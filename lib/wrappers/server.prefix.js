var express = require('express');

if (!global.plexus.server[module.plexus.name]) {
    global.plexus.server[module.plexus.name] = express.createServer();
    if (!global.plexus.port) global.plexus.port = 3000;
    global.plexus.server[module.plexus.name].port = global.plexus.port++;
}

var server = global.plexus.server[module.plexus.name];
