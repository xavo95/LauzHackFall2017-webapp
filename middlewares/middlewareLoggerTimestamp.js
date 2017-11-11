'use strict';

var moment = require('moment');


var loggerTimestampMiddleware = function (req, res, next) {
    req.timestamp = moment().format();
    next();
};

module.exports.loggerTimestampMiddleware = loggerTimestampMiddleware;