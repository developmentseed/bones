// Load application.
require('./');
var path = require('path');

process.env.NODE_ENV = 'test';
process.argv[2] = 'start';
module.exports = require(path.join(__dirname, '../../')).start();


// Augment assert for now...
var assert = require('assert');
var http = require('http');
var util = require('util');
/**
 * Assert response from `server` with
 * the given `req` object and `res` assertions object.
 *
 * @param {Server} server
 * @param {Object} req
 * @param {Object|Function} res
 * @param {String} msg
 */
assert.response = function(server, req, res, msg) {
    // Callback as third or fourth arg
    var callback = typeof res === 'function'
        ? res
        : typeof msg === 'function'
            ? msg
            : function() {};

    // Default messate to test title
    if (typeof msg === 'function') msg = null;
    msg = msg || '';

    // Issue request
    var timer,
        method = req.method || 'GET',
        status = res.status || res.statusCode,
        data = req.data || req.body,
        requestTimeout = req.timeout || 0,
        encoding = req.encoding || 'utf8';

    var request = http.request({
        host: '127.0.0.1',
        port: server.port,
        path: req.url,
        method: method,
        headers: req.headers
    });

    var check = function() {
        if (--server.__pending === 0) {
            server.close();
            server.__listening = false;
        }
    };

    // Timeout
    if (requestTimeout) {
        timer = setTimeout(function() {
            check();
            delete req.timeout;
            throw new Error(msg + 'Request timed out after ' + requestTimeout + 'ms.');
        }, requestTimeout);
    }

    if (data) request.write(data);

    request.on('response', function(response) {
        response.body = '';
        response.setEncoding(encoding);
        response.on('data', function(chunk) { response.body += chunk; });
        response.on('end', function() {
            if (timer) clearTimeout(timer);
            var err = null;
            try {
                // Assert response body
                if (res.body !== undefined) {
                    var eql = res.body instanceof RegExp
                      ? res.body.test(response.body)
                      : res.body === response.body;
                    assert.ok(
                        eql,
                        msg + 'Invalid response body.\n'
                            + '    Expected: ' + util.inspect(res.body) + '\n'
                            + '    Got: ' + util.inspect(response.body)
                    );
                }

                // Assert response status
                if (typeof status === 'number') {
                    assert.equal(
                        response.statusCode,
                        status,
                        msg + 'Invalid response status code.\n'
                            + '     Expected: ' + status + '\n'
                            + '     Got: ' + response.statusCode + ''
                    );
                }

                // Assert response headers
                if (res.headers) {
                    var keys = Object.keys(res.headers);
                    for (var i = 0, len = keys.length; i < len; ++i) {
                        var name = keys[i],
                            actual = response.headers[name.toLowerCase()],
                            expected = res.headers[name],
                            eql = expected instanceof RegExp
                              ? expected.test(actual)
                              : expected == actual;
                            assert.ok(
                                eql,
                                msg + 'Invalid response header ' + name + '.\n'
                                    + '    Expected: ' + expected + '\n'
                                    + '    Got: ' + actual
                            );
                    }
                }
            }
            catch (e) {
                err = e;
            }
            callback(err, response);
        });
    });

    request.end();

};

