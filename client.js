// Client-side `Backbone.View` overrides. Adds an `attach()` method that can be
// triggered after `render()` to allow client-side specific JS event handlers,
// UI libraries to be attached or inited. `template()` and `html()` are mirrors
// of their server-side counterparts for templating and easy generation of a
// View's HTML contents.
Backbone.View = Backbone.View.extend({
    attach: function() {},
    template: function(template, data) {
        var compiled = Handlebars.compile(Bones.templates[template]);
        return compiled(data);
    },
    html: function() {
        return $(this.el).html();
    }
});

// Client-side `Backbone.Controller` overrides.
Backbone.Controller = Backbone.Controller.extend({
    route: function(route, name, callback) {
        Backbone.history || (Backbone.history = new Backbone.History);
        if (!_.isRegExp(route)) route = this._routeToRegExp(route);
        Backbone.history.route(route, _.bind(function(fragment, res) {
            var args = this._extractParameters(route, fragment);
            var response = function() {};
            var view = callback.apply(this, args.concat([response]));
            this.trigger.apply(this, ['route:' + name].concat(args));
        }, this));
    }
});

