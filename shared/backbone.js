if (typeof process !== 'undefined' && process.versions && process.versions.node) {
    module.exports = Backbone = require('backbone');
    _ = require('underscore');
    $ = require('jquery');
}

Backbone.Model.augment = Backbone.Collection.augment =
Backbone.Router.augment = Backbone.View.augment = function(props) {
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

var extend = Backbone.Router.extend;
Backbone.Model.extend = Backbone.Collection.extend =
Backbone.Router.extend = Backbone.View.extend = function() {
    var child = extend.apply(this, arguments);
    delete child.title;
    return child;
};

Backbone.View.prototype.html = function() {
    return $(this.el).html();
};
