#!/usr/bin/env bash

(
rm -rf ../release
cd ../libs
NODE_PATH=$(which node)
if [ -x "$NODE_PATH" ] ; then
    node dojo/dojo.js load=build --profile ../build/rdforms.profile.js --release
else
    nodejs dojo/dojo.js load=build --profile ../build/rdforms.profile.js --release
fi
)

