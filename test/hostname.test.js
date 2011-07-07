process.env.NODE_ENV = 'test';
var assert = require('assert');
var os = require('os');

var server = require('./fixture/start').servers.Core;

exports['hostname'] = function() {
    assert.response(server, {
        url: '/hostname'
    }, {
        status: 200
    });

    assert.response(server, {
        url: '/hostname',
        headers: { host: os.hostname() }
    }, {
        body: os.hostname(),
        status: 200
    });

    assert.response(server, {
        url: '/hostname',
        headers: { host: os.hostname() + ':3000' }
    }, {
        body: os.hostname() + ':3000',
        status: 200
    });

    assert.response(server, {
        url: '/hostname',
        headers: { host: 'other' }
    }, {
        body: 'other',
        status: 200
    });

    assert.response(server, {
        url: '/hostname',
        headers: { host: 'foo.third' }
    }, {
        body: 'foo.third',
        status: 200
    });

    assert.response(server, {
        url: '/hostname',
        headers: { host: 'foo.third:3000' }
    }, {
        body: 'foo.third:3000',
        status: 200
    });

    assert.response(server, {
        url: '/hostname',
        headers: { host: 'other.foo.third' }
    }, {
        status: 400
    });

    assert.response(server, {
        url: '/hostname',
        headers: { host: 'asdf' }
    }, {
        status: 400
    });
};
