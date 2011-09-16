var Bones = Bones || {};
Bones.utils = Bones.utils || {};

if (typeof process !== 'undefined' && process.versions && process.versions.node) {
    module.exports = Bones.utils;
}

Bones.utils.callback = function(callback) {
    return {
        success: function(model, response) { callback(null, response); },
        error: function(model, err) { callback(err); }
    };
};

// Multifetch. Pass a hash of models and fetch each in parallel.
Bones.utils.fetch = function(models, callback) {
    var remaining = _(models).size();
    var error = null;
    _(models).each(function(model) {
        model.fetch({
            success: function() {
                if (--remaining === 0) callback(error, models);
            },
            error: function(m, err) {
                if (!error) error = err;
                model.error = err;
                if (--remaining === 0) callback(error, models);
            }
        });
    });
};

// From https://github.com/visionmedia/lingo/blob/master/lib/languages/en.js
Bones.utils.uncountable = [ 'advice', 'enegery', 'excretion', 'digestion',
    'cooperation', 'health', 'justice', 'jeans', 'labour', 'machinery',
    'equipment', 'information', 'pollution', 'sewage', 'paper', 'money',
    'species', 'series', 'rain', 'rice', 'fish', 'sheep', 'moose', 'deer',
    'bison', 'proceedings', 'shears', 'pincers', 'breeches', 'hijinks',
    'clippers', 'chassis', 'innings', 'elk', 'rhinoceros', 'swine', 'you',
    'news' ];

Bones.utils.singularize = function(text) {
    if (Bones.utils.uncountable.indexOf(text.toLowerCase()) >= 0) return text;
    for (var i = Bones.utils.singularize.rules.length - 1; i >= 0; i--) {
        var rule = Bones.utils.singularize.rules[i];
        if (rule[0].test(text)) {
            return text.replace(rule[0], rule[1]);
        }
    }
    return text;
};

// From https://github.com/visionmedia/lingo/blob/master/lib/languages/en.js
Bones.utils.singularize.rules = [
    [ (/s$/i), "" ],
    [ (/(bu|mis|kis)s$/i), "$1s" ],
    [ (/([ti])a$/i), "$1um" ],
    [ (/((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$/i), "$1$2sis" ],
    [ (/(^analy)ses$/i), "$1sis" ],
    [ (/([^f])ves$/i), "$1fe" ],
    [ (/([lr])ves$/i), "$1f" ],
    [ (/([^aeiouy]|qu)ies$/i), "$1y" ],
    [ (/ies$/i), "ie" ],
    [ (/(x|ch|ss|sh)es$/i), "$1" ],
    [ (/([m|l])ice$/i), "$1ouse" ],
    [ (/(bus)es$/i), "$1" ],
    [ (/(o)es$/i), "$1" ],
    [ (/(shoe)s$/i), "$1" ],
    [ (/(cris|ax|test)es$/i), "$1is" ],
    [ (/(octop|vir)i$/i), "$1us" ],
    [ (/(alias|status)es$/i), "$1" ],
    [ (/^(ox)en/i), "$1" ],
    [ (/(vert|ind)ices$/i), "$1ex" ],
    [ (/(matr)ices$/i), "$1ix" ],
    [ (/(quiz)zes$/i), "$1" ],
    [ (/^(p)eople$/i), "$erson" ],
    [ (/^(m)en$/i), "$1an" ],
    [ (/^(child)ren$/i), "$1" ],
    [ (/^(move)s$/i), "$1" ],
    [ (/^(sex)$es/i), "$1" ]
];


Bones.utils.pluralize = function(text) {
    if (Bones.utils.uncountable.indexOf(text.toLowerCase()) >= 0) return text;
    for (var i = Bones.utils.pluralize.rules.length - 1; i >= 0; i--) {
        var rule = Bones.utils.pluralize.rules[i];
        if (rule[0].test(text)) {
            return text.replace(rule[0], rule[1]);
        }
    }
    return text;

};

// From https://github.com/visionmedia/lingo/blob/master/lib/languages/en.js
Bones.utils.pluralize.rules = [
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
    [ (/^(p)erson$/i), "$1eople" ],
    [ (/^(m)an$/i), "$1en" ],
    [ (/^(child)$/i), "$1ren" ],
    [ (/^(move)$/i), "$1s" ],
    [ (/^(sex)$/i), "$1es" ]
];
