command = Bones.Command.extend();

command.description = 'demo command';

command.options['lorem'] = {
    'description': 'Lorem ipsum dolor sit amet.',
    'default': 'ipsum'
};

command.prototype.initialize = function(plugin, callback) {
    if (callback) callback('successfully started!');
};
