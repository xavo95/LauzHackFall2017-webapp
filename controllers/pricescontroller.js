'use strict';

var Prices = require('../models/prices');
var Companies = require('../models/companies');
var fs = require('fs');
var parse = require('csv-parse');
var Promise = require("bluebird");


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
        callback(err, prices);
    });
}

function getPricesByISINCode(callback, isin_code) {
    Prices.find({ISIN_CODE: isin_code}).sort({TIMESTAMP: 1}).exec(function (err, prices) {
        var timestamp0 = prices[0].TIMESTAMP;
        prices[0].TIMESTAMP = timestamp0.substring(0, 4) + '-' + timestamp0.substring(4, 6) + '-' +
            timestamp0.substring(6, 8) + ' ' + timestamp0.substring(8, 10) + ':' + timestamp0.substring(10, 12) +
            ':' + timestamp0.substring(12, 14);

        var prices_acc = [prices[0]];
        for (var i = 1; i < prices.length; i++) {
            var timestamp = prices[i].TIMESTAMP;
            prices[i].TIMESTAMP = timestamp.substring(0, 4) + '-' + timestamp.substring(4, 6) + '-' +
                timestamp.substring(6, 8) + ' ' + timestamp.substring(8, 10) + ':' + timestamp.substring(10, 12) +
                ':' + timestamp.substring(12, 14);
            if (prices[i].TIMESTAMP === prices_acc[prices_acc.length - 1].TIMESTAMP) {
                prices_acc[prices_acc.length - 1].VOL += prices[i].VOL;
            } else {
                prices_acc.push(prices[i]);
            }
        }
        var prices_acc_average = [prices_acc[0]];
        prices_acc_average[0]._doc.MAX = prices_acc_average[0].PRICE;
        prices_acc_average[0]._doc.MIN = prices_acc_average[0].PRICE;
        prices_acc_average[0]._doc.OPEN = prices_acc_average[0].PRICE;
        prices_acc_average[0]._doc.CLOSE = prices_acc_average[0].PRICE;
        for (var k = 1; k < prices_acc.length; k++) {
            var day = prices_acc[k].TIMESTAMP.substring(8, 10);
            var last_day = prices_acc_average[prices_acc_average.length - 1].TIMESTAMP.substring(8, 10);
            var hour = prices_acc[k].TIMESTAMP.substring(11, 13);
            var last_hour = prices_acc_average[prices_acc_average.length - 1].TIMESTAMP.substring(11, 13);
            if (day === last_day) {
                if (hour === last_hour) {
                    if(prices_acc_average[prices_acc_average.length - 1]._doc.MAX < prices_acc[k].PRICE) {
                        prices_acc_average[prices_acc_average.length - 1]._doc.MAX = prices_acc[k].PRICE;
                    } else if(prices_acc_average[prices_acc_average.length - 1]._doc.MIN > prices_acc[k].PRICE) {
                        prices_acc_average[prices_acc_average.length - 1]._doc.MIN = prices_acc[k].PRICE;
                    }
                } else {
                    prices_acc_average.push(prices_acc[k]);
                    prices_acc_average[prices_acc_average.length - 1]._doc.MAX = prices_acc_average[prices_acc_average.length - 1].PRICE;
                    prices_acc_average[prices_acc_average.length - 1]._doc.MIN = prices_acc_average[prices_acc_average.length - 1].PRICE;
                    prices_acc_average[prices_acc_average.length - 2]._doc.CLOSE = prices_acc_average[prices_acc_average.length - 2].PRICE;
                    prices_acc_average[prices_acc_average.length - 1]._doc.OPEN = prices_acc_average[prices_acc_average.length - 2]._doc.CLOSE;
                }
            } else {
                prices_acc_average.push(prices_acc[k]);
                prices_acc_average[prices_acc_average.length - 1]._doc.MAX = prices_acc_average[prices_acc_average.length - 1].PRICE;
                prices_acc_average[prices_acc_average.length - 1]._doc.MIN = prices_acc_average[prices_acc_average.length - 1].PRICE;
                prices_acc_average[prices_acc_average.length - 2]._doc.CLOSE = prices_acc_average[prices_acc_average.length - 2].PRICE;
                prices_acc_average[prices_acc_average.length - 1]._doc.OPEN = prices_acc_average[prices_acc_average.length - 2]._doc.CLOSE;
            }
        }
        prices_acc_average[prices_acc_average.length - 1]._doc.CLOSE = prices_acc_average[prices_acc_average.length - 1].PRICE;
        callback(err, prices_acc_average);
    });
}

