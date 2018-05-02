const passport = require('passport');

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
        res.send(req.session.passport.user);
    });

    app.get('/api/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    })

}