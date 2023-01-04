const Pool = require("pg").Pool;

const pool = new Pool({
  user: "thangzathang",
  password: process.env.PASSWORD,
  host: "localhost",
  port: 5432,
  database: "movielist",
});

module.exports = pool;
