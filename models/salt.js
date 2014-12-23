var crypto = require('crypto');

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Salts', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        fileName: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        salt: {
            type: DataTypes.STRING(64),
            allowNull: false,
        },
    }, {
        classMethods: {
            genSalt: function(callback) {
                crypto.randomBytes(32, function(err, buf) {
                    if (err)
                        return callback(err);
                    return callback(null, buf.toString('hex'));
                });
            },
        },
    });
};
