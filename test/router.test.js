process.env.NODE_ENV = 'test';
var assert = require('assert');
var fs = require('fs');

var fixture = require('bones').plugin;

exports['router behavior'] = function() {
    assert['throws'](function() {
        new fixture.routers.Page;
    }, "Can't initialize router without server.");
};
