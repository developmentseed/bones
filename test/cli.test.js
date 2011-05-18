var assert = require('assert');
var exec = require('child_process').exec;

exports['test --help'] = function() {
    exec('node test/fixture --help', function(err, stdout, stderr) {
        assert.equal(err.code, 1);
        assert.equal(stdout, 'Usage: node ./test/fixture [command] --help for a list of options.\nAvailable commands are:\n  start:  start application\n');
        assert.equal(stderr, '');
    });
};

exports['test start --help'] = function() {
    exec('node test/fixture start --help', function(err, stdout, stderr) {
        assert.equal(err.code, 1);
        assert.equal(stdout, 'Usage: node ./test/fixture start [options...]\nstart: start application\n    --adminParty     Celebrate with administrators! (Default: false)\n    --config=[path]  Path to JSON configuration file.\n');
        assert.equal(stderr, '');
    });
};
