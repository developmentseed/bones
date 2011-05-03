command = Bones.Command.extend();

command.description = 'start application';

command.options.adminParty = {
    'shortcut': 'a',
    'description': 'Enable admin mode.',
    'default': false
};

command.prototype.initialize = function(plugin) {
    if (!Object.keys(plugin.servers).length) {
        console.warn(Bones.utils.colorize('No servers defined.', 'red'));
        return;
    }

    this.servers = {};
    for (var server in plugin.servers) {
        this.servers[server] = new plugin.servers[server](plugin);
        this.servers[server].start();
        console.warn('Started %s.', Bones.utils.colorize(this.servers[server], 'green'));
    }
};
