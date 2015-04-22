#!/usr/bin/env bash

echo "Building using requirejs."
../node_modules/requirejs/bin/r.js -o rconf.js

#echo "Generating an AMD free version using AMDClean."
#NODE_PATH=$(which node)
#if [ -x "$NODE_PATH" ] ; then
#    node amdclean.js
#else
#    nodejs amdclean.js
#fi
