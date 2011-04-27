var plugin = module.exports = require('bones').plugin(__dirname);

plugin.load(require('othermodule'));
plugin.load(require('submodule'));
plugin.load();
