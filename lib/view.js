var Backbone = require('./backbone');
var $ = require('jquery');
var _ = require('underscore');

module.exports = Backbone.View;

Backbone.View.toString = function() {
    return '<View ' + this.title + '>';
};

Backbone.View.register = function(server) {
    // Bind model routes to server.
    server.all('/api/' + this.title + '/:id', this.load.bind(this));
    server.get('/api/' + this.title + '/:id', this.get);
    server.post('/api/' + this.title + '/:id', this.post);
    server.put('/api/' + this.title + '/:id', this.put);
    server.del('/api/' + this.title + '/:id', this.del);
};

Backbone.View.prototype.toString = function() {
    return '[View ' + this.constructor.title + ']';
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
