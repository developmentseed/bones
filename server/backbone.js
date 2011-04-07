var Backbone = module.exports = require('../shared/backbone');

Backbone.sync = function() {
    throw new Error('No default sync method');
};
