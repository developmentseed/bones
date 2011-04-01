if (!global.plexus.server[env.name]) {
    global.plexus.server[env.name] = require('express').createServer();
    if (!global.plexus.port) global.plexus.port = 3000;
    global.plexus.server[env.name].port = global.plexus.port++;
}

var directories = {
    views: require('path').join(__dirname, '/../views')
};

var plexus = require('plexus').middleware;
var server = global.plexus.server[env.name];

(function defineServer() {
