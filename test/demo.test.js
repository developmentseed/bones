process.env.NODE_ENV = 'test';
var assert = require('assert');

require('./fixtures/demo');
var demo = require('bones').plugin;
var server = new demo.servers['Core'](demo);

exports['routes'] = function(beforeExit) {
    assert.response(server, {
        url: '/submodule-page',
        method: 'GET'
    }, {
        body: 'submodule page',
        status: 200
    });

    assert.response(server, {
        url: '/page/foo',
        method: 'GET'
    }, {
        body: 'page foo',
        status: 200
    });

    assert.response(server, {
        url: '/page/bar',
        method: 'GET'
    }, {
        body: 'page bar',
        status: 200
    });

    assert.response(server, {
        url: '/page/special',
        method: 'GET'
    }, {
        body: 'special page',
        status: 200
    });

    assert.response(server, {
        url: '/page/baz',
        method: 'GET'
    }, {
        body: 'bones router special page',
        status: 200
    });

    assert.response(server, {
        url: '/page/foo',
        method: 'POST'
    }, {
        body: 'Forbidden',
        status: 403
    });

    assert.response(server, {
        url: '/page/foo',
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'cookie': 'bones.token=1f4a1137268b8e384e50d0fb72c627c4'
        },
        body: '{"bones.token":"1f4a1137268b8e384e50d0fb72c627c4"}'
    }, {
        body: 'Not Found',
        status: 404
    });
};
