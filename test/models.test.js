process.env.NODE_ENV = 'test';
var assert = require('assert');

var server = require('./fixture/start').servers.Core;

describe('models', function() {
it('should load model', function(done) {
    assert.response(server, {
        url: '/api/Page/foo',
        method: 'GET'
    }, {
        body: '{"id":"foo","method":"read"}',
        status: 200
    }, done);
});

it('should return 404', function(done) {
    assert.response(server, {
        url: '/api/page/foo',
        method: 'GET'
    }, {
        body: 'Not Found',
        status: 404
    }, done);
});

it('should update model', function(done) {
    assert.response(server, {
        url: '/api/Page/foo',
        method: 'PUT',
        headers: {
            'content-type': 'application/json',
            'cookie': 'bones.token=1f4a1137268b8e384e50d0fb72c627c4'
        },
        body: '{"bones.token":"1f4a1137268b8e384e50d0fb72c627c4","id":"foo","key":"value"}'
    }, {
        body: '{"id":"foo","key":"value","method":"update"}',
        status: 200
    }, done);
});
});
