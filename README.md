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

## Getting started with Bones

* Install node v0.4.* and npm 1.*
* Create package.json file
* Add bones as a bundleDependency/clone repo for development

See https://github.com/developmentseed/skeleton for an example app that layout.

### Application layout

Bones expect you to organize your application in a certain way, and treats a few directories in special ways.

* `/commands` - extra command line commands
* `/controllers` - Bankbone controllers
* `/models` - Backbone models
* `/routers` - server only routes
* `/views` - Backbone views
* `/servers` - applications
* `/templates` - templates.

With the exception of `/templates/` these directories will be populated with `.bones` files. Bones automatically adds the normal boilerplate stuff you would otherwise need to add to files suffixed with `.bones`. This has the additional benefit of not loading extra detection code to determine if the code is running on the server or client. Bones will simply add the right code.

Files in each of these directories are expected to provide a single model|view|controller|template|etc... The file should be named a underscoreified version of the class name. A `blogPost` model should be defined in a `blog_post.bones` file. Bones with automatically transform all-lower-with-underscore style filesystem names to camelcase code.

### Creating an application

Bones won't load new files automatically, you need to tell Bones to do that. Create a server by adding a file to `/servers`, and then register your models|views|controllers|templates|etc... The example application has an example server in `/bones/example/simple/server/main.bones`.

Your application will need a entry point, an `index.js`. The example application again provides a good starting point here.

Note, the second line of the file will need to be changed so that bones isn't included as using a relative path. Your application's `index.js` should say:

  var plugin = module.exports = require('bones').plugin(__dirname);

## Extending bones

* adding child modules (bones-document)
* creating new components (.extend) vs. augmenting existing (.augment)
* adding template engines (see bones/core/index.js)
  * server side vs. client side template compilation
