Backbone.Router.prototype.route = function(route, name, callback) {
    Backbone.history || (Backbone.history = new Backbone.History);
    if (!_.isRegExp(route)) route = this._routeToRegExp(route);
    Backbone.history.route(route, _.bind(function(fragment) {
        var args = this._extractParameters(route, fragment);
        callback.apply(this, args);
        this.trigger.apply(this, ['route:' + name].concat(args));
    }, this));
};

// Generate CSRF protection token that is valid for the specified amount of
// msec. The default is 1 second. Callers should provide the request path to
// ensure the cookie is not pervasive across requests.
Backbone.csrf = function(path, timeout) {
    var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXZY0123456789';
    var token = '';
    while (token.length < 32) {
        token += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // Remove hashes, query strings from cookie path.
    path = path || '/';
    path = path.split('#')[0].split('?')[0];

    var expires = new Date(+new Date + (timeout || 2000)).toGMTString();
    document.cookie = 'bones.token=' + token
        + ';expires=' + expires
        + ';path=' + path + ';';
    return token;
};

// Client-side override of `Backbone.sync`. Adds CSRF double-cookie
// confirmation protection to all PUT/POST/DELETE requests. The csrf middleware
// must be used server-side to invalidate requests without this CSRF
// protection. The original `Backbone.sync` cannot be reused because it does
// not send a request body for DELETE requests.
Backbone.sync = function(method, model, options) {
    function getUrl(object) {
        if (!(object && object.url)) throw new Error("A 'url' property or function must be specified");
        return _.isFunction(object.url) ? object.url() : object.url;
    };

    var type = {
        'create': 'POST',
        'update': 'PUT',
        'delete': 'DELETE',
        'read'  : 'GET'
    }[method];

    if (method !== 'read') {
        var modelJSON = model.toJSON ? model.toJSON() : model;
        modelJSON['bones.token'] = Backbone.csrf(getUrl(model));
        modelJSON = JSON.stringify(modelJSON);
    }

    // Default JSON-request options.
    var params = {
        url:          getUrl(model),
        type:         type,
        contentType:  'application/json',
        data:         (modelJSON || null),
        dataType:     'json',
        processData:  false,
        success:      options.success,
        error:        options.error
    };

    // Make the request.
    return $.ajax(params);
};
