var express  = require('express');
var passport = require('passport');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index');
});

router.get('/login', function(req, res) {
    res.render('login');
});

router.get('/u/{user}', isLoggedIn, function(req, res) {
    res.render('user', {user: req.user});
});

router.get('/u/{user}/{item}', isLoggedIn, function(req, res) {
    res.render('userItem', { user: req.user}); 
});

router.get('/public', function(req, res) {
    res.render('public');
});

router.get('/public/{item}', function(req, res) {
    res.render('publicItem');
});

module.exports = router;
