var Backbone = require('./backbone');
var _ = require('underscore');

module.exports = Backbone.Model;

Backbone.Model.toString = function() {
    return '<Model ' + this.title + '>';
};

Backbone.Model.register = function(server) {
    server.models[this.title] = this;
    


    // Bind model routes to server.
    // server.server.all('/api/' + this.title + '/:id', this.load.bind(this));
    // server.server.get('/api/' + this.title + '/:id', this.get);
    // server.server.post('/api/' + this.title + '/:id', this.post);
    // server.server.put('/api/' + this.title + '/:id', this.put);
    // server.server.del('/api/' + this.title + '/:id', this.del);
};

Backbone.Model.load = function(req, res, next) {
    req.model = new this({ id: req.params.id });
    next();
}

Backbone.Model.get = function(req, res, next) {
    req.model.fetch({
        success: function(model, resp) { res.send(JSON.stringify(model)) },
        error: function(model, err) { next(err); }
    });
};

Backbone.Model.post = function(req, res, next) {
    req.model.save(req.body, {
        success: function(model, resp) { res.send(resp) },
        error: function(model, err) { next(err); }
    });
};

Backbone.Model.put = Backbone.Model.post;

Backbone.Model.del = function(req, res, next) {
    req.model.destroy({
        success: function(model, resp) { res.send({}) },
        error: function(model, err) { next(err); }
    });
}

Backbone.Model.prototype.toString = function() {
    return '[Model ' + this.constructor.title + ']';
};

// Undefine client-side methods.
// delete Backbone.Model.prototype.fetch;
// delete Backbone.Model.prototype.save;
// delete Backbone.Model.prototype.destroy;
// delete Backbone.Model.prototype.sync;
Backbone.Model.prototype.sync = function(method, model, success, error) {
    // Note: `this` is a bogus. Do not use.
    throw new Error(model + " does not implement sync().");
};
