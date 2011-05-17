controller = Backbone.Controller.extend({
    routes: {
        '/': 'home',
        '/foo': 'foo'
    },

    home: function() {
        var view = new views['Home'];
        if (this.res) this.res.send(view.el);
    },

    foo: function() {
        var view = new views['Foo'];
        if (this.res) this.res.send(view.el);
    }
});
