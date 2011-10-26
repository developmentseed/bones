var Backbone = require('./backbone');
var _ = require('underscore');
var HTTPServer = require('express').HTTPServer;
var middleware = require('..').middleware;

module.exports = Server;
function Server(plugin) {
    HTTPServer.call(this, []);
    this.plugin = plugin;
    this.initialize.apply(this, arguments);
    this.conclude.apply(this, arguments);
};

Server.prototype.__proto__ = HTTPServer.prototype;

_.extend(Server.prototype, Backbone.Events, {
    initialize : function(plugin) {},

    conclude: function(plugin) {
        // Add catchall 404 middleware and error handler for root servers.
        if (this.port) {
            this.use(middleware.notFound());
            this.error(middleware.showError());
        // Remove redundant frontmost middleware from each server that will not
        // be a root server. See `express/lib/http.js`.
        } else {
            this.stack.shift();
        }
    },

    port: null,

    start: function(callback) {
        this.port && this.listen(this.port, callback);
        return this;
    },

    toString: function() {
        if (this.port) {
            return '[Server ' + this.constructor.title + ':' + this.address().port + ']';
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
