process.env.NODE_ENV = 'test';
var assert = require('assert');
var fs = require('fs');

require('./fixtures/assets');
var demo = require('bones').plugin;
var server = new demo.servers['Core'](demo);

exports['assets'] = function(beforeExit) {
    assert.response(server, {
        url: '/assets/assets/does-not-exist',
        method: 'GET'
    }, {
        body: 'Not Found',
        status: 404
    });

    assert.response(server, {
        url: '/assets/assets/foo',
        method: 'GET'
    }, {
        body: 'lorem ipsum',
        status: 200
    });
};

exports['core assets'] = function(beforeExit) {
    assert.response(server, {
        url: '/assets/bones/core.js',
        method: 'GET'
    }, { status: 200 }, function(res) {
        assert.ok(res.body.indexOf(fs.readFileSync(require.resolve('bones/client/backbone.js'))) >= 0);
        assert.ok(res.body.indexOf(fs.readFileSync(require.resolve('bones/client/utils.js'))) >= 0);
        assert.ok(res.body.indexOf(fs.readFileSync(require.resolve('bones/shared/backbone.js'))) >= 0);
        assert.ok(res.body.indexOf(fs.readFileSync(require.resolve('bones/shared/utils.js'))) >= 0);
    });

    assert.response(server, {
        url: '/assets/bones/vendor.js',
        method: 'GET'
    }, { status: 200 }, function(res) {
        assert.ok(res.body.indexOf(fs.readFileSync(require.resolve('bones/assets/jquery.js'))) >= 0);
        assert.ok(res.body.indexOf(fs.readFileSync(require.resolve('backbone'))) >= 0);
        assert.ok(res.body.indexOf(fs.readFileSync(require.resolve('underscore'))) >= 0);
    });
};
