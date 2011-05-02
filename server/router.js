var Backbone = require('./backbone');
var _ = require('underscore');

module.exports = Router;

function Router(app, args) {
    if (!app.server) {
        throw new Error("Can't initialize router without server.");
    }
    this.server = app.server;

    this.initialize(app, args);
};

_.extend(Router.prototype, Backbone.Events, {
    initialize : function() {},
    toString: function() {
        return '[Router ' + this.constructor.title + ']';
    }
});

Router.augment = Backbone.Controller.augment;
Router.extend = Backbone.Controller.extend;

Router.register = function(app, args) {
    return new this(app, args);
};

Router.toString = function() {
    return '<Router ' + this.title + '>';
}
