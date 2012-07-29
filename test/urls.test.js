process.env.NODE_ENV = 'test';
var assert = require('assert');

var server = require('./fixture/start').servers.Core;

describe('URL handling', function() {

it('should redirect _escaped_fragment_',function(done) {
    assert.response(server, {
        url: '/page/special?_escaped_fragment_=/something/different',
        method: 'GET'
    }, {
        body: '<p>Moved Permanently. Redirecting to <a href="http://127.0.0.1:3000/something/different">http://127.0.0.1:3000/something/different</a></p>',
        status: 301
    }, done);
});

it('should serve home for hash requests', function(done) {
    assert.response(server, {
        url: '/#!/map/devseed-hq',
        method: 'GET'
    }, {
        body: 'home',
        status: 200
    }, done);
});

it('should ignore query strings', function(done) {
    assert.response(server, {
        url: '/?foo',
        method: 'GET'
    }, {
        body: 'home',
        status: 200
    }, done);
});

});
