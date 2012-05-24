// Starts routing on client
// ------------------------
var start = _.once(function() {
    // Passing {silent: true} to Backbone.start in Backbone > 0.5.3
    // will signal that the page has already been rendered, and avoid
    // reloading the page when initializing backbone.
    Bones.start({pushState: true, root: "", silent: true});
});

// Sets up key tracking on client
// ------------------------------
// TODO: should we use Bones.currentKeys?
var keyTracking = _.once(function() {
    $(function() {
        // Global tracking of pressed keys.
        $(document).keydown(function(ev) {
            window.currentKeys = window.currentKeys || {};
            window.currentKeys[ev.keyCode] = ev;
        });
        $(document).keyup(function(ev) {
            window.currentKeys = window.currentKeys || {};
            if (window.currentKeys[ev.keyCode]) {
                delete window.currentKeys[ev.keyCode];
            }
        });

    });
});

// Topmost view
// ------------
view = Backbone.View.extend({
    _ensureElement: function() {
        this.setElement('body');
    },
    initialize: function() {
        if (!Bones.server) {
            keyTracking();
        }
    }
});

// Registers event handler for all click events
// --------------------------------------------
view.prototype.events = {
    'click a': 'routeClick'
};

// Routes a click event
// --------------------
view.prototype.routeClick = function(ev) {
    if (window.currentKeys && _.size(window.currentKeys)) {
        return true;
    }
    // We only route client side if the browser supports push state.
    // The check here is borrowed from Backbone.
    if (window.history && window.history.pushState) {
        var href = $(ev.currentTarget).get(0).getAttribute('href', 2);
        if (href) return view.route($(ev.currentTarget).get(0).getAttribute('href', 2));
    }
    return true;
};

// Routes a path
// -------------
view.route = function(path) {
    start();
    if (path.charAt(0) === '/') {
        var matched = _.any(Backbone.history.handlers, function(handler) {
            if (handler.route.test(path)) {
                Backbone.history.navigate(path, true);
                return true;
            }
        });
        return !matched;
    }
    return true;
};
