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

### Application layout

Bones expect you to organize your application in a certain way, and treats a few directories in special ways.

* `/commands` - extra command line commands
* `/controllers` - Bankbone controllers
* `/models` - Backbone models
* `/routers` - server only routes
* `/views` - Backbone views
* `/servers` - applications
* `/templates` - templates.

With the execption of `/templates/` these directories will be populated with `.bones` files. Bones automatically adds the normal boilerplate stuff you would otherwise need to add to files suffixed wth `.bones`. This has the additional benefit of not loading extra detection code to determine if the code is running on the server or client. Bones will simply add the right code.

* .bones files, camelizing
* create index.js file
* creating a server
  * register components with the server
* adding child modules (bones-document)
* creating new components (.extend) vs. augmenting existing (.augment)
* adding template engines (see bones/core/index.js)
  * server side vs. client side template compilation
