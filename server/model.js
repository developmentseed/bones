var Backbone = require('./backbone');
var _ = require('underscore');

module.exports = Backbone.Model;

Backbone.Model.toString = function() {
    return '<Model ' + this.title + '>';
};

Backbone.Model.register = function(app) {
    // Add the controller if it's not a server-only controller.
    this.files.forEach(function(filename) {
        if (!(/\.server\.bones$/).test(filename) && app.assets) {
            app.assets.models.push(filename);
        }
    });

    app.models[this.title] = this;
};

Backbone.Model.prototype.toString = function() {
    return '[Model ' + this.constructor.title + ']';
};
