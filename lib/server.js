var Backbone = require('./backbone');
var _ = require('underscore');
var express = require('express');

module.exports = Server;

function Server(options) {
    options || (options = {});
    this.server = new express.createServer();
    this.initialize(options);
};

_.extend(Server.prototype, Backbone.Events, {
    initialize : function() {},
    
    register: function(plugin) {
        plugin.register(this.server);
    },
    
    toString: function() {
        return '[Server ' + this.constructor.title + ']';
    }
});

Server.augment = Backbone.Controller.augment;
Server.extend = Backbone.Controller.extend;
Server.register = Backbone.Controller.register;
Server.toString = function() {
    return '<Server ' + this.title + '>';
};
