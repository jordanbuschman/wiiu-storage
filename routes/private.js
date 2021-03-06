var express  = require('express');
var passport = require('passport');

var router   = express.Router();

router.post('/auth', passport.authenticate('login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}) );

router.get('/', function(req, res) {
    res.render('public', {
        title: 'Wii-U File Storage',
        message: req.flash('message')
    });
});

router.get('/login', function(req, res) {
    res.render('login', {title: 'Wii-U - Login'});
})

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
        sessionUser: req.user,
        user: req.param.user
    });
});

router.get('/u/:user/:file', isLoggedIn, function(req, res) {
    res.render('userItem', {
        title: 'Wii-U - ' + req.params.file,
        sessionUser: req.user,
        user: req.param.user
    }); 
});
    
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}

module.exports = router;
