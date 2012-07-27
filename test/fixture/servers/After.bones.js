server = Bones.Server.extend({
    initialize: function() {
        this.get('/page/special', this.pageSpecial);
    },

    pageSpecial: function(req, res, next) {
        res.send('this should never be returned');
    }
});
