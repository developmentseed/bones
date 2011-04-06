var Backbone = module.exports = require('../shared/backbone');

Backbone.sync = function() {
    throw new Error('No default sync method');
};

Backbone.Model.register = Backbone.Collection.register =
Backbone.Controller.register = Backbone.View.register = function(server) {
    return new this(server);
};
