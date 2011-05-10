exports.$ = require('jquery');
exports._ = require('underscore');
exports.mirror = require('mirror');

exports.utils = require('bones/server/utils');
exports.middleware = require('bones/server/middleware');

exports.server = true;

exports.Backbone = require('bones/server/backbone');
exports.Controller = require('bones/server/controller');
exports.Model = require('bones/server/model');
exports.Collection = require('bones/server/collection');
exports.Router = require('bones/server/router');
exports.View = require('bones/server/view');
exports.Server = require('bones/server/server');
exports.Command = require('bones/server/command');

Object.defineProperty(exports, 'plugin', {
    get: function() {
        if (!global.__BonesPlugin__) {
            var Plugin = require('./server/plugin');
            global.__BonesPlugin__ = new Plugin();
            require('./core');
        }
        return global.__BonesPlugin__;
    }
});

exports.load = function(dir) {
    this.plugin.directories.push(dir);
    this.plugin
        .require(dir, 'controllers')
        .require(dir, 'models')
        .require(dir, 'routers')
        .require(dir, 'templates')
        .require(dir, 'views')
        .require(dir, 'servers')
        .require(dir, 'commands');
};

exports.start = function() {
    return this.plugin.start();
};
