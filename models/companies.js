'use strict';

var mongoose = require('mongoose');

var CompaniesSchema = new mongoose.Schema({
    NAME: {type: String, required: true},
    SYMBOL: {type: String, required: true},
    IS_PART_OF_SMI: {type: Number, required: true},
    SECTOR: {type: Number, required: true},
    ISIN_CODE: {type: String, required: true},
    INDUSTRY: {type: Number, required: true},
    // DUFRY N doesn't have market cap mio
    MARKET_CAP_MIO: {type: Number, required: false},
    // SMI_WEIGHT only appears if is part of smi
    SMI_WEIGHT: {type: Number, required: false}
});

module.exports = mongoose.model('Company', CompaniesSchema);