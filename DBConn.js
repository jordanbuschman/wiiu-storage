var debug  = require('debug')('wiiu-storage:postgres');
var bcrypt = require('bcrypt');

function DBConn() {
    this.authenticateUser = function(_username, _password, callback) {
        console.log('USERNAME: ' + _username + ', PASSWORD: ' + _password);
        if (!_username || !_password)
            callback(false);

        global.db.Users.find({
            where: { username:  _username },
            attributes: ['id', 'username', 'password']
        }).success(function(user) {
            if(!user)
                callback(false);
            else { //Found username, now get salt
                bcrypt.compare(_password, user.password, function(err, res) {
                    if (err) {
                        debug(err);
                        callback(false);
                    }
                    if (res)
                        callback(true);
                    else
                        callback(false);
                });
            }
        }).failure(function() {
            callback(false);
        });
    };
};
module.exports = DBConn;
