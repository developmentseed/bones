var express = require('express');
// console.log(module.bones);

if (!global.bones.servers[module.bones.name]) {
    global.bones.servers[module.bones.name] = express.createServer();
}

var server = global.bones.servers[module.bones.name];
