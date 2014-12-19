var express  = require('express');
var passport = require('passport');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', {title: 'Wii-U', what: 'best'});
});

router.get('/login', function(req, res) {
    res.render('login', {title: 'Wii-U - Login'});
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

router.get('/public', function(req, res) {
    res.render('public', {title: 'Wii-U - Public Files'});
});

router.get('/public/:file', function(req, res) {
    res.render('publicItem', {title: 'Wii-U - ' + req.params.file});
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}

module.exports = router;
