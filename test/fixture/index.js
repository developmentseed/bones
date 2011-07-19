require('othermodule');
require('submodule');

// Explicit order
require('./views/Error');

require('bones').load(__dirname);

if (!module.parent) {
    require('bones').start();
}
