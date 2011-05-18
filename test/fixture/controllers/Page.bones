controller = Backbone.Controller.extend({
    routes: {
        '/page/:id': 'page',
        '/page/special': 'pageSpecial'
    },

    page: function(id) {
        this.res && this.res.send('page ' + id);
    },
    
    pageSpecial: function() {
        this.res && this.res.send('special page');
    }
});
