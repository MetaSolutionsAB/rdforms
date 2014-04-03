#!/usr/bin/env bash

(
cd ../lib/dojo-src
NODE_PATH=$(which node)
if [ -x "$NODE_PATH" ] ; then
    node dojo/dojo.js load=build --profile ../../build/rdforms.profile.js --release
else
    nodejs dojo/dojo.js load=build --profile ./../build/rdforms.profile.js --release
fi
)