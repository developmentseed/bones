var env = process.env.NODE_ENV || 'development';
var host = require('os').hostname();

exports = module.exports = require('express');

exports['sanitizeHost'] = function sanitizeHost(app) {
    var hosts = app.config.host;
    if (!hosts) {
        hosts = app.config.host = [];
    } else if (!Array.isArray(hosts)) {
        hosts = app.config.host = [ hosts ];
    }
    hosts.forEach(function(host, i) {
        if (typeof host === 'string') {
            hosts[i] = new RegExp('^' + hosts[i].replace(/\./g, '\\.').replace(/\*/g, '[a-z0-9_-]+') + '(:\\d+)?$', 'i');
            // Make sure we get the original host names when stringifying the host name matcher.
            hosts[i].toJSON = function() { return host; };
        }
    });

    return function(req, res, next) {
        if (!req.headers.host) {
            return next();
        } else if (!hosts.length) {
            // Check that the supplied hostname is harmless. If not, we'll
            // substitute it with the hostname reported by the machine.
            if (/^\w([\w-]*\w)?(\.\w([\w-]*\w)?)*(:\d+)?$/.test(req.headers.host)) {
                return next();
            }
        } else {
            for (var i = 0; i < hosts.length; i++) {
                if (hosts[i].test(req.headers.host)) {
                    return next();
                }
            }
        }

        res.send(400);
    };
};

exports['validateCSRFToken'] = function validateCSRFToken() {
    return function(req, res, next) {
        if (req.method === 'GET' || req.method === 'HEAD') {
            next();
        } else if (req.body && req.cookies['bones.token'] && req.body['bones.token'] === req.cookies['bones.token']) {
            delete req.body['bones.token'];
            next();
        } else {
            next(new Error.HTTP(403));
        }
    };
};

exports['fragmentRedirect'] = function fragmentRedirect() {
    return function(req, res, next) {
        // @see https://code.google.com/web/ajaxcrawling/docs/specification.html
        if (req.query._escaped_fragment_ === undefined) {
            next();
        } else {
            // Force the first char of the path to be a slash to prevent
            // foreign redirects.
            var path = '/' + req.query._escaped_fragment_.substr(1);
            res.redirect(path, 301);
        }
    };
};

exports['showError'] = function showError() {
    return function showError(err, req, res, next) {
        if (!err.status) err.status = 500;

        // Output unexpected errors to console but hide them from public eyes.
        if (err.status >= 500) {
            if (process.env.NODE_ENV != 'test') console.error(err.stack || err.toString());
            if (process.env.NODE_ENV == 'production') err.message = 'Internal Server Error';
        }

        if ((req.headers.accept + '' || '').indexOf('json') >= 0) {
            res.writeHead(err.status, { 'Content-Type': 'application/json' });
            if (env === 'development') {
                res.end('HEAD' == req.method ? null : JSON.stringify(err));
            } else {
                res.end('HEAD' == req.method ? null : JSON.stringify({ message: err.message }));
            }
        } else {
            res.writeHead(err.status, { 'Content-Type': 'text/plain' });
            if (env === 'development') {
                res.end('HEAD' == req.method ? null : err.stack);
            } else {
                res.end('HEAD' == req.method ? null : err.message);
            }
        }
    };
};

exports['notFound'] = function notFound() {
    return function notFound(req, res, next) {
        next(new Error.HTTP(404));
    };
};
