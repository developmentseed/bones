router = Bones.Router.extend({
    initialize: function() {
        this.server.get('/page/baz', this.pageSpecial);
    },

    pageSpecial: function(req, res, next) {
        res.send('bones router special page');
    }
});
