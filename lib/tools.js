var colors = {
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

exports.colorize = function(text, color, style) {
    color = color || 'red';
    style = style || 'regular';
    return "\033[" + styles[style] + ";" + colors[color] + "m" + text + "\033[0m";
};

exports.camelize = function(text) {
    return text.replace(/(?:^|_)(.)/g, function(all, chr) {
        return chr.toUpperCase();
    });
};
