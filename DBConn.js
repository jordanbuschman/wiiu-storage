var debug  = require('debug')('wiiu-storage:postgres');
var bcrypt = require('bcrypt');

function DBConn() {
    this.authenticateUser = function(_username, _password, callback) {
        console.log('USERNAME: ' + _username + ', PASSWORD: ' + _password);
        if (!_username || !_password)
            callback({ 'username' : _username, 'authenticated' : false });

        global.db.Users.find({
            where: { username:  _username },
            attributes: ['id', 'username', 'password']
        }).success(function(user) {
            if(!user)
                callback({ 'username' : _username, 'authenticated' : false });
            else { //Found username, now get salt
                bcrypt.compare(_password, user.password, function(err, res) {
                    if (err) {
                        debug(err);
                        callback({ 'username' : _username, 'authenticated' : false });
                    }
                    if (res)
                        callback({ 'username' : _username, 'authenticated' : true });
                    else
                        callback({ 'username' : _username, 'authenticated' : false });
                });
            }
        }).failure(function() {
            callback({ 'username' : _username, 'authenticated' : false });
        });
    };
};
module.exports = DBConn;
