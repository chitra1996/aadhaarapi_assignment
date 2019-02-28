'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('express-handlebars');

const log = require('./app/api/logger').init();

const api = require('./app/index');
const app = express();

const config = require('./config');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Allow CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    next();
});

// api routes
app.use('/', api);

app.listen(config.port, () => {
    console.log("Server started!! Please visit:",
        '\x1b[36m',
        "http://localhost:" + config.port,
        '\x1b[0m');
});

// setup view engine
app.engine('.hbs', hbs({
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

// public files
app.use(express.static('public'));
