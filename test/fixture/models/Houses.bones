model = Backbone.Collection.extend({
    model: models.House,
    sync: function(method, model, success, error) {
        success([
            {'foo': 'bar'},
            {'foo': 'baz'},
            {'foo': 'blah'}
        ]);
    }
});
