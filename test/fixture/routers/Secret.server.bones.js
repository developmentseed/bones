router = Backbone.Router.extend({
    routes: {
        '/serverside': 'pageSecret'
    },

    pageSecret: function() {
        this.res && this.res.send('page secret');
    }
});
