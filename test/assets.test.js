process.env.NODE_ENV = 'test';
var assert = require('assert');
var fs = require('fs');
var path = require('path');

var server = require('./fixture/start').servers.Core;

function checkAsset(res, fixture) {
    var contents = fs.readFileSync(require.resolve(path.join(
        __dirname, '..', fixture)),'utf8');
    assert.ok(res.body.indexOf(contents) >= 0, 'Missing '+fixture);
}

function excludesAsset(res, fixture) {
    var contents = fs.readFileSync(require.resolve(path.join(
        __dirname, '..', fixture)), 'utf8');
    assert.ok(res.body.indexOf(contents) === -1, 'Includes '+fixture);
}

function checkTemplate(res, fixture) {
    var contents = require(path.join( __dirname, '..', fixture)).source;
    assert.ok(res.body.indexOf(contents) >= 0, 'Missing '+fixture);
}

function excludesTemplate(res, fixture) {
    var contents = require(path.join( __dirname, '..', fixture)).source;
    assert.ok(res.body.indexOf(contents) === -1, 'Includes '+fixture);
}

describe('assets', function() {

it('should return 404', function(done) {
    assert.response(server, {
        url: '/assets/fixture/does-not-exist',
        method: 'GET'
    }, {
        body: 'Not Found',
        status: 404
    }, done);
});

it('should return 200', function(done) {
    assert.response(server, {
        url: '/assets/fixture/foo',
        method: 'GET'
    }, {
        body: 'lorem ipsum',
        status: 200
    }, done);
});


it('/assets/bones/core.js', function(done) {
    assert.response(server, {
        url: '/assets/bones/core.js',
        method: 'GET'
    }, { status: 200 }, function(err, res) {
        checkAsset(res, 'client/backbone.js');
        checkAsset(res, 'client/utils.js');
        checkAsset(res, 'shared/backbone.js');
        checkAsset(res, 'client/utils.js');
        done()
    });
});

it('/assets/bones/core.js', function(done) {
    assert.response(server, {
        url: '/assets/bones/vendor.js',
        method: 'GET'
    }, { status: 200 }, function(err, res) {
        checkAsset(res, 'assets/jquery.js');
        assert.ok(res.body.indexOf(fs.readFileSync(require.resolve('backbone'))) >= 0);
        assert.ok(res.body.indexOf(fs.readFileSync(require.resolve('underscore'))) >= 0);
        done();
    });
});

it('/assets/bones/routers.js', function(done) {
    assert.response(server, {
        url: '/assets/bones/routers.js',
        method: 'GET'
    }, { status: 200 }, function(err, res) {
        checkAsset(res, 'test/fixture/node_modules/submodule/routers/Foo');
        checkAsset(res, 'test/fixture/routers/Page');

        // Doesn't include server files.
        excludesAsset(res, 'test/fixture/routers/Secret.server');
        excludesAsset(res, 'test/fixture/routers/Deprecated.server');

        // Correct order.
        assert.ok(res.body.indexOf('// ---- start test/fixture/node_modules/submodule/routers/Foo.bones.js ----') >= 0);
        assert.ok(res.body.indexOf('// ---- start test/fixture/node_modules/submodule/routers/Foo.bones.js ----') <
                  res.body.indexOf('// ---- start test/fixture/routers/Page.bones.js ----'));

        assert.ok(res.body.indexOf('// ---- end test/fixture/node_modules/submodule/routers/Foo.bones.js ----') >= 0);
        assert.ok(res.body.indexOf('// ---- end test/fixture/node_modules/submodule/routers/Foo.bones.js ----') <
                  res.body.indexOf('// ---- start test/fixture/routers/Page.bones.js ----'));
        done();
    });
});

it('/assets/bones/models.js', function(done) {
    assert.response(server, {
        url: '/assets/bones/models.js',
        method: 'GET'
    }, { status: 200 }, function(err, res) {
        checkAsset(res, 'test/fixture/models/Failure');
        checkAsset(res, 'test/fixture/models/Failures');
        checkAsset(res, 'test/fixture/models/House');
        checkAsset(res, 'test/fixture/models/Houses');
        checkAsset(res, 'test/fixture/models/Page');

        // Doesn't include server files.
        excludesAsset(res, 'test/fixture/models/Page.server');
        excludesAsset(res, 'test/fixture/models/Secret.server');
        excludesAsset(res, 'test/fixture/models/Deprecated.server');

        // Correct order.
        assert.ok(res.body.indexOf('// ---- start test/fixture/models/Failure.bones.js ----') >= 0);
        assert.ok(res.body.indexOf('// ---- start test/fixture/models/Failure.bones.js ----') <
                  res.body.indexOf('// ---- start test/fixture/models/Failures.bones.js ----'));
        assert.ok(res.body.indexOf('// ---- start test/fixture/models/Failures.bones.js ----') <
                  res.body.indexOf('// ---- start test/fixture/models/House.bones.js ----'));
        assert.ok(res.body.indexOf('// ---- start test/fixture/models/House.bones.js ----') <
                  res.body.indexOf('// ---- start test/fixture/models/Houses.bones.js ----'));
        assert.ok(res.body.indexOf('// ---- start test/fixture/models/Houses.bones.js ----') <
                  res.body.indexOf('// ---- start test/fixture/models/Page.bones.js ----'));
        done();
    });
});


it('/assets/bones/views.js', function(done) {
    assert.response(server, {
        url: '/assets/bones/views.js',
        method: 'GET'
    }, { status: 200 }, function(err, res) {
        checkAsset(res, 'test/fixture/views/Error');
        checkAsset(res, 'test/fixture/views/App');

        // Doesn't include server files.
        excludesAsset(res, 'test/fixture/views/App.server');
        excludesAsset(res, 'test/fixture/views/Secret.server');
        excludesAsset(res, 'test/fixture/views/Deprecated.server');

        // Correct order.
        assert.ok(res.body.indexOf('// ---- start test/fixture/views/Error.bones.js ----') >= 0);
        assert.ok(res.body.indexOf('// ---- start test/fixture/views/Error.bones.js ----') <
                  res.body.indexOf('// ---- start test/fixture/views/App.bones.js ----'));
        done();
    });
});

it('/assets/bones/templates.js', function(done) {
    assert.response(server, {
        url: '/assets/bones/templates.js',
        method: 'GET'
    }, { status: 200 }, function(err, res) {
        checkTemplate(res, 'test/fixture/templates/Error._');
        checkTemplate(res, 'test/fixture/node_modules/othermodule/templates/Other._');

        // Doesn't include server files.
        excludesTemplate(res, 'test/fixture/templates/ServerSide.server._');

        // Correct order.
        assert.ok(res.body.indexOf('// ---- start test/fixture/templates/Error._ ----') >= 0);
        assert.ok(res.body.indexOf('// ---- start test/fixture/templates/Error._ ----') >
                  res.body.indexOf('// ---- start test/fixture/node_modules/othermodule/templates/Other._ ----'));
        done();
    });
});

});
