// var collection = require('./collection');
var model = require('./model');

exports.models = function(conf, models) {
    // Will only route models with name in models.
    models = models || [];

    // Express middleware for routing for Plexus models.
    return function() {
        // this.all('/api/:model', collection.validate(models));
        this.all('/api/:model/*', model.validate(models));
    };
};
