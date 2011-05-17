process.env.NODE_ENV = 'test';
var assert = require('assert');

require('./fixtures/assets');
var demo = require('bones').plugin;
var server = new demo.servers['Core'](demo);

exports['assets'] = function(beforeExit) {
    assert.response(server, {
        url: '/assets/assets/does-not-exist',
        method: 'GET'
    }, {
        body: 'Not Found',
        status: 404
    });

    assert.response(server, {
        url: '/assets/assets/foo',
        method: 'GET'
    }, {
        body: 'lorem ipsum',
        status: 200
    });
};
