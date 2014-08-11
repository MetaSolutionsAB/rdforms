#! /bin/bash

echo "Downloads the Nobel filetype vocabulary and convert it from SKOS format to choices."

wget --header='Accept:application/rdf+xml' -O nobelFiletypesRDFS.rdf http://data.nobelprize.org/all/filetype
cd ..

# This is the actual transform from RDFS to Choices as specified via the config file.
./rdfsGenerate test/nobelFiletypesRDFS.rdf test/nobelFiletypesChoices.json http://data.nobelprize.org/terms/FileType

