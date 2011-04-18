controller = Backbone.Controller.extend({
    routes: {
        '/': 'home',
        '/foo': 'foo'
    },

    home: function(res) {
        res((new views['Home']).el);
    },

    foo: function(res) {
        res((new views['Foo']).el);
    }
});
