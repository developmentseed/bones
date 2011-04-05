var path = require('path');
var fs = require('fs');
var assert = require('assert');
var Module = require('module');
var _ = require('underscore');
var jade = require('jade');

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

    return wrappers[kind].prefix + ';\n' + content + ';\n' + wrappers[kind].suffix;
}

require.extensions['.plexus'] = function(module, filename) {
    var content = fs.readFileSync(filename, 'utf8');
    var kind = tools.singularize(path.basename(path.dirname(filename)));
    var name = path.basename(filename).replace(/\..+$/, '');

    content = wrap(kind, name, content);
    module._compile(content, filename);
    if (module.exports && !module.exports.title) {
        module.exports.title = name;
    }
};

require.extensions['.jade'] = function(module, filename) {
    var content = fs.readFileSync(filename, 'utf8');
    var name = path.basename(filename).replace(/\..+$/, '');
    module.exports = jade.compile(content, { filename: filename });
    module.exports.title = name;
};


function Plugin(dir) {
    this.directory = dir;
    this.controllers = {};
    this.models = {};
    this.routers = {};
    this.templates = {};
    this.views = {};
    this.servers = {};
};

Plugin.prototype.load = function(plugin) {
    if (!plugin) {
        // Load the current directory.
        this.require('controllers');
        this.require('models');
        this.require('routers');
        this.require('templates');
        this.require('views');
        this.require('servers');
    } else {
        _.extend(this.controllers, plugin.controllers);
        _.extend(this.models, plugin.models);
        _.extend(this.routers, plugin.routers);
        _.extend(this.templates, plugin.templates);
        _.extend(this.views, plugin.views);
        _.extend(this.servers, plugin.servers);
    }
};

Plugin.prototype.require = function(kind) {
    var plugin = this, dir = path.join(plugin.directory, kind);

    try {
        fs.readdirSync(dir).forEach(function(name) {
            var file = path.join(dir, name);
            var stat = fs.statSync(file);

            if (stat.isFile()) {
                var component = require(file);
                if (component) {
                    plugin[kind][component.title] = component;
                }
            }
        });
    } catch(err) {
        if (err.code !== 'ENOENT') throw err;
        return {};
    }
};

Plugin.prototype.start = function() {
    if (!Object.keys(this.servers).length) {
        console.warn(tools.colorize('No servers defined.', 'red'));
        return;
    }

    for (var server in this.servers) {
        server = new this.servers[server];
        server.start();
        console.warn('Started %s.', tools.colorize(server, 'green'));
    }
};

// plexus.plugin(__dirname)
module.exports = function(dir) {
    return new Plugin(dir);
};
