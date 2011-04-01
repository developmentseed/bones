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

// Global try/catch suffix.
var prefix = "var env = module.plexus; try {\n";
prefix += "console.log(__filename);\n";
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

function wrap(kind, content) {
    wrappers[kind] = wrappers[kind] || {};
    wrappers[kind].prefix = wrappers[kind].prefix || '';
    wrappers[kind].suffix = wrappers[kind].suffix || '';

    return prefix + wrappers[kind].prefix + ';\n' +
           content + ';\n' +
           wrappers[kind].suffix + suffix
               .replace(/__CONTENT_LENGTH__/g, content.split('\n').length)
               .replace(/__PREFIX_LENGTH__/g, prefix.split('\n').length + wrappers[kind].prefix.split('\n').length)
               .replace(/__PREFIX_NAME__/g, path.join(__dirname, 'wrappers', kind + '.prefix.js'))
               .replace(/__SUFFIX_LENGTH__/g, suffix.split('\n').length + wrappers[kind].suffix.split('\n').length)
               .replace(/__SUFFIX_NAME__/g, path.join(__dirname, 'wrappers', kind + '.suffix.js'));
}

function load(kind, filename, server) {
    var name = path.basename(filename).replace(/\..+$/, '');
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
            kind: kind,
            name: name,
            server: server
        };

        var content = wrap(kind, fs.readFileSync(filename, 'utf8'));
        plugin._compile(content, filename);
        plugin.loaded = true;
    } catch (err) {
        delete Module._cache[filename];
        throw err;
    }

    return plugin.exports;
}

module.exports = function loadDirectory(kind, dir, server) {
    var suffix = /\.(.+)\.plexus$/;
    global.plexus[kind] = global.plexus[kind] || {};
    server = server || null;

    var shared_files = [], server_files = [], dirs = [];
    try {
        fs.readdirSync(dir).forEach(function(name) {
            var file = path.join(dir, name);
            var stat = fs.statSync(file);
            if (stat.isDirectory() && !server) {
                dirs.push(file);
            } else if (stat.isFile() && (/\.plexus$/).test(name)) {
                if (server || suffix.test(name)) {
                    server_files.push({
                        file: file,
                        server: server || name.match(suffix)[1]
                    });
                } else {
                    shared_files.push(file);
                }
            }
        });
    } catch(err) {
        if (err.code !== 'ENOENT') throw err;
        else return;
    }

    dirs.forEach(function(dir) {
        loadDirectory(kind, dir, path.basename(dir));
    });

    server_files.forEach(function(obj) {
        load(kind, obj.file, obj.server);
    });

    shared_files.forEach(function(file) {
        load(kind, file, null);
    });
};
