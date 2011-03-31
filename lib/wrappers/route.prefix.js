var server = global.plexus.server[module.plexus.name];

if (!server) {
    throw new Error("Server " + module.plexus.name + " doesn't exist");
}
