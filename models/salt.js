var bcrypt = require('bcrypt');
var crypto = require('crypto');

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Salt', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            unique: true,
            allowNull: false,
        },
        fileName: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        salt: {
            type: DataTypes.STRING(32),
            allowNull: false,
        },
    }, {
        instanceMethods: {
            genSalt: function(callback) {
                crypto.randomBytes(32, function(err, salt) {
                    if (err)
                        return callback(err);
                    return callback(null, salt);
                });
            },
        }
    });
};
