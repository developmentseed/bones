if (!global.plexus.model[module.plexus.name]) {
    global.plexus.model[module.plexus.name] = 
        require('plexus').model.create(module.plexus.name);
}

var model = global.plexus.model[module.plexus.name];
var parent = model.__super__;
