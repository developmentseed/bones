router = Backbone.Router.extend({
    routes: {
        '/apache': 'pageApache'
    },

    pageApache: function() {
        this.res && this.res.send('page deprecated');
    }
});
