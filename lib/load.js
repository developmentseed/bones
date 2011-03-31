var assert = require('assert');
var _ = require('underscore');
var fs = require('fs');
var path = require('path');
var Module = require('module');


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

// Try catch suffix.
var prefix = "try {\n";
var suffix = "\n;} catch(err) {" +
             "\n    var fixLines = new RegExp('(' + __filename + '):([0-9]+)', 'g');" +
             "\n    err.stack = err.stack.replace(fixLines," +
             "\n    function(match, file, number) {" +
             "\n        var line = parseInt(number, 10);" +
             "\n        if (line >= __CONTENT_LENGTH__ + __PREFIX_LENGTH__) {" +
             "\n            return '__SUFFIX_NAME__:' + (line - __CONTENT_LENGTH__ - __PREFIX_LENGTH__ + 1)" +
             "\n        } else if (line >= __PREFIX_LENGTH__) {" +
             "\n            return file + ':' + (line - __PREFIX_LENGTH__ + 1);" +
             "\n        } else {" +
             "\n            return '__PREFIX_NAME__:' + (line - 1);" +
             "\n        }" +
             "\n    });" +
             "\n    throw err;" +
             "\n}";

function wrap(type, content) {
    wrappers[type].prefix = wrappers[type].prefix || '';
    wrappers[type].suffix = wrappers[type].suffix || '';

    return prefix + wrappers[type].prefix + ';\n' +
           content + ';\n' +
           wrappers[type].suffix + suffix
               .replace(/__CONTENT_LENGTH__/g, content.split('\n').length)
               .replace(/__PREFIX_LENGTH__/g, prefix.split('\n').length + wrappers[type].prefix.split('\n').length)
               .replace(/__PREFIX_NAME__/g, path.join(__dirname, 'wrappers', type + '.prefix.js'))
               .replace(/__SUFFIX_LENGTH__/g, suffix.split('\n').length + wrappers[type].suffix.split('\n').length)
               .replace(/__SUFFIX_NAME__/g, path.join(__dirname, 'wrappers', type + '.suffix.js'));
}

// Wrap wrappers in try/catch
for (var name in wrappers) {
    }



function load(type, filename) {
    var name = path.basename(filename, '.js');
    filename = require.resolve(filename);

    if (Module._cache[filename]) {
        return Module._cache[filename].exports;
    }

    var plugin = Module._cache[filename] = new Module(filename, module.parent);

    try {
        assert.ok(!plugin.loaded);
        plugin.filename = filename;

        plugin.paths = Module._nodeModulePaths(path.dirname(filename));
        // Find the first intersection
        for (var i = 0; i < plugin.paths.length; i++) {
            if (module.parent.paths.indexOf(plugin.paths[i]) >= 0) {
                // Found intersection
                plugin.paths = _.first(plugin.paths, i).concat(module.parent.paths);
                break;
            }
        }

        plugin.plexus = {
            type: type,
            name: name
        };

        var content = wrap(type, fs.readFileSync(filename, 'utf8'));
        plugin._compile(content, filename);
        plugin.loaded = true;
    } catch (err) {
        delete Module._cache[filename];
        throw err;
    }

    return plugin.exports;
}

module.exports = function(type, dir) {
    global.plexus[type] = global.plexus[type] || {};

    try {
        var files = fs.readdirSync(dir);
    } catch(err) {
        if (err.code !== 'ENOENT') throw err;
        else return;
    }

    files.forEach(function(name) {
        var file = path.join(dir, name);
        try {
            var stat = fs.statSync(file);
            if (stat.isDirectory() || (/\.js$/).test(name)) {
                load(type, file);
            }
        } catch(err) {
            console.warn("Couldn't load %s %s", type, file);
            throw err;
        }
    });
};
