var fs = require('fs'),
    path = require('path');

/**
 * The only method we need to override for on the server is `sync` which is
 * called to load the resource. By default Backbone models will attempt to
 * retrieve their state from a URI returned from their 'URL' method. Clearly
 * that won't work on the server, as we're trying to power that very same
 * URI. Here we do the hard work!
 */
models.Project.prototype.sync = function(method, model, options) {
    // Project data can only be read, so return an error it the client is
    // trying to do anything else.
    if (method != 'read') return options.error('Unsupported method');

    var projectDir = path.dirname(require.resolve('bones')) + '/node_modules/' + model.id,
        resp = {id: model.id};

    var fetchPackage = function(callback) {
        fs.readFile(projectDir +'/package.json', 'utf8', function(err, data) {
            if (err) return callback('Could not retrieve project information.');
            data = JSON.parse(data);
            resp = _.extend(resp, data);
            callback();
        });
    };

    var fetchReadme = function(callback) {
        // Setup the regex we'll use for detecting README files.
        var re = /^readme(|\.\w*)$/i;

        // Scan the project directory, and send a readme back to the client.
        fs.readdir(projectDir, function(err, files) {
            if (err) return callback('Project not found.');

            var found = false;
            for (var i = 0; i < files.length; i++) {
                var match = re.exec(files[i]);
                if (match) {
                    found = true;
                    fs.readFile(projectDir +'/'+ match.input, 'utf8', function(err, data) {
                        if (err) return callback('Could not retrieve project information.');
                        // 80 chars folks...
                        data = wrap(data);
                        resp.readme = data;
                        callback();
                    });
                    break;
                }
            }
            if (!found) return callback('Project is missing a readme file.');
        });
    }

    fetchPackage(function(err) {
        if (err) return options.error(err);
        fetchReadme(function(err) {
            if (err) return options.error(err);
            options.success(resp);
        });
    });
};

var wrap = function(str) {
    var lines = [];
    _(str.split(/\n/)).each(function(v) {
        if (v.length > 80) {
            var parts = v.match(/.{80}|.+$/g);
            lines.push(parts.join('\n'));
        } else {
            lines.push(v);
        }
    });

    return lines.join('\n');
};
