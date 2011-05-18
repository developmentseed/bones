// Load application.
require('./');

process.env.NODE_ENV = 'test';
process.argv[2] = 'start';
module.exports = require('bones').start();
