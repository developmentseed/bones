process.env.NODE_ENV = 'test';
var assert = require('assert');

require('./fixtures/collections');
var demo = require('bones').plugin;
var server = new demo.servers['Core'](demo);

exports['api endpoints'] = function() {
    assert.response(server, {
        url: '/api/House',
        method: 'GET'
    }, {
        body: '[{"foo":"bar"},{"foo":"baz"},{"foo":"blah"}]',
        status: 200
    });
};
