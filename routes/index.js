'use strict';

var express = require('express');
var router = express.Router();
var exampleRouter = require('./exampleroute/example');


router.get('/example', exampleRouter.mapIndex);


module.exports.router = router;
