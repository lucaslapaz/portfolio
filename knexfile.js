const dotenv = require("dotenv");
dotenv.config();

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

  development: {
    client: 'mysql2',
    connection: {
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      port: process.env.MYSQL_PORT,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.DATABASE
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: "./migrations"
    }
  },

  // staging: {
  //   client: 'mysql2',
  //   connection: {
  //     host: process.env.MYSQL_HOST,
  //     user: process.env.MYSQL_USER,
  //     port: process.env.MYSQL_PORT,
  //     password: process.env.MYSQL_PASSWORD,
  //     database: process.env.PORTFOLIO_STAGE,
  //   },
  //   pool: {
  //     min: 2,
  //     max: 10
  //   },
  //   migrations: {
  //     directory: "./migrations"
  //   }
  // },

  // production: {
  //   client: 'mysql2',
  //   connection: {
  //     host: process.env.MYSQL_HOST,
  //     user: process.env.MYSQL_USER,
  //     port: process.env.MYSQL_PORT,
  //     password: process.env.MYSQL_PASSWORD,
  //     database: process.env.PORTFOLIO_PROD,
  //   },
  //   pool: {
  //     min: 2,
  //     max: 10
  //   },
  //   migrations: {
  //     tableName: 'knex_migrations'
  //   }
  // }

};
