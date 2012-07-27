view = Backbone.View.extend({
    initialize: function(options) {
        _.bindAll(this, 'render');
        this.render().trigger('attach');
    },
    render: function() {
        this.el = templates.Error(this.options);
        return this;
    }
});
