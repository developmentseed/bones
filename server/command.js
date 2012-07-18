var Backbone = require('./backbone');
var _ = require('underscore');

module.exports = Command;

function Command(plugin, callback) {
    this.bootstrap(plugin, function() {
        this.initialize(plugin, callback);
    }.bind(this));
};

Command.prototype.bootstrap = function(plugin, callback) {
    callback();
};

Command.prototype.initialize = function(plugin, callback) {};

Command.prototype.toString = function() {
    return '[Command ' + this.constructor.title + ']';
};

Command.augment = Backbone.Router.augment;
Command.extend = Backbone.Router.extend;

Command.extend = _.wrap(Command.extend, function(parent, props, staticProps) {
    var result = parent.call(this, props, staticProps);
    result.options = Object.create(this.options);
    return result;
});

Command.toString = function() {
    return '<Command ' + this.title + '>';
};

Command.options = {
    'host': {
        'description': 'Hostnames allowed for requests. Wildcards are allowed.',
        'default': false
    }
};
