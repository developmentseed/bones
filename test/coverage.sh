#!/usr/bin/env sh

cd ..
mkdir -p coverage/node_modules
rm -rf coverage/node_modules/bones
jscoverage --no-instrument=test \
           --no-instrument=node_modules \
           --no-instrument=assets \
           --no-instrument=client \
           --exclude=examples \
           bones \
           coverage/node_modules/bones
cd coverage/node_modules/bones
expresso
