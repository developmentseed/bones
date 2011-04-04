var middleware = exports;

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

exports.csrf = function(conf) {
    return function(req, res, next) {
        if (req.method === 'GET') {
            next();
        } else if (req.body && req.cookies['plexus.token'] && req.body['plexus.token'] === req.cookies['plexus.token']) {
            delete req.body['plexus.token'];
            next();
        } else {
            res.send(403);
        }
    };
};
