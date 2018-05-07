const passport = require('passport');
const uuid = require('uuid/v4');

const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) { return next(); }
    res.status(401).send({ error: 'Not Authenticated!' })
}

const ensureCSRF = (req, res, next) => {
    if (req.get('X-XSRF-TOKEN') === res.session.csrf) { return next(); }
    res.status(401).send({ error: 'CSRF Token Not Matched!' })
}

module.exports = app => {

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
            res.redirect("http://localhost:3000");
        }
    );

    app.get('/api/fetch_user', (req, res) => {
        const user = req.session && req.session.passport && req.session.passport.user;
        let csrf = null;
        if (user) {
            csrf = uuid();
            req.session.csrf = csrf;
        }
        res.send({user: user, csrf: csrf});
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