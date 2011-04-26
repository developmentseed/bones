var Backbone = require('./backbone');
var _ = require('underscore');

module.exports = Router;

function Router(options, args) {
    if (!options.server) {
        throw new Error("Can't initialize router without server.");
    }
    this.server = options.server;

    this.initialize(options, args);
};

_.extend(Router.prototype, Backbone.Events, {
    initialize : function() {},
    toString: function() {
        return '[Router ' + this.constructor.title + ']';
    }
});

Router.augment = Backbone.Controller.augment;
Router.extend = Backbone.Controller.extend;

Router.register = function(server, args) {
    return new this(server, args);
};

Router.toString = function() {
    return '<Router ' + this.title + '>';
}
