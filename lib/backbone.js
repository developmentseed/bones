var Backbone = require('backbone');
var _ = require('underscore');

module.exports = Backbone;

Backbone.sync = function() {
    throw new Error('No default sync method');
}

Backbone.Model.augment = Backbone.Collection.augment =
Backbone.Controller.augment = Backbone.View.augment = function(props) {
    var obj = this.prototype;
    for (var key in props) {
        if (typeof props[key] === 'function') {
            obj[key] = _.wrap(obj[key], props[key]);
        } else if (_.isArray(props[key])) {
            obj[key] = _.isArray(obj[key]) ? obj[key].concat(props[key]) : props[key];
        } else if (typeof props[key] === 'object') {
            obj[key] = _.extend({}, obj[key], props[key]);
        } else {
            obj[key] = props[key];
        }
    }

    return this;
};

Backbone.Model.register = Backbone.Collection.register =
Backbone.Controller.register = Backbone.View.register = function(server) {
    return new this({ server: server });
};

var extend = Backbone.Controller.extend;
Backbone.Model.extend = Backbone.Collection.extend =
Backbone.Controller.extend = Backbone.View.extend = function() {
    var child = extend.apply(this, arguments);
    for (var key in this) {
         child[key] = this[key];
    }
    return child;
};
