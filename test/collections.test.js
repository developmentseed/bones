process.env.NODE_ENV = 'test';
var assert = require('assert');

var server = require('./fixture/start').servers.Core;

describe('api endpoints', function() {

it('should load collection', function(done) {
    assert.response(server, {
        url: '/api/House',
        method: 'GET'
    }, {
        body: '[{"foo":"bar"},{"foo":"baz"},{"foo":"blah"}]',
        status: 200
    }, done);
});

it('should return 500', function(done) {
    assert.response(server, {
        url: '/api/Failure',
        method: 'GET'
    }, {
        body: 'Internal Server Error',
        status: 500
    }, done);
});

it('should return 500', function(done) {
    assert.response(server, {
        url: '/api/Failure',
        method: 'GET',
        headers: { accept: 'application/json' }
    }, {
        body: '{"message":"Internal Server Error"}',
        status: 500
    }, done);
});

it('should return 404', function(done) {
    assert.response(server, {
        url: '/api/DoesNotExist',
        method: 'GET'
    }, {
        body: 'Not Found',
        status: 404
    }, done);
});

it('should return 404', function(done) {
    assert.response(server, {
        url: '/api/DoesNotExist',
        method: 'GET',
        headers: { accept: 'application/json' }
    }, {
        body: '{"message":"Not Found"}',
        status: 404
    }, done);
});

});
