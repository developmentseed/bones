Backbone.Controller.prototype.route = function(route, name, callback) {
    Backbone.history || (Backbone.history = new Backbone.History);
    if (!_.isRegExp(route)) route = this._routeToRegExp(route);
    Backbone.history.route(route, _.bind(function(fragment) {
        var args = this._extractParameters(route, fragment);
        callback.apply(this, args.concat([ function() {} ]));
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

Backbone.History.prototype.getFragment = function(loc) {
    var hashStrip = /#!/;
    return (loc || window.location).hash.replace(hashStrip, '');
};

Backbone.History.prototype._saveLocation = Backbone.History.prototype.saveLocation;
Backbone.History.prototype.saveLocation = function(fragment) {
    var hashStrip = /#!/;
    // Next two lines are duplicated withing the original saveLocation method.
    fragment = (fragment || '').replace(hashStrip, '');
    if (this.fragment == fragment) return;
    Backbone.History.prototype._saveLocation('!' + fragment);
};


// Generate CSRF protection cookie. Callers should provide the request path
// to ensure the cookie is not pervasive across all requests.
Backbone.csrf = function(path) {
    var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXZY0123456789';
    var token = '';
    while (token.length < 32) {
        token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    document.cookie = 'bones.token=' + token + ';max-age=60;';
    return token;
};

// Client-side override of `Backbone.sync`. Adds CSRF double-cookie
// confirmation protection to all PUT/POST/DELETE requests. The csrf middleware
// must be used server-side to invalidate requests without this CSRF
// proteciton.
Backbone.sync = _.wrap(Backbone.sync, function(parent, method, model, success, error) {
    function getUrl(object) {
        if (!(object && object.url)) throw new Error("A 'url' property or function must be specified");
        return _.isFunction(object.url) ? object.url() : object.url;
    };

    if (method !== 'read') {
        var clone = model.clone();
        clone.set({ 'bones.token': Backbone.csrf(getUrl(model)) });
    }

    return parent.call(this, method, clone || model, success, error);
});
