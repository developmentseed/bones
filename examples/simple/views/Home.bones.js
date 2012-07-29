view = views.Main.extend({
    render: function() {
        var projects = [];
        this.collection.each(function(item) {
            projects.push(item.escape('id'));
        });
        $(this.el).empty().append(templates.Home({projects:projects}));
        return this;
    }
});
