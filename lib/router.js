var _ = require('underscore');
var Backbone = require('./backbone');

var Router = module.exports = function Router(options) {
    options || (options = {});

    if (!options.server) {
        throw new Error("Can't initialize controller without server.");
    }
    this.server = options.server;

    this.initialize(options);
};

_.extend(Router.prototype, Backbone.Events, {
    initialize : function() {},
});

Router.extend = Backbone.Controller.extend;
