module.exports = {
    development: {
        username: 'root',
        password: 'password',
        database: 'forum_test',
        dialect: 'mysql',
        operatorsAliases: false
    },
    production: {
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      host: process.env.DB_HOSTNAME,
      dialect: 'mysql',
      operatorsAliases: false
    }
  };