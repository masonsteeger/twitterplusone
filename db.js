const Pool = require('pg').Pool
require('dotenv').config();


const devConfig = `postgresql://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DATABASE}`;

const proConfig = 'postgres://rtwfyhhicszitx:6a18e26623839e5e74030d9bf86b0114a982b11851b822230d05c994d468497c@ec2-52-21-247-176.compute-1.amazonaws.com:5432/de96lkrjvdhslm'

const pool = new Pool({
  connectionString:(process.env.NODE_ENV === "production" ? devConfig : proConfig)
});

module.exports = pool;
