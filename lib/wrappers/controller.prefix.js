if (!global.plexus.controller[module.plexus.name]) {
    global.plexus.controller[module.plexus.name] =
        require('plexus').controller.create(module.plexus.name);
}

var controller = global.plexus.controller[module.plexus.name];
var parent = controller.__super__;
