var plugin = module.exports = require('../../..').plugin(__dirname);

plugin.load(require('othermodule'));
plugin.load(require('submodule'));
plugin.load();
