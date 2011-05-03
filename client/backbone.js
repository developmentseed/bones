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
