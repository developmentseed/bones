var Backbone = require('./backbone');
var _ = require('underscore');

module.exports = Backbone.Model;

Backbone.Model.toString = function() {
    return '<Model ' + this.title + '>';
};

Backbone.Model.register = function(server) {
    // Add the model if it's not a server-only model.
    this.files.forEach(function(filename) {
        if (!(/\.server\.bones(\.js|)$/).test(filename) && server.assets &&
            server.assets.models.indexOf(filename) < 0) {
            server.assets.models.push(filename);
        }
    });

    server.models[this.title] = this;
};

Backbone.Model.prototype.toString = function() {
    return '[Model ' + this.constructor.title + ']';
};
