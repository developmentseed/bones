var fs = require('fs'),
    path = require('path'),
    middleware = require('express'),
    env = process.env.NODE_ENV || 'development';

server = Bones.Server.extend({});

server.prototype.initialize = function(app) {
    app.directories.forEach(function(dir) {
        var pkg = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8'));
        this.use('/assets/' + pkg.name, middleware['static'](
            path.join(dir, 'assets'),
            { maxAge: env === 'production' ? 3600 * 1000 : 0 } // 1 hour
        ));
    }, this);
};
