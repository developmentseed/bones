var Backbone = require('./backbone');
var _ = require('underscore');
var express = require('express');

module.exports = Server;

var middleware = {
    csrf: function() {
        return function(req, res, next) {
            if (req.method === 'GET') {
                next();
            } else if (req.body && req.cookies['bones.token'] && req.body['bones.token'] === req.cookies['bones.token']) {
                delete req.body['bones.token'];
                next();
            } else {
                res.send(403);
            }
        }
    },
    fragRedirect: function() {
        return function(req, res, next) {
            // @see https://code.google.com/web/ajaxcrawling/docs/specification.html
            if (req.query._escaped_fragment_ === undefined) {
                next();
            } else {
                // Force the first char of the path to be a slash to prevent
                // foreign redirects.
                var path = '/' + req.query._escaped_fragment_.substr(1);
                res.redirect(path, 301);
            }
        }
    }
};

function Server(plugin) {
    this.plugin = plugin;
    this.server = new express.createServer();

    // Stores models, views served by this server.
    this.models = {};
    this.views = {};

    // Stores instances of routers and controllers registered with this server.
    this.routers = {};
    this.controllers = {};

    this.middleware.forEach(function(middleware) {
        this.server.use(middleware());
    }, this);

    this.initialize(plugin);
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

    middleware: [ express.bodyParser, express.cookieParser, middleware.csrf, middleware.fragRedirect ],

    port: 3000,

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
