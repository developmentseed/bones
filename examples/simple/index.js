#!/usr/bin/env node
var plugin = module.exports = require('../..').plugin(__dirname);

plugin.load();

if (!module.parent) {
    plugin.start();
}
