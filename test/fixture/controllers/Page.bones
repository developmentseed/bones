controller = Backbone.Controller.extend({
    routes: {
        '/': 'home',
        '/page/:id': 'page',
        '/page/special': 'pageSpecial'
    },

    page: function(id) {
        this.res && this.res.send('page ' + id);
    },

    pageSpecial: function() {
        this.res && this.res.send('special page');
    },

    home: function() {
        this.res && this.res.send('home');
    }
});
