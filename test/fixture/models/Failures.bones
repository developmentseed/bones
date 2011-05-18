model = Backbone.Collection.extend({
    model: models.Fail,
    sync: function(method, model, success, error) {
        error();
    }
});
