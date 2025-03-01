const path = require('path');
const config = require('./index');
require('dotenv').config();
const db = config.db;
const username = db.username;
const password = db.password;
const database = db.database;
const host = db.host;
const schema = db.schema;

module.exports = {
    development: {
        username,
        password,
        database,
        host,
        dialect: 'postgres',
        seederStorage: 'sequelize',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },
        // define: {
        //     schema
        // }
    },
    production: {
        use_env_variable: 'DATABASE_URL',
        dialect: 'postgres',
        seederStorage: 'sequelize',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },
        define: {
            schema,
        },
        migrationStorage: 'sequelize',
        migrationStoragePath: path.resolve('db', 'migrations'),
        seederStoragePath: path.resolve('db', 'seeders'),
    }
};
