if (!global.plexus.model[env.name]) {
    global.plexus.model[env.name] =
        require('plexus').model.create(env.name);
}

var model = global.plexus.model[env.name];
var parent = model.__super__;
