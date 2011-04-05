var Backbone = require('./backbone');
var _ = require('underscore');

module.exports = Router;

function Router(options) {
    if (!options.server) {
        throw new Error("Can't initialize router without server.");
    }
    this.server = options.server;

    this.initialize(options);
};

_.extend(Router.prototype, Backbone.Events, {
    initialize : function() {},
    toString: function() {
        return '[Router ' + this.constructor.title + ']';
    }
});

Router.augment = Backbone.Controller.augment;
Router.extend = Backbone.Controller.extend;
Router.register = Backbone.Controller.register;
Router.toString = function() {
    return '<Router ' + this.title + '>';
}
