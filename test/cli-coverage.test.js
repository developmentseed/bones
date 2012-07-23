var assert = require('assert');
var os = require('os');
var exec = require('child_process').exec;
var path = require('path');

var hostnameDescription = 'Hostnames allowed for requests. Wildcards are allowed. (Default: ["127.0.0.1","localhost","' + os.hostname() + '","other","*.third"])';

// Remove all hidden properties from an object.
function makePlain(json) {
    return JSON.parse(JSON.stringify(json));
}

var bones = require(path.join(__dirname, '../'));

require('./fixture');

describe('cli code coverage', function() {

it('test --help', function(done) {
    require('optimist').argv = { _: [], '$0': 'node ./test/fixture', help: true };
    bones.start(function(output) {
        assert.deepEqual(output, [
            [ 'Usage: %s for a list of options.', '\u001b[0;32mnode ./test/fixture [command] --help\u001b[0m' ],
            [ 'Available commands are:' ],
            [ '  start:  start application' ],
            [ '  foo:    demo command' ]
        ]);
        done();
    });
});

it('test start --help', function(done) {
    require('optimist').argv = { _: ['start'], '$0': 'node ./test/fixture', help: true };
    bones.start(function(output) {
        assert.deepEqual(output, [
            [ 'Usage: %s', '\u001b[0;32mnode ./test/fixture <command> [options...]\u001b[0m' ],
            [ 'Commands: start application' ],
            [ '  %s %s', '\u001b[1;33mstart\u001b[0m', '\u001b[0;33m\u001b[0m' ],
            [ '\nOptions:' ],
            [ '    --host           ' + hostnameDescription ],
            [ '    --adminParty     Celebrate with administrators! (Default: false)' ],
            [ '    --config=[path]  Path to JSON configuration file.' ]
        ]);
        done();
    });
});


it('test foo --help', function(done) {
    require('optimist').argv = { _: ['foo'], '$0': 'node ./test/fixture', help: true };
    bones.start(function(output) {
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
        done();
    });
});


it('test foo', function(done) {
    require('optimist').argv = { _: ['foo'], '$0': 'node ./test/fixture' };
    bones.start(function(output) {
        assert.equal(output, 'successfully started!');
        done();
    });
});


it('test foo --config=test/fixture/config.json', function(done) {
    require('optimist').argv = { _: ['foo'], '$0': 'node ./test/fixture', config: 'test/fixture/config.json' };
    bones.start(function(output) {
        assert.deepEqual(makePlain(bones.plugin.config), {
            lorem: 'ipsum',
            dolor: __dirname + '/fixture/commands',
            host: [ '127.0.0.1', 'localhost', os.hostname(), 'other', '*.third' ],
            adminParty: true,
            unknownOption: 42
        });
        assert.equal(output, 'successfully started!');
        done();
    });
});


it('test foo --dolor=pain', function(done) {
    require('optimist').argv = { _: ['foo'], '$0': 'node ./test/fixture', dolor: 'pain' };
    bones.plugin.config = {};
    bones.start(function(output) {
        assert.deepEqual(makePlain(bones.plugin.config), {
            lorem: 'ipsum',
            dolor: 'pain',
            host: [ '127.0.0.1', 'localhost', os.hostname(), 'other', '*.third' ],
            adminParty: false
        });
        assert.equal(output, 'successfully started!');
        done();
    });
});

it('test foo --config=test/fixture/config.json --show-config', function(done) {
    require('optimist').argv = { _: ['foo'], '$0': 'node ./test/fixture', config: 'test/fixture/config.json', 'show-config': true };
    bones.start(function(output) {
        assert.equal(output, undefined);
        assert.deepEqual(makePlain(bones.plugin.config), {
            lorem: 'ipsum',
            dolor: 'pain',
            host: [ '127.0.0.1', 'localhost', os.hostname(), 'other', '*.third' ],
            adminParty: true,
            unknownOption: 42
        });
        done();
    });
});

});
