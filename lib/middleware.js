var middleware = exports;

middleware.csrf = function(conf) {
    return function(req, res, next) {
        if (req.method === 'GET') {
            next();
        } else if (req.body && req.cookies['plexus.token'] && req.body['plexus.token'] === req.cookies['plexus.token']) {
            delete req.body['plexus.token'];
            next();
        } else {
            res.send(403);
        }
    };
};

middleware.txmtErrorHandler = function txmtErrorHandler(err, req, res, next) {
    res.statusCode = 500;
    console.error(err.stack);
    var accept = req.headers.accept || '';
    // html
    if (~accept.indexOf('html')) {
        var stack = err.stack.replace(/(\/.+?):(\d+):(\d+)/g,
            function(text, file, line, column) {
                return '<a href="txmt://open?url=file://' + file +
                        '&line=' + line + '&column=' + column +
                        '">' + text + '</a>';
            });
        res.setHeader('Content-Type', 'text/html');
        res.end('<pre>' + stack + '</pre>');
    // json
    } else if (~accept.indexOf('json')) {
        var json = JSON.stringify({ error: err });
        res.setHeader('Content-Type', 'application/json');
        res.end(json);
    // plain text
    } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(err.stack);
    }
};
