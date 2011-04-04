var path = require('path');

global.plexus = global.plexus || {};

var tools = require('./lib/tools');
var load = require('./lib/load');

exports.express = require('express');
exports.Backbone = require('./lib/backbone');
exports.Plexus = {
    Router: require('./lib/router')
};

exports.init = function(dir) {
    load('routers', dir);
    load('controllers', dir);
    // load('model', path.join(dir, 'models'));
    // load('view', path.join(dir, 'views'));
    load('servers', dir);
    // load('route', path.join(dir, 'routes'));

    return exports;
};

exports.start = function() {
    var servers = global.plexus.servers;
    for (var server in servers) {
        servers[server].listen(servers[server].port);
        console.warn('Started %s server on port %s.',
            tools.colorize(server, 'green'),
            tools.colorize(servers[server].port, 'green')
        );
    }

    return exports;
};
