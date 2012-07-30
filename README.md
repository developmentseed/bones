# Bones

Bones provides conventions for [Backbone](http://documentcloud.github.com/backbone/) applications. It allows most code to be shared on the server and the client. Bones exposes your Backbone routes as regular paths on the server so they can be accessed by non-JavaScript agents, while capable clients can enjoy the normal client-side Backbone experience.

## Getting started

The [wiki](https://github.com/developmentseed/bones/wiki) contains more information
on [**Getting Started**](https://github.com/developmentseed/bones/wiki/Getting-Started)
and on the [concepts](https://github.com/developmentseed/bones/wiki/Plugin-Architecture) in Bones.

## Example Application

* The [simple app example](https://github.com/developmentseed/bones/tree/master/examples/simple) is
  a good quickstart to making a bones application.

## Testing

To run the test suite, install [mocha](http://visionmedia.github.com/mocha/) and type `npm test`.

Code coverages tests require [jscoverage](https://github.com/visionmedia/node-jscoverage). To generate a report run `npm run-script coverage`.

## License

Bones is [BSD licensed](https://github.com/developmentseed/bones/raw/master/LICENSE).
