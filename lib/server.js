var Backbone = require('./backbone');
var _ = require('underscore');
var express = require('express');

module.exports = Server;

function Server(options) {
    options || (options = {});

    this.server = new express.createServer();
    this.models = {};

    this.initialize(options);
};

_.extend(Server.prototype, Backbone.Events, {
    initialize : function() {},

    port: 3000,

    register: function(component) {
        component.register(this);
    },

    start: function() {
        this.server.listen(this.port);
    },

    toString: function() {
        return '[Server ' + this.constructor.title + ':' + this.server.address().port + ']';
    }
});

Server.augment = Backbone.Controller.augment;
Server.extend = Backbone.Controller.extend;
Server.register = Backbone.Controller.register;
Server.toString = function() {
    return '<Server ' + this.title + '>';
};
