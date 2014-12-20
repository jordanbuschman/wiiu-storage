var bcrypt = require('bcrypt-nodejs');
function DB() {
    this.authenticateUser = function(username, password) {
        if (!username || !password)
            return false;

        global.DB.User.find({ username: username }) 
            .success(function(row) { //Found username, now get salt
                console.log(row);
                return true;
            });
            .failure(function() {
                return false;
            });
    };
};
module.exports = DB;
