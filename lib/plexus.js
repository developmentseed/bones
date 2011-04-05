var plexus = exports;

plexus.plugin = require('./plugin');
plexus.middleware = require('./middleware');

plexus.express = require('express');
plexus.Backbone = require('./backbone');
plexus.Plexus = {
    Controller: require('./controller'),
    Model: require('./model'),
    Router: require('./router'),
    Server: require('./server')
};
