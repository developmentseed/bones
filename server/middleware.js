exports = module.exports = require('express');

exports['csrf'] = function csrf() {
    return function(req, res, next) {
        if (req.method === 'GET') {
            next();
        } else if (req.body && req.cookies['bones.token'] && req.body['bones.token'] === req.cookies['bones.token']) {
            delete req.body['bones.token'];
            next();
        } else {
            res.send(403);
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
