var util = require('util');
var _ = require('underscore');
var Backbone = module.exports = require('backbone');

Backbone.Controller.augment = function(props) {
    var obj = this.prototype;
    for (var key in props) {
        if (typeof props[key] === 'function') {
            obj[key] = _.wrap(obj[key], props[key]);
        } else if (_.isArray(props[key])) {
            obj[key] = _.isArray(obj[key]) ? obj[key].concat(props[key]) : props[key];
        } else if (typeof props[key] === 'object') {
            obj[key] = _.extend({}, obj[key], props[key]);
        } else {
            obj[key] = props[key];
        }
    }

    return this;
};

Backbone.Controller.toString = function() {
    return '<Backbone.Controller ' + this.title + '>';
};

var extend = Backbone.Controller.extend;
Backbone.Controller.extend = function() {
    var child = extend.apply(this, arguments);
    child.extend = this.extend;
    child.augment = this.augment;
    child.toString = this.toString;
    return child;
};

Backbone.Controller.prototype.initialize = function(options) {
    if (!options.server) {
        throw new Error("Can't initialize controller without server.");
    }
    this.server = options.server;

    // Bind routes.
    if (this.routes) {
        var controller = this, routes = this.routes;
        _(this.routes).keys().reverse().forEach(function(route) {
            var name = routes[route];
            controller.route(route, name, controller[name]);
        });
    }
};

Backbone.Controller.prototype.toString = function() {
    return '[Backbone.Controller ' + this.constructor.title + ']';
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
        callback.apply(this, args.concat([res]));
        this.trigger.apply(this, ['route:' + name].concat(args));
    }, this));
};
