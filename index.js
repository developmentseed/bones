var path = require('path');

var tools = require('./lib/tools');
var load = require('./lib/load');

exports.init = function(dir) {
    global.plexus = global.plexus || {};

    load('server', path.join(dir, 'servers'), true);
    load('controller', path.join(dir, 'controllers'));
    load('model', path.join(dir, 'models'));
    load('view', path.join(dir, 'views'));
    load('route', path.join(dir, 'routes'));

    return exports;
};

exports.start = function() {
    var servers = global.plexus.server;
    for (var server in servers) {
        servers[server].listen(servers[server].port);
        console.warn('Started %s server on port %s.',
            tools.colorize(server, 'green'),
            tools.colorize(servers[server].port, 'green')
        );
    }

    return exports;
};

exports.middleware = require('./lib/middleware');
exports.controller = require('./lib/controller');
exports.model = require('./lib/model');
