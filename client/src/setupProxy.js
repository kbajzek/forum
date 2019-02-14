const proxy = require('http-proxy-middleware');

module.exports = function(app) {
    if(JSON.stringify(process.env.NODE_ENV) === JSON.stringify('development')){
        app.use(proxy('/api/', {
            target: 'http://localhost:5000'
        }));
        app.use(proxy('/auth/steam', {
            target: 'http://localhost:5000'
        }));
        app.use(proxy('/socket.io/', {
            target: 'http://localhost:5000'
        }));
    }
}