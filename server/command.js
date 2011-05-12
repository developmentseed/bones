var Backbone = require('./backbone');
var _ = require('underscore');

module.exports = Command;

function Command(plugin, callback) {
    this.options = Object.create(Command.options);

    this.bootstrap(plugin, function() {
        this.initialize(plugin, callback);
    }.bind(this));
};

Command.prototype.bootstrap = function(plugin, callback) {
    callback();
};

Command.prototype.initialize = function(plugin, callback) {};

Command.augment = Backbone.Controller.augment;
Command.extend = Backbone.Controller.extend;

Command.toString = function() {
    return '<Command ' + this.title + '>';
};

Command.options = {};
