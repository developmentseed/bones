var Backbone = module.exports = require('../shared/backbone');

Backbone.sync = function() {
    throw new Error('No default sync method');
};

// Remove Backbone.Events.on() from server side. It conflicts with Node.js
// events. Remove off() together as it can be confusing. Please use bind() and
// unbind().
if (_(Backbone.Events).has('on')) {
    delete Backbone.Events.on;
}
if (_(Backbone.Events).has('off')) {
    delete Backbone.Events.off;
}
