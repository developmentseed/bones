var path = require('path');
var fs = require('fs');
var util = require('util');
var assert = require('assert');
var Module = require('module');
var _ = require('underscore');
var Bones = require('bones');

var utils = Bones.utils;

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

require.extensions['.bones'] = function(module, filename) {
    var content = fs.readFileSync(filename, 'utf8');
    var kind = utils.singularize(path.basename(path.dirname(filename)));

    wrappers[kind] = wrappers[kind] || {};
    wrappers[kind].prefix = wrappers[kind].prefix || '';
    wrappers[kind].suffix = wrappers[kind].suffix || '';

    content = wrappers[kind].prefix + ';' + content + ';' + wrappers[kind].suffix;
    module._compile(content, filename);

    if (module.exports) {
        Bones.plugin.add(module.exports, filename);
    }
};

module.exports = Plugin;
function Plugin() {
    this.directories = [];
    this.config = {};
    this.controllers = {};
    this.models = {};
    this.routers = {};
    this.templates = {};
    this.views = {};
    this.servers = {};
    this.commands = {};
};

function alphabetical(a, b) {
    return a.toLowerCase().localeCompare(b.toLowerCase());
}

Plugin.prototype.require = function(dir, kind) {
    dir = path.join(dir, kind);
    try {
        fs.readdirSync(dir).sort(alphabetical).forEach(function(name) {
            var file = path.join(dir, name);
            if (path.extname(file) in require.extensions &&
                path.basename(file)[0] !== '.' &&
                fs.statSync(file).isFile()) {
                require(file);
            }
        });
    } catch(err) {
        if (err.code !== 'ENOENT') throw err;
    }

    return this;
};

Plugin.prototype.add = function(component, filename) {
    if (!component.files) component.files = [];
    component.files.push(filename);

    if (!component.title) {
        component.title = path.basename(filename).replace(/\..+$/, '');
    }

    var kind = path.basename(path.dirname(filename));
    Bones.plugin[kind][component.title] = component;
};

Plugin.prototype.start = function() {
    this.argv = require('optimist').argv;

    var command = this.argv._.length ? this.argv._[0] : 'start';
    if (this.argv.help || !(command in this.commands)) {
        this.help();
    } else {
        var command = this.commands[command];
        this.loadConfig(command);
        return new command(this);
    }
};

Plugin.prototype.loadConfig = function(command) {
    var config = this.config;
    command.options = command.options || {};

    if (this.argv.config) {
        try {
            _.extend(config, JSON.parse(fs.readFileSync(this.argv.config, 'utf8')));
        } catch(e) {
            console.error(utils.colorize('Invalid JSON config file: ' +
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
            delete this.argv[command.options[key]['shortcut']];
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
                     console.warn(utils.colorize('Note: Unknown option "' + key + '".', 'yellow'));
                } else {
                    // It's from the config file.
                    console.warn(utils.colorize('Note: Unknown option "' + key + '" in config file.', 'yellow'));
                }
            }
        }
    }

    for (var key in config) {
        if (typeof config[key] === 'function') {
            config[key] = config[key](this, config);
        }
    }

    if (showConfig) {
        console.warn(utils.colorize('Using configuration:', 'green'));
        console.warn(JSON.stringify(config, false, 4));
    }
};

Plugin.prototype.help = function() {
    var command = this.argv._.length ? this.argv._[0] : false;
    if (command !== false && command in this.commands) {
        // Display information about this command.
        var command = this.commands[command];
        console.log('Usage: %s', utils.colorize(this.argv['$0'] + ' ' +
            command.title +
            (command.usage ? ' ' + command.usage : '') +
            ' [options...]', 'green'));

        console.log('%s%s: %s',
            utils.colorize(command.title, 'yellow', 'bold'),
            utils.colorize(command.usage ? ' ' + command.usage : '', 'yellow'),
            command.description);

        var options = [];
        for (var key in command.options) {
            var option = command.options[key];
            var value = option['default'];
            if (typeof value === 'function') value = value(this);
            options.push([
                option.shortcut ? '-' + option.shortcut : '',
                '--' + (option.title || key),
                (option.description ? option.description + ' ' : '') + '(Default: ' + util.inspect(value) +')'
            ]);
        }
        options.push([ '', '--config=[path]', 'Path to JSON configuration file.' ]);

        table(options);
    } else {
        // Display information about all available commands.
        console.log('Usage: %s for a list of options.', utils.colorize(this.argv['$0'] + ' ' + (command || '[command]') + ' --help', 'green'));
        console.log('Available commands are:');
        var commands = [];
        for (var key in this.commands) {
            commands.push([ this.commands[key].title + ':', this.commands[key].description || '']);
        }
        table(commands);
    }
    process.exit(1);
};

function table(fields) {
    if (!fields[0]) return;
    var lengths = fields[0].map(function(val, i) {
        return Math.max.apply(Math, fields.map(function(field) {
            return field[i].length;
        }));
    });
    fields.forEach(function(field) {
        console.log(
            '  ' + field.map(function(val, i) {
                if (i >= lengths.length - 1) return val;
                return val + Array(lengths[i] - val.length + 1).join(' ');
            }).join('  ')
        );
    });
};
