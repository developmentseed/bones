var _ = require('underscore');
var path = require('path');
var fs = require('fs');
var Bones = require('bones');

require('bones').load(__dirname);

// Default template engine.
require.extensions['._'] = function(module, filename) {
    var content = fs.readFileSync(filename, 'utf8');
    var name = path.basename(filename).replace(/\..+$/, '');

    try {
        module.exports = _.template(content);
        Bones.plugin.add(module.exports, filename);
    } catch (err) {
        var lines = err.message.split('\n');
        lines.splice(1, 0, '    in template ' + filename);
        err.message = lines.join('\n');
        throw err;
    }

    module.exports.register = function(app) {
        if (app.assets) {
            app.assets.templates.push({
                filename: filename,
                content: 'template = ' + module.exports + ';'
            });
        }
    };
};
