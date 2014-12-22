var LocalStrategy = require('passport-local').Strategy;
var Users         = require('../models/user');

module.exports = function(passport) {
    passport.serializeUser(function(user, callback) {
        return callback(null, user);
    });
    passport.deserializeUser(function(id, callback) {
        return callback(null, id);
    });

    passport.use('login', new LocalStrategy(
        function(username, password, callback) {
            global.db.Users.findOne({
                where: {'username' : username },
                attributes: ['id', 'username', 'password'],
            }).then(function(user) {
                if (!user) {
                    return callback(null, false);
                }
                user.validatePassword(password, function(err, res) {
                    if (err)
                        return callback(err);
                    else if (res) {
                        return callback(null, [user.id, user.username, password]);
                    }
                    else {
                        return callback(null, false);
                    }
                });
            });
        }
    ));
};
