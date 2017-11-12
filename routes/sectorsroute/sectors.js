'use strict';

var sectorController = require('../../controllers/sectorscontroller');

var getSectors = function (req, res) {
    var callback = function (err, sectors) {
        if (err) {
            return res.status(503).send({message: 'Error performing the query: ' + err});
        } else if (!sectors) {
            return res.status(404).send({message: 'There is no sectors on database'});
        } else if (sectors.length === 0) {
            return res.status(404).send({message: 'There is no sectors on database'});
        } else {
            return res.status(200).send(sectors);
        }
    };
    sectorController.getSectors(callback);
};

var getSectorsShort = function (req, res) {
    var callback = function (err, sectors) {
        if (err) {
            return res.status(503).send({message: 'Error performing the query: ' + err});
        } else if (!sectors) {
            return res.status(404).send({message: 'There is no sectors on database'});
        } else if (sectors.length === 0) {
            return res.status(404).send({message: 'There is no sectors on database'});
        } else {
            return res.status(200).send(sectors);
        }
    };
    sectorController.getSectorsShort(callback);
};


module.exports.getSectors = getSectors;
module.exports.getSectorsShort = getSectorsShort;