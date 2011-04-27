var mirror = require('mirror');

router = Bones.Router.extend({});

router.prototype.initialize = function(options) {
    this.initializeMiddleware(options);
    this.initializeModels(options);
    this.initializeCollections(options);
    this.initializeStatic(options);
    this.initializeAssets(options);
};

router.prototype.initializeMiddleware = function(options) {
    this.server.use(express.bodyParser());
    this.server.use(express.cookieParser());
};

router.prototype.initializeModels = function(options) {
    this.models = options.models;

    // Bind model routes to server.
    this.server.all('/api/:model/:id', this.loadModel.bind(this));
    this.server.get('/api/:model/:id', this.getModel.bind(this));
    this.server.post('/api/:model/:id', this.postModel.bind(this));
    this.server.put('/api/:model/:id', this.putModel.bind(this));
    this.server.del('/api/:model/:id', this.delModel.bind(this));
};

router.prototype.initializeCollections = function(options) {
    this.models = options.models;

    this.server.get('/api/:collection', this.loadCollection.bind(this));
};

router.prototype.initializeStatic = function(options) {
    this.server.use(express['static'](options.plugin.directory + '/client'));
};

router.prototype.initializeAssets = function(options) {
    options.assets = {
        vendor: [
            'bones/core/assets/jquery',
            'underscore',
            'backbone'
        ],
        core: [
            'bones/shared/core',
            'bones/client/core',
            'bones/shared/backbone',
            'bones/client/backbone'
        ],
        models: [],
        views: [],
        controllers: [],
        templates: []
    };

    var assets = options.assets;
    var wrapper = {
        wrapper: Bones.wrapClientFile
    };

    this.server.get('/bones.vendor.js', mirror.assets(require, assets.vendor));
    this.server.get('/bones.core.js', mirror.assets(require, assets.core));

    this.server.get('/bones.controllers.js', mirror.assets(require, assets.controllers, wrapper));
    this.server.get('/bones.models.js', mirror.assets(require, assets.models, wrapper));
    this.server.get('/bones.views.js', mirror.assets(require, assets.views, wrapper));
    this.server.get('/bones.templates.js', mirror.source(assets.templates, wrapper));
};

var headers = { 'Content-Type': 'application/json' };

router.prototype.loadCollection = function(req, res, next) {
    var name = Bones.camelize(Bones.pluralize(req.params.collection));
    if (name in this.models) {
        // Pass any querystring paramaters to the collection.
        req.collection = new this.models[name]([], req.query);
        req.collection.fetch({
            success: function(collection, resp){
                res.send(collection.models);
            },
            error: function(collection, resp) {
                res.send({ error: "Couldn't load collection" }, headers, 500);
            }
        });
    } else {
        next();
    }
};

router.prototype.loadModel = function(req, res, next) {
    var name = Bones.camelize(req.params.model);
    if (name in this.models) {
        req.model = new this.models[name]({ id: req.params.id });
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
            next({ error: err });
        }
    });
};

router.prototype.postModel = function(req, res, next) {
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

router.prototype.putModel = router.prototype.postModel;

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
