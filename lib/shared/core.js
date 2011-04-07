var Plexus = Plexus || {};
if (typeof process !== 'undefined' && process.versions && process.versions.node) {
    module.exports = Plexus;
}

Plexus.camelize = function(text) {
    return text.replace(/(?:^|_)(.)/g, function(all, chr) {
        return chr.toUpperCase();
    });
};

Plexus.singularize = function(text) {
    // Extend as necessary.
    // See https://github.com/visionmedia/lingo/blob/master/lib/languages/en.js.
    return text.replace(/s$/i, '');
};

Plexus.pluralize = function(text) {
    // Extend as necessary.
    return text + 's';
};
