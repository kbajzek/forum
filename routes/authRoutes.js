const passport = require('passport');
const uuid = require('uuid/v4');
const configFile = require('../config/config');
const config = JSON.stringify(process.env.NODE_ENV) === JSON.stringify('development') ? configFile.development : configFile.production;

const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) { return next(); }
    res.status(401).send({ error: 'Not Authenticated!' })
}

const ensureCSRF = (req, res, next) => {
    if (req.get('X-XSRF-TOKEN') === res.session.csrf) { return next(); }
    res.status(401).send({ error: 'CSRF Token Not Matched!' })
}

const fail_return_url = config.authentication.fail_return_url;
const return_url = config.authentication.return_url;

module.exports = app => {

    app.get('/auth/google', passport.authenticate('google', { scope: ['profile','email'] }));
    app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: fail_return_url }), (req, res) => {
            // Successful authentication, redirect home.
            req.session.csrf = uuid(); 
            res.redirect(return_url);
    });

    app.get(
        '/auth/steam',
        passport.authenticate('steam')
    );

    app.get(
        '/auth/steam/return',
        passport.authenticate('steam'),
        (req, res) => {
            console.log("Authentication was successful");
            console.log("In steam returning function");
            req.session.csrf = uuid();
            res.redirect(config.authentication.redirect_url);
        }
    );

    app.get('/api/fetch_user', (req, res) => {
        const user = req.session && req.session.passport && req.session.passport.user;
        //console.log(req.session)
        res.send({user: user, csrf: req.session.csrf});
    });

    app.get('/api/logout', (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.send({logout: 1});
            }
        })
    })

}