var path = require('path');

var tools = require('./lib/tools');
var load = require('./lib/load');

exports.init = function(dir) {
    global.plexus = global.plexus || {};

    load('server', path.join(dir, 'servers'));
    load('route', path.join(dir, 'routes'));
    load('controller', path.join(dir, 'controllers'));
    load('model', path.join(dir, 'models'));
    load('view', path.join(dir, 'views'));

    return exports;
};

exports.start = function() {
    var servers = global.plexus.server;
    for (var server in servers) {
        console.warn('Starting %s on port %s...',
            tools.colorize(server, 'green'),
            tools.colorize(servers[server].port, 'green')
        );

        servers[server].listen(servers[server].port);
    }

    return exports;
};


