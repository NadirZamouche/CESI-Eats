const mysql = require('mysql2/promise');
const config = require('./config/config.json').development;

async function createDatabase() {
    const connection = await mysql.createConnection({
        host: config.host,
        user: config.username,
        password: config.password
    });

    // Check if the database exists
    const [databases] = await connection.query(`SHOW DATABASES LIKE '${config.database}';`);
    if (databases.length === 0) {
        // Create the database, enclose the database name in backticks
        await connection.query(`CREATE DATABASE \`${config.database}\`;`);
        console.log(`Database ${config.database} created.`);
    } else {
        console.log(`Database ${config.database} already exists.`);
    }

    await connection.end();
}

createDatabase().catch(err => {
    console.error('Unable to create database:', err);
});
