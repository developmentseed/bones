view = views.Main.extend({
    render: function() {
        // TODO Format links in the readme as link.
        // TODO avoid double encoding issues.

        $(this.el).empty().append(templates.Project({
            name: this.model.escape('name'),
            description: this.model.escape('description'),
            readme: this.model.escape('readme')
        }));
        return this;
    }
});
