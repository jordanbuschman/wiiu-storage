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
            type: DataTypes.STRING(64),
            allowNull: false,
        },
    });
};
