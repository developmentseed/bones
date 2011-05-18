process.env.NODE_ENV = 'test';
var assert = require('assert');
var fs = require('fs');

var fixture = require('bones').plugin;

exports['controller behavior'] = function() {
    assert['throws'](function() {
        new fixture.controllers.Page;
    }, "Can't initialize controller without server.");
};
