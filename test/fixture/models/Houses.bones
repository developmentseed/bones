model = Backbone.Collection.extend({
    model: models.House,
    sync: function(method, model, options) {
        options.success([
            {'foo': 'bar'},
            {'foo': 'baz'},
            {'foo': 'blah'}
        ]);
    }
});
