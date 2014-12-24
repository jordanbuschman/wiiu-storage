var express  = require('express');
var passport = require('passport');
var fs       = require('fs');
var S3Conn   = require('../S3Conn');

var router = express.Router();
var s3Conn = new S3Conn();

router.get('/loggedin', function(req, res) {
    res.send(req.isAuthenticated() ? req.user : '0');
});

router.post('/login', function(req, res, next) {
    passport.authenticate('login', function(err, user, info) {
        if (err)
            return next(err);
        if (!user) {
            req.flash('error', 'Incorrect username or password.');
            return res.redirect('/login');
        }
        req.logIn(user, function(err) {
            if (err)
                return next(err);
            console.log(user);
            return res.redirect('/u/' + user[1]);
        });
    })(req, res, next);
});

router.post('/logout', function(req, res) {
    req.logOut();
    res.status(200).send();
});

router.post('/u/:user/upload', isLoggedIn, function(req, res, next) {
    req.pipe(req.busboy);

    req.busboy.on('file', function (fieldname, file, filename) {
        var dataBuffer = new Buffer('');

        file.on('data', function(data) {
            dataBuffer = Buffer.concat([dataBuffer, data]);
        });

        file.on('end', function() {
            global.db.Files.findOne({
                where: { userId: req.user[0], fileName: filename },
                attributes: ['id', 'userId', 'fileName', 'salt', 'hmacKey'],
            }).then(function(fileData) {
                if (fileData) { //File already exists, conflict error
                    return res.status(409).send();
                }
                //TODO: Upload is super slow, either give users an option to encrypt or remove completely
                global.db.Files.generateRandomBytes(function(err, rand) {
                    if (err)
                        return next(err);

                    global.db.Files.create({
                        'userId': req.user[0],
                        'fileName': filename,
                        'salt': rand[0],
                        'hmacKey': rand[1],
                    }).then(function(newFileData) {
                        if (!newFileData) //Insertion went wrong
                            return res.status(500).send();
                        //If here, that means that the file data was created successfully. Encrypt and upload to S3.
                        s3Conn.uploadPrivateFile(req.user[1], req.user[2], filename, newFileData.salt, newFileData.hmacKey, dataBuffer, function(result) {
                            if (result.StatusCode)
                                return res.status(result.StatusCode).send();
                            else
                                return res.status(500).send(JSON.stringify(result));
                        });
                    });
                });
            });
        });
    });
});

router.get('/u/:user/:file', isLoggedIn, function(req, res) {
    var username = req.user[1];
    var password = req.user[2];
    var filename = decodeURI(req.params.file);

    global.db.Files.findOne({
        where: { 'userId': req.user[0], 'fileName': filename },
        attributes: ['id', 'fileName', 'hmacKey']
    }).then(function(newFile) {
        if (!newFile) //File does not exist
            return res.status(404).render('error');
        
        s3Conn.getPrivateFile(username, password, newFile.fileName, newFile.hmacKey, function(result) {
            if (result.StatusCode == 200) {
                res.status(result.StatusCode);
                res.set('Content-Type', 'image/jpg');
                res.send(result.Body);
            }
            else
                return res.status(500).send(JSON.stringify(result));
        });
    });

});

router.get('/', function(req, res) {
    res.redirect('/api/public');
});

router.get('/public', function(req, res) {
    s3Conn.listPublicFiles(function(data) {
        if (data.StatusCode != 200)
            return res.status(data.StatusCode).send(data.Body);

        var completeContents = data.Body.ListBucketResult.Contents;
        var contents = {'Contents': new Array()};
        for (content in completeContents) {
            if (completeContents[content].Size == 0)
                continue;

            contents.Contents.push({
                'Key': completeContents[content].Key,
                'LastModified': completeContents[content].LastModified,
                'Size': completeContents[content].Size,
                'URL': '/api/' + completeContents[content].Key
            });
        }
        return res.status(data.StatusCode).send(contents);

    });
});

router.get('/public/:file', function(req, res) {
    var file = decodeURI(req.params.file);
    
    s3Conn.getPublicFile(file, function(data) {
        res.status(data.StatusCode).send(data.Body);
    });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated() && req.user[1] == req.params.user)
        return next();

    return res.status('403').render('forbidden', {
        title: 'Wii-U - Forbidden'
    });
}

module.exports = router;
