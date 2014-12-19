var LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport) {
    passport.use('local-login', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    },
    function(req, username, password, done) {
        User.findOne({ 'local.username': username }, function(err, user) {
            if (err)
                return done(err);
            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.'));
            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Incorrect password.'));
    
            return done(null, user);
        });
    } ));
};
