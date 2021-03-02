module.exports = {
  development: {
    username: process.env.DEV_DB_USERNAME,
    password: process.env.DEV_DB_PASSWORD,
    database: process.env.DEV_DB_NAME,
    host: process.env.DEV_DB_HOSTNAME,
    port: 5432,
    dialect: 'postgres',
  },
  test: {
    username: process.env.CI_DB_USERNAME,
    password: process.env.CI_DB_PASSWORD,
    database: process.env.CI_DB_NAME,
    host: '127.0.0.1',
    port: 3306,
    dialect: 'postgres',
  },
  production: {
    username: 'atriposaday',
    password: null,
    database: 'atriposaday',
    host: 'postgres',
//    port: process.env.PROD_DB_PORT,
    dialect: 'postgres',
    logging: false
  }
};