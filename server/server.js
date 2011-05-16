var Backbone = require('./backbone');
var _ = require('underscore');
var express = require('express');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var middleware = require('..').middleware;

module.exports = Server;
util.inherits(Server, EventEmitter);
function Server(plugin) {
    this.plugin = plugin;
    this.server = new express.createServer();

    // Stores models, views served by this server.
    this.models = {};
    this.views = {};

    // Stores instances of routers and controllers registered with this server.
    this.routers = {};
    this.controllers = {};

    this.middleware(plugin);
    this.initialize(plugin);
    this.conclude(plugin);
};

_.extend(Server.prototype, Backbone.Events, {
    initialize : function(plugin) {
        // Default implementation loads all components.
        var components = ['routers', 'controllers', 'models', 'views', 'templates'];
        components.forEach(function(kind) {
            for (var name in plugin[kind]) {
                plugin[kind][name].register(this);
            }
        }, this);
    },

    middleware: function(plugin) {
        this.server.use(middleware.bodyParser());
        this.server.use(middleware.cookieParser());
        this.server.use(middleware.csrf());
        this.server.use(middleware.fragmentRedirect());
        this.server.error(middleware.showError());
    },

    // TODO: Find a better solution for pre/post hooks
    conclude: function(plugin) {
        if (this.server) {
            this.server.all('*', middleware.notFound());
        }
    },

    port: 3000,

    start: function(callback) {
        this.server.listen(this.port, callback);
        return this;
    },

    toString: function() {
        if (this.server) {
            return '[Server ' + this.constructor.title + ':' + this.server.address().port + ']';
        } else {
            return '[Server ' + this.constructor.title + ']';
        }
    }
});

Server.augment = Backbone.Controller.augment;
Server.extend = Backbone.Controller.extend;
Server.toString = function() {
    return '<Server ' + this.title + '>';
};
