var assert = require('assert');
var os = require('os');
var exec = require('child_process').exec;

var hostnameDescription = 'Hostnames allowed for requests. Wildcards are allowed. (Default: ["127.0.0.1","localhost","' + os.hostname() + '","other","*.third"])';

// Remove all hidden properties from an object.
function makePlain(json) {
    return JSON.parse(JSON.stringify(json));
}

require('./fixture');

exports['test --help'] = function(beforeExit) {
    var completed = false;

    require('optimist').argv = { _: [], '$0': 'node ./test/fixture', help: true };
    require('bones').start(function(output) {
        completed = true;

        assert.deepEqual(output, [
            [ 'Usage: %s for a list of options.', '\u001b[0;32mnode ./test/fixture [command] --help\u001b[0m' ],
            [ 'Available commands are:' ],
            [ '  start:  start application' ],
            [ '  foo:    demo command' ]
        ]);
    });

    beforeExit(function() { assert.ok(completed); });
};

exports['test start --help'] = function(beforeExit) {
    var completed = false;

    require('optimist').argv = { _: ['start'], '$0': 'node ./test/fixture', help: true };
    require('bones').start(function(output) {
        completed = true;
        assert.deepEqual(output, [
            [ 'Usage: %s', '\u001b[0;32mnode ./test/fixture <command> [options...]\u001b[0m' ],
            [ 'Commands: start application' ],
            [ '  %s %s', '\u001b[1;33mstart\u001b[0m', '\u001b[0;33m\u001b[0m' ],
            [ '\nOptions:' ],
            [ '    --host           ' + hostnameDescription ],
            [ '    --adminParty     Celebrate with administrators! (Default: false)' ],
            [ '    --config=[path]  Path to JSON configuration file.' ]
        ]);
    });

    beforeExit(function() { assert.ok(completed); });
};


exports['test foo --help'] = function(beforeExit) {
    var completed = false;

    require('optimist').argv = { _: ['foo'], '$0': 'node ./test/fixture', help: true };
    require('bones').start(function(output) {
        completed = true;
        assert.deepEqual(output, [
            [ 'Usage: %s', '\u001b[0;32mnode ./test/fixture <command> [options...]\u001b[0m' ],
            [ 'Commands: demo command' ],
            [ '  %s %s', '\u001b[1;33mfoo\u001b[0m', '\u001b[0;33m\u001b[0m' ],
            [ '\nOptions:' ],
            [ '      --lorem          Lorem ipsum dolor sit amet. (Default: "ipsum")' ],
            [ '  -d  --dolor          (Default: "' + __dirname + '/fixture/commands")' ],
            [ '      --host           ' + hostnameDescription ],
            [ '      --adminParty     Celebrate with administrators! (Default: false)' ],
            [ '      --config=[path]  Path to JSON configuration file.' ]
        ]);
    });

    beforeExit(function() { assert.ok(completed); });
};


exports['test foo'] = function(beforeExit) {
    var completed = false;

    require('optimist').argv = { _: ['foo'], '$0': 'node ./test/fixture' };
    require('bones').start(function(output) {
        completed = true;
        assert.equal(output, 'successfully started!');
    });

    beforeExit(function() { assert.ok(completed); });
};


exports['test foo --config=test/fixture/config.json'] = function(beforeExit) {
    var completed = false;

    require('optimist').argv = { _: ['foo'], '$0': 'node ./test/fixture', config: 'test/fixture/config.json' };
    require('bones').start(function(output) {
        completed = true;
        assert.deepEqual(makePlain(require('bones').plugin.config), {
            lorem: 'ipsum',
            dolor: __dirname + '/fixture/commands',
            host: [ '127.0.0.1', 'localhost', os.hostname(), 'other', '*.third' ],
            adminParty: true,
            unknownOption: 42
        });
        assert.equal(output, 'successfully started!');
    });

    beforeExit(function() { assert.ok(completed); });
};


exports['test foo --dolor=pain'] = function(beforeExit) {
    var completed = false;

    require('optimist').argv = { _: ['foo'], '$0': 'node ./test/fixture', dolor: 'pain' };
    require('bones').plugin.config = {};
    require('bones').start(function(output) {
        completed = true;
        assert.deepEqual(makePlain(require('bones').plugin.config), {
            lorem: 'ipsum',
            dolor: 'pain',
            host: [ '127.0.0.1', 'localhost', os.hostname(), 'other', '*.third' ],
            adminParty: false
        });
        assert.equal(output, 'successfully started!');
    });

    beforeExit(function() { assert.ok(completed); });
};

exports['test foo --config=test/fixture/config.json --show-config'] = function(beforeExit) {
    var completed = false;

    require('optimist').argv = { _: ['foo'], '$0': 'node ./test/fixture', config: 'test/fixture/config.json', 'show-config': true };
    require('bones').start(function(output) {
        completed = true;
        assert.equal(output, undefined);
        assert.deepEqual(makePlain(require('bones').plugin.config), {
            lorem: 'ipsum',
            dolor: 'pain',
            host: [ '127.0.0.1', 'localhost', os.hostname(), 'other', '*.third' ],
            adminParty: true,
            unknownOption: 42
        });
    });

    beforeExit(function() { assert.ok(completed); });
};
