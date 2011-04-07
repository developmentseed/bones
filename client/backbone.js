Backbone.Controller.prototype.route = function(route, name, callback) {
    Backbone.history || (Backbone.history = new Backbone.History);
    if (!_.isRegExp(route)) route = this._routeToRegExp(route);
    Backbone.history.route(route, _.bind(function(fragment) {
        var args = this._extractParameters(route, fragment);
        callback.apply(this, args.concat([ function() {} ]));
        this.trigger.apply(this, ['route:' + name].concat(args));
    }, this));
};
