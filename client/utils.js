$(function() {
    // Fix for [IE8 AJAX payload caching][1].
    // [1]: http://stackoverflow.com/questions/1013637/unexpected-caching-of-ajax-results-in-ie8
    $.browser.msie && $.ajaxSetup({ cache: false });
});

(function() {
    // Closure for models/views/controllers.
    var models = {}, views = {}, controllers = {}, templates = {};

    Bones.server = false;

    Bones.initialize = function(kind, callback) {
        if (kind === 'model') {
            var model = callback(models);
            if (model) models[model.title] = model;
        } else if (kind === 'view') {
            var view = callback(models, views, templates);
            if (view) views[view.title] = view;
        } else if (kind === 'controller') {
            var controller = callback(models, views, controllers);
            if (controller) controllers[controller.title] = controller;
        } else if (kind === 'template') {
            var template = callback(templates);
            if (template) templates[template.title] = template;
        } else if (_.isFunction(kind)) {
            kind(models, views, controllers, templates);
        }
    };

    Bones.start = function() {
        for (var k in controllers) {
            new controllers[k];
        }

        Backbone.history.start();
    };

    Bones.DEBUG = {
        models: models,
        views: views,
        controllers: controllers,
        templates: templates
    };
})();
