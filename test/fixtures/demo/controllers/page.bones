controller = Backbone.Controller.extend({
    routes: {
        '/page/:id': 'page',
        '/page/special': 'pageSpecial'
    },

    page: function(id, res) {
        res('page ' + id);
    },
    
    pageSpecial: function(res) {
        res('special page');
    }
});
