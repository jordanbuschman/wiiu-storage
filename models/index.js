var debug = require('debug')('wiiu-storage:postgres');

if (!global.hasOwnProperty('db')) {
    var Sequelize = require('sequelize');
    var sequelize = null;

    if (process.env.DATABASE_URL) {
        //Found matching environment variable DATABASE_URL
        var match = process.env.DATABASE_URL.match(/postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);

        sequelize = new Sequelize(match[5], match[1], match[2], {
            dialect: 'postgres',
            protocol: 'postgres',
            port: match[4],
            host: match[3],
            logging: debug
        });
    }
    else {
        sequelize = new Sequelize('wiiu-storage', 'postgres', 'root', {
            dialect: 'postgres',
            protocol: 'postgres',
            port: 5432,
            host: 'localhost',
            logging: debug
        });
    }

    global.db = {
        Sequelize: Sequelize,
        sequelize: sequelize,
        Users: sequelize.import(__dirname + '/user'),
        Salts: sequelize.import(__dirname + '/salt'),
    };
}

module.exports = global.db;
