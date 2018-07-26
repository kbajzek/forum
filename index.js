const express = require('express');
const session = require('express-session');
const redis = require("redis").createClient();
const RedisStore = require('connect-redis')(session);
const passport = require('passport');
const util = require('util');
const SteamStrategy = require('passport-steam').Strategy;

const bodyParser = require('body-parser');
const forumRoutes = require('./routes/forumRoutes');
const authRoutes = require('./routes/authRoutes');
const models = require('./models');

passport.serializeUser(function(id, done) {
    done(null, id);
});
  
passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

passport.use(new SteamStrategy({
    returnURL: 'http://192.168.56.1:5000/auth/steam/return',
    realm: 'http://192.168.56.1:5000/',
    apiKey: 'CF1AE94B18F1E3282342ED1886995157'
  },
  function(identifier, profile, done) {
    console.log(profile);

      const beginningString = 'https://steamcommunity.com/openid/id/';
      const steamId = identifier.substring(beginningString.length);

      models.User.findOne({where: {steam: steamId}})
        .then((result) => {
            if(!result){
                models.User.create({steam: steamId, name: profile.displayName})
                    .then((newUser) => {
                        return done(null, newUser.id);
                    })
            } else {
                return done(null, result.id);
            }
            
        })
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
const server = require('http').Server(app);
const io = require('socket.io')(server);

io.on('connection', function (socket) {
    socket.emit('user1', { hello: 'world' });
    socket.on('user1response', function (data) {
        console.log('...........................................................................................');
    });
});

app.use(session({
    secret: 'your secret',
    resave: false,
    saveUninitialized: false,
    cookie: { path: '/', httpOnly: true, secure: false, maxAge: 86400000 },
    store:new RedisStore({
        host: '192.168.56.1',
        port: 6379,
        client: redis
    })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());



authRoutes(app);

forumRoutes(app);

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
server.listen(PORT);

// app.get('/account', ensureAuthenticated, function(req, res){
//     res.send({ user: req.user });
// });

