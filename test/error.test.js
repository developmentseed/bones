process.env.NODE_ENV = 'test';
var assert = require('assert');

var server = require('./fixture/start').servers.Core;

describe('errors', function() {

it('should return 404', function(done) {
    assert.response(server, {
        url: '/does-not-exist',
        method: 'GET'
    }, {
        body: 'Not Found',
        status: 404
    }, done);
});

it('should return JSON 404 message', function(done) {
    assert.response(server, {
        url: '/does-not-exist',
        method: 'GET',
        headers: { 'accept': 'application/json' }
    }, {
        body: '{"message":"Not Found"}',
        status: 404
    }, done);
});

it('should return 403', function(done) {
    assert.response(server, {
        url: '/does-not-exist',
        method: 'POST',
        headers: { 'accept': 'application/json' }
    }, {
        body: '{"message":"Forbidden"}',
        status: 403
    }, done);
});

it('should return 404', function(done) {
    assert.response(server, {
        url: '/does-not-exist',
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'cookie': 'bones.token=cfd72122969dfaefddd180725fadf53f;'
        },
        body: JSON.stringify({ 'bones.token': 'cfd72122969dfaefddd180725fadf53f' })
    }, {
        body: 'Not Found',
        status: 404
    }, done);
});

it('should return JSON 404 message', function(done) {
    assert.response(server, {
        url: '/does-not-exist',
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
            'cookie': 'bones.token=cfd72122969dfaefddd180725fadf53f;'
        },
        body: JSON.stringify({ 'bones.token': 'cfd72122969dfaefddd180725fadf53f' })
    }, {
        body: '{"message":"Not Found"}',
        status: 404
    }, done);
});

it('should return 404', function(done) {
    assert.response(server, {
        url: '/api/DoesNotExit/asdf',
        method: 'GET'
    }, {
        body: 'Not Found',
        status: 404
    }, done);
});

it('should return JSON 404 message', function(done) {
    assert.response(server, {
        url: '/api/DoesNotExit/asdf',
        method: 'GET',
        headers: { 'accept': 'application/json' }
    }, {
        body: '{"message":"Not Found"}',
        status: 404
    }, done);
});

it('should return 404', function(done) {
    assert.response(server, {
        url: '/api/Page/asdf',
        method: 'GET'
    }, {
        body: 'Not Found',
        status: 404
    }, done);
});

it('should return JSON 404 message', function(done) {
    assert.response(server, {
        url: '/api/Page/asdf',
        method: 'GET',
        headers: { 'accept': 'application/json' }
    }, {
        body: '{"message":"Not Found"}',
        status: 404
    }, done);
});

it('should return 409', function(done) {
    assert.response(server, {
        url: '/api/Page/asdf',
        method: 'PUT',
        headers: {
            'content-type': 'application/json',
            'cookie': 'bones.token=cfd72122969dfaefddd180725fadf53f;'
        },
        body: JSON.stringify({ 'bones.token': 'cfd72122969dfaefddd180725fadf53f' })
    }, {
        body: 'Conflict',
        status: 409
    }, done);
});

it('should return JSON 409 message', function(done) {
    assert.response(server, {
        url: '/api/Page/asdf',
        method: 'PUT',
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
            'cookie': 'bones.token=cfd72122969dfaefddd180725fadf53f;'
        },
        body: JSON.stringify({ 'bones.token': 'cfd72122969dfaefddd180725fadf53f' })
    }, {
        body: '{"message":"Conflict"}',
        status: 409
    }, done);
});

it('should return 409', function(done) {
    assert.response(server, {
        url: '/api/Page/asdf',
        method: 'DELETE',
        headers: {
            'content-type': 'application/json',
            'cookie': 'bones.token=cfd72122969dfaefddd180725fadf53f;'
        },
        body: JSON.stringify({ 'bones.token': 'cfd72122969dfaefddd180725fadf53f' })
    }, {
        body: 'Conflict',
        status: 409
    }, done);
});

it('should return JSON 409 message', function(done) {
    assert.response(server, {
        url: '/api/Page/asdf',
        method: 'DELETE',
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
            'cookie': 'bones.token=cfd72122969dfaefddd180725fadf53f;'
        },
        body: JSON.stringify({ 'bones.token': 'cfd72122969dfaefddd180725fadf53f' })
    }, {
        body: '{"message":"Conflict"}',
        status: 409
    }, done);
});

});
