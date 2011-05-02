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
