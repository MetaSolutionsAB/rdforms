#! /bin/bash

echo "Downloads the Frequency vocabulary (http://purl.org/cld/terms/Frequency) and converts it from SKOS format to choices."

# XSLT transform only to get rid of internal ENTITY declarations which the xmldom library cannot handle
cd ../../converters/XSLT/
wget http://dublincore.org/groups/collections/frequency/2013-06-26/freq.rdf
./expandEntities.sh freq.rdf freq.rdf
mv freq.rdf ../../common/dcat-ap/frequencySKOS.rdf
cd ../vocab/

# This is the actual transform from SKOS to Choices
./skosGenerate ../../common/dcat-ap/frequencySKOS.rdf ../../common/dcat-ap/frequencyChoices.json

