servers['Route'].augment({
    initialize: function(parent, app) {
        this.use(new servers['Before'](app));
        parent.call(this, app);
        this.use(new servers['After'](app));
    }
});
