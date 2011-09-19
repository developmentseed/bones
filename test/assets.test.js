process.env.NODE_ENV = 'test';
var assert = require('assert');
var fs = require('fs');

var server = require('./fixture/start').servers.Core;

exports['assets'] = function(beforeExit) {
    assert.response(server, {
        url: '/assets/fixture/does-not-exist',
        method: 'GET'
    }, {
        body: 'Not Found',
        status: 404
    });

    assert.response(server, {
        url: '/assets/fixture/foo',
        method: 'GET'
    }, {
        body: 'lorem ipsum',
        status: 200
    });
};

exports['/assets/bones/core.js'] = function() {
    assert.response(server, {
        url: '/assets/bones/core.js',
        method: 'GET'
    }, { status: 200 }, function(res) {
        assert.ok(res.body.indexOf(fs.readFileSync(require.resolve('bones/client/backbone.js'))) >= 0);
        assert.ok(res.body.indexOf(fs.readFileSync(require.resolve('bones/client/utils.js'))) >= 0);
        assert.ok(res.body.indexOf(fs.readFileSync(require.resolve('bones/shared/backbone.js'))) >= 0);
        assert.ok(res.body.indexOf(fs.readFileSync(require.resolve('bones/shared/utils.js'))) >= 0);
    });
};

exports['/assets/bones/core.js'] = function() {
    assert.response(server, {
        url: '/assets/bones/vendor.js',
        method: 'GET'
    }, { status: 200 }, function(res) {
        assert.ok(res.body.indexOf(fs.readFileSync(require.resolve('bones/assets/jquery.js'))) >= 0);
        assert.ok(res.body.indexOf(fs.readFileSync(require.resolve('backbone'))) >= 0);
        assert.ok(res.body.indexOf(fs.readFileSync(require.resolve('underscore'))) >= 0);
    });
};

exports['/assets/bones/controllers.js'] = function() {
    assert.response(server, {
        url: '/assets/bones/controllers.js',
        method: 'GET'
    }, { status: 200 }, function(res) {
        assert.ok(res.body.indexOf(fs.readFileSync(require.resolve('bones/test/fixture/node_modules/submodule/controllers/Foo'))) >= 0);
        assert.ok(res.body.indexOf(fs.readFileSync(require.resolve('bones/test/fixture/controllers/Page'))) >= 0);

        // Correct order.
        assert.ok(res.body.indexOf('// ---- start test/fixture/node_modules/submodule/controllers/Foo.bones ----') >= 0);
        assert.ok(res.body.indexOf('// ---- start test/fixture/node_modules/submodule/controllers/Foo.bones ----') <
                  res.body.indexOf('// ---- start test/fixture/controllers/Page.bones ----'));

        assert.ok(res.body.indexOf('// ---- end test/fixture/node_modules/submodule/controllers/Foo.bones ----') >= 0);
        assert.ok(res.body.indexOf('// ---- end test/fixture/node_modules/submodule/controllers/Foo.bones ----') <
                  res.body.indexOf('// ---- start test/fixture/controllers/Page.bones ----'));
    });
};

exports['/assets/bones/models.js'] = function() {
    assert.response(server, {
        url: '/assets/bones/models.js',
        method: 'GET'
    }, { status: 200 }, function(res) {
        assert.ok(res.body.indexOf(fs.readFileSync(require.resolve('bones/test/fixture/models/Failure'))) >= 0);
        assert.ok(res.body.indexOf(fs.readFileSync(require.resolve('bones/test/fixture/models/Failures'))) >= 0);
        assert.ok(res.body.indexOf(fs.readFileSync(require.resolve('bones/test/fixture/models/House'))) >= 0);
        assert.ok(res.body.indexOf(fs.readFileSync(require.resolve('bones/test/fixture/models/Houses'))) >= 0);
        assert.ok(res.body.indexOf(fs.readFileSync(require.resolve('bones/test/fixture/models/Page'))) >= 0);

        // Doesn't include server files.
        assert.ok(res.body.indexOf(fs.readFileSync(require.resolve('bones/test/fixture/models/Page.server'))) < 0);

        // Correct order.
        assert.ok(res.body.indexOf('// ---- start test/fixture/models/Failure.bones ----') >= 0);
        assert.ok(res.body.indexOf('// ---- start test/fixture/models/Failure.bones ----') <
                  res.body.indexOf('// ---- start test/fixture/models/Failures.bones ----'));
        assert.ok(res.body.indexOf('// ---- start test/fixture/models/Failures.bones ----') <
                  res.body.indexOf('// ---- start test/fixture/models/House.bones ----'));
        assert.ok(res.body.indexOf('// ---- start test/fixture/models/House.bones ----') <
                  res.body.indexOf('// ---- start test/fixture/models/Houses.bones ----'));
        assert.ok(res.body.indexOf('// ---- start test/fixture/models/Houses.bones ----') <
                  res.body.indexOf('// ---- start test/fixture/models/Page.bones ----'));
    });
};


exports['/assets/bones/views.js'] = function() {
    assert.response(server, {
        url: '/assets/bones/views.js',
        method: 'GET'
    }, { status: 200 }, function(res) {
        assert.ok(res.body.indexOf(fs.readFileSync(require.resolve('bones/test/fixture/views/Error'))) >= 0);
        assert.ok(res.body.indexOf(fs.readFileSync(require.resolve('bones/test/fixture/views/App'))) >= 0);

        // Doesn't include server files.
        assert.ok(res.body.indexOf(fs.readFileSync(require.resolve('bones/test/fixture/views/App.server'))) < 0);

        // Correct order.
        assert.ok(res.body.indexOf('// ---- start test/fixture/views/Error.bones ----') >= 0);
        assert.ok(res.body.indexOf('// ---- start test/fixture/views/Error.bones ----') <
                  res.body.indexOf('// ---- start test/fixture/views/App.bones ----'));
    });
};

exports['/assets/bones/templates.js'] = function() {
    assert.response(server, {
        url: '/assets/bones/templates.js',
        method: 'GET'
    }, { status: 200 }, function(res) {
        assert.ok(res.body.indexOf(require('bones/test/fixture/templates/Error._').toString()) >= 0);
        assert.ok(res.body.indexOf(require('bones/test/fixture/node_modules/othermodule/templates/Other._').toString()) >= 0);

        // Doesn't include server files.
        assert.ok(res.body.indexOf(require('bones/test/fixture/templates/ServerSide.server._').toString()) < 0);

        // Correct order.
        assert.ok(res.body.indexOf('// ---- start test/fixture/templates/Error._ ----') >= 0);
        assert.ok(res.body.indexOf('// ---- start test/fixture/templates/Error._ ----') >
                  res.body.indexOf('// ---- start test/fixture/node_modules/othermodule/templates/Other._ ----'));
    });
};
