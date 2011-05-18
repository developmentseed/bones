process.env.NODE_ENV = 'test';
var assert = require('assert');
var fs = require('fs');

require('./fixture');
var fixture = require('bones').plugin;
var server = new fixture.servers['Core'](fixture);

exports['controller behavior'] = function() {
    assert['throws'](function() {
        new fixture.controllers.Page;
    }, "Can't initialize controller without server.");
};
