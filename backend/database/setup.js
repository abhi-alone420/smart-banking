/**
 * Initializes the smart_banking database and tables.
 * Run from backend folder: node database/setup.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

async function setup() {
  const config = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    port: Number(process.env.DB_PORT) || 3306,
    multipleStatements: true,
  };

  console.log(`Connecting to MySQL at ${config.host}:${config.port} as ${config.user}...`);

  let connection;
  try {
    connection = await mysql.createConnection(config);
    console.log('Connected to MySQL.');

    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    await connection.query(schema);
    console.log('Database schema applied successfully.');
    console.log(`Database "${process.env.DB_NAME || 'smart_banking'}" is ready.`);
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.error('\nCould not connect to MySQL. Make sure MySQL is running.');
      console.error('  - XAMPP/WAMP: start MySQL from the control panel');
      console.error('  - MySQL Installer: start the MySQL80 service in Services');
      console.error('  - Docker: docker run -d -p 3306:3306 -e MYSQL_ROOT_PASSWORD=root mysql:8');
    } else {
      console.error('\nSetup failed:', error.message);
    }
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
}

setup();
