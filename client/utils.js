$(function() {
    // Fix for [IE8 AJAX payload caching][1].
    // [1]: http://stackoverflow.com/questions/1013637/unexpected-caching-of-ajax-results-in-ie8
    $.browser.msie && $.ajaxSetup({ cache: false });
});

(function() {
    // Closure for models/views/routers.
    var models = {}, views = {}, routers = {}, templates = {};

    Bones.server = false;

    Bones.initialize = function(kind, callback) {
        if (kind === 'model') {
            var model = callback(models);
            if (model) models[model.title] = model;
        } else if (kind === 'view') {
            var view = callback(models, views, templates);
            if (view) views[view.title] = view;
        } else if (kind === 'router') {
            var router = callback(models, views, routers);
            if (router) routers[router.title] = router;
        } else if (kind === 'template') {
            var template = callback(templates);
            if (template) templates[template.title] = template;
        } else if (_.isFunction(kind)) {
            kind(models, views, routers, templates);
        }
    };

    Bones.start = function(options) {
        for (var k in routers) {
            new routers[k];
        }

        Backbone.history.start(options);
    };

    Bones.DEBUG = {
        models: models,
        views: views,
        routers: routers,
        templates: templates
    };
})();
