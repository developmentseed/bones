#!/usr/bin/env node
require('bones').load(__dirname);

if (!module.parent) {
    require('bones').start();
}
