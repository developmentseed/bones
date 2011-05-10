var assert = require('assert');

require('./fixtures/demo');
var demo = require('bones').plugin;
var main = new demo.servers['Main'](demo);

exports['routes'] = function(beforeExit) {
    assert.response(main.server, {
        url: '/submodule-page',
        method: 'GET'
    }, {
        body: 'submodule page',
        status: 200
    });

    assert.response(main.server, {
        url: '/page/foo',
        method: 'GET'
    }, {
        body: 'page foo',
        status: 200
    });

    assert.response(main.server, {
        url: '/page/bar',
        method: 'GET'
    }, {
        body: 'page bar',
        status: 200
    });

    assert.response(main.server, {
        url: '/page/special',
        method: 'GET'
    }, {
        body: 'special page',
        status: 200
    });

    assert.response(main.server, {
        url: '/page/baz',
        method: 'GET'
    }, {
        body: 'bones router special page',
        status: 200
    });

    assert.response(main.server, {
        url: '/page/foo',
        method: 'POST'
    }, {
        body: 'Forbidden',
        status: 403
    });

    assert.response(main.server, {
        url: '/page/foo',
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'cookie': 'bones.token=1f4a1137268b8e384e50d0fb72c627c4'
        },
        body: '{"bones.token":"1f4a1137268b8e384e50d0fb72c627c4"}'
    }, {
        body: 'Cannot POST /page/foo',
        status: 404
    });
};

exports['api endpoints'] = function() {
    assert.response(main.server, {
        url: '/api/Page/foo',
        method: 'GET'
    }, {
        body: '{"id":"foo","method":"read"}',
        status: 200
    });

    assert.response(main.server, {
        url: '/api/page/foo',
        method: 'GET'
    }, {
        body: 'Cannot GET /api/page/foo',
        status: 404
    });

    assert.response(main.server, {
        url: '/api/Page/foo',
        method: 'PUT',
        headers: {
            'content-type': 'application/json',
            'cookie': 'bones.token=1f4a1137268b8e384e50d0fb72c627c4'
        },
        body: '{"bones.token":"1f4a1137268b8e384e50d0fb72c627c4","id":"foo","key":"value"}'
    }, {
        body: '{"id":"foo","key":"value","method":"update"}',
        status: 200
    });
};
