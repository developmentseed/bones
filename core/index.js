var _ = require('underscore');
var path = require('path');
var fs = require('fs');
var bones = require('..');

module.exports = bones.plugin(__dirname);
module.exports.load();

require.extensions['._'] = function(module, filename) {
    var content = fs.readFileSync(filename, 'utf8');
    var name = bones.Bones.camelize(path.basename(filename).replace(/\..+$/, ''));

    module.exports = _.template(content);
    module.exports.register = function(server) {
        server.assets.templates.push({
            filename: filename,
            content: 'template = _.template(' + JSON.stringify(content) + ');'
        });
    };
};
