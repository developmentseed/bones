view = Backbone.View.extend({
    events: {
        'click a.route': 'route'
    },
    href: function(el) {
        var href = $(el).get(0).getAttribute('href', 2);
        if ($.browser.msie && $.browser.version < 8) {
            return /^([a-z]+:\/\/.+?)?(\/.*?)$/.exec(href)[2];
        } else {
            return href;
        }
    },
    route: function(ev) {
        var fragment = _(ev).isString() ? ev : this.href(ev.currentTarget);
        if (fragment.charAt(0) === '/') {
            // Remove the basepath from the fragment, but leave a /.
            fragment = fragment.substr(req.query.basepath.length - 1);
            var matched = _.any(Backbone.history.handlers, function(handler) {
                if (handler.route.test(fragment)) {
                    handler.callback(fragment);
                    return true;
                }
            });
            if (matched) {
                Backbone.history.saveLocation(fragment);
                return false;
            }
        }
        return true;
    }
});
