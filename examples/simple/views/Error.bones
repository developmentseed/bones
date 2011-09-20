view = views.Main.extend({
    initialize: function(options) {
        _.bindAll(this, 'render');
        options = options || {};
        // TODO: Push responseText parsing all the way up into Bones.
        if (options.responseText) {
            try {
                options = $.parseJSON(options.responseText);
            } catch (err) {}
        }
        this.options = {};
        this.options.status = options.status || '404';
        this.options.message = options.message || 'Not found';
        views.Main.prototype.initialize.call(this, options);
    },
    render: function() {
        $(this.el).empty().append(templates.Error(this.options));
        return this;
    }
});
