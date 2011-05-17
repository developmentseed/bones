server = Bones.Server.extend({
    initialize: function() {
        this.get('/page/baz', this.pageSpecial);
    },

    pageSpecial: function(req, res, next) {
        res.send('bones router special page');
    }
});
