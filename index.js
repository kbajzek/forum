const express = require('express');
const session = require('express-session');
// const redis = require("redis").createClient();
// const RedisStore = require('connect-redis')(session);
const passport = require('passport');
const util = require('util');
const SteamStrategy = require('passport-steam').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const SequelizeStore = require('express-session-sequelize')(session.Store);

const bodyParser = require('body-parser');
const forumRoutes = require('./routes/forumRoutes');
const authRoutes = require('./routes/authRoutes');
const models = require('./models');
const configFile = require('./config/config');
const config = JSON.stringify(process.env.NODE_ENV) === JSON.stringify('development') ? configFile.development : configFile.production;

const clientID = config.authentication.client_id;
const clientSecret = config.authentication.client_secret;
const callbackURL=  config.authentication.redirect_url;
const secret = config.session_secret;

// passport.use(new SteamStrategy({
//     returnURL: 'http://localhost:5000/auth/steam/return',
//     realm: 'http://localhost:5000/',
//     apiKey: keys.steamAPIKey
//   },
//   function(identifier, profile, done) {
//     //console.log(profile);

//       const beginningString = 'https://steamcommunity.com/openid/id/';
//       const steamId = identifier.substring(beginningString.length);

//       models.user.findOne({where: {steam: steamId}})
//         .then((result) => {
//             if(!result){
//                 models.user.create({steam: steamId, name: profile.displayName, avatar: profile.photos[2].value})
//                     .then((newUser) => {
//                         return done(null, newUser.id);
//                     })
//             } else {
//                 return done(null, result.id);
//             }
            
//         })
//   }
// ));

models.sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');

        const myStore = new SequelizeStore({db: models.sequelize});

        const sessionMiddleware = session({
            secret, 
            resave: false,
            saveUninitialized: false,
            cookie: { path: '/', httpOnly: true, secure: false, maxAge: 86400000 },
            store: myStore,
        });

        passport.serializeUser(function(id, done) {
            done(null, id);
            return null;
        });
          
        passport.deserializeUser(function(obj, done) {
            done(null, obj);
            return null;
        });
        
        passport.use(new GoogleStrategy({
                clientID,
                clientSecret,
                callbackURL
            },
            async (accessToken, refreshToken, profile, done) => {

                // console.log("profile: ", profile);

                models.user.findOne({where: {steam: profile.id}})
                    .then((result) => {
                        if(!result){
                            models.user.create({steam: profile.id, name: profile.displayName, avatar: profile.photos[0].value})
                                .then((newUser) => {
                                    done(null, newUser.id);
                                    return null;
                                })
                        } else {
                            done(null, result.id);
                            return null;
                        }
                    });
            }
        ));

        const app = express();
        const server = require('http').Server(app);
        const io = require('socket.io')(server);

        // const sessionMiddleware = session({
        //     secret: 'your secret',
        //     resave: false,
        //     saveUninitialized: false,
        //     cookie: { path: '/', httpOnly: true, secure: false, maxAge: 86400000 },
        //     store: new RedisStore({
        //         host: 'localhost',
        //         port: 6379,
        //         client: redis
        //     })
        // });

        io.use(function(socket, next){
            sessionMiddleware(socket.request, {}, next);
        })

        let socketUsers = new Map();
        let socketLocations = new Map();

        const setUserId = (user, id) => {
            const userInfo = socketUsers.get(user);
            if(userInfo && userInfo !== undefined){
                const newUserInfo = {
                    ...userInfo,
                    id
                }
                socketUsers.set(user,newUserInfo);
            }else{
                const newUserInfo = {
                    location: null,
                    id
                }
                socketUsers.set(user,newUserInfo);
            }
        }

        const deleteUser = (user) => {
            const userInfo = socketUsers.get(user);
            if(userInfo && userInfo !== undefined){
                const locationInfo = socketLocations.get(userInfo.location);
                if(locationInfo && locationInfo !== undefined){
                    const newLocationInfo = locationInfo.filter(u => u !== user);
                    models.user.findAll({where: {id: newLocationInfo}})
                        .then(users => {
                            const usersViewing = users.map(user => {
                                return {
                                    id: user.id,
                                    name: user.name,
                                    avatar: user.avatar
                                }
                            })
                            newLocationInfo.forEach(u => {
                                const socketID = socketUsers.get(u);
                                if(socketID && socketID !== undefined){
                                    io.to(socketID.id).emit('usersViewing.update', {location: userInfo.location, users: usersViewing});
                                }
                            })
                        })
                    
                    socketLocations.set(userInfo.location, newLocationInfo);
                }
            }
            socketUsers.delete(user);
        }

        const setUserLocation = (user, location) => {
            const userInfo = socketUsers.get(user);
            if(userInfo && userInfo !== undefined && userInfo.location !== location){
                let locationInfo = socketLocations.get(userInfo.location);
                if(locationInfo && locationInfo !== undefined){
                    const newLocationInfo = locationInfo.filter(u => u !== user);
                    models.user.findAll({where: {id: newLocationInfo}})
                        .then(users => {
                            const usersViewing = users.map(user => {
                                return {
                                    id: user.id,
                                    name: user.name,
                                    avatar: user.avatar
                                }
                            })
                            newLocationInfo.forEach(u => {
                                const socketID = socketUsers.get(u);
                                if(socketID && socketID !== undefined){
                                    io.to(socketID.id).emit('usersViewing.update', {location: userInfo.location, users: usersViewing});
                                }
                            })
                        })
                    socketLocations.set(userInfo.location, newLocationInfo);
                }
                locationInfo = socketLocations.get(location);
                if(locationInfo && locationInfo !== undefined){
                    const newLocationInfo = locationInfo.concat(user);
                    models.user.findAll({where: {id: newLocationInfo}})
                        .then(users => {
                            const usersViewing = users.map(user => {
                                return {
                                    id: user.id,
                                    name: user.name,
                                    avatar: user.avatar
                                }
                            })
                            newLocationInfo.forEach(u => {
                                const socketID = socketUsers.get(u);
                                if(socketID && socketID !== undefined){
                                    io.to(socketID.id).emit('usersViewing.update', {location: location, users: usersViewing});
                                }
                            })
                        })
                    socketLocations.set(location, newLocationInfo);
                }else{
                    socketLocations.set(location, [user]);
                }
                const newUserInfo = {
                    ...userInfo,
                    location
                }
                socketUsers.set(user,newUserInfo);
            }
        }

        io.on('connection', function (socket) {
            const user = socket.request.session && socket.request.session.passport && socket.request.session.passport.user;
            if(user){
                setUserId(user, socket.id);
                console.log('user ' + user + ' connected')
            }
            socket.on("disconnect", () => {
                const user = socket.request.session && socket.request.session.passport && socket.request.session.passport.user;
                if(user){
                    console.log('user ' + user + ' disconnected')
                    deleteUser(user);
                }
            });
        });

        app.use(sessionMiddleware);

        app.use(passport.initialize());
        app.use(passport.session());

        app.use(bodyParser.json());



        authRoutes(app);

        forumRoutes(app, io, socketUsers, socketLocations, setUserLocation);

        // if (process.env.NODE_ENV === 'production') {
            // Express will serve up production assets
            // like our main.js file, or main.css file!
            app.use(express.static('client/build'));

            // Express will serve up the index.html file
            // if it doesn't recognize the route
            const path = require('path');
            app.get('*', (req, res) => {
                res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
            });
        // }

        const PORT = 8081;
        server.listen(PORT);

    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });