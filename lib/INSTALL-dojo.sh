#!/bin/sh

mkdir tmp
cd tmp
# http://download.dojotoolkit.org/release-1.6.1/dojo-release-1.6.1-src.tar.gz
echo "Fetching dojo from: http://download.dojotoolkit.org/release-1.6.1/dojo-release-1.6.1-src.tar.gz"
wget http://download.dojotoolkit.org/release-1.6.1/dojo-release-1.6.1-src.tar.gz
echo "Unpacking dojo"
tar xfz dojo-release-1.6.1-src.tar.gz
rm -rf ../dojo-src
mv dojo-release-1.6.1-src ../dojo-src
cd ..
rm -rf tmp
cd dojo-src/util/buildscripts/
chmod 755 build.sh
echo "Building an appropriate release of dojo including debug options."
./build.sh profile=standard action=release releaseDir=../../../