var assert = require('assert');
var exec = require('child_process').exec;

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
            [ 'Usage: %s', '\u001b[0;32mnode ./test/fixture start [options...]\u001b[0m' ],
            [ '%s%s: %s', '\u001b[1;33mstart\u001b[0m', '\u001b[0;33m\u001b[0m', 'start application' ],
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
            [ 'Usage: %s', '\u001b[0;32mnode ./test/fixture foo [options...]\u001b[0m' ],
            [ '%s%s: %s', '\u001b[1;33mfoo\u001b[0m', '\u001b[0;33m\u001b[0m', 'demo command' ],
            [ '    --lorem          Lorem ipsum dolor sit amet. (Default: \'ipsum\')' ],
            [ '    --adminParty     Celebrate with administrators! (Default: false)' ],
            [ '    --config=[path]  Path to JSON configuration file.' ]
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
