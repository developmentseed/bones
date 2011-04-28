var Backbone = require('./backbone');
var _ = require('underscore');
var express = require('express');

module.exports = Server;

function Server(plugin) {
    this.plugin = plugin;

    this.server = new express.createServer();
    this.models = {};

    var core = this.register(this.plugin.routers['Core']);
    this.initialize(this.plugin);
    core.initializeModels(this);
    core.initializeCollections(this);
};

_.extend(Server.prototype, Backbone.Events, {
    initialize : function(root) {},

    port: 3000,

    register: function(component, args) {
        return component.register(this, args);
    },

    start: function() {
        this.server.listen(this.port);
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
