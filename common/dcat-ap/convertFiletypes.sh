#! /bin/bash

echo "Downloads the Filetypes vocabulary (http://publications.europa.eu/mdr/resource/authority/file-type/skos/filetypes-skos.rdf) and converts it from SKOS format to choices."

wget -O filetypesSKOS.rdf http://publications.europa.eu/mdr/resource/authority/file-type/skos/filetypes-skos.rdf
cd ../../converters/vocab
# This is the actual transform from SKOS to Choices as specified via the config file.
./skosGenerate ../../common/dcat-ap/filetypesConfig

