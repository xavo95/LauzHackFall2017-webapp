'use strict';

var mongoose = require("mongoose");
var Example = require('../../../routes/exampleroute/example');

//Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../../app');
var should = chai.should();

chai.use(chaiHttp);

describe('Example Route TEST', function() {
    before(function() {
        // runs before all tests in this block
    });

    after(function() {
        server.server.close();
    });

    beforeEach(function() {
        // runs before each test in this block
    });

    afterEach(function() {
        // runs after each test in this block
    });

    /*
    * Test the /GET route
    */
    describe('/GET root', function() {
        it('it should GET all the examples', function(done) {
            chai.request(server.server).get('/api/example').end(function(err, res) {
                res.should.have.status(200);
                res.body.msg.should.to.equal('Angular Rest Test');
                done();
            });
        });
    });
});