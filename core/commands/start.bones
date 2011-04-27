command = Bones.Command.extend();

command.description = 'start application';

command.options.adminParty = {
    'shortcut': 'a',
    'description': 'Enable admin mode.',
    'default': false
};

command.prototype.initialize = function(options) {
    if (!Object.keys(options.servers).length) {
        console.warn(Bones.colorize('No servers defined.', 'red'));
        return;
    }

    this.servers = {};
    for (var server in options.servers) {
        this.servers[server] = new options.servers[server](options);
        this.servers[server].start();
        console.warn('Started %s.', Bones.colorize( this.servers[server], 'green'));
    }
};
