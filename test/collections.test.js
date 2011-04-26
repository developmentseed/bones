var assert = require('assert');
var demo = require('./fixtures/collections');
var main = new demo.servers['Main'](demo);

exports['api endpoints'] = function() {
    assert.response(main.server, {
        url: '/api/house',
        method: 'GET'
    }, {
        body: '[{"foo":"bar"},{"foo":"baz"},{"foo":"blah"}]',
        status: 200
    });
};
