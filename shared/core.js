var Bones = Bones || {};
if (typeof process !== 'undefined' && process.versions && process.versions.node) {
    module.exports = Bones;
}

Bones.camelize = function(text) {
    return text.replace(/(?:^|_)(.)/g, function(all, chr) {
        return chr.toUpperCase();
    });
};

Bones.underscoreify = function(text) {
    return text.replace(/[A-Z]/g, function(match) {
        return '_'+ match.toLowerCase();
    }).replace(/^_/, '');
};

Bones.singularize = function(text) {
    // Extend as necessary.
    // See https://github.com/visionmedia/lingo/blob/master/lib/languages/en.js.
    return text.replace(/s$/i, '');
};

Bones.pluralize = function(text) {
    // Extend as necessary.
    return text + 's';
};
