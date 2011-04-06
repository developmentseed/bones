var Backbone = require('./backbone');
var _ = require('underscore');

module.exports = Backbone.Model;

Backbone.Model.toString = function() {
    return '<Model ' + this.title + '>';
};

Backbone.Model.register = function(server) {
    server.models[this.title] = this;
};

Backbone.Model.prototype.toString = function() {
    return '[Model ' + this.constructor.title + ']';
};

// Undefine client-side methods.
// delete Backbone.Model.prototype.fetch;
// delete Backbone.Model.prototype.save;
// delete Backbone.Model.prototype.destroy;
// delete Backbone.Model.prototype.sync;
Backbone.Model.prototype.sync = function(method, model, success, error) {
    // Note: `this` is a bogus. Do not use.
    throw new Error(model + " does not implement sync().");
};
