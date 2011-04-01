if (!global.plexus.controller[env.name]) {
    global.plexus.controller[env.name] =
        require('plexus').controller.create(env.name);
}

var controller = global.plexus.controller[env.name];
var parent = controller.__super__;
