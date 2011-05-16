var env = process.env.NODE_ENV || 'development';

exports = module.exports = require('express');

exports['csrf'] = function csrf() {
    return function(req, res, next) {
        if (req.method === 'GET') {
            next();
        } else if (req.body && req.cookies['bones.token'] && req.body['bones.token'] === req.cookies['bones.token']) {
            delete req.body['bones.token'];
            next();
        } else {
            next(new Error.HTTP(403));
        }
    }
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
    }
};

exports['showError'] = function showError() {
    return function showError(err, req, res, next) {
        if (!err.status) err.status = 500;

        if ((req.headers.accept + '' || '').indexOf('json') >= 0) {
            res.writeHead(err.status, { 'Content-Type': 'application/json' });
            if (env === 'development') {
                res.end(JSON.stringify(err));
            } else {
                res.end(JSON.stringify({ message: err.message }));
            }
        } else {
            res.writeHead(err.status, { 'Content-Type': 'text/plain' });
            if (env === 'development') {
                res.end(err.stack);
            } else {
                res.end(err.message);
            }
        }
    };
};

exports['notFound'] = function notFound() {
    return function notFound(req, res, next) {
        next(new Error.HTTP(404));
    };
};
