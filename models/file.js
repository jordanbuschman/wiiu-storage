var crypto = require('crypto');

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Files', {
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
        hmacKey: {
            type: DataTypes.STRING(64),
            allowNull: false,
        },
    }, {
        classMethods: {
            generateRandomBytes: function(callback) {
                crypto.randomBytes(32, function(err, buf1) {
                    if (err)
                        return callback(err);

                    crypto.randomBytes(32, function(err, buf2) {
                        if (err)
                            return callback(err);
                            
                        return callback(null, [buf1.toString('hex'), buf2.toString('hex')]);
                    });
                });
            },
        },
    });
};
