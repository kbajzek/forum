const express = require('express');
const session = require('express-session');
const passport = require('passport');
const util = require('util');
const SteamStrategy = require('passport-steam').Strategy;
const bodyParser = require('body-parser');
const routes = require('./routes/forumRoutes');
const models = require('./models');

passport.serializeUser(function(user, done) {
    done(null, user);
});
  
passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

passport.use(new SteamStrategy({
    returnURL: 'http://localhost:5000/auth/steam/return',
    realm: 'http://localhost:5000/',
    profile: false
  },
  function(identifier, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {

      // To keep the example simple, the user's Steam profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Steam account with a user record in your database,
      // and return that user instead.
      console.log("In validate function");
      console.log(identifier);
      console.log(profile);
      return done(null, identifier);
    });
  }
));

models.sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });


const app = express();

app.use(session({
    secret: 'your secret',
    resave: true,
    saveUninitialized: true}));

app.use(passport.initialize());
app.use(passport.session());


app.use(bodyParser.json());

routes(app);

app.get('/', function(req, res){
    res.send({message: 'hi'});
  });

app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });

app.get('/auth/steam',
    passport.authenticate('steam', { failureRedirect: '/' }),
    function(req, res) {
    res.redirect('/');
});

app.get('/auth/steam/return',
  passport.authenticate('steam', { failureRedirect: '/' }),
  function(req, res) {
    console.log("In steam returning function");
    res.redirect('/');
  });

  app.get('/account', ensureAuthenticated, function(req, res){
    res.send({ user: req.user });
  });

if (process.env.NODE_ENV === 'production') {
    // Express will serve up production assets
    // like our main.js file, or main.css file!
    app.use(express.static('client/build'));

    // Express will serve up the index.html file
    // if it doesn't recognize the route
    const path = require('path');
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT);



function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.status(401).send({ error: 'Not Authenticated!' })
}