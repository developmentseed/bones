var path = require('path');
var fs = require('fs');
var assert = require('assert');
var Module = require('module');
var _ = require('underscore');

var Plexus = require('..').Plexus;

// Load wrappers
var wrappers = {};
fs.readdirSync(__dirname).forEach(function(name) {
    var match = name.match(/^(.+)\.(prefix|suffix)\.js$/);
    if (match) {
        wrappers[match[1]] = wrappers[match[1]] || {};
        wrappers[match[1]][match[2]] =
            fs.readFileSync(path.join(__dirname, name), 'utf8')
                .split('\n').join('');
    }
});

require.extensions['.plexus'] = function(module, filename) {
    var content = fs.readFileSync(filename, 'utf8');
    var kind = Plexus.singularize(path.basename(path.dirname(filename)));

    wrappers[kind] = wrappers[kind] || {};
    wrappers[kind].prefix = wrappers[kind].prefix || '';
    wrappers[kind].suffix = wrappers[kind].suffix || '';

    content = wrappers[kind].prefix + ';' + content + ';' + wrappers[kind].suffix;
    module._compile(content, filename);
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
    return this;
};

Plugin.prototype.require = function(kind) {
    var plugin = this, dir = path.join(plugin.directory, kind);

    try {
        fs.readdirSync(dir).forEach(function(name) {
            var file = path.join(dir, name);
            if (fs.statSync(file).isFile()) {
                var component = require(file);

                if (component) {
                    component.__filename = file;
                    if (!component.title) {
                        component.title = Plexus.camelize(
                            path.basename(file).replace(/\..+$/, ''));
                    }
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
        console.warn(Plexus.colorize('No servers defined.', 'red'));
        return;
    }

    for (var server in this.servers) {
        server = new this.servers[server](this);
        server.start();
        console.warn('Started %s.', Plexus.colorize(server, 'green'));
    }
};

// plexus.plugin(__dirname)
module.exports = function(dir) {
    return new Plugin(dir).load(require('plexus/core'));
};
