'use strict';

var Sectors = require('../models/sectors');
var fs = require('fs');
var parse = require('csv-parse');


function loadSectorCSV() {
    var inputPath = './data/sectors.csv';
    fs.readFile(inputPath, function (err, fileData) {
        parse(fileData, {columns: true, trim: false}, function (err, rows) {
            for (var i = 0; i < rows.length; i++) {
                addSectorIfNotExists(rows[i].SECTOR_NAME, rows[i].INDUSTRY_NAME, rows[i].SECTOR, rows[i].INDUSTRY);
            }
        });
    });
}

function addSectorIfNotExists(sector_name, industry_name, sector, industry) {
    Sectors.find({
        SECTOR_NAME: sector_name,
        INDUSTRY_NAME: industry_name,
        SECTOR: sector,
        INDUSTRY: industry
    }, function (err, sectors) {
        if (err) {
            console.log({message: 'Error performing the query: ' + err});
        } else if (sectors.length === 0) {
            var sectorAdd = new Sectors({
                SECTOR_NAME: sector_name,
                INDUSTRY_NAME: industry_name,
                SECTOR: sector,
                INDUSTRY: industry
            });
            sectorAdd.save(function (err) {
                if (err) {
                    console.log({message: 'Error adding sector: ' + err});
                }
            });
        }
    });
}

function getSectors(callback) {
    Sectors.find({}, function (err, sectors) {
        callback(err, sectors);
    });
}

function getSectorsShort(callback) {
    Sectors.find({}).sort({SECTOR: 1}).exec(function (err, sectors) {
        var sectors_acc = [sectors[0]];
        for(var i = 1; i < sectors.length; i++) {
            if(sectors_acc[sectors_acc.length - 1]._doc.SECTOR_NAME !== sectors[i]._doc.SECTOR_NAME) {
                sectors_acc.push(sectors[i]);
            }
        }
        callback(err, sectors_acc);
    });
}

module.exports.loadSectorCSV = loadSectorCSV;
module.exports.getSectors = getSectors;
module.exports.getSectorsShort = getSectorsShort;