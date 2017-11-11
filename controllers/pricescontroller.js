'use strict';

var Prices = require('../models/prices');
var fs = require('fs');
var parse = require('csv-parse');


function loadPricesCSV() {
    var inputPath = './data/prices.csv';
    fs.readFile(inputPath, function (err, fileData) {
        parse(fileData, {columns: true, trim: false}, function (err, rows) {
            for (var i = 0; i < rows.length; i++) {
                addPriceIfNotExists(rows[i].ISIN_CODE, rows[i].PRICE, rows[i].VOL, rows[i].TIMESTAMP);
            }
        });
    });
}

function addPriceIfNotExists(isin_code, price, vol, timestamp) {
    Prices.find({
        ISIN_CODE: isin_code,
        PRICE: price,
        VOL: vol,
        TIMESTAMP: timestamp
    }, function (err, prices) {
        if (err) {
            console.log({message: 'Error performing the query: ' + err});
        } else if (prices.length === 0) {
            var priceAdd = new Prices({
                ISIN_CODE: isin_code,
                PRICE: price,
                VOL: vol,
                TIMESTAMP: timestamp
            });
            priceAdd.save(function (err) {
                if (err) {
                    console.log({message: 'Error adding price: ' + err});
                }
            });
        }
    });
}

function getPrices() {
    Prices.find({}, function (err, prices) {
        if (err) {
            return ({message: 'Error performing the query: ' + err});
        } else if (!prices) {
            return ({message: 'There is no prices on database'});
        } else if (prices.length === 0) {
            return ({message: 'There is no prices on database'});
        } else {
            return prices;
        }
    });
}

module.exports.loadPricesCSV = loadPricesCSV;
module.exports.getPrices = getPrices;