#! /bin/bash

echo "Converts Eurovoc from SKOS to choices, relying on a eurovoc_skos.rdf file being present."

cd ../../converters/vocab
# This is the actual transform from SKOS to Choices as specified via the config file.
./skosGenerate ../../common/dcat-ap/eurovocConfig

