var env = process.env.NODE_ENV || 'development';
var middleware = require('..').middleware;

server = Bones.Server.extend({});

server.prototype.port = 3000;

server.prototype.initialize = function(app) {
    this.port = app.config.port || this.port;

    // Middleware provides body decoding, CSRF validation et al.
    // Place other servers before this one ONLY when you intend to circumvent
    // these safeguards.
    this.use(new servers['Middleware'](app));

    // Debugging server provides facilities for easier client side debugging.
    if (env === 'development') {
        this.use(new servers['Debug'](app));
    }

    // The Route server provides default routes for /api/Model as well as
    // the /assets/bones routes.
    this.use(new servers['Route'](app));

    // The Asset server provides each plugin's asset folder at /asset/pluginname.
    this.use(new servers['Asset'](app));
};
