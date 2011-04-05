var plugin = module.exports = require('plexus').plugin(__dirname);

plugin.load(require('plexus/plugins/core'));
plugin.load();

if (!module.parent) {
    plugin.start();
}
