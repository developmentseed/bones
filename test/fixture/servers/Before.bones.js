server = Bones.Server.extend({
    initialize: function() {
        this.get('/page/baz', this.pageSpecial);
        this.get('/hostname', function(req, res, next) {
            res.send(req.headers.host);
        });
    },

    pageSpecial: function(req, res, next) {
        res.send('bones router special page');
    }
});
