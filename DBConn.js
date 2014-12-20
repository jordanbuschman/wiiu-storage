var debug  = require('debug')('wiiu-storage:postgres');
var bcrypt = require('bcrypt-nodejs');

function DBConn() {
    this.authenticateUser = function(_username, _password, callback) {
        if (!_username || !_password)
            callback(false);

        global.db.Users.find({
            where: { username:  _username },
            attributes: ['id', 'username', 'password']
        }).success(function(user) {
            if(!user)
                callback(false);
            else { //Found username, now get salt
                global.db.Salts.find({
                    where: { userid: user.id },
                    attributes: ['salt']
                }).success(function(salt) {
                    if (!salt)
                        callback(false);
                    else { //Got salt
                        bcrypt.hash(_password, salt['salt'], null, function(err, HashAndSalt) {
                            if (err) {
                                debug(err);
                                callback(false);
                            }
                            else { //Done hashing, now compare passwords
                                if (HashAndSalt == user.password) //They match! Authenticated.
                                    callback(true);
                                else
                                    callback(false);
                            }
                        });
                    }
                }).failure(function() {
                    callback(false);
                });
            }
        }).failure(function() {
            callback(false);
        });
    };
};
module.exports = DBConn;
