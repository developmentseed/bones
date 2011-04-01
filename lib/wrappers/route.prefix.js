var controller = global.plexus.controller[env.name];

if (!controller) {
    throw new Error("Controller " + env.name + " doesn't exist");
}

// var server = global.plexus.server[env.name];
// 
// if (!server) {
//     throw new Error("Server " + env.name + " doesn't exist");
// }

var route = {};
