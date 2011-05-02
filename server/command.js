var Backbone = require('./backbone');
var _ = require('underscore');

module.exports = Command;

function Command(app) {
    this.options = Object.create(Command.options);
    this.initialize(app);
};

Command.prototype.initialize = function(app) {};

Command.augment = Backbone.Controller.augment;
Command.extend = Backbone.Controller.extend;

Command.toString = function() {
    return '<Command ' + this.title + '>';
};

Command.options = {};
