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
    if (!(/\.server.plexus$/).test(this.__filename)) {
        server.viewFiles.push(this.__filename);
    }
};

// Backbone.View.prototype.delegateEvents = function() {};

Backbone.View.prototype.template = function(template, data) {
    throw new Error('not supported');
};

Backbone.View.prototype.make = function(tagName, attributes, content) {
    var el = $('<' + tagName + '>');
    if (attributes) $(el).attr(attributes);
    if (content) $(el).html(content);
    return el;
};
