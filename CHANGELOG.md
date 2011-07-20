
## Bones 2.x.x

- Upgraded to backbone.js 0.5.1. Most important changes affecting Bones applications:
 - `Backbone.Controller` is now `Backbone.Router`
 - `Backbone.sync(model, method, success, error)` changed to `Backbone.sync(model, method, options)`
- Removed hashbang support (this may be temporarily).
- Removed 'attach' mechanism, use *.server.bones style overrides instead #18

## Bones 1.3.11
