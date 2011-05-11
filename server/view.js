var Backbone = require('./backbone');
var $ = require('jquery');
var _ = require('underscore');

module.exports = Backbone.View;

Backbone.View.toString = function() {
    return '<View ' + this.title + '>';
};

Backbone.View.prototype.toString = function() {
    return '[View ' + this.constructor.title + ']';
};

Backbone.View.register = function(app) {
    // Add the views if it's not a server-only view.
    this.files.forEach(function(filename) {
        if (!(/\.server\.bones$/).test(filename) && app.assets &&
            app.assets.views.indexOf(filename) < 0) {
            app.assets.views.push(filename);
        }
    });

    app.views[this.title] = this;
};

Backbone.View.prototype.delegateEvents = function() {};

Backbone.View.prototype.template = function(template, data) {
    throw new Error('not supported');
};

Backbone.View.prototype.make = function(tagName, attributes, content) {
    var el = $('<' + tagName + '>');
    if (attributes) $(el).attr(attributes);
    if (content) $(el).html(content);
    return el;
};
