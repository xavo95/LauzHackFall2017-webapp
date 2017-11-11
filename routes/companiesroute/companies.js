'use strict';

var companiesController = require('../../controllers/companiescontroller');

var getCompanies = function (req, res) {
    var callback = function (err, companies) {
        if (err) {
            return res.status(503).send({message: 'Error performing the query: ' + err});
        } else if (!companies) {
            return res.status(404).send({message: 'There is no companies on database'});
        } else if (companies.length === 0) {
            return res.status(404).send({message: 'There is no companies on database'});
        } else {
            return res.status(200).send(companies);
        }
    };
    companiesController.getCompanies(callback);
};


module.exports.getCompanies = getCompanies;