const passwords = require('./passwords');

module.exports = {
    development: {
        port: 5000,
        steamAPIKey: 'CF1AE94B18F1E3282342ED1886995157',
        database: {
            username: 'root',
            password: 'password',
            database: 'forum_test',
            dialect: 'mysql',
            operatorsAliases: false,
            logging: false,
        },
        authentication: {
            client_id: passwords.development.oauth_client_id,
            client_secret: passwords.development.oauth_client_secret,
            redirect_url: 'http://localhost:5000/auth/google/callback',
            return_url: 'http://localhost:3000',
            fail_return_url: 'http://localhost:3000/login'
        },
        session_secret: passwords.development.session_secret,
    },
    production: {
        port: 8081,
        steamAPIKey: 'CF1AE94B18F1E3282342ED1886995157',
        database: {
            username: 'root',
            password: passwords.production.sql_password,
            database: 'forum_test',
            dialect: 'mysql',
            operatorsAliases: false,
            logging: false,
        },
        authentication: {
            client_id: passwords.production.oauth_client_id,
            client_secret: passwords.production.oauth_client_secret,
            redirect_url: 'https://forum.kevinbajzek.com/auth/google/callback',
            return_url: 'https://forum.kevinbajzek.com',
            fail_return_url: 'https://forum.kevinbajzek.com/login'
        },
        session_secret: passwords.production.session_secret,
    }
};