var plexus = exports;

plexus.express = require('express');

plexus.Plexus = require('./server/plexus');
plexus.Backbone = require('./server/backbone');
plexus.Plexus.Controller = require('./server/controller');
plexus.Plexus.Model = require('./server/model');
plexus.Plexus.Router = require('./server/router');
plexus.Plexus.View = require('./server/view');
plexus.Plexus.Server = require('./server/server');

plexus.plugin = require('./server/plugin');
plexus.middleware = require('./server/middleware');
