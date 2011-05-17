var middleware = require('..').middleware;

server = Bones.Server.extend({});

server.prototype.initialize = function(app) {
    this.port = app.config.port || 3000;
    this.use(new servers['Middleware'](app));
    this.use(new servers['Route'](app));
    this.use(new servers['Asset'](app));
};
