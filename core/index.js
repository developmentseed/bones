var jade = require('jade');
var path = require('path');
var fs = require('fs');

module.exports = require('..').plugin(__dirname);
module.exports.load();

// Remove common prefix between __dirname and filename so that we don't
// leak information about the directory structure.
function removePrefix(str) {
    for (var i = 0; i < str.length; i++) {
        if (str[i] !== __dirname[i]) {
            return str.substring(i);
        }
    }
    return '';
};

require.extensions['.jade'] = function(module, filename) {
    var content = fs.readFileSync(filename, 'utf8');
    var name = path.basename(filename).replace(/\..+$/, '');
    module.exports = jade.compile(content, {
        filename: removePrefix(filename)
    });
    module.exports.register = function(server) {
        server.assets.templates.push({
            filename: filename,
            content: 'template = ' + this
        });
    };
};
