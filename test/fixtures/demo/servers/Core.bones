servers['Core'].prototype.initialize = function(app) {
    this.port = app.config.port || 3000;
    this.use(new servers['Middleware'](app));
    this.use(new servers['Before'](app));
    this.use(new servers['Route'](app));
    this.use(new servers['After'](app));
    this.use(new servers['Asset'](app));
};
