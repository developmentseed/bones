var fs = require('fs');
var path = require('path');

router = Bones.Router.extend({});

router.prototype.initialize = function(app) {
    this.initializeStatic(app);
    this.initializeAssets(app);
    this.initializeModels(app);
    this.initializeCollections(app);
};

router.prototype.initializeModels = function(app) {
    this.models = app.models;

    // Bind model routes to server.
    _.bindAll(this, 'loadModel', 'getModel', 'saveModel', 'delModel');
    this.server.get('/api/:model/:id', this.loadModel, this.getModel);
    this.server.post('/api/:model', this.loadModel, this.saveModel);
    this.server.put('/api/:model/:id', this.loadModel, this.saveModel);
    this.server.del('/api/:model/:id', this.loadModel, this.delModel);
};

router.prototype.initializeCollections = function(app) {
    this.models = app.models;

    this.server.get('/api/:collection', this.loadCollection.bind(this));
};

router.prototype.initializeStatic = function(app) {
    app.plugin.directories.forEach(function(dir) {
        var pkg = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8'));
        app.server.use('/assets/' + pkg.name, middleware['static'](path.join(dir, 'assets')));
    });
};

router.prototype.initializeAssets = function(app) {
    var assets = app.assets = {
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


    this.server.get('/assets/bones/vendor.js', mirror.assets(assets.vendor), { type: '.js' });
    this.server.get('/assets/bones/core.js', mirror.assets(assets.core), { type: '.js' });

    var options = {
        type: '.js',
        wrapper: Bones.utils.wrapClientFile,
        sort: Bones.utils.sortByLoadOrder
    };
    this.server.get('/assets/bones/controllers.js', mirror.assets(assets.controllers, options));
    this.server.get('/assets/bones/models.js', mirror.assets(assets.models, options));
    this.server.get('/assets/bones/views.js', mirror.assets(assets.views, options));
    this.server.get('/assets/bones/templates.js', mirror.source(assets.templates, options));
};

var headers = { 'Content-Type': 'application/json' };

router.prototype.loadCollection = function(req, res, next) {
    var name = Bones.utils.pluralize(req.params.collection);
    if (name in this.models) {
        // Pass any querystring paramaters to the collection.
        req.collection = new this.models[name]([], req.query);
        req.collection.fetch({
            success: function(collection, resp) {
                res.send(resp, headers);
            },
            error: function(collection, err) {
                next(new Error.HTTP(err, 404));
            }
        });
    } else {
        next();
    }
};

router.prototype.loadModel = function(req, res, next) {
    var name = req.params.model;
    if (name in this.models) {
        // Pass any querystring paramaters to the model.
        req.model = new this.models[name]({ id: req.params.id }, req.query);
    }
    next();
};

router.prototype.getModel = function(req, res, next) {
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

router.prototype.saveModel = function(req, res, next) {
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

router.prototype.delModel = function(req, res, next) {
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
