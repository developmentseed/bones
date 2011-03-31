var Backbone = require('backbone');
var tools = require('./tools');

// UNFINISHED

var Controller = exports;
Controller.create = function(name) {
    return Backbone.Controller.extend({
        name: name
    }, {
        toString: function() {
            return '<Controller ' + name + '>';
        }
    });
};
