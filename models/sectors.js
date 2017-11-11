'use strict';

var mongoose = require('mongoose');

var SectorsSchema = new mongoose.Schema({
    SECTOR_NAME: {type: String, required: true},
    INDUSTRY_NAME: {type: String, required: true},
    SECTOR: {type: Number, required: true},
    INDUSTRY: {type: Number, required: true}
});

module.exports = mongoose.model('Sector', SectorsSchema);