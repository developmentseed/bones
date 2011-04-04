var Backbone = require('./backbone');
var tools = require('./tools');

var Model = exports;

Model.create = function(name) {
    return Backbone.Model.extend({
        name: name
    }, {
        toString: function() {
            return '<Model ' + name + '>';
        }
    });
};

Model.validate = function(models) {
    return function(req, res, next) {
        if (models.length && models.indexOf(req.params.model) < 0) {
            // This server doesn't handle the specified model.
            res.send(404);
        } else if (!global.plexus.model[req.params.model]) {
            // There is no model with that name.
            res.send(404);
        } else {
            req.model = new 
            next();
        }
    };
};
