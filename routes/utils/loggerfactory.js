'use strict';

var winston = require('winston');
var expressWinston = require('express-winston');
var moment = require('moment');


var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            colorize: 'all'
        })
    ]
});

var expressLogger = new expressWinston.logger({
    transports: [
        new winston.transports.Console({
            json: false,
            colorize: true
        })
    ],
    meta: false,
    msg: "[{{req.timestamp}}] {{res.statusCode}} HTTP {{req.method}} {{req.url}} {{res.responseTime}}ms",
    expressFormat: false,
    colorize: true
});


function log(level, message, filePath, functionName) {
    var logMessage = '[' + moment().format() + '] ' + message + ' on file (' + filePath + ')@' + functionName;
    logger.log(level, logMessage);
}

function getExpressLogger() {
    return expressLogger;
}


module.exports.log = log;
module.exports.getExpressLogger = getExpressLogger;