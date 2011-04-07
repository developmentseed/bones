var Backbone = require('./backbone');
var _ = require('underscore');

module.exports = Backbone.Model;

Backbone.Model.toString = function() {
    return '<Model ' + this.title + '>';
};

Backbone.Model.register = function(server) {
    // Add the controller if it's not a server-only controller.
    this.files.forEach(function(filename) {
        if (!(/\.server.plexus$/).test(filename)) {
            server.assets.models.push(filename);
        }
    });

    server.models[this.title] = this;
};

Backbone.Model.prototype.toString = function() {
    return '[Model ' + this.constructor.title + ']';
};

Backbone.Model.prototype.sync = function(method, model, success, error) {
    // Note: `this` is not set. Do not use. Use `model` instead.
    throw new Error(model + " does not implement sync().");
};
