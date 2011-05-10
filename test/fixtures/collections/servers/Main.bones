server = Bones.Server.extend({
    initialize: function() {
        routers['Core'].register(this);
        models['Houses'].register(this);
    }
});
