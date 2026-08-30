const mysql = require('mysql2');
require('dotenv').config();

const connectionConfig = process.env.DATABASE_URL || process.env.MYSQL_URL || {
    host: process.env.DB_HOST || process.env.MYSQLHOST || 'localhost',
    port: Number(process.env.DB_PORT || process.env.MYSQLPORT || 3306),
    user: process.env.DB_USERNAME || process.env.MYSQLUSER || 'root',
    password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || '',
    database: process.env.DB_NAME || process.env.MYSQLDATABASE || 'railway',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
};

const dbPool = mysql.createPool(connectionConfig);

module.exports = dbPool.promise();