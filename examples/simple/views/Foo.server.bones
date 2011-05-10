views['Foo'].augment({
    render: function(parent) {
        this.el = templates['Home']();
        return this;
    }
});
