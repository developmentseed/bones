process.env.NODE_ENV = 'test';
var assert = require('assert');
var fs = require('fs');
var path = require('path');

var fixture = require(path.join(__dirname, '../')).plugin;

describe('router', function() {
it('router behavior', function() {
    assert['throws'](function() {
        new fixture.routers.Page;
    }, "Can't initialize router without server.");
});
});
