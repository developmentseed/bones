view = Backbone.View.extend({
    initialize: function(options) {
        _.bindAll(this, 'render');
        this.render();
        this.trigger('attach');
    },
    render: function() {
        console.log('home view');
        return this;
    }
});
