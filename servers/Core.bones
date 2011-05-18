var middleware = require('..').middleware;

server = Bones.Server.extend({});

server.prototype.port = 3000;

server.prototype.initialize = function(app) {
    this.port = app.config.port || this.port;
    this.use(new servers['Middleware'](app));
    this.use(new servers['Route'](app));
    this.use(new servers['Asset'](app));
};
