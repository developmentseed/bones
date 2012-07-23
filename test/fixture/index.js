require('othermodule');
require('submodule');

// Explicit order
require('./views/Error');

var path = require('path');
var bones = require(path.join(__dirname, '../../'));

bones.load(__dirname);

if (!module.parent) {
    bones.start();
}
