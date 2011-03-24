var Bones = Bones || {};
Bones.models = Bones.models || {};
Bones.views = Bones.views || {};
Bones.controllers = Bones.controllers || {};
Bones.templates = Bones.templates || {};

// Client-side `Backbone.View` overrides. Adds an `attach()` method that can be
// triggered after `render()` to allow client-side specific JS event handlers,
// UI libraries to be attached or inited. `template()` and `html()` are mirrors
// of their server-side counterparts for templating and easy generation of a
// View's HTML contents.
Backbone.View = Backbone.View.extend({
    attach: function() {},
    _configure_original: Backbone.View.prototype._configure,
    _configure: function(options) {
        this._configure_original(options);
        this.bind('attach', this.attach);
    },
    template: function(template, data) {
        var compiled = Handlebars.compile(Bones.templates[template]);
        return compiled(data);
    },
    html: function() {
        return $(this.el).html();
    }
});

// Client-side `Backbone.Controller` overrides.
Backbone.Controller = Backbone.Controller.extend({
    route: function(route, name, callback) {
        Backbone.history || (Backbone.history = new Backbone.History);
        if (!_.isRegExp(route)) route = this._routeToRegExp(route);
        Backbone.history.route(route, _.bind(function(fragment, res) {
            var args = this._extractParameters(route, fragment);
            var response = function() {};
            var view = callback.apply(this, args.concat([response]));
            this.trigger.apply(this, ['route:' + name].concat(args));
        }, this));
    }
});

// Generate CSRF protection cookie. Callers should provide the request path
// to ensure the cookie is not pervasive across all requests.
Backbone.csrf = function(path) {
    path = path || '/';

    var csrf = Math.floor(Math.random() * new Date()) + '';
    var expires = new Date();
    expires.setTime(expires.getTime() + 1000);
    var cookie = 'bones.csrf='
        + csrf
        + ';expires=' + expires.toUTCString()
        + ';path=' + path;
    document.cookie = cookie;
    return csrf;
}

// Client-side override of `Backbone.sync`. Adds CSRF double-cookie
// confirmation protection to all PUT/POST/DELETE requests. The csrf middleware
// must be used server-side to invalidate requests without this CSRF
// proteciton.
Backbone.sync = function(method, model, success, error) {
    var getUrl = function(object) {
        if (!(object && object.url)) throw new Error("A 'url' property or function must be specified");
        return _.isFunction(object.url) ? object.url() : object.url;
    };
    var methodMap = {
        'create': 'POST',
        'update': 'PUT',
        'delete': 'DELETE',
        'read'  : 'GET'
    };
    var type = methodMap[method];

    var modelJSON = null;
    if (method === 'create' || method === 'update' || method === 'delete') {
        modelJSON = (method === 'create' || method === 'update')
            ? model.toJSON()
            : {};
        modelJSON['bones.csrf'] = Backbone.csrf(getUrl(model));
        modelJSON = JSON.stringify(modelJSON);
    }

    // Default JSON-request options.
    var params = {
        url:          getUrl(model),
        type:         type,
        contentType:  'application/json',
        data:         modelJSON,
        dataType:     'json',
        processData:  false,
        success:      success,
        error:        error
    };

    // For older servers, emulate JSON by encoding the request into an HTML-form.
    if (Backbone.emulateJSON) {
        params.contentType = 'application/x-www-form-urlencoded';
        params.processData = true;
        params.data        = modelJSON ? {model : modelJSON} : {};
    }

    // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
    // And an `X-HTTP-Method-Override` header.
    if (Backbone.emulateHTTP) {
        if (type === 'PUT' || type === 'DELETE') {
            if (Backbone.emulateJSON) params.data._method = type;
            params.type = 'POST';
            params.beforeSend = function(xhr) {
                xhr.setRequestHeader("X-HTTP-Method-Override", type);
            };
        }
    }

    // Make the request.
    $.ajax(params);
};

