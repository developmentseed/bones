if (global.__BonesPlugin__) {
    console.trace("\033[0;31mMultiple instances of bones are not supported.\033[0m");
    process.exit(4);
}

exports.$ = require('jquery');
exports._ = require('underscore');
exports.mirror = require('mirror');

exports.utils = require('./server/utils');
exports.middleware = require('./server/middleware');

exports.server = true;

exports.Backbone = require('./server/backbone');
exports.Controller = require('./server/controller');
exports.Model = require('./server/model');
exports.Collection = require('./server/collection');
exports.View = require('./server/view');
exports.Server = require('./server/server');
exports.Command = require('./server/command');

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
