$(function() {
    // Fix for [IE8 AJAX payload caching][1].
    // [1]: http://stackoverflow.com/questions/1013637/unexpected-caching-of-ajax-results-in-ie8
    $.browser.msie && $.ajaxSetup({ cache: false });
});

(function() {
    // Closure for models/views/controllers.
    var models = {}, views = {}, controllers = {};

    Plexus.initialize = function(kind, callback) {
        if (kind === 'model') {
            var model = callback(models);
            models[model.title] = model;
        } else if (kind === 'view') {
            var view = callback(models, views);
            views[view.title] = view;
        } else if (kind === 'controller') {
            var controller = callback(models, views, controllers);
            controllers[controller.title] = controller;
        }
    };

    Plexus.start = function(name) {
        new controllers[name];
        Backbone.history.start();
    }
})();
