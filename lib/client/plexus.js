$(function() {
    // Fix for [IE8 AJAX payload caching][1].
    // [1]: http://stackoverflow.com/questions/1013637/unexpected-caching-of-ajax-results-in-ie8
    $.browser.msie && $.ajaxSetup({ cache: false });
});

Plexus.controllers || (Plexus.controllers = {});
Plexus.models || (Plexus.model = {});
Plexus.views || (Plexus.views = {});

Plexus.initialize = function(kind, name, callback) {
    if (kind === 'controller') {
        var component = callback(Plexus.models, Plexus.views, Plexus.controllers);
    } else if (kind === 'view') {
        var component = callback(Plexus.models, Plexus.views);
    } else if (kind === 'model') {
        var component = callback(plexus.models);
    }

    if (component) {
        if (!component.title) component.title = name;
        Plexus[kind + 's'][component.title] = component;
    }
};
