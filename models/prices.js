'use strict';

var mongoose = require('mongoose');

var PricesSchema = new mongoose.Schema({
    ISIN_CODE: {type: String, required: true},
    PRICE: {type: Number, required: true},
    VOL: {type: Number, required: true},
    TIMESTAMP: {type: String, required: true}
});

module.exports = mongoose.model('Price', PricesSchema);