'use strict';

// Load environment variables defined at '.env' file
require('dotenv').config();
var path = require("path");
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var compression = require('compression');
var mongoose = require('mongoose');


var middlewareLoggerTimestamp = require('./middlewares/middlewareLoggerTimestamp');
var router = require('./routes/index');
var logger = require('./routes/utils/loggerfactory');
var sectorController = require('./controllers/sectorscontroller');
var companiesController = require('./controllers/companiescontroller');
var pricesController = require('./controllers/pricescontroller');


// Enable transport compression
app.use(compression());

// Enable Logging Express
app.use(logger.getExpressLogger());

// Setup a global middleware example
app.use(middlewareLoggerTimestamp.loggerTimestampMiddleware);

// Serve static assets from the app folder. This enables things like javascript
// and stylesheets to be loaded as expected. Analog to nginx.
app.use('/', express.static(path.join(__dirname, 'public')));

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: true
}));

// Parse application/json
app.use(bodyParser.json());

// enables them to specify the verb on header 'X-HTTP-Method-Override'
app.use(methodOverride('X-HTTP-Method-Override'));

// Setup app routes
app.use('/api', router.router);

// Start the server
var configPort = process.env.PORT;
var port = (configPort !== undefined ? configPort : 8888);
var server = app.listen(port, function () {
    logger.log('info', "Listening on port " + server.address().port, 'app.js', 'root');
});

var configMongoURL = process.env.MONGODB;
var mongoURL = (configMongoURL !== undefined ? configMongoURL : 'mongodb://localhost:27017/lauzhack2017');
mongoose.connect(mongoURL, {
    useMongoClient: true
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error connecting to database:'));
db.once('open', function() {
    logger.log('info', "Connected to the database...", 'app.js', 'root');
    sectorController.loadSectorCSV();
    companiesController.loadCompaniesCSV();
    // pricesController.loadPricesCSV();
});

module.exports.server = server;