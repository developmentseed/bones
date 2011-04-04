var assert = require('assert');
var _ = require('underscore');
var fs = require('fs');
var path = require('path');
var Module = require('module');

var tools = require('./tools');

// Load wrappers
var wrappers = {};
fs.readdirSync(path.join(__dirname, 'wrappers')).forEach(function(name) {
    var match = name.match(/^(.+)\.(prefix|suffix)\.js$/);
    if (match) {
        wrappers[match[1]] = wrappers[match[1]] || {};
        wrappers[match[1]][match[2]] =
            fs.readFileSync(path.join(__dirname, 'wrappers', name), 'utf8');
    }
});

function wrap(kind, name, content) {
    wrappers[kind] = wrappers[kind] || {};
    wrappers[kind].prefix = wrappers[kind].prefix || '';
    wrappers[kind].suffix = wrappers[kind].suffix || '';

    var content_length = content.split('\n').length;
    var preamble_length = wrappers['global'].prefix.split('\n').length;
    var prefix_length = preamble_length + 
                        wrappers[kind].prefix.split('\n').length;
    var suffix_length = wrappers['global'].suffix.split('\n').length + 
                        wrappers[kind].suffix.split('\n').length;

    var prefix_name = path.join(__dirname, 'wrappers', kind + '.prefix.js');
    var suffix_name = path.join(__dirname, 'wrappers', kind + '.suffix.js');

    return wrappers['global'].prefix
               .replace(/__KIND__/g, kind.replace(/'/g, "\\'"))
               .replace(/__NAME__/g, name.replace(/'/g, "\\'")) +
           wrappers[kind].prefix +
           ';\n' +
           content +
           ';\n' +
           wrappers[kind].suffix +
           wrappers['global'].suffix
               .replace(/__CONTENT_LENGTH__/g, content_length)
               .replace(/__PREAMBLE_LENGTH__/g, preamble_length)
               .replace(/__PREFIX_LENGTH__/g, prefix_length)
               .replace(/__PREFIX_NAME__/g, prefix_name)
               .replace(/__SUFFIX_LENGTH__/g, suffix_length)
               .replace(/__SUFFIX_NAME__/g, suffix_name);
}

require.extensions['.plexus'] = function(module, filename) {
    var content = fs.readFileSync(filename, 'utf8');
    var kind = tools.singularize(path.basename(path.dirname(filename)));
    var name = path.basename(filename).replace(/\..+$/, '');

    content = wrap(kind, name, content);
    module._compile(content, filename);
};

module.exports = function(kind, dir) {
    global.plexus[kind] = global.plexus[kind] || {};
    dir = path.join(dir, kind);

    var shared_files = [], server_files = [];
    try {
        fs.readdirSync(dir).forEach(function(name) {
            var file = path.join(dir, name);
            var stat = fs.statSync(file);

            if (stat.isFile() && (/\.plexus$/).test(name)) {
                require(file);
            }
        });
    } catch(err) {
        if (err.code !== 'ENOENT') throw err;
        else return;
    }
};
