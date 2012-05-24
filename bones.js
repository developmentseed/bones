if (global.__BonesPlugin__) {
    console.trace("\033[0;31mMultiple instances of bones are not supported.\033[0m");
    process.exit(4);
}

exports.$ = require('jquery');
exports._ = require('underscore');
exports.mirror = require('mirror');

exports.utils = require('bones/server/utils');
exports.middleware = require('bones/server/middleware');

exports.server = true;

exports.Backbone = require('bones/server/backbone');
exports.Backbone.setDomLibrary(exports.$);

exports.Router = require('bones/server/router');
exports.Model = require('bones/server/model');
exports.Collection = require('bones/server/collection');
exports.View = require('bones/server/view');
exports.Server = require('bones/server/server');
exports.Command = require('bones/server/command');

exports.load = function(dir) {
    return exports.plugin.load(dir);
};

exports.start = function(callback) {
    return exports.plugin.start(callback);
};

var Plugin = require('./server/plugin');
global.__BonesPath__ = require.resolve('bones');
exports.plugin = global.__BonesPlugin__ = new Plugin();
exports.plugin.load(__dirname);
