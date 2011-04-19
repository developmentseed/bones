var middleware = exports;

middleware.csrf = function(conf) {
    return function(req, res, next) {
        if (req.method === 'GET') {
            next();
        } else if (req.body && req.cookies['bones.token'] && req.body['bones.token'] === req.cookies['bones.token']) {
            delete req.body['bones.token'];
            next();
        } else {
            res.send(403);
        }
    };
};

middleware.txmtErrorHandler = function txmtErrorHandler(err, req, res, next) {
    res.statusCode = 500;
    console.error(err);
    var json = JSON.stringify(err);
    var accept = req.headers.accept || '';
    // html
    if (~accept.indexOf('html')) {
        res.setHeader('Content-Type', 'text/html');
        res.end('<pre>' + json + '</pre>');
    // json
    } else if (~accept.indexOf('json')) {
        res.setHeader('Content-Type', 'application/json');
        res.end(json);
    // plain text
    } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(json);
    }
};
