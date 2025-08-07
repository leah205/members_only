const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // store your Neon string here
  ssl: {
    rejectUnauthorized: false, // needed for Neon
  }
});

module.exports = pool;