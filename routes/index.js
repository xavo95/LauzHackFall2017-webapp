'use strict';

var express = require('express');
var router = express.Router();
var exampleRouter = require('./exampleroute/example');
var sectorsRouter = require('./sectorsroute/sectors');
var companiesRouter = require('./companiesroute/companies');
var pricesRouter = require('./pricesroute/prices');


router.get('/example', exampleRouter.mapIndex);
router.get('/sectors', sectorsRouter.getSectors);
router.get('/companies', companiesRouter.getCompanies);
router.get('/prices', pricesRouter.getPrices);
router.get('/prices/:isin_code', pricesRouter.getPricesByISINCode);


module.exports.router = router;
