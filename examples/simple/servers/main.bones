var mirror = require('mirror');

server = Bones.Server.extend({
    initialize: function() {
        this.register(routers['Core']);

        this.register(models['Foo']);
        this.register(views['Home']);
        this.register(views['Foo']);
        this.register(controllers['Home']);
        this.register(controllers['Other']);
        this.register(controllers['Default']);

        this.register(templates['Home']);
    }
});