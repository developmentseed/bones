if (!global.plexus.server[module.plexus.name]) {
    global.plexus.server[module.plexus.name] = require('express').createServer();
    if (!global.plexus.port) global.plexus.port = 3000;
    global.plexus.server[module.plexus.name].port = global.plexus.port++;
}

var server = global.plexus.server[module.plexus.name];

var directories = {
    views: require('path').join(__dirname, '/../views')
};

var plexus = require('plexus').middleware;
