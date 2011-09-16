var fs = require('fs'),
    path = require('path');

models.Projects.prototype.sync = function(method, model, options) {
    // Scan the project directory, and send a readme back to the client.
    var file = path.dirname(require.resolve('bones')) + '/package.json';
    fs.readFile(file, 'utf8', function(err, data) {
        if (err) return options.error('Failed to load projects.');
        data = JSON.parse(data);

        var models = [];
        _(data.dependencies).each(function(ver, id) {
            models.push({
                id: id,
                version: ver
            });
        });
        options.success(models);
    });
};
