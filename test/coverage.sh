#!/usr/bin/env sh

cd ..
rm -rf bones-cov
mkdir bones-cov
jscoverage --no-instrument=test \
           --no-instrument=node_modules \
           --no-instrument=assets \
           --no-instrument=client \
           --no-instrument=server/command.prefix.js \
           --no-instrument=server/command.suffix.js \
           --no-instrument=server/router.prefix.js \
           --no-instrument=server/router.suffix.js \
           --no-instrument=server/model.prefix.js \
           --no-instrument=server/model.suffix.js \
           --no-instrument=server/server.prefix.js \
           --no-instrument=server/server.suffix.js \
           --no-instrument=server/view.prefix.js \
           --no-instrument=server/view.suffix.js \
           --exclude=examples \
           bones \
           bones-cov
cd bones-cov

mocha -R html-cov > coverage.html

VIEWER=$(which open);
if [ -x $VIEWER ]; then
    $VIEWER coverage.html
fi
