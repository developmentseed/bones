if (global.__BonesPlugin__) {
    console.trace("\033[0;31mMultiple instances of bones are not supported.\033[0m");
    process.exit(4);
}

var path = require('path');

exports.$ = require('jquery');
exports._ = require('underscore');
exports.mirror = require('mirror');

exports.utils = require(path.join(__dirname, 'server/utils'));
exports.middleware = require(path.join(__dirname, 'server/middleware'));

exports.server = true;

exports.Backbone = require(path.join(__dirname, 'server/backbone'));
exports.Router = require(path.join(__dirname, 'server/router'));
exports.Model = require(path.join(__dirname, 'server/model'));
exports.Collection = require(path.join(__dirname, 'server/collection'));
exports.View = require(path.join(__dirname, 'server/view'));
exports.Server = require(path.join(__dirname, 'server/server'));
exports.Command = require(path.join(__dirname, 'server/command'));

exports.load = function(dir) {
    return exports.plugin.load(dir);
};

exports.start = function(callback) {
    return exports.plugin.start(callback);
};

var Plugin = require('./server/plugin');
global.__BonesPath__ = require.resolve(__dirname);
exports.plugin = global.__BonesPlugin__ = new Plugin();
exports.plugin.load(__dirname);
