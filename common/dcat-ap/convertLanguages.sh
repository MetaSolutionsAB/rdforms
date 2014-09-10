#! /bin/bash

echo "Downloads the Language vocabulary and converts it from SKOS format to choices."

wget -O languagesSKOS.rdf http://publications.europa.eu/mdr/resource/authority/language/skos/languages-skos.rdf
cd ../../converters/vocab
# This is the actual transform from SKOS to Choices as specified via the config file.
./skosGenerate ../../common/dcat-ap/languagesConfig

