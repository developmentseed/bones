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
    for (var i = Bones.pluralize.rules.length - 1; i >= 0; i--) {
        var rule = Bones.pluralize.rules[i];
        if (rule[0].test(text)) {
            return text.replace(rule[0], rule[1]);
        }
    }
    return text;

};

// From https://github.com/visionmedia/lingo/blob/master/lib/languages/en.js
Bones.pluralize.rules = [
    [ (/$/), "s" ],
    [ (/(s|ss|sh|ch|x|o)$/i), "$1es" ],
    [ (/y$/i), "ies" ],
    [ (/(o|e)y$/i), "$1ys" ],
    [ (/(octop|vir)us$/i), "$1i" ],
    [ (/(alias|status)$/i), "$1es" ],
    [ (/(bu)s$/i), "$1ses" ],
    [ (/([ti])um$/i), "$1a" ],
    [ (/sis$/i), "ses" ],
    [ (/(?:([^f])fe|([lr])f)$/i), "$1$2ves" ],
    [ (/([^aeiouy]|qu)y$/i), "$1ies" ],
    [ (/(matr|vert|ind)(?:ix|ex)$/i), "$1ices" ],
    [ (/([m|l])ouse$/i), "$1ice" ],
    [ (/^(ox)$/i), "$1en" ],
    [ (/(quiz)$/i), "$1zes" ],
    [ (/^person$/i), "people" ],
    [ (/^man$/i), "men" ],
    [ (/^child$/i), "children" ],
    [ (/^move$/i), "moves" ],
    [ (/^sex$/i), "sexes" ]
];
