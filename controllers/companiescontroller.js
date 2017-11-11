'use strict';

var Companies = require('../models/companies');
var fs = require('fs');
var parse = require('csv-parse');


function loadCompaniesCSV() {
    var inputPath = './data/companies.csv';
    fs.readFile(inputPath, function (err, fileData) {
        parse(fileData, {columns: true, trim: false}, function (err, rows) {
            for (var i = 0; i < rows.length; i++) {
                addCompanyIfNotExists(rows[i].NAME, rows[i].SYMBOL, rows[i].IS_PART_OF_SMI, rows[i].SECTOR,
                    rows[i].ISIN_CODE, rows[i].INDUSTRY, rows[i].MARKET_CAP_MIO, rows[i].SMI_WEIGHT);
            }
        });
    });
}

function addCompanyIfNotExists(name, symbol, is_part_of_smi, sector, isin_code, industry, market_cap_mio, smi_weight) {
    Companies.find({
        NAME: name,
        SYMBOL: symbol,
        IS_PART_OF_SMI: is_part_of_smi,
        SECTOR: sector,
        ISIN_CODE: isin_code,
        INDUSTRY: industry,
        MARKET_CAP_MIO: market_cap_mio,
        SMI_WEIGHT: smi_weight
    }, function (err, companies) {
        if (err) {
            console.log({message: 'Error performing the query: ' + err});
        } else if (companies.length === 0) {
            var companiesAdd = new Companies({
                NAME: name,
                SYMBOL: symbol,
                IS_PART_OF_SMI: is_part_of_smi,
                SECTOR: sector,
                ISIN_CODE: isin_code,
                INDUSTRY: industry,
                MARKET_CAP_MIO: market_cap_mio,
                SMI_WEIGHT: smi_weight
            });
            companiesAdd.save(function (err) {
                if (err) {
                    console.log({message: 'Error adding company: ' + err});
                }
            });
        }
    });
}

function getCompanies(callback) {
    Companies.find({}, function (err, companies) {
        callback(err, companies);
    });
}

module.exports.loadCompaniesCSV = loadCompaniesCSV;
module.exports.getCompanies = getCompanies;