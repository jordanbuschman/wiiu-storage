var LocalStrategy = require('passport-local').Strategy;
var Users         = require('../models/user');

module.exports = function(passport) {
    passport.serializeUser(function(user, callback) {
        callback(null, user);
    });
    passport.deserializeUser(function(id, callback) {
        callback(null, id);
    });

    passport.use('login', new LocalStrategy(
        function(username, password, callback) {
            global.db.Users.findOne({
                where: {'username' : username },
                attributes: ['id', 'username', 'password'],
            }).then(function(user) {
                if (!user) {
                    console.log('NO USER');
                    callback(null, false, { message: 'Incorrect login information.' });
                }
                user.validatePassword(password, function(err, res) {
                    if (err)
                        callback(err);
                    else if (res) {
                        callback(null, user);
                    }
                    else {
                        callback(null, false, { message: 'Incorrect login information.' });
                    }
                });
            });
        }
    ));
};
