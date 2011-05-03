module.exports = {
    $: require('jquery'),
    _: require('underscore'),
    express: require('express'),
    mirror: require('mirror'),

    utils: require('bones/server/utils'),

    server: true,

    Backbone: require('bones/server/backbone'),
    Controller: require('bones/server/controller'),
    Model: require('bones/server/model'),
    Collection: require('bones/server/collection'),
    Router: require('bones/server/router'),
    View: require('bones/server/view'),
    Server: require('bones/server/server'),
    Command: require('bones/server/command'),

    get plugin() {
        if (!global.__BonesPlugin__) {
            var Plugin = require('./server/plugin');
            global.__BonesPlugin__ = new Plugin();
            require('./core');
        }
        return global.__BonesPlugin__;
    },

    load: function(dir) {
        this.plugin.directories.push(dir);
        this.plugin
            .require(dir, 'controllers')
            .require(dir, 'models')
            .require(dir, 'routers')
            .require(dir, 'templates')
            .require(dir, 'views')
            .require(dir, 'servers')
            .require(dir, 'commands');
    },

    start: function() {
        return this.plugin.start();
    }
};
