var headers = { 'Content-Type': 'application/json' };
var env = process.env.NODE_ENV || 'development';

server = Bones.Server.extend({});

server.prototype.assets = {
    vendor: [
        require.resolve('bones/assets/jquery'),
        require.resolve('underscore'),
        require.resolve('backbone')
    ],
    core: [
        require.resolve('bones/shared/utils'),
        require.resolve('bones/client/utils'),
        require.resolve('bones/shared/backbone'),
        require.resolve('bones/client/backbone')
    ],
    models: [],
    views: [],
    controllers: [],
    templates: []
};

// Stores models, views served by this server.
server.prototype.models = {};
server.prototype.views = {};

// Stores instances of controllers registered with this server.
server.prototype.controllers = {};

server.prototype.initialize = function(app) {
    this.registerComponents(app);
    this.initializeAssets(app);
    this.initializeModels(app);
};

server.prototype.registerComponents = function(app) {
    var components = ['controllers', 'models', 'views', 'templates'];
    components.forEach(function(kind) {
        for (var name in app[kind]) {
            app[kind][name].register(this);
        }
    }, this);
};

server.prototype.initializeAssets = function(app) {
    var maxAge = env == 'production' ? 3600 : 0;

    this.get('/assets/bones/vendor.js', mirror.assets(this.assets.vendor, { type: '.js', maxAge: maxAge }));
    this.get('/assets/bones/core.js', mirror.assets(this.assets.core, { type: '.js', maxAge: maxAge }));

    var options = {
        type: '.js',
        wrapper: Bones.utils.wrapClientFile,
        sort: Bones.utils.sortByLoadOrder,
        maxAge: maxAge
    };
    this.get('/assets/bones/controllers.js', mirror.assets(this.assets.controllers, options));
    this.get('/assets/bones/models.js', mirror.assets(this.assets.models, options));
    this.get('/assets/bones/views.js', mirror.assets(this.assets.views, options));
    this.get('/assets/bones/templates.js', mirror.source(this.assets.templates, options));
};

server.prototype.initializeModels = function(app) {
    this.models = app.models;
    _.bindAll(this, 'loadModel', 'getModel', 'saveModel', 'delModel', 'loadCollection');
    this.get('/api/:model/:id', this.loadModel, this.getModel);
    this.post('/api/:model', this.loadModel, this.saveModel);
    this.put('/api/:model/:id', this.loadModel, this.saveModel);
    this.del('/api/:model/:id', this.loadModel, this.delModel);
    this.get('/api/:collection', this.loadCollection.bind(this));
};

server.prototype.loadCollection = function(req, res, next) {
    var name = Bones.utils.pluralize(req.params.collection);
    if (name in this.models) {
        // Pass any querystring paramaters to the collection.
        req.collection = new this.models[name]([], req.query);
        req.collection.fetch({
            success: function(collection, resp) {
                res.send(resp, headers);
            },
            error: function(collection, err) {
                next(new Error.HTTP(err, 500));
            }
        });
    } else {
        next();
    }
};

server.prototype.loadModel = function(req, res, next) {
    var name = req.params.model;
    if (name in this.models) {
        // Pass any querystring paramaters to the model.
        req.model = new this.models[name]({ id: req.params.id }, req.query);
    }
    next();
};

server.prototype.getModel = function(req, res, next) {
    if (!req.model) return next();
    req.model.fetch({
        success: function(model, resp) {
            res.send(resp, headers);
        },
        error: function(model, err) {
            next(new Error.HTTP(err, 404));
        }
    });
};

server.prototype.saveModel = function(req, res, next) {
    if (!req.model) return next();
    req.model.save(req.body, {
        success: function(model, resp) {
            res.send(resp, headers);
        },
        error: function(model, err) {
            err = err instanceof Object ? err.toString() : err;
            next(new Error.HTTP(err, 409));
        }
    });
};

server.prototype.delModel = function(req, res, next) {
    if (!req.model) return next();
    req.model.destroy({
        success: function(model, resp) {
            res.send({}, headers);
        },
        error: function(model, err) {
            err = err instanceof Object ? err.toString() : err;
            next(new Error.HTTP(err, 409));
        }
    });
};
