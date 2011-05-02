server = Bones.Server.extend({
    initialize: function() {
        routers['Core'].register(this);
        models['Page'].register(this);
        routers['Before'].register(this);
        routers['Main'].register(this);
        controllers['Page'].register(this);
        controllers['Foo'].register(this);
        routers['After'].register(this);
    }
});
