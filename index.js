var bones = exports;

bones.underscore = require('underscore');
bones.express = require('express');

bones.Bones = require('./server/core');
bones.Backbone = require('./server/backbone');
bones.Bones.Controller = require('./server/controller');
bones.Bones.Model = require('./server/model');
bones.Bones.Collection = require('./server/collection');
bones.Bones.Router = require('./server/router');
bones.Bones.View = require('./server/view');
bones.Bones.Server = require('./server/server');
bones.Bones.Command = require('./server/command');

bones.plugin = require('./server/plugin');
bones.middleware = require('./server/middleware');
