const Pool = require('pg').Pool

const pool = new Pool({
  user:"masonsteeger",
  password:"M_$teeger94",
  host: "localhost",
  port: 5432,
  database: "twitterplusone"
});

module.exports = pool;
