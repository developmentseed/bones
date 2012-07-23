process.env.NODE_ENV = 'test';
var assert = require('assert');
var os = require('os');

var server = require('./fixture/start').servers.Core;

describe('routes', function() {

it('should load submodule page', function(done) {
    assert.response(server, {
        url: '/submodule-page',
        method: 'GET'
    }, {
        body: 'submodule page',
        status: 200
    }, done);
});

it('should load foo page', function(done) {
    assert.response(server, {
        url: '/page/foo',
        method: 'GET'
    }, {
        body: 'page foo',
        status: 200
    }, done);
});

it('should load  bar page', function(done) {
    assert.response(server, {
        url: '/page/bar',
        method: 'GET'
    }, {
        body: 'page bar',
        status: 200
    }, done);
});

it('should load special page', function(done) {
    assert.response(server, {
        url: '/page/special',
        method: 'GET'
    }, {
        body: 'special page',
        status: 200
    }, done);
});

it('should redirect fragment querystring', function(done) {
    assert.response(server, {
        url: '/?_escaped_fragment_=/page/special',
        method: 'GET',
        headers: { host: os.hostname() }
    }, {
        body: '<p>Moved Permanently. Redirecting to <a href="http://' + os.hostname() + '/page/special">http://' + os.hostname() + '/page/special</a></p>',
        status: 301
    }, function(err, res) {
        assert.ifError(err);
        assert.equal(res.headers.location, 'http://' + os.hostname() + '/page/special');
        done();
    });
});

it('should load baz page', function(done) {
    assert.response(server, {
        url: '/page/baz',
        method: 'GET'
    }, {
        body: 'bones router special page',
        status: 200
    }, done);
});

it('should deny POST', function() {
    assert.response(server, {
        url: '/page/foo',
        method: 'POST'
    }, {
        body: 'Forbidden',
        status: 403
    });
});

it('should not find page', function() {
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
});

});
