process.env.NODE_ENV = 'test';
var assert = require('assert');

var server = require('./fixture/start').servers.Core;

exports['api endpoints'] = function() {
    assert.response(server, {
        url: '/api/House',
        method: 'GET'
    }, {
        body: '[{"foo":"bar"},{"foo":"baz"},{"foo":"blah"}]',
        status: 200
    });

    assert.response(server, {
        url: '/api/Failure',
        method: 'GET'
    }, {
        body: 'Internal Server Error',
        status: 500
    });

    assert.response(server, {
        url: '/api/Failure',
        method: 'GET',
        headers: { accept: 'application/json' }
    }, {
        body: '{"message":"Internal Server Error"}',
        status: 500
    });

    assert.response(server, {
        url: '/api/DoesNotExist',
        method: 'GET'
    }, {
        body: 'Not Found',
        status: 404
    });

    assert.response(server, {
        url: '/api/DoesNotExist',
        method: 'GET',
        headers: { accept: 'application/json' }
    }, {
        body: '{"message":"Not Found"}',
        status: 404
    });
};
