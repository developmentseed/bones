// On the client we override this, but on the server we need the default
// behavior.
// TODO explain better...
views.App.prototype._ensureElement = function() {
    Backbone.View.prototype._ensureElement.apply(this, arguments);
};
