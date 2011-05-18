process.env.NODE_ENV = 'test';
var assert = require('assert');
var fs = require('fs');

require('./fixture')
var fixture = require('bones').plugin;

exports['stringify'] = function() {
    assert.equal(fixture.controllers.Foo + '', '<Controller Foo>');
    assert.equal(fixture.controllers.Page + '', '<Controller Page>');
    var srv = new (require('bones').Server.extend({}, { title: 'Demo' }));
    assert.equal(new fixture.controllers.Page({ server: srv }) + '', '[Controller Page]');

    assert.equal(fixture.models.Failure + '', '<Model Failure>');
    assert.equal(fixture.models.Failures + '', '<Collection Failures>');
    assert.equal(fixture.models.House + '', '<Model House>');
    assert.equal(fixture.models.Houses + '', '<Collection Houses>');
    assert.equal(new fixture.models.Houses + '', '[Collection Houses]');
    assert.equal(fixture.models.Page + '', '<Model Page>');
    assert.equal(new fixture.models.Page + '', '[Model Page]');

    assert.equal(fixture.servers.Asset + '', '<Server Asset>');
    assert.equal(fixture.servers.Core + '', '<Server Core>');
    assert.equal(fixture.servers.Middleware + '', '<Server Middleware>');
    assert.equal(new fixture.servers.Asset({directories: []}) + '', '[Server Asset]');

    assert.equal(fixture.commands.foo + '', '<Command foo>');
    assert.equal(new fixture.commands.foo + '', '[Command foo]');

    assert.equal(fixture.views.App + '', '<View App>');
    assert.equal(fixture.views.Error + '', '<View Error>');
    assert.equal(new fixture.views.Error({ error: 'test' }) + '', '[View Error]');
};
