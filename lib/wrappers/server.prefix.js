var express = require('express');
// console.log(module.plexus);

if (!global.plexus.servers[module.plexus.name]) {
    global.plexus.servers[module.plexus.name] = express.createServer();
}

var server = global.plexus.servers[module.plexus.name];