function getPricesForSector(isin_code, name) {
    return new Promise(function(resolve) {
        Prices.find({ISIN_CODE: isin_code}).sort({TIMESTAMP: 1}).exec(function (err, prices) {
            prices[0]._doc.NAME = name;
            var timestamp0 = prices[0].TIMESTAMP;
            prices[0].TIMESTAMP = timestamp0.substring(0, 4) + '-' + timestamp0.substring(4, 6) + '-' +
                timestamp0.substring(6, 8) + ' ' + timestamp0.substring(8, 10) + ':' + timestamp0.substring(10, 12) +
                ':' + timestamp0.substring(12, 14);

            var prices_acc = [prices[0]];
            for (var i = 1; i < prices.length; i++) {
                prices[i]._doc.NAME = name;
                var timestamp = prices[i].TIMESTAMP;
                prices[i].TIMESTAMP = timestamp.substring(0, 4) + '-' + timestamp.substring(4, 6) + '-' +
                    timestamp.substring(6, 8) + ' ' + timestamp.substring(8, 10) + ':' + timestamp.substring(10, 12) +
                    ':' + timestamp.substring(12, 14);
                if (prices[i].TIMESTAMP === prices_acc[prices_acc.length - 1].TIMESTAMP) {
                    prices_acc[prices_acc.length - 1].VOL += prices[i].VOL;
                } else {
                    prices_acc.push(prices[i]);
                }
            }
            var prices_acc_average = [prices_acc[0]];
            prices_acc_average[0]._doc.MAX = prices_acc_average[0].PRICE;
            prices_acc_average[0]._doc.MIN = prices_acc_average[0].PRICE;
            prices_acc_average[0]._doc.OPEN = prices_acc_average[0].PRICE;
            prices_acc_average[0]._doc.CLOSE = prices_acc_average[0].PRICE;
            for (var k = 1; k < prices_acc.length; k++) {
                var day = prices_acc[k].TIMESTAMP.substring(8, 10);
                var last_day = prices_acc_average[prices_acc_average.length - 1].TIMESTAMP.substring(8, 10);
                var hour = prices_acc[k].TIMESTAMP.substring(11, 13);
                var last_hour = prices_acc_average[prices_acc_average.length - 1].TIMESTAMP.substring(11, 13);
                if (day === last_day) {
                    if (hour === last_hour) {
                        if(prices_acc_average[prices_acc_average.length - 1]._doc.MAX < prices_acc[k].PRICE) {
                            prices_acc_average[prices_acc_average.length - 1]._doc.MAX = prices_acc[k].PRICE;
                        } else if(prices_acc_average[prices_acc_average.length - 1]._doc.MIN > prices_acc[k].PRICE) {
                            prices_acc_average[prices_acc_average.length - 1]._doc.MIN = prices_acc[k].PRICE;
                        }
                    } else {
                        prices_acc_average.push(prices_acc[k]);
                        prices_acc_average[prices_acc_average.length - 1]._doc.MAX = prices_acc_average[prices_acc_average.length - 1].PRICE;
                        prices_acc_average[prices_acc_average.length - 1]._doc.MIN = prices_acc_average[prices_acc_average.length - 1].PRICE;
                        prices_acc_average[prices_acc_average.length - 2]._doc.CLOSE = prices_acc_average[prices_acc_average.length - 2].PRICE;
                        prices_acc_average[prices_acc_average.length - 1]._doc.OPEN = prices_acc_average[prices_acc_average.length - 2]._doc.CLOSE;
                    }
                } else {
                    prices_acc_average.push(prices_acc[k]);
                    prices_acc_average[prices_acc_average.length - 1]._doc.MAX = prices_acc_average[prices_acc_average.length - 1].PRICE;
                    prices_acc_average[prices_acc_average.length - 1]._doc.MIN = prices_acc_average[prices_acc_average.length - 1].PRICE;
                    prices_acc_average[prices_acc_average.length - 2]._doc.CLOSE = prices_acc_average[prices_acc_average.length - 2].PRICE;
                    prices_acc_average[prices_acc_average.length - 1]._doc.OPEN = prices_acc_average[prices_acc_average.length - 2]._doc.CLOSE;
                }
            }
            prices_acc_average[prices_acc_average.length - 1]._doc.CLOSE = prices_acc_average[prices_acc_average.length - 1].PRICE;
            resolve(prices_acc_average);
        });
    });
}

function getPricesBySectorCode(callback, sector_code) {
    Companies.find({SECTOR: sector_code}).sort({ISIN_CODE: 1}).exec(function (err, companies) {
        var prices = [];
        for (var i = 0; i < companies.length; ++i) {
            prices.push(getPricesForSector(companies[i]._doc.ISIN_CODE, companies[i]._doc.NAME));
        }
        Promise.all(prices).then(function(values) {
            callback(err, values);
        });
    });
}

module.exports.loadPricesCSV = loadPricesCSV;
module.exports.getPrices = getPrices;
module.exports.getPricesByISINCode = getPricesByISINCode;
module.exports.getPricesBySectorCode = getPricesBySectorCode;