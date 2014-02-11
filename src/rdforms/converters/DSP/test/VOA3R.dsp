<?xml version="1.0" ?>
<DescriptionSetTemplate xmlns="http://dublincore.org/xml/dc-dsp/2008/01/14"
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
xsi:schemaLocation="http://dublincore.org/xml/dc-dsp/2008/01/14 dcmi-dsp.xsd"
>

  <DescriptionTemplate ID="AgResResource" minOccurs="1" maxOccurs="1" standalone="yes">

    <StatementTemplate minOccurs="1" type="literal">
      <Property>http://purl.org/dc/terms/title</Property>      
      <LiteralConstraint>
        <LanguageOccurrence>mandatory</LanguageOccurrence>
      </LiteralConstraint>
    </StatementTemplate>

    <StatementTemplate minOccurs="0" type="literal">
      <Property>http://purl.org/dc/terms/alternative</Property>      
      <LiteralConstraint>
        <LanguageOccurrence>mandatory</LanguageOccurrence>
      </LiteralConstraint>      
    </StatementTemplate>

    <StatementTemplate minOccurs="0" type='nonliteral'>
      <Property>http://purl.org/dc/terms/creator</Property>
      <NonLiteralConstraint descriptionTemplateRef="agent">
        <ValueURIOccurrence>disallowed</ValueURIOccurrence>
        <VocabularyEncodingSchemeOccurrence>disallowed</VocabularyEncodingSchemeOccurrence>
        <ValueStringConstraint maxOccurs="0"/>
      </NonLiteralConstraint>            
    </StatementTemplate>

    <StatementTemplate minOccurs="0" type='nonliteral'>
      <SubPropertyOf>http://purl.org/dc/terms/contributor</SubPropertyOf>
      <NonLiteralConstraint descriptionTemplateRef="agent">
        <ValueURIOccurrence>disallowed</ValueURIOccurrence>
        <VocabularyEncodingSchemeOccurrence>disallowed</VocabularyEncodingSchemeOccurrence>
        <ValueStringConstraint maxOccurs="0"/>
      </NonLiteralConstraint>            
    </StatementTemplate>


    <StatementTemplate minOccurs="0" type='nonliteral'>
      <Property>http://purl.org/dc/terms/publisher</Property>
      <NonLiteralConstraint descriptionTemplateRef="agent">
        <ValueURIOccurrence>disallowed</ValueURIOccurrence>
        <VocabularyEncodingSchemeOccurrence>disallowed</VocabularyEncodingSchemeOccurrence>
        <ValueStringConstraint maxOccurs="0"/>
      </NonLiteralConstraint>            
    </StatementTemplate>

    <StatementTemplate minOccurs="1" maxOccurs="1" type="literal">
      <Property>http://purl.org/dc/terms/date</Property>      
      <LiteralConstraint>
        <SyntaxEncodingScheme>http://purl.org/dc/terms/W3CDTF</SyntaxEncodingScheme>
      </LiteralConstraint>      
    </StatementTemplate>

    <StatementTemplate minOccurs="1" type="nonliteral">
      <Property>http://purl.org/dc/terms/language</Property>      
      <NonLiteralConstraint>
        <VocabularyEncodingScheme>http://purl.org/dc/terms/ISO639-2</VocabularyEncodingScheme>
        <VocabularyEncodingScheme>http://purl.org/dc/terms/ISO639-3</VocabularyEncodingScheme>
        <ValueStringConstraint minOccurs="1" maxOccurs="1"/>
      </NonLiteralConstraint>
    </StatementTemplate>

    <StatementTemplate minOccurs="0" type="nonliteral">
      <Property>http://purl.org/dc/terms/identifier</Property>      
      <NonLiteralConstraint>
        <ValueStringConstraint minOccurs="0" maxOccurs="1">
          <SyntaxEncodingScheme>http://voa3r.eu/terms/EncodedSchema</SyntaxEncodingScheme>
        </ValueStringConstraint>
      </NonLiteralConstraint>
    </StatementTemplate>

    <StatementTemplate minOccurs="0" maxOccurs="1" type="nonliteral">
      <Property>http://purl.org/dc/terms/format</Property>      
      <NonLiteralConstraint>
        <VocabularyEncodingScheme>http://purl.org/dc/terms/IMT</VocabularyEncodingScheme>
        <ValueStringConstraint minOccurs="1" maxOccurs="1"/>
      </NonLiteralConstraint>
    </StatementTemplate>

    <StatementTemplate minOccurs="0" maxOccurs="1" type="nonliteral">
      <Property>http://www.europeana.eu/schemas/ese/isShownBy</Property>      
      <NonLiteralConstraint>
        <VocabularyEncodingSchemeOccurrence>disallowed</VocabularyEncodingSchemeOccurrence>
        <ValueStringConstraint maxOccurs="0"/>
      </NonLiteralConstraint>
    </StatementTemplate>

    <StatementTemplate minOccurs="0" maxOccurs="1" type="nonliteral">
      <Property>http://www.europeana.eu/schemas/ese/isShownAt</Property>      
      <NonLiteralConstraint>
        <VocabularyEncodingSchemeOccurrence>disallowed</VocabularyEncodingSchemeOccurrence>
        <ValueStringConstraint maxOccurs="0"/>
      </NonLiteralConstraint>
    </StatementTemplate>

    <StatementTemplate minOccurs="0" type="nonliteral">
      <Property>http://purl.org/dc/terms/subject</Property>      
      <NonLiteralConstraint>
        <ValueStringConstraint minOccurs="0" maxOccurs="1">
          <SyntaxEncodingScheme>http://voa3r.eu/terms/EncodedSchema</SyntaxEncodingScheme>
        </ValueStringConstraint>
      </NonLiteralConstraint>
    </StatementTemplate>

    <StatementTemplate minOccurs="0" type="literal">
      <Property>http://purl.org/dc/terms/description</Property>
      <LiteralConstraint>
        <LanguageOccurrence>mandatory</LanguageOccurrence>
      </LiteralConstraint>   
    </StatementTemplate>

    <StatementTemplate minOccurs="0" type="literal">
      <Property>http://purl.org/dc/terms/abstract</Property>      
      <LiteralConstraint>
        <LanguageOccurrence>mandatory</LanguageOccurrence>
      </LiteralConstraint>   
    </StatementTemplate>

    <StatementTemplate minOccurs="0" type="nonliteral">
      <Property>http://purl.org/dc/terms/bibliographicCitation</Property>      
      <NonLiteralConstraint>
        <ValueURIOccurrence>disallowed</ValueURIOccurrence>
        <VocabularyEncodingScheme>http://www.openurl.info/registry/</VocabularyEncodingScheme>
        <ValueStringConstraint minOccurs="1" maxOccurs="1">
          <SyntaxEncodingScheme>http://voa3r.eu/terms/EncodedSchema</SyntaxEncodingScheme>
        </ValueStringConstraint>
      </NonLiteralConstraint>
    </StatementTemplate>

    <StatementTemplate minOccurs="0" type="nonliteral">
      <Property>http://purl.org/dc/terms/type</Property>      
      <NonLiteralConstraint>
        <VocabularyEncodingScheme>http://voa3r.eu/terms/ResourceType</VocabularyEncodingScheme>
        <ValueStringConstraint minOccurs="1" maxOccurs="1"/>
      </NonLiteralConstraint>
    </StatementTemplate>

    <StatementTemplate minOccurs="0" type="literal">
      <Property>http://purl.org/dc/terms/rights</Property>      
    </StatementTemplate>

    <StatementTemplate minOccurs="0" type="nonliteral">
      <Property>http://purl.org/dc/terms/accessRights</Property>
      <NonLiteralConstraint>
        <VocabularyEncodingScheme>http://purl.org/eprint/accessRights/</VocabularyEncodingScheme>
      </NonLiteralConstraint>
    </StatementTemplate>

    <StatementTemplate minOccurs="0" type="literal">
      <Property>http://purl.org/dc/terms/license</Property>      
    </StatementTemplate>

    <StatementTemplate minOccurs="0" type="nonliteral">
      <Property>http://voa3r.eu/terms/reviewStatus</Property>
      <NonLiteralConstraint>
        <VocabularyEncodingScheme>http://voa3r.eu/terms/ReviewStatus</VocabularyEncodingScheme>
        <ValueStringConstraint minOccurs="1" maxOccurs="1"/>
      </NonLiteralConstraint>
    </StatementTemplate>

    <StatementTemplate minOccurs="0" type="nonliteral">
      <Property>http://voa3r.eu/terms/publicationStatus</Property>
      <NonLiteralConstraint>
        <VocabularyEncodingScheme>http://voa3r.eu/terms/PublicationStatus</VocabularyEncodingScheme>
        <ValueStringConstraint minOccurs="1" maxOccurs="1"/>
      </NonLiteralConstraint>
    </StatementTemplate>

    <StatementTemplate minOccurs="0" type="nonliteral">
      <Property>http://purl.org/dc/terms/relation</Property>      
    </StatementTemplate>

    <StatementTemplate minOccurs="0" type="nonliteral">
      <Property>http://purl.org/dc/terms/conformsTo</Property>      
    </StatementTemplate>

    <StatementTemplate minOccurs="0" type="nonliteral">
      <Property>http://purl.org/dc/terms/conformsTo</Property>      
    </StatementTemplate>

    <StatementTemplate minOccurs="0" type="nonliteral">
      <Property>http://purl.org/dc/terms/references</Property>      
    </StatementTemplate>

    <StatementTemplate minOccurs="0" type="nonliteral">
      <Property>http://purl.org/dc/terms/isReferencedBy</Property>      
    </StatementTemplate>

    <StatementTemplate minOccurs="0" type="nonliteral">
      <Property>http://purl.org/dc/terms/hasPart</Property>      
    </StatementTemplate>

    <StatementTemplate minOccurs="0" type="nonliteral">
      <Property>http://purl.org/dc/terms/isPartOf</Property>      
    </StatementTemplate>

    <StatementTemplate minOccurs="0" type="nonliteral">
      <Property>http://purl.org/dc/terms/hasVersion</Property>      
    </StatementTemplate>

    <StatementTemplate minOccurs="0" type="nonliteral">
      <Property>http://purl.org/dc/terms/isVersionOf</Property>      
    </StatementTemplate>

    <StatementTemplate minOccurs="0" type="nonliteral">
      <Property>http://voa3r.eu/terms/hasTranslation</Property>      
    </StatementTemplate>

    <StatementTemplate minOccurs="0" type="nonliteral">
      <Property>http://voa3r.eu/terms/isTranslationOf</Property>      
    </StatementTemplate>

    <StatementTemplate minOccurs="0" type="nonliteral">
      <Property>http://voa3r.eu/terms/hasMetametadata</Property>
      <NonLiteralConstraint descriptionTemplateRef="metametadata">
        <VocabularyEncodingSchemeOccurrence>disallowed</VocabularyEncodingSchemeOccurrence>
        <ValueStringConstraint maxOccurs="0"/>
      </NonLiteralConstraint>                    
    </StatementTemplate>

    <StatementTemplate minOccurs="0" type="nonliteral">
      <Property>http://voa3r.eu/terms/hasResearch</Property>
      <NonLiteralConstraint descriptionTemplateRef="research">
        <VocabularyEncodingSchemeOccurrence>disallowed</VocabularyEncodingSchemeOccurrence>
        <ValueStringConstraint maxOccurs="0"/>
      </NonLiteralConstraint>                    
    </StatementTemplate>

  </DescriptionTemplate>

  <DescriptionTemplate ID="agent" standalone="no">

    <ResourceClass>http://xmlns.com/foaf/0.1/Agent</ResourceClass>

    <StatementTemplate minOccurs="0"  type="literal">
      <Property>http://xmlns.com/foaf/0.1/name</Property>
    </StatementTemplate>

    <StatementTemplate minOccurs="0"  type="literal">
      <Property>http://xmlns.com/foaf/0.1/givenName</Property>
    </StatementTemplate>

    <StatementTemplate minOccurs="0" type="literal">
      <Property>http://xmlns.com/foaf/0.1/familyName</Property>
    </StatementTemplate>

    <StatementTemplate minOccurs="0"  type="literal">
      <Property>http://xmlns.com/foaf/0.1/firstName</Property>
    </StatementTemplate>

    <StatementTemplate minOccurs="0"  type="literal">
      <Property>http://xmlns.com/foaf/0.1/lastName</Property>
    </StatementTemplate>

    <StatementTemplate minOccurs="0"  type="nonliteral">
      <Property>http://xmlns.com/foaf/0.1/mbox</Property>
      <NonLiteralConstraint>
        <ValueURIOccurrence>mandatory</ValueURIOccurrence>
      </NonLiteralConstraint>
    </StatementTemplate>

  </DescriptionTemplate>

  <DescriptionTemplate ID="metametadata" standalone="no">

    <StatementTemplate minOccurs="0" type="nonliteral">
      <Property>http://purl.org/dc/terms/identifier</Property>      
    </StatementTemplate>    

    <StatementTemplate minOccurs="1" type="nonliteral">
      <Property>http://purl.org/dc/terms/type</Property>      
    </StatementTemplate>


    <StatementTemplate minOccurs="0" type="nonliteral">
      <Property>http://purl.org/dc/terms/language</Property>      
      <NonLiteralConstraint>
        <VocabularyEncodingScheme>http://purl.org/dc/terms/ISO639-2</VocabularyEncodingScheme>
        <VocabularyEncodingScheme>http://purl.org/dc/terms/ISO639-3</VocabularyEncodingScheme>
        <ValueStringConstraint minOccurs="1" maxOccurs="1"/>
      </NonLiteralConstraint>
    </StatementTemplate>


    <StatementTemplate minOccurs="1" maxOccurs="1" type="literal">
      <Property>http://purl.org/dc/terms/date</Property>      
      <LiteralConstraint>
        <SyntaxEncodingScheme>http://purl.org/dc/terms/W3CDTF</SyntaxEncodingScheme>
      </LiteralConstraint>      
    </StatementTemplate>


    <StatementTemplate minOccurs="0" type='nonliteral'>
      <SubPropertyOf>http://purl.org/dc/terms/contributor</SubPropertyOf>
      <NonLiteralConstraint descriptionTemplateRef="agent">
        <ValueURIOccurrence>disallowed</ValueURIOccurrence>
        <VocabularyEncodingSchemeOccurrence>disallowed</VocabularyEncodingSchemeOccurrence>
        <ValueStringConstraint maxOccurs="0"/>
      </NonLiteralConstraint>            
    </StatementTemplate>

  </DescriptionTemplate>

  <DescriptionTemplate ID="research" standalone="no">

    <StatementTemplate minOccurs="0" type="nonliteral">
      <Property>http://voa3r.eu/terms/objectOfInterest</Property>      
    </StatementTemplate>

    <StatementTemplate minOccurs="0" type="nonliteral">
      <Property>http://voa3r.eu/terms/measuresVariable</Property>      
    </StatementTemplate>

    <StatementTemplate minOccurs="0" type="nonliteral">
      <Property>http://voa3r.eu/terms/usesMethod</Property>      
    </StatementTemplate>

    <StatementTemplate minOccurs="0" type="nonliteral">
      <Property>http://voa3r.eu/terms/usesProtocol</Property>      
    </StatementTemplate>

    <StatementTemplate minOccurs="0" type="nonliteral">
      <Property>http://voa3r.eu/terms/usesInstrument</Property>      
    </StatementTemplate>

    <StatementTemplate minOccurs="0" type="nonliteral">
      <Property>http://voa3r.eu/terms/usesTechnique</Property>      
    </StatementTemplate>


  </DescriptionTemplate>

</DescriptionSetTemplate>
