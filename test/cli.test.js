var assert = require('assert');
var exec = require('child_process').exec;

exports['test --help'] = function() {
    exec('node test/fixture --help', function(err, stdout, stderr) {
        assert.equal(err.code, 1);
        assert.equal(stdout,
            'Usage: node ./test/fixture [command] --help for a list of options.\n' +
            'Available commands are:\n' +
            '  start:  start application\n' +
            '  foo:    demo command\n');
        assert.equal(stderr, '');
    });
};

exports['test start --help'] = function() {
    exec('node test/fixture start --help', function(err, stdout, stderr) {
        assert.equal(err.code, 1);
        assert.equal(stdout,
            'Usage: node ./test/fixture start [options...]\n' +
            'start: start application\n' +
            '    --adminParty     Celebrate with administrators! (Default: false)\n' +
            '    --config=[path]  Path to JSON configuration file.\n');
        assert.equal(stderr, '');
    });
};

exports['test foo --help'] = function() {
    exec('node test/fixture foo --help', function(err, stdout, stderr) {
        assert.equal(err.code, 1);
        assert.equal(stdout,
            'Usage: node ./test/fixture foo [options...]\n' +
            'foo: demo command\n' +
            '      --lorem          Lorem ipsum dolor sit amet. (Default: \'ipsum\')\n' +
            '  -d  --dolor          (Default: \'' + __dirname + '/fixture/commands\')\n' +
            '      --adminParty     Celebrate with administrators! (Default: false)\n' +
            '      --config=[path]  Path to JSON configuration file.\n');
        assert.equal(stderr, '');
    });
};

exports['test foo --config=test/fixture/config.json'] = function() {
    exec('node test/fixture foo --config=test/fixture/config.json', function(err, stdout, stderr) {
        assert.ok(!err);
        assert.deepEqual(JSON.parse(stdout), {
            adminParty: true,
            unknownOption: 42,
            lorem: "ipsum",
            dolor: __dirname + '/fixture/commands'
        });
        assert.equal(stderr, 'Note: Unknown option "unknownOption" in config file.\n');
    });
};

exports['test foo --dolor=pain'] = function() {
    exec('node test/fixture foo --dolor=pain', function(err, stdout, stderr) {
        assert.ok(!err);
        assert.deepEqual(JSON.parse(stdout), {
            adminParty: false,
            lorem: "ipsum",
            dolor: 'pain'
        });
        assert.equal(stderr, '');
    });
};
