Bones
-----
Conventions for server-side `backbone.js` views/controllers. Provides a set of
overrides to allow the same Views and Controllers to be used both client-side
and server-side.

                       +--------+
                       | Models |
         +-----------> +--------+ <------------+
         |             | Views  |              |
         |          +--------------+           |
         |          | Controllers  |           |
         |          +--------------+           |
    +---------+                           +---------+
    | Browser |                           | Server  |
    +---------+                           +---------+

Bones allows your Backbone controller routes to be served as normal static
pages to crawlers and javascript-disabled browsers while allowing your users to
enjoy the normal client-side Backbone experience.

### Tested with

- documentcloud underscore 1.1.4
- documentcloud backbone 0.3.3
- tmpvar jsdom 0.1.20
- tautologistics node-htmlparser v1.7.3
- mikeal request v1.2.0
- coolaj86 node-jquery v1.4.4
- visionmedia express 1.0.0
- developmentseed handlebars.js

### Summary of overrides/conventions

- `Backbone.Controller` provides a Connect middleware for serving Controller
  routes server-side.
- `Backbone.Controller` passes an additional `response` argument to all route
  callbacks for sending an HTTP response server-side.
- `Backbone.View` splits the typical template and initiate JS behaviors
  between the `render()` and new `attach()` methods allowing client-specific
  JS behaviors to be ignored by server-side code.
- `Backbone.View` provides a convenience `template()` method for sharing
  `handlebars.js` templates between client-side and server-side code.
- `Backbone.View` provides a convenience `html()` method for rendering a View
  to string (server-side).
- Optional cookie confirmation-based CSRF protection.

### Usage

    var express = require('express'),
        server = express.createServer(),
        Bones = require('bones').Bones(server, {}),
        mvc = require('mvc'); // Your models, views, controllers.

    // Adds routes for Router controller.
    new mvc.Router();

    // Start server.
    server.listen(9999);

To enable CSRF protection, pass `secret: [your key]` in the options object.
You must use the Connect `session` middleware prior to passing Bones your
Express server:

    var express = require('express'),
        server = express.createServer(),
        secret = 'MySecretKey';

    // Typical middleware for using sessions.
    ui_server.use(express.bodyDecoder());
    ui_server.use(express.cookieDecoder());
    ui_server.use(express.session({
        secret: secret,
        store: new express.session.MemoryStore({ reapInterval: -1 })
    }));

    // Pass secret key to Bones.
    var Bones = require('bones').Bones(server, { secret: secret }),

See `examples` for a simple example of Bones usage.

### Authors

- [Will White](http://github.com/willwhite)
- [Young Hahn](http://github.com/yhahn)

