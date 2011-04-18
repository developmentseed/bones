var Backbone = require('./backbone');
var _ = require('underscore');

module.exports = Backbone.Controller;

Backbone.Controller.register = function(server) {
    // Add the controller if it's not a server-only controller.
    this.files.forEach(function(filename) {
        if (!(/\.server.bones$/).test(filename)) {
            server.assets.controllers.push(filename);
        }
    });

    return new this(server);
};

Backbone.Controller.toString = function() {
    return '<Controller ' + this.title + '>';
};

Backbone.Controller.prototype.initialize = function(options) {
    if (!options.server) {
        throw new Error("Can't initialize controller without server.");
    }
    this.server = options.server;

    // Bind routes.
    if (this.routes) {
        var controller = this, routes = this.routes;
        // Add the last routes first.
        _(this.routes).keys().reverse().forEach(function(route) {
            var name = routes[route];
            controller.route(route, name, controller[name]);
        });
    }
};

Backbone.Controller.prototype.toString = function() {
    return '[Controller ' + this.constructor.title + ']';
};

Backbone.Controller.prototype._bindRoutes = function() {
    // Noop. Routes are bound in initialize();
};

Backbone.Controller.prototype.route = function(route, name, callback) {
    if (!_.isRegExp(route)) route = this._routeToRegExp(route);
    if (!_.isFunction(callback)) throw new Error("'" + name + "' is not a function in " + this);

    // Add route to express server.
    this.server.get(route, _.bind(function(req, res, next) {
        var fragment = (req.query && req.query['_escaped_fragment_']) || req.url;
        var args = this._extractParameters(route, fragment);
        callback.apply(this, args.concat([ function(content) {
            res.send(content);
        }, res ]));
        this.trigger.apply(this, ['route:' + name].concat(args));
    }, this));
};
