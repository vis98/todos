/* const { Client } = require('pg');
const client = new Client({
    connectionString: 'postgresql://postgres:1234@localhost:5432/todo',
  });
  client.connect()
  .then(() => {
    console.log('Connected to PostgreSQL');
  })
  .catch(err => {
    console.error('Error connecting to PostgreSQL:', err);
  });
  
  module.exports=client */

  const pgp = require('pg-promise')();
const connection = {
  host: 'localhost',
  port: '5432',
  database: 'todo',
  user: 'postgres',
  password: '1234',
};

const db = pgp(connection);

module.exports = db;
