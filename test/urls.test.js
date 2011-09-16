process.env.NODE_ENV = 'test';
var assert = require('assert');

var server = require('./fixture/start').servers.Core;

exports['_escaped_fragment_ redirect'] = function() {
    assert.response(server, {
        url: '/page/special?_escaped_fragment_=/something/different',
        method: 'GET'
    }, {
        body: '<p>Moved Permanently. Redirecting to <a href="http://127.0.0.1:3000/something/different">http://127.0.0.1:3000/something/different</a></p>',
        status: 301
    });
}

exports['hash request'] = function() {
    assert.response(server, {
        url: '/#!/map/devseed-hq',
        method: 'GET'
    }, {
        body: 'home',
        status: 200
    });
}

exports['query request'] = function() {
    assert.response(server, {
        url: '/?foo',
        method: 'GET'
    }, {
        body: 'home',
        status: 200
    });
}
