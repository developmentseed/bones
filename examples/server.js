var fs = require('fs'),
    express = require('express'),

    // Create an Express server.
    server = express.createServer(),

    // Initialize Bones. Implements Backbone overrides, adds route for
    // `/bones.js` and any controller routes using the Express server.
    Bones = require('bones').Bones(server),

    // Models, Views, Controllers should be required *after* Bones is
    // required to ensure overrides are in place.
    mvc = require('./mvc');

// Read template and add it to Bones template cache. The template cache is
// accessible to client side code at `Bones.templates` by adding `/bones.js`
// to the client side scripts. This call is blocking as it occurs at server
// start time.
Bones.templates['index'] = fs.readFileSync(__dirname + '/index.hbs', 'utf8');

// Initialize our router.
new mvc.Router();

// Expose various scripts to the client for inclusion, e.g. `mvc.js`. Backbone,
// underscore and other shared server/client js may also be good candidates
// for serving with `staticProvider` or you may provide client-side copies
// instead.
server.use(express.staticProvider('.'));

// Start server.
// http://localhost:9999
// => 'Hello world'
server.listen(9999);

