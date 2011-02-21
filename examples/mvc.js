// Requires for the server-side context. *TODO* Note that `var` is omitted here
// because even within the `if()` IE will wipe globally defined variables if
// `var` is included, leaving us with broken objects.
if (typeof require !== 'undefined') {
    _ = require('underscore')._,
    Backbone = require('backbone'),
    Bones = require('bones');
}

// Router. All route callbacks receive an additional `response` argument which
// should be passed the View to be displayed. `response()` does nothing
// client-side (it is the responsibility of the View to insert itself into the
// DOM) while the server will return the HTML contents of the view passed.
var Router = Backbone.Controller.extend({
    routes: {
        '/': 'home'
    },
    home: function(response) {
        response(new PageView({ content: 'Hello world' }));
    }
});

// App "viewport" view. Unlike client-side only Backbone, there should be at
// one view which represents the entire HTML page for the server to send back.
// Only this view should need to do a check against `Bones.server` to determine
// whether it is in the client-side or server-side content. This check should
// be used as seldom as possible.
var PageView = Backbone.View.extend({
    initialize: function(options) {
        _.bindAll(this, 'render');
        this.render().trigger('attach');
    },
    render: function() {
        // Server side.
        if (Bones.server) {
            this.el = this.template('index', this.options);
        // Client side.
        } else {
            $('#app').html(this.options.content);
        }
        return this;
    }
});

(typeof module !== 'undefined') && (module.exports = {
    Router: Router
});

