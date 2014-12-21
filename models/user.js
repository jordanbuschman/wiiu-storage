var bcrypt = require('bcrypt');

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        username: {
            type: DataTypes.STRING(32),
            unique: true,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        instanceMethods: {
            setPassword: function(password, callback) {
                bcrypt.genSalt(10, function(err, salt) {
                    if (err)
                        callback(err);
                    else {
                        bcrypt.hash(password, salt, function(err, encrypted) {
                            if (err)
                                callback(err);
                            else {
                                this.password = encrypted;
                                callback();
                            }
                        });
                    }
                });
            },
            validatePassword: function(password, callback) {
                bcrypt.compare(password, this.password, function(err, res) {
                    callback(err, res);
                });
            }
        }
    });
};
