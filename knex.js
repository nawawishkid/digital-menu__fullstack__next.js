module.exports = require("knex")({
  client: "mysql",
  connection: {
    host: process.env.DB_URL,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DBNAME,
    timezone: "UTC",
    dateStrings: true,
  },
});
