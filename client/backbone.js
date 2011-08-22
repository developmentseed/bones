Backbone.Controller.prototype.route = function(route, name, callback) {
    Backbone.history || (Backbone.history = new Backbone.History);
    if (!_.isRegExp(route)) route = this._routeToRegExp(route);
    Backbone.history.route(route, _.bind(function(fragment) {
        var args = this._extractParameters(route, fragment);
        callback.apply(this, args);
        this.trigger.apply(this, ['route:' + name].concat(args));
    }, this));
};

// Client-side `Backbone.View` overrides. Adds an `attach()` method that can be
// triggered after `render()` to allow client-side specific JS event handlers,
// UI libraries to be attached or inited. `template()` and `html()` are mirrors
// of their server-side counterparts for templating and easy generation of a
// View's HTML contents.
Backbone.View.augment({
    attach: function() {},
    _configure: function(parent, options) {
        parent.call(this, options);
        this.bind('attach', this.attach);
    }
});

// Fix for Backbone.History.start with 0.3.3 and IE7.
// See https://github.com/documentcloud/backbone/issues/228
Backbone.History.prototype.start = function() {
    var docMode = document.documentMode;
    var oldIE = ($.browser.msie && (!docMode || docMode <= 7));
    if (oldIE) {
        this.iframe = $('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo('body')[0].contentWindow;
        this.iframe.document.open().close();
        this.iframe.location.hash = window.location.hash;
    }
    if ('onhashchange' in window && !oldIE) {
        $(window).bind('hashchange', this.checkUrl);
    } else {
        setInterval(this.checkUrl, this.interval);
    }
    return this.loadUrl();
};

Backbone.History.prototype._saveLocation = Backbone.History.prototype.saveLocation;
Backbone.History.prototype.saveLocation = function(fragment) {
    // Override: Ensure ! so browser behaves correctly when using back button.
    Backbone.History.prototype._saveLocation.call(this, '!' + fragment.replace(/^!*/, ''));
};

Backbone.History.prototype.checkUrl = function() {
    var current = this.getFragment();
    if (current == this.fragment && this.iframe) {
        current = this.getFragment(this.iframe.location);
    }
    if (current == this.fragment ||
        current == decodeURIComponent(this.fragment)) return false;
    if (this.iframe) {
      // Override: Keep IE happy.
      this.iframe.location.hash = current;
      window.location.hash = '!' + current;
    }
    this.loadUrl();
};

Backbone.History.prototype.loadUrl = function() {
  this.fragment = this.getFragment();
  // Override: Remove ! to look up route.
  var fragment = this.fragment.replace(/^!*/, '');
  var matched = _.any(this.handlers, function(handler) {
    if (handler.route.test(fragment)) {
      handler.callback(fragment);
      return true;
    }
  });
  return matched;
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
Backbone.sync = function(method, model, success, error) {
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
        success:      success,
        error:        error
    };

    // Make the request.
    $.ajax(params);
};
