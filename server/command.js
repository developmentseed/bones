var Backbone = require('./backbone');
var _ = require('underscore');

module.exports = Command;

function Command(options) {
    this.options = Object.create(Command.options);
    this.initialize(options);
};

Command.prototype.initialize = function() {};

Command.augment = Backbone.Controller.augment;
Command.extend = Backbone.Controller.extend;

Command.toString = function() {
    return '<Command ' + this.title + '>';
};

Command.options = {};
