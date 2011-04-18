server = Bones.Server.extend({
    initialize: function() {
        this.register(models['Page']);
        this.register(routers['Before']);
        this.register(routers['Main']);
        this.register(controllers['Page']);
        this.register(controllers['Foo']);
        this.register(routers['After']);
    }
});
