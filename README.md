# Bones

Bones provides conventions for [Backbone](http://documentcloud.github.com/backbone/) applications. It allows most code to be shared on the server and the client. Bones exposes your Backbone controller routes as regular paths on the server so they can be accessed by non-JavaScript agents, while capable clients can enjoy the normal client-side Backbone experience.

## Getting started

The [wiki](https://github.com/developmentseed/bones/wiki) contains more information on [**Getting Started**](https://github.com/developmentseed/bones/wiki/Getting-Started) and on the [concepts](https://github.com/developmentseed/bones/wiki/Plugin-Architecture) in Bones.

## Testing

To run the test suite, type `npm test`. **Note**: bones has to be in a folder named `node_modules` for tests to work correctly.

This can be done like:

    ln -s `pwd` `pwd`/node_modules/bones

## License

Bones is [BSD licensed](https://github.com/developmentseed/bones/raw/master/LICENSE).

