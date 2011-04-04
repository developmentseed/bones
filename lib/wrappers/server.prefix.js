var plexus = require('plexus');
var express = plexus.express;

if (!global.plexus.servers[env.name]) {
    global.plexus.servers[env.name] = express.createServer();
    if (!global.plexus.port) global.plexus.port = 3000;
    global.plexus.servers[env.name].port = global.plexus.port++;

    global.plexus.servers[env.name].controller = function(controller) {
        if (!this.history) this.history = new plexus.Backbone.History;
        this.use()
    };
}

var server = global.plexus.servers[env.name];
var controllers = global.plexus.controllers;
var routers = global.plexus.routers;

(function defineServer() {
