process.env.NODE_ENV = 'test';
var assert = require('assert');

require('./fixtures/collections');
var demo = require('bones').plugin;
var main = new demo.servers['Main'](demo);

exports['api endpoints'] = function() {
    assert.response(main.server, {
        url: '/api/House',
        method: 'GET'
    }, {
        body: '[{"foo":"bar"},{"foo":"baz"},{"foo":"blah"}]',
        status: 200
    });
};
