var assert = require('assert');
var os = require('os');
var exec = require('child_process').exec;

var hostnameDescription = 'Hostnames allowed for requests. Wildcards are allowed. (Default: ["127.0.0.1","localhost","' + os.hostname() + '","other","*.third"])';

exports['test --help'] = function() {
    exec('node test/fixture --help', function(err, stdout, stderr) {
        assert.equal(err.code, 1);
        assert.equal(stderr,
            'Usage: node ./test/fixture [command] --help for a list of options.\n' +
            'Available commands are:\n' +
            '  start:  start application\n' +
            '  foo:    demo command\n');
        assert.equal(stdout, '');
    });
};

exports['test start --help'] = function() {
    exec('node test/fixture start --help', function(err, stdout, stderr) {
        assert.equal(err.code, 1);
        assert.equal(stderr,
            'Usage: node ./test/fixture <command> [options...]\n' +
            'Commands: start application\n' +
            '  start \n' +
            '\n' +
            'Options:\n' +
            '    --host           ' + hostnameDescription + '\n' +
            '    --adminParty     Celebrate with administrators! (Default: false)\n' +
            '    --config=[path]  Path to JSON configuration file.\n');
        assert.equal(stdout, '');
    });
};

exports['test foo --help'] = function() {
    exec('node test/fixture foo --help', function(err, stdout, stderr) {
        assert.equal(err.code, 1);
        assert.equal(stderr,
            'Usage: node ./test/fixture <command> [options...]\n' +
            'Commands: demo command\n' +
            '  foo \n' +
            '\n' +
            'Options:\n' +
            '      --lorem          Lorem ipsum dolor sit amet. (Default: "ipsum")\n' +
            '  -d  --dolor          (Default: "' + __dirname + '/fixture/commands")\n' +
            '      --host           ' + hostnameDescription + '\n' +
            '      --adminParty     Celebrate with administrators! (Default: false)\n' +
            '      --config=[path]  Path to JSON configuration file.\n');
        assert.equal(stdout, '');
    });
};

exports['test foo --config=test/fixture/config.json'] = function() {
    exec('node test/fixture foo --config=test/fixture/config.json', function(err, stdout, stderr) {
        assert.ok(!err);
        assert.deepEqual(JSON.parse(stdout), {
            adminParty: true,
            unknownOption: 42,
            lorem: "ipsum",
            dolor: __dirname + '/fixture/commands',
            host: [ '127.0.0.1', 'localhost', os.hostname(), 'other', '*.third' ]
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
            dolor: 'pain',
            host: [ '127.0.0.1', 'localhost', os.hostname(), 'other', '*.third' ]
        });
        assert.equal(stderr, '');
    });
};


exports['test foo --config=test/fixture/config.json --show-config'] = function() {
    exec('node test/fixture foo --config=test/fixture/config.json --show-config', function(err, stdout, stderr) {
        assert.ok(!err);
        assert.equal(stdout, '');
        assert.equal(stderr,
            'Note: Unknown option "unknownOption" in config file.\n' +
            'Using configuration:\n' +
            '{\n' +
            '    "adminParty": true,\n' +
            '    "unknownOption": 42,\n' +
            '    "lorem": "ipsum",\n' +
            '    "dolor": "' + __dirname + '/fixture/commands",\n' +
            '    "host": [\n' +
            '        "127.0.0.1",\n' +
            '        "localhost",\n' +
            '        "' + os.hostname() + '",\n' +
            '        "other",\n' +
            '        "*.third"\n' +
            '    ]\n' +
            '}\n');
    });
};
