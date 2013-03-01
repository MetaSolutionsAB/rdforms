#!/bin/sh

dojoversion="1.8.3";

dojodir="dojo-release-"$dojoversion"-src"
dojofile=$dojodir".tar.gz"
dojourl="http://download.dojotoolkit.org/release-"$dojoversion"/"$dojofile

mkdir tmp
cd tmp
echo "Fetching dojo from: "$dojourl
wget $dojourl
echo "Unpacking dojo"
tar xfz $dojofile
rm -rf ../dojo-src
mv $dojodir ../dojo-src
cd ..
rm -rf tmp
cd dojo-src/util/buildscripts/
chmod 755 build.sh
echo "Building an appropriate release of dojo including debug options."
./build.sh profile=standard action=release releaseDir=../../../