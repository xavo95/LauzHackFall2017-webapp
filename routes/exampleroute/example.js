'use strict';

var mapIndex = function (req, res) {
    res.status(200);
    res.json({'msg': 'Angular Rest Test'});
};


module.exports.mapIndex = mapIndex;