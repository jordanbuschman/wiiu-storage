var express  = require('express');
var passport = require('passport');

var router   = express.Router();

router.get('/', function(req, res) {
    res.render('public', {
        title: 'Wii-U File Storage',
        loggedIn: req.isAuthenticated(),
        user: (req.isAuthenticated() ? req.user.name : false),
        message: 'meow'
    });
});

router.get('/login', function(req, res) {
    var error = req.flash('error');
    res.render('login', {
        title: 'Wii-U - Login',
        error: (error ? error : false)
    });
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/:file', function(req, res) {
    res.render('publicItem', {title: 'Wii-U - ' + req.params.file});
});

router.get('/u/:user', isLoggedIn, function(req, res) {
    res.render('user', {
        title: 'Wii-U - ' + req.params.user + '\'s Files',
    });
});

router.get('/u/:user/upload', isLoggedIn, function(req, res) {
    res.render('upload', {
        title: 'Wii-U - Upload file',
        user: req.user
    });
});
router.get('/u/:user/:file', isLoggedIn, function(req, res) {
    res.render('userItem', {
        title: 'Wii-U - ' + req.params.file,
        user: req.user
    }); 
});
    
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated() && req.user[1] == req.params.user)
        return next();

    res.status('403').render('forbidden', {
        title: 'Wii-U - Forbidden'
    });
}

module.exports = router;
