#! /bin/bash

echo "Downloads the Frequency vocabulary (http://publications.europa.eu/mdr/resource/authority/file-type/skos/filetypes-skos.rdf) and converts it from SKOS format to choices."

wget -O filetypesSKOS.rdf http://publications.europa.eu/mdr/resource/authority/file-type/skos/filetypes-skos.rdf
cd ..
# This is the actual transform from SKOS to Choices as specified via the config file.
./skosGenerate test/filetypesConfig

