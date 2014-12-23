var express  = require('express');
var passport = require('passport');
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
        var fileContents;
        file.on('data', function(data) {
            fileContents += data;
        });

        file.on('end', function() {
            global.db.Salts.findOne({
                where: { userId: req.user[0], fileName: filename },
                attributes: ['id', 'userId', 'fileName', 'salt'],
            }).then(function(salt) {
                if (salt) { //File already exists, conflict error
                    return res.status(409).send();
                }
                global.db.Salts.genSalt(function(err, newSalt) {
                    if (err)
                        return next(err);

                    global.db.Salts.create({
                        'userId': req.user[0],
                        'fileName': filename,
                        'salt': newSalt
                    }).then(function(salt) {
                        if (!salt) //Insertion went wrong
                            return res.status(500).send();
                        //If here, that means that the salt was created successfully. Encrypt and upload to S3.
                        s3Conn.uploadPrivateFile(req.user[1], req.user[2], filename, salt.salt, fileContents, function(result) {
                            console.log(result.StatusCode);
                            return res.status(result.StatusCode).send();
                        })
                    });
                });
            });
        });
    });
});

router.post('/private/:user/:file', function(req, res) {
    var username = decodeURI(req.params.user);
    var filename = decodeURI(req.params.file);
    var password = req.body.password;

    if (req.isAuthenticated() && req.user.username == username) 
        res.status(200).send();
    else
        res.status(401).send();
});

router.get('/', function(req, res) {
    res.redirect('/api/public');
});

router.get('/public', function(req, res) {
    s3Conn.listPublicFiles(function(e, data) {
        if (e) {
            res.json({'ERROR' : e });
        }
        else {
            var contents = data.Body.ListBucketResult.Contents;
            var trimmedContents = [];
            contents.forEach(function(listing, index) {
                if (index != 0) {
                    trimmedContents[index - 1] = {
                        Key: listing.Key,
                        LastModified: listing.LastModified,
                        Size: listing.Size,
                    };
                }
            });

            res.json({ 'Contents' : trimmedContents });
        }
    });
});

router.get('/public/:file', function(req, res) {
    var file = decodeURI(req.params.file);
    file = file.replace(/^\/|[\?<>\\:\*\|":\x00-\x1f\x80-\x9f]/g, '');
    res.json(file);
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated() && req.user[1] == req.params.user)
        return next();

    res.status('403').render('forbidden', {
        title: 'Wii-U - Forbidden'
    });
}

module.exports = router;
