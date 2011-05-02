var _ = require('underscore');
var path = require('path');
var fs = require('fs');
var bones = require('bones');

require('bones').load(__dirname);

require.extensions['._'] = function(module, filename) {
    var content = fs.readFileSync(filename, 'utf8');
    var name = bones.utils.camelize(path.basename(filename).replace(/\..+$/, ''));

    module.exports = _.template(content);
    module.exports.register = function(app) {
        if (app.assets) {
            app.assets.templates.push({
                filename: filename,
                content: 'template = ' + module.exports + ';'
            });
        }
    };
};
