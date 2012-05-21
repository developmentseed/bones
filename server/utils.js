var utils = module.exports = require('../shared/utils');
var fs = require('fs');
var http = require('http');
var path = require('path');
var tty = require('tty');

var bones = require('..');

var colors = {
    'default': 1,
    black: 30,
    red: 31,
    green: 32,
    yellow: 33,
    blue: 34,
    purple: 35,
    cyan: 36,
    white: 37
};

var styles = {
    regular: 0,
    bold: 1,
    underline: 4
};

if (tty.isatty(process.stdout.fd) && tty.isatty(process.stderr.fd)) {
    utils.colorize = function(text, color, style) {
        color = color || 'red';
        style = style || 'regular';
        return "\033[" + styles[style] + ";" + colors[color] + "m" + text + "\033[0m";
    };
} else {
    utils.colorize = function(text) { return text; };
}


// Load client-side wrappers
var wrappers = {};
var wrapperDir = path.join(__dirname, '../client');
fs.readdirSync(wrapperDir).forEach(function(name) {
    var match = name.match(/^(.+)\.(prefix|suffix)\.js$/);
    if (match) {
        wrappers[match[1]] = wrappers[match[1]] || {};
        wrappers[match[1]][match[2]] =
            fs.readFileSync(path.join(wrapperDir, name), 'utf8');
    }
});

// Remove common prefix between the working directory and filename so that we don't
// leak information about the directory structure.
utils.removePrefix = function(str) {
    var prefix = process.cwd().split('/');
    str = str.split('/');
    while (prefix.length && str[0] === prefix[0]) {
        str.shift();
        prefix.shift();
    }
    return str.join('/');
};


utils.wrapClientFile = function(content, filename) {
    var kind = utils.singularize(path.basename(path.dirname(filename)));
    var name = path.basename(filename).replace(/\..+$/, '');
    var file = utils.removePrefix(filename);

    wrappers[kind] = wrappers[kind] || {};
    wrappers[kind].prefix = wrappers[kind].prefix || '';
    wrappers[kind].suffix = wrappers[kind].suffix || '';

    return wrappers[kind].prefix.replace(/__NAME__/g, name).replace(/__FILE__/g, file) +
           "\n" + content + "\n" +
           wrappers[kind].suffix.replace(/__NAME__/g, name).replace(/__FILE__/g, file);
};

utils.sortByLoadOrder = function(assets) {
    var reference = bones.plugin.order;
    assets.sort(function loadOrderSort(a, b) {
        a = reference.indexOf(a);
        b = reference.indexOf(b);
        return (a < 0 || b < 0) ? b - a : a - b;
    });
};


Error.HTTP = function(message, status) {
    if (typeof message === 'number') {
        status = message;
        message = null;
    }
    if (!message) {
        message = http.STATUS_CODES[status] || 'Unknown';
    }

    Error.call(this, message);
    Error.captureStackTrace(this, arguments.callee);
    this.message = message;
    this.status = status;
};

Error.HTTP.prototype.__proto__ = Error.prototype;
