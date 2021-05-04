// config/config.js

require('dotenv').config(); // instantiate env variables

const CONFIG = {
    app: process.env.APP,          // 'dev';
    port: process.env.PORT,        // 4000;

    db_dialect: process.env.DB_DIALECT, // 'mongodb';
    db_host: process.env.DB_HOST,       // 'localhost';
    db_port: process.env.DB_PORT,       // '27017';
    db_name: process.env.DB_NAME,       // 'platform-dev';
}; // Make a global CONFIG object to be used all over the app

module.exports = CONFIG;
