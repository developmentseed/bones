// Backbone base class overrides for the server-side context. DOM-related
// modules are required *globally* such that Backbone will pick up their
// presence.
$ = require('jquery-1.4.4');
jQuery = require('jquery-1.4.4');
jsdom  = require('jsdom').jsdom;
window = jsdom().createWindow();
document = window.document;

var fs = require('fs'),
    path = require('path'),
    _ = require('underscore')._,
    crypto = require('crypto'),
    Backbone = require('backbone'),
    Handlebars = require('handlebars');

// View (server-side)
// ------------------
// With a server-side DOM present Backbone Views tend to take care of
// themselves. The main override is to clear out `delegateEvents()` - the
// `events` hash is of no use on the server-side with the View being dead
// after initial delivery. `template()` and `html()` serve as 
// functions to make client/server-side templating a uniform interface.
//
// The following conventions must be followed in order to ensure that the views
// can be used in both environments:
//
// - Use `render()` only for templating. Any DOM event handlers, other
//   js library initialization (e.g. OpenLayers) should be done in the
//   `attach()` method.
// - `render()` must `return this` in order to be chainable and any calls to
//   `render()` should chain `trigger('attach')`.
// - `template()` should be used to render an object using `template` to
//   identify the template to use in the `Bones.templates` hash. Avoid using
//   jquery or other doing other DOM element creation if templating could get
//   the job done.
Backbone.View = Backbone.View.extend({
    delegateEvents: function() {},
    template: function(template, data) {
        var compiled = Handlebars.compile(Bones.templates[template]);
        return compiled(data);
    },
    html: function() {
        if (typeof this.el === 'string') {
            return this.el;
        } else {
            // Consider using the method described here:
            // http://stackoverflow.com/questions/652763/jquery-object-to-string
            return $(this.el).html();
        }
    }
});

// Controller/History (server-side)
// --------------------------------
// Expose Backbone's controller/history routing functionality to Connect
// as a middleware. A Connect server can add Backbone controller routing to
// its stack of middlewares by doing:
//
//     server.use(Backbone.history.middleware());
//     new MyController(); /* Routes will be added at initialize. */
Backbone.Controller = Backbone.Controller.extend({
    // Override `.route()` to add a callback handler with an additional
    // `response` argument callback for sending back a View as HTML using
    // the Connect server.
    route: function(route, name, callback) {
        Backbone.history || (Backbone.history = new Backbone.History);
        if (!_.isRegExp(route)) route = this._routeToRegExp(route);
        Backbone.history.route(route, _.bind(function(fragment, res) {
            var response = function(view) {
                res.send(view.html());
            };

            var args = this._extractParameters(route, fragment);
            var view = callback.apply(this, args.concat([response]));
            this.trigger.apply(this, ['route:' + name].concat(args));
        }, this));
    }
});

// Override `.loadUrl()` to allow `res` response object to be passed through
// to handler callback.
Backbone.History.prototype.loadUrl = function(fragment, res) {
    var matched = _.any(this.handlers, function(handler) {
        if (handler.route.test(fragment)) {
            handler.callback(fragment, res);
            return true;
        }
    });
    return matched;
};

// Provide a custom Backbone.History middleware for use with Connect.
Backbone.History.prototype.middleware = function(req, res, next) {
    var fragment;
    if (req.query && req.query['_escaped_fragment_']) {
        fragment = req.query['_escaped_fragment_'];
    } else {
        fragment = req.url;
    }
    !Backbone.history.loadUrl(fragment, res) && next();
};

// Clear out unused/unusable methods.
Backbone.History.prototype.start = function() {};
Backbone.History.prototype.getFragment = function() {};
Backbone.History.prototype.saveLocation = function() {};

// Instantiate Backbone.history.
Backbone.history || (Backbone.history = new Backbone.History);

// Bones object.
var Bones = module.exports = {
    Bones: function(server, options) {
        // Add CSRF protection middleware if `options.secret` is set.
        options.secret && server.use(this.middleware.csrf(options));

        // Add Backbone routing.
        server.use(this.middleware.history);

        // Add route rule for bones.js, bones-templates.js.
        server.get('/bones.js', this.middleware.clientjs);
        server.get('/bones-templates.js', this.middleware.templates);

        // Add server reference to Bones.
        this.server = server;
        return this;
    },
    middleware: {
        history: Backbone.history.middleware,
        clientjs: function(req, res, next) {
            res.sendfile(path.join(__dirname, 'bones.js'));
        },
        templates: function(req, res, next) {
            var js = '// Bones templates (client-side)\n'
                + 'var Bones = Bones || {};\n'
                + 'Bones.templates = '
                + JSON.stringify(Bones.templates)
                + ';\n';
            res.send(js, { 'Content-Type': 'text/javascript' });
        },
        csrf: function(options) {
            return function(req, res, next) {
                var cookie;
                if (req.cookies['bones.csrf']) {
                    cookie = req.cookies['bones.csrf'];
                } else {
                    cookie = crypto.createHmac('sha256', options.secret)
                        .update(req.sessionID)
                        .digest('hex');
                    res.cookie('bones.csrf', cookie);
                }
                if (req.method === 'GET') {
                    next();
                } else if (req.body && req.body['bones.csrf'] === cookie) {
                    delete req.body['bones.csrf'];
                    next();
                } else {
                    res.send('Access denied', 403);
                }
            }
        }
    },
    server: null,
    templates: {},
    models: {},
    views: {},
    controllers: {}
};

