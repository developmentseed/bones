var plugin = module.exports = require('plexus').plugin(__dirname);

plugin.load(require('othermodule'));
plugin.load(require('submodule'));
plugin.load();
