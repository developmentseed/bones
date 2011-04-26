server = Bones.Server.extend({
    initialize: function() {
        this.register(models['Houses']);
    }
});
