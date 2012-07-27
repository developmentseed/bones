#!/usr/bin/env node

var bones = require('bones');

// Bones load views/models/etc.. in alphabetical order. To explicity load
// certain ones early simply require them here.
require('./views/Main');

bones.load(__dirname);

if (!module.parent) {
    bones.start();
}
