var plexus = exports;

plexus.underscore = require('underscore');
plexus.express = require('express');

plexus.Plexus = require('./server/core');
plexus.Backbone = require('./server/backbone');
plexus.Plexus.Controller = require('./server/controller');
plexus.Plexus.Model = require('./server/model');
plexus.Plexus.Router = require('./server/router');
plexus.Plexus.View = require('./server/view');
plexus.Plexus.Server = require('./server/server');
plexus.Plexus.Command = require('./server/command');

plexus.plugin = require('./server/plugin');
plexus.middleware = require('./server/middleware');
