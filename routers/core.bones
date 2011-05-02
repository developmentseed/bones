var fs = require('fs');
var path = require('path');

router = Bones.Router.extend({});

router.prototype.initialize = function(app) {
    this.initializeMiddleware(app);
    this.initializeStatic(app);
    this.initializeAssets(app);
    this.initializeModels(app);
    this.initializeCollections(app);
};

router.prototype.initializeMiddleware = function(app) {
    this.server.use(express.bodyParser());
    this.server.use(express.cookieParser());
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
        app.server.use('/assets/' + pkg.name, express['static'](path.join(dir, 'assets')));
    });
};

router.prototype.initializeAssets = function(app) {
    app.assets = {
        vendor: [
            'bones/assets/jquery',
            'underscore',
            'backbone'
        ],
        core: [
            'bones/shared/utils',
            'bones/client/utils',
            'bones/shared/backbone',
            'bones/client/backbone'
        ],
        models: [],
        views: [],
        controllers: [],
        templates: []
    };

    var assets = app.assets;
    var wrapper = {
        wrapper: Bones.utils.wrapClientFile
    };

    this.server.get('/assets/bones/vendor.js', mirror.assets(require, assets.vendor));
    this.server.get('/assets/bones/core.js', mirror.assets(require, assets.core));

    this.server.get('/assets/bones/controllers.js', mirror.assets(require, assets.controllers, wrapper));
    this.server.get('/assets/bones/models.js', mirror.assets(require, assets.models, wrapper));
    this.server.get('/assets/bones/views.js', mirror.assets(require, assets.views, wrapper));
    this.server.get('/assets/bones/templates.js', mirror.source(assets.templates, wrapper));
};

var headers = { 'Content-Type': 'application/json' };

router.prototype.loadCollection = function(req, res, next) {
    var name = Bones.utils.camelize(Bones.utils.pluralize(req.params.collection));
    if (name in this.models) {
        // Pass any querystring paramaters to the collection.
        req.collection = new this.models[name]([], req.query);
        req.collection.fetch({
            success: function(collection) {
                res.send(collection.models);
            },
            error: function(collection) {
                res.send({ error: "Couldn't load collection" }, headers, 500);
            }
        });
    } else {
        next();
    }
};

router.prototype.loadModel = function(req, res, next) {
    var name = Bones.utils.camelize(req.params.model);
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
            res.send(JSON.stringify(model), headers);
        },
        error: function(model, err) {
            next(JSON.stringify({ error: err }));
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
            res.send({ error: err }, headers, 409);
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
            next({ error: err });
        }
    });
};
