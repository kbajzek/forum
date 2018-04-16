const express = require('express');
// const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routes = require('./routes/forumRoutes');
const models = require('./models');

models.sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });


const app = express();

// mongoose.Promise = global.Promise;
app.use(bodyParser.json());

// let connection;
// if (process.env.NODE_ENV !== 'production') {
//     mongoose.connect('mongodb://localhost/forum_test');
// }

routes(app);

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
