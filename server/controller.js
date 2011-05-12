var Backbone = require('./backbone');
var _ = require('underscore');

module.exports = Backbone.Controller;

Backbone.Controller.register = function(app) {
    // Add the controller if it's not a server-only controller.
    this.files.forEach(function(filename) {
        if (!(/\.server\.bones$/).test(filename) && app.assets &&
            app.assets.controllers.indexOf(filename) < 0) {
            app.assets.controllers.push(filename);
        }
    });

    // TODO push the order of the controllers to the client

    return app.controllers[this.title] = new this(app);
};

Backbone.Controller.toString = function() {
    return '<Controller ' + this.title + '>';
};

Backbone.Controller.prototype.initialize = function(app) {
    if (!app.server) {
        throw new Error("Can't initialize controller without server.");
    }
    this.server = app.server;

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
    var controller = this;
    this.server.get(route, function(req, res, next) {
        var fragment = (req.query && req.query['_escaped_fragment_']) || req.url;
        var args = controller._extractParameters(route, fragment);
        var context = Object.create(controller, { req: { value: req }, res: { value: res } });
        callback.apply(context, args);
        controller.trigger.apply(controller, ['route:' + name].concat(args));
    });
};
