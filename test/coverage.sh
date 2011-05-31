#!/usr/bin/env sh

cd ..
rm -rf coverage/node_modules
mkdir -p coverage/node_modules
jscoverage --no-instrument=test \
           --no-instrument=node_modules \
           --no-instrument=assets \
           --no-instrument=client \
           --no-instrument=server/command.prefix.js \
           --no-instrument=server/command.suffix.js \
           --no-instrument=server/controller.prefix.js \
           --no-instrument=server/controller.suffix.js \
           --no-instrument=server/model.prefix.js \
           --no-instrument=server/model.suffix.js \
           --no-instrument=server/server.prefix.js \
           --no-instrument=server/server.suffix.js \
           --no-instrument=server/view.prefix.js \
           --no-instrument=server/view.suffix.js \
           --exclude=examples \
           bones \
           coverage/node_modules/bones
cd coverage/node_modules/bones
expresso
