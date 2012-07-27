command = Bones.Command.extend();

command.description = 'start application';

command.prototype.initialize = function(plugin, callback) {
    if (!Object.keys(plugin.servers).length) {
        console.warn(Bones.utils.colorize('No servers defined.', 'red'));
        return;
    }

    this.servers = {};
    var queue = _(plugin.servers)
        .filter(function(server) { return !!server.prototype.port })
        .length;
    _(plugin.servers)
        .chain()
        .filter(function(server) { return !!server.prototype.port })
        .each(function(server) {
            this.servers[server.title] = new server(plugin);
            this.servers[server.title].start(function() {
                console.warn('Started %s.', Bones.utils.colorize(this, 'green'));
                this.emit('start');
                queue--;
                queue === 0 && callback && callback();
            }.bind(this.servers[server.title]));
        }.bind(this));
};
