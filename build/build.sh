#!/bin/sh

cd ../lib/dojo-src/util/buildscripts/

./build.sh profileFile=../../../../build/rforms.profile.js action=clean,release version=rforms1.0 releaseName=target localeList=en,en-us,de,el,es,et,hu,no-nb,pt,ro,ru,sv releaseDir=../../../../ cssOptimize=comments.keepLines
