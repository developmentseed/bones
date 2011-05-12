command = Bones.Command.extend();

command.description = 'start application';

command.options.adminParty = {
    'shortcut': 'a',
    'description': 'Enable admin mode.',
    'default': false
};

command.prototype.initialize = function(plugin, callback) {
    if (!Object.keys(plugin.servers).length) {
        console.warn(Bones.utils.colorize('No servers defined.', 'red'));
        return;
    }

    var started = 0;
    this.servers = {};
    for (var server in plugin.servers) {
        this.servers[server] = new plugin.servers[server](plugin);
        this.servers[server].start(function() {
            console.warn('Started %s.', Bones.utils.colorize(this, 'green'));
            this.emit('start');
            started++;
            (started === _(plugin.servers).size()) && callback && callback();
        }.bind(this.servers[server]));
    }
};
