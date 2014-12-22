var express  = require('express');
var passport = require('passport');
var S3Conn   = require('../S3Conn');

var router = express.Router();
var s3Conn = new S3Conn();

router.get('/loggedin', function(req, res) {
    res.send(req.isAuthenticated() ? req.user : '0');
});

router.post('/login', function(req, res, next) {
    passport.authenticate('login', {
        failureRedirect: '/login',
        successRedirect: '/success',
        failureFlash: 'Incorrect username or Password',
        successFlash: 'Welcome, ' + req.user
    })(req, res, next);
});

router.post('/logout', function(req, res) {
    req.logOut();
    res.send(200);
});

router.post('/private/:user/:file', function(req, res) {
    var username = decodeURI(req.params.user);
    var filename = decodeURI(req.params.file);
    var password = req.body.password;

    if (req.isAuthenticated() && req.user.username == username) 
        res.send(200);
    else
        res.send(401);
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

module.exports = router;
