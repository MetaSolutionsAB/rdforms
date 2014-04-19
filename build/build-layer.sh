#!/usr/bin/env bash

(
cd ../libs
NODE_PATH=$(which node)
if [ -x "$NODE_PATH" ] ; then
    node dojo/dojo.js load=build --profile ../build/rdforms-layer.profile.js --release
else
    nodejs dojo/dojo.js load=build --profile ../build/rdforms-layer.profile.js --release
fi
)