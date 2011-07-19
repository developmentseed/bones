model = Backbone.Collection.extend({
    model: models.Fail,
    sync: function(method, model, options) {
        options.error();
    }
});
