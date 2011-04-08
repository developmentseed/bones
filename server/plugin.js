var path = require('path');
var fs = require('fs');
var util = require('util');
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
    module.plexus = require('..');
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
    this.commands = {};
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
        this.require('commands');
    } else {
        _.extend(this.controllers, plugin.controllers);
        _.extend(this.models, plugin.models);
        _.extend(this.routers, plugin.routers);
        _.extend(this.templates, plugin.templates);
        _.extend(this.views, plugin.views);
        _.extend(this.servers, plugin.servers);
        _.extend(this.commands, plugin.commands);
    }
};

Plugin.prototype.require = function(kind) {
    var plugin = this, dir = path.join(plugin.directory, kind);

    try {
        fs.readdirSync(dir).forEach(function(name) {
            var file = path.join(dir, name);
            if (path.extname(file) in require.extensions &&
                path.basename(file)[0] !== '.' &&
                fs.statSync(file).isFile()) {
                var component = require(file);

                if (component) {
                    if (!component.files) component.files = [];
                    component.files.push(file);

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
    this.argv = require('optimist').argv;

    var command = this.argv._.length ? this.argv._[0] : 'start';
    if (this.argv.help || !(command in this.commands)) {
        this.help();
    } else {
        var command = this.commands[command];
        this.config = this.loadConfig(command);
        new command(this);
    }
};

Plugin.prototype.loadConfig = function(command) {
    var config = {};
    if (this.argv.config) {
        try {
            config = JSON.parse(fs.readFileSync(this.argv.config, 'utf8'));
        } catch(e) {
            console.error(Plexus.colorize('Invalid JSON config file: ' +
                this.argv.config, 'red'));
            process.exit(2);
        }
    }

    for (var key in command.options) {
        if (!(key in config)) {
            config[key] = command.options[key]['default'];
        }
        if (command.options[key]['shortcut'] in this.argv) {
            config[key] = this.argv[command.options[key]['shortcut']];
            delete this.argv[command.options[key]['shortcut']]
        }
        if (key in this.argv) {
            config[key] = this.argv[key];
            delete this.argv[key];
        }
    }

    _.defaults(config, this.argv);

    var showConfig = false;
    for (var key in config) {
        if (key === 'config' || key === '_' || key[0] === '$') {
            delete config[key];
        }
        else if (key === 'show-config') {
            showConfig = config[key];
            delete config[key];
        }
        else {
            if (!(key in command.options)) {
                if (key in this.argv) {
                    // It was specified on the command line.
                     console.warn(Plexus.colorize('Note: Unknown option "' + key + '".', 'yellow'))
                } else {
                    // It's from the config file.
                    console.warn(Plexus.colorize('Note: Unknown option "' + key + '" in config file.', 'yellow'))
                }
            }
            if (typeof config[key] === 'function') config[key] = config[key](this);
        }
    }

    if (showConfig) {
        console.warn(Plexus.colorize('Using configuration:', 'green'));
        console.warn(JSON.stringify(config, false, 4));
    }

    return config;
};

Plugin.prototype.help = function() {
    var command = this.argv._.length ? this.argv._[0] : false;
    console.log('Usage: %s', Plexus.colorize(this.argv['$0'] + ' ' + (command || '[command]') + ' [options...]', 'green'));
    if (!command) console.log('Usage: %s for a list of options.', Plexus.colorize(this.argv['$0'] + ' ' + (command || '[command]') + ' --help', 'green'));
    if (command !== false && command in this.commands) {
        // Display information about this command.
        var command = this.commands[command];
        if (command.description) console.log('%s: %s', Plexus.colorize(command.title, 'yellow', 'bold'), command.description);
        for (var key in command.options) {
            var option = command.options[key];
            var value = option['default'];
            if (typeof value === 'function') value = value(this);

            console.log('  %s  %s %s (Default: %s)',
                option.shortcut ? '-' + option.shortcut : '  ',
                '--' + (option.title ? (option.title + Array(20 - option.title.length).join(' ')) :
                                       (key + Array(20 - key.length).join(' '))),
                option.description || '',
                util.inspect(value)
            );
        }

        console.log('      --verbose             Be more verbose. (Default: false)');
        console.log('      --config=[path]       Path to JSON configuration file.');
    } else {
        // Display information about all available commands.
        console.log('Available commands are:');
        for (var key in this.commands) {
            console.log('    %s:\t%s',
            this.commands[key].title,
            this.commands[key].description || '');
        }
    }
    process.exit(1);
};

// plexus.plugin(__dirname)
module.exports = function(dir) {
    var plugin = new Plugin(dir);
    plugin.load(require('../core'));
    return plugin;
};
