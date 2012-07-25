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

Backbone.View.register = function(server) {
    // Add the views if it's not a server-only view.
    this.files.forEach(function(filename) {
        if (!(/\.server\.bones(\.js|)$/).test(filename) && server.assets &&
            server.assets.views.indexOf(filename) < 0) {
            server.assets.views.push(filename);
        }
    });

    server.views[this.title] = this;
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
