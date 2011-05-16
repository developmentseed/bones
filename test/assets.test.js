process.env.NODE_ENV = 'test';
var assert = require('assert');

require('./fixtures/assets');
var demo = require('bones').plugin;
var main = new demo.servers['Main'](demo);

exports['assets'] = function(beforeExit) {
    assert.response(main.server, {
        url: '/assets/assets/does-not-exist',
        method: 'GET'
    }, {
        body: 'Not Found',
        status: 404
    });

    assert.response(main.server, {
        url: '/assets/assets/foo',
        method: 'GET'
    }, {
        body: 'lorem ipsum',
        status: 200
    });
};
