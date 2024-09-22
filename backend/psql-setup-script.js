const { sequelize } = require('./db/models');
require('dotenv').config();
console.log('Running psql-setup-script.js');
console.log('Loaded Environment Variables:', {
    DB_USERNAME: process.env.DB_USERNAME,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_DATABASE: process.env.DB_DATABASE,
    DB_HOST: process.env.DB_HOST,
    SCHEMA: process.env.SCHEMA,
});


sequelize.showAllSchemas({ logging: false }).then(async (data) => {
    if (!data.includes(process.env.SCHEMA)) {
        await sequelize.createSchema(process.env.SCHEMA);
    }
});
