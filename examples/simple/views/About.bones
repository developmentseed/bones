view = views.Main.extend({
    render: function() {
        $(this.el).empty().append(templates.About());
        return this;
    }
});
