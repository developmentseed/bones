var env = process.env.NODE_ENV || 'development';

server = Bones.Server.extend({
    initialize: function(app) {
        _.bindAll(this, 'logError');
        if (env === 'development') {
            this.get('/api/Error', this.logError);
        }
    },

    logError: function(req, res, next) {
        console.error("Client Error: %s\n    at %s:%d",
            req.query.message, req.query.url, req.query.line);
        res.send();
    }
});
