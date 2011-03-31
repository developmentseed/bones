var path = require('path');
var express = require('express');

var load = require('./lib/load');

exports.init = function(dir) {
    global.bones = global.bones || {
        servers: {}
    };

    load.servers(path.join(dir, 'servers'));
}


