'use strict';

var pricesController = require('../../controllers/pricescontroller');

var getPrices = function (req, res) {
    var callback = function (err, prices) {
        if (err) {
            return res.status(503).send({message: 'Error performing the query: ' + err});
        } else if (!prices) {
            return res.status(404).send({message: 'There is no prices on database'});
        } else if (prices.length === 0) {
            return res.status(404).send({message: 'There is no prices on database'});
        } else {
            return res.status(200).send(prices);
        }
    };
    pricesController.getPrices(callback);
};

var getPricesByISINCode = function (req, res) {
    var callback = function (err, prices) {
        if (err) {
            return res.status(503).send({message: 'Error performing the query: ' + err});
        } else if (!prices) {
            return res.status(404).send({message: 'There is no prices on database'});
        } else if (prices.length === 0) {
            return res.status(404).send({message: 'There is no prices on database'});
        } else {
            return res.status(200).send(prices);
        }
    };
    pricesController.getPricesByISINCode(callback, req.params.isin_code);
};


module.exports.getPrices = getPrices;
module.exports.getPricesByISINCode = getPricesByISINCode;