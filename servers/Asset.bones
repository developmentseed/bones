var fs = require('fs'),
    path = require('path'),
    middleware = require('express');

server = Bones.Server.extend({});

server.prototype.initialize = function(app) {
    app.directories.forEach(function(dir) {
        var pkg = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8'));
        this.use('/assets/' + pkg.name, middleware['static'](path.join(dir, 'assets')));
    }, this);
};
