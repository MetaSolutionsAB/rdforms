define({
 "auxilliary": [
  {
   "id": "dcterms:title",
   "property": "http://purl.org/dc/terms/title",
   "label": {
    "en": "Title"
   },
   "description": {
    "en": "A name given to the resource."
   },
   "type": "text",
   "nodetype": "LANGUAGE_LITERAL"
  },
  {
   "id": "dcterms:creator",
   "property": "http://purl.org/dc/terms/creator",
   "label": {
    "en": "Creator"
   },
   "description": {
    "en": "An entity primarily responsible for making the resource."
   },
   "constraints": {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/Agent"
   },
   "type": "choice",
   "nodetype": "RESOURCE"
  },
  {
   "id": "dcterms:subject",
   "property": "http://purl.org/dc/terms/subject",
   "label": {
    "en": "Subject"
   },
   "description": {
    "en": "The topic of the resource."
   },
   "type": "text",
   "nodetype": "LANGUAGE_LITERAL"
  },
  {
   "id": "dcterms:description",
   "property": "http://purl.org/dc/terms/description",
   "label": {
    "en": "Description"
   },
   "description": {
    "en": "An account of the resource."
   },
   "type": "text",
   "nodetype": "LANGUAGE_LITERAL"
  },
  {
   "id": "dcterms:publisher",
   "property": "http://purl.org/dc/terms/publisher",
   "label": {
    "en": "Publisher"
   },
   "description": {
    "en": "An entity responsible for making the resource available."
   },
   "constraints": {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/Agent"
   },
   "type": "choice",
   "nodetype": "RESOURCE"
  },
  {
   "id": "dcterms:contributor",
   "property": "http://purl.org/dc/terms/contributor",
   "label": {
    "en": "Contributor"
   },
   "description": {
    "en": "An entity responsible for making contributions to the resource."
   },
   "constraints": {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/Agent"
   },
   "type": "choice",
   "nodetype": "RESOURCE"
  },
  {
   "id": "dcterms:date",
   "property": "http://purl.org/dc/terms/date",
   "label": {
    "en": "Date"
   },
   "description": {
    "en": "A point or period of time associated with an event in the lifecycle of the resource."
   },
   "type": "text",
   "nodetype": "LANGUAGE_LITERAL"
  },
  {
   "id": "dcterms:type",
   "property": "http://purl.org/dc/terms/type",
   "label": {
    "en": "Type"
   },
   "description": {
    "en": "The nature or genre of the resource."
   },
   "constraints": {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.w3.org/2000/01/rdf-schema#Class"
   },
   "type": "group",
   "automatic": true,
   "content": []
  },
  {
   "id": "dcterms:format",
   "property": "http://purl.org/dc/terms/format",
   "label": {
    "en": "Format"
   },
   "description": {
    "en": "The file format, physical medium, or dimensions of the resource."
   },
   "constraints": {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/MediaTypeOrExtent"
   },
   "type": "group",
   "automatic": true,
   "content": []
  },
  {
   "id": "dcterms:identifier",
   "property": "http://purl.org/dc/terms/identifier",
   "label": {
    "en": "Identifier"
   },
   "description": {
    "en": "An unambiguous reference to the resource within a given context."
   },
   "type": "text",
   "nodetype": "LANGUAGE_LITERAL"
  },
  {
   "id": "dcterms:source",
   "property": "http://purl.org/dc/terms/source",
   "label": {
    "en": "Source"
   },
   "description": {
    "en": "A related resource from which the described resource is derived."
   },
   "type": "text",
   "nodetype": "LANGUAGE_LITERAL"
  },
  {
   "id": "dcterms:language",
   "property": "http://purl.org/dc/terms/language",
   "label": {
    "en": "Language"
   },
   "description": {
    "en": "A language of the resource."
   },
   "constraints": {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/LinguisticSystem"
   },
   "type": "group",
   "automatic": true,
   "content": []
  },
  {
   "id": "dcterms:relation",
   "property": "http://purl.org/dc/terms/relation",
   "label": {
    "en": "Relation"
   },
   "description": {
    "en": "A related resource."
   },
   "type": "text",
   "nodetype": "LANGUAGE_LITERAL"
  },
  {
   "id": "dcterms:coverage",
   "property": "http://purl.org/dc/terms/coverage",
   "label": {
    "en": "Coverage"
   },
   "description": {
    "en": "The spatial or temporal topic of the resource, the spatial applicability of the resource, or the jurisdiction under which the resource is relevant."
   },
   "constraints": {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/LocationPeriodOrJurisdiction"
   },
   "type": "group",
   "automatic": true,
   "content": []
  },
  {
   "id": "dcterms:rights",
   "property": "http://purl.org/dc/terms/rights",
   "label": {
    "en": "Rights"
   },
   "description": {
    "en": "Information about rights held in and over the resource."
   },
   "constraints": {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/RightsStatement"
   },
   "type": "group",
   "automatic": true,
   "content": []
  },
  {
   "id": "dcterms:audience",
   "property": "http://purl.org/dc/terms/audience",
   "label": {
    "en": "Audience"
   },
   "description": {
    "en": "A class of entity for whom the resource is intended or useful."
   },
   "constraints": {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/AgentClass"
   },
   "type": "group",
   "automatic": true,
   "content": []
  },
  {
   "id": "dcterms:alternative",
   "property": "http://purl.org/dc/terms/alternative",
   "label": {
    "en": "Alternative Title"
   },
   "description": {
    "en": "An alternative name for the resource."
   },
   "type": "text",
   "nodetype": "LANGUAGE_LITERAL"
  },
  {
   "id": "dcterms:tableOfContents",
   "property": "http://purl.org/dc/terms/tableOfContents",
   "label": {
    "en": "Table Of Contents"
   },
   "description": {
    "en": "A list of subunits of the resource."
   },
   "type": "text",
   "nodetype": "LANGUAGE_LITERAL"
  },
  {
   "id": "dcterms:abstract",
   "property": "http://purl.org/dc/terms/abstract",
   "label": {
    "en": "Abstract"
   },
   "description": {
    "en": "A summary of the resource."
   },
   "type": "text",
   "nodetype": "LANGUAGE_LITERAL"
  },
  {
   "id": "dcterms:created",
   "property": "http://purl.org/dc/terms/created",
   "label": {
    "en": "Date Created"
   },
   "description": {
    "en": "Date of creation of the resource."
   },
   "type": "text",
   "nodetype": "LANGUAGE_LITERAL"
  },
  {
   "id": "dcterms:valid",
   "property": "http://purl.org/dc/terms/valid",
   "label": {
    "en": "Date Valid"
   },
   "description": {
    "en": "Date (often a range) of validity of a resource."
   },
   "type": "text",
   "nodetype": "LANGUAGE_LITERAL"
  },
  {
   "id": "dcterms:available",
   "property": "http://purl.org/dc/terms/available",
   "label": {
    "en": "Date Available"
   },
   "description": {
    "en": "Date (often a range) that the resource became or will become available."
   },
   "type": "text",
   "nodetype": "LANGUAGE_LITERAL"
  },
  {
   "id": "dcterms:issued",
   "property": "http://purl.org/dc/terms/issued",
   "label": {
    "en": "Date Issued"
   },
   "description": {
    "en": "Date of formal issuance (e.g., publication) of the resource."
   },
   "type": "text",
   "nodetype": "LANGUAGE_LITERAL"
  },
  {
   "id": "dcterms:modified",
   "property": "http://purl.org/dc/terms/modified",
   "label": {
    "en": "Date Modified"
   },
   "description": {
    "en": "Date on which the resource was changed."
   },
   "type": "text",
   "nodetype": "LANGUAGE_LITERAL"
  },
  {
   "id": "dcterms:extent",
   "property": "http://purl.org/dc/terms/extent",
   "label": {
    "en": "Extent"
   },
   "description": {
    "en": "The size or duration of the resource."
   },
   "constraints": {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/SizeOrDuration"
   },
   "type": "group",
   "automatic": true,
   "content": []
  },
  {
   "id": "dcterms:medium",
   "property": "http://purl.org/dc/terms/medium",
   "label": {
    "en": "Medium"
   },
   "description": {
    "en": "The material or physical carrier of the resource."
   },
   "constraints": {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/PhysicalMedium"
   },
   "type": "group",
   "automatic": true,
   "content": []
  },
  {
   "id": "dcterms:isVersionOf",
   "property": "http://purl.org/dc/terms/isVersionOf",
   "label": {
    "en": "Is Version Of"
   },
   "description": {
    "en": "A related resource of which the described resource is a version, edition, or adaptation."
   },
   "type": "text",
   "nodetype": "LANGUAGE_LITERAL"
  },
  {
   "id": "dcterms:hasVersion",
   "property": "http://purl.org/dc/terms/hasVersion",
   "label": {
    "en": "Has Version"
   },
   "description": {
    "en": "A related resource that is a version, edition, or adaptation of the described resource."
   },
   "type": "text",
   "nodetype": "LANGUAGE_LITERAL"
  },
  {
   "id": "dcterms:isReplacedBy",
   "property": "http://purl.org/dc/terms/isReplacedBy",
   "label": {
    "en": "Is Replaced By"
   },
   "description": {
    "en": "A related resource that supplants, displaces, or supersedes the described resource."
   },
   "type": "text",
   "nodetype": "LANGUAGE_LITERAL"
  },
  {
   "id": "dcterms:replaces",
   "property": "http://purl.org/dc/terms/replaces",
   "label": {
    "en": "Replaces"
   },
   "description": {
    "en": "A related resource that is supplanted, displaced, or superseded by the described resource."
   },
   "type": "text",
   "nodetype": "LANGUAGE_LITERAL"
  },
  {
   "id": "dcterms:isRequiredBy",
   "property": "http://purl.org/dc/terms/isRequiredBy",
   "label": {
    "en": "Is Required By"
   },
   "description": {
    "en": "A related resource that requires the described resource to support its function, delivery, or coherence."
   },
   "type": "text",
   "nodetype": "LANGUAGE_LITERAL"
  },
  {
   "id": "dcterms:requires",
   "property": "http://purl.org/dc/terms/requires",
   "label": {
    "en": "Requires"
   },
   "description": {
    "en": "A related resource that is required by the described resource to support its function, delivery, or coherence."
   },
   "type": "text",
   "nodetype": "LANGUAGE_LITERAL"
  },
  {
   "id": "dcterms:isPartOf",
   "property": "http://purl.org/dc/terms/isPartOf",
   "label": {
    "en": "Is Part Of"
   },
   "description": {
    "en": "A related resource in which the described resource is physically or logically included."
   },
   "type": "text",
   "nodetype": "LANGUAGE_LITERAL"
  },
  {
   "id": "dcterms:hasPart",
   "property": "http://purl.org/dc/terms/hasPart",
   "label": {
    "en": "Has Part"
   },
   "description": {
    "en": "A related resource that is included either physically or logically in the described resource."
   },
   "type": "text",
   "nodetype": "LANGUAGE_LITERAL"
  },
  {
   "id": "dcterms:isReferencedBy",
   "property": "http://purl.org/dc/terms/isReferencedBy",
   "label": {
    "en": "Is Referenced By"
   },
   "description": {
    "en": "A related resource that references, cites, or otherwise points to the described resource."
   },
   "type": "text",
   "nodetype": "LANGUAGE_LITERAL"
  },
  {
   "id": "dcterms:references",
   "property": "http://purl.org/dc/terms/references",
   "label": {
    "en": "References"
   },
   "description": {
    "en": "A related resource that is referenced, cited, or otherwise pointed to by the described resource."
   },
   "type": "text",
   "nodetype": "LANGUAGE_LITERAL"
  },
  {
   "id": "dcterms:isFormatOf",
   "property": "http://purl.org/dc/terms/isFormatOf",
   "label": {
    "en": "Is Format Of"
   },
   "description": {
    "en": "A related resource that is substantially the same as the described resource, but in another format."
   },
   "type": "text",
   "nodetype": "LANGUAGE_LITERAL"
  },
  {
   "id": "dcterms:hasFormat",
   "property": "http://purl.org/dc/terms/hasFormat",
   "label": {
    "en": "Has Format"
   },
   "description": {
    "en": "A related resource that is substantially the same as the pre-existing described resource, but in another format."
   },
   "type": "text",
   "nodetype": "LANGUAGE_LITERAL"
  },
  {
   "id": "dcterms:conformsTo",
   "property": "http://purl.org/dc/terms/conformsTo",
   "label": {
    "en": "Conforms To"
   },
   "description": {
    "en": "An established standard to which the described resource conforms."
   },
   "constraints": {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/Standard"
   },
   "type": "group",
   "automatic": true,
   "content": []
  },
  {
   "id": "dcterms:spatial",
   "property": "http://purl.org/dc/terms/spatial",
   "label": {
    "en": "Spatial Coverage"
   },
   "description": {
    "en": "Spatial characteristics of the resource."
   },
   "constraints": {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/Location"
   },
   "type": "group",
   "automatic": true,
   "content": []
  },
  {
   "id": "dcterms:temporal",
   "property": "http://purl.org/dc/terms/temporal",
   "label": {
    "en": "Temporal Coverage"
   },
   "description": {
    "en": "Temporal characteristics of the resource."
   },
   "constraints": {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/PeriodOfTime"
   },
   "type": "group",
   "automatic": true,
   "content": []
  },
  {
   "id": "dcterms:mediator",
   "property": "http://purl.org/dc/terms/mediator",
   "label": {
    "en": "Mediator"
   },
   "description": {
    "en": "An entity that mediates access to the resource and for whom the resource is intended or useful."
   },
   "constraints": {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/AgentClass"
   },
   "type": "group",
   "automatic": true,
   "content": []
  },
  {
   "id": "dcterms:dateAccepted",
   "property": "http://purl.org/dc/terms/dateAccepted",
   "label": {
    "en": "Date Accepted"
   },
   "description": {
    "en": "Date of acceptance of the resource."
   },
   "type": "text",
   "nodetype": "LANGUAGE_LITERAL"
  },
  {
   "id": "dcterms:dateCopyrighted",
   "property": "http://purl.org/dc/terms/dateCopyrighted",
   "label": {
    "en": "Date Copyrighted"
   },
   "description": {
    "en": "Date of copyright."
   },
   "type": "text",
   "nodetype": "LANGUAGE_LITERAL"
  },
  {
   "id": "dcterms:dateSubmitted",
   "property": "http://purl.org/dc/terms/dateSubmitted",
   "label": {
    "en": "Date Submitted"
   },
   "description": {
    "en": "Date of submission of the resource."
   },
   "type": "text",
   "nodetype": "LANGUAGE_LITERAL"
  },
  {
   "id": "dcterms:educationLevel",
   "property": "http://purl.org/dc/terms/educationLevel",
   "label": {
    "en": "Audience Education Level"
   },
   "description": {
    "en": "A class of entity, defined in terms of progression through an educational or training context, for which the described resource is intended."
   },
   "constraints": {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/AgentClass"
   },
   "type": "group",
   "automatic": true,
   "content": []
  },
  {
   "id": "dcterms:accessRights",
   "property": "http://purl.org/dc/terms/accessRights",
   "label": {
    "en": "Access Rights"
   },
   "description": {
    "en": "Information about who can access the resource or an indication of its security status."
   },
   "constraints": {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/RightsStatement"
   },
   "type": "group",
   "automatic": true,
   "content": []
  },
  {
   "id": "dcterms:bibliographicCitation",
   "property": "http://purl.org/dc/terms/bibliographicCitation",
   "label": {
    "en": "Bibliographic Citation"
   },
   "description": {
    "en": "A bibliographic reference for the resource."
   },
   "type": "text",
   "nodetype": "LANGUAGE_LITERAL"
  },
  {
   "id": "dcterms:license",
   "property": "http://purl.org/dc/terms/license",
   "label": {
    "en": "License"
   },
   "description": {
    "en": "A legal document giving official permission to do something with the resource."
   },
   "constraints": {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/LicenseDocument"
   },
   "type": "group",
   "automatic": true,
   "content": []
  },
  {
   "id": "dcterms:rightsHolder",
   "property": "http://purl.org/dc/terms/rightsHolder",
   "label": {
    "en": "Rights Holder"
   },
   "description": {
    "en": "A person or organization owning or managing rights over the resource."
   },
   "constraints": {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/Agent"
   },
   "type": "choice",
   "nodetype": "RESOURCE"
  },
  {
   "id": "dcterms:provenance",
   "property": "http://purl.org/dc/terms/provenance",
   "label": {
    "en": "Provenance"
   },
   "description": {
    "en": "A statement of any changes in ownership and custody of the resource since its creation that are significant for its authenticity, integrity, and interpretation."
   },
   "constraints": {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/ProvenanceStatement"
   },
   "type": "group",
   "automatic": true,
   "content": []
  },
  {
   "id": "dcterms:instructionalMethod",
   "property": "http://purl.org/dc/terms/instructionalMethod",
   "label": {
    "en": "Instructional Method"
   },
   "description": {
    "en": "A process, used to engender knowledge, attitudes and skills, that the described resource is designed to support."
   },
   "constraints": {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/MethodOfInstruction"
   },
   "type": "group",
   "automatic": true,
   "content": []
  },
  {
   "id": "dcterms:accrualMethod",
   "property": "http://purl.org/dc/terms/accrualMethod",
   "label": {
    "en": "Accrual Method"
   },
   "description": {
    "en": "The method by which items are added to a collection."
   },
   "constraints": {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/MethodOfAccrual"
   },
   "type": "group",
   "automatic": true,
   "content": []
  },
  {
   "id": "dcterms:accrualPeriodicity",
   "property": "http://purl.org/dc/terms/accrualPeriodicity",
   "label": {
    "en": "Accrual Periodicity"
   },
   "description": {
    "en": "The frequency with which items are added to a collection."
   },
   "constraints": {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/Frequency"
   },
   "type": "group",
   "automatic": true,
   "content": []
  },
  {
   "id": "dcterms:accrualPolicy",
   "property": "http://purl.org/dc/terms/accrualPolicy",
   "label": {
    "en": "Accrual Policy"
   },
   "description": {
    "en": "The policy governing the addition of items to a collection."
   },
   "constraints": {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/Policy"
   },
   "type": "group",
   "automatic": true,
   "content": []
  },
  {
   "id": "http://purl.org/dc/elements/1.1/title",
   "property": "http://purl.org/dc/elements/1.1/title",
   "label": {
    "en": "title"
   },
   "type": "text",
   "nodetype": "LANGUAGE_LITERAL"
  },
  {
   "id": "http://purl.org/dc/elements/1.1/creator",
   "property": "http://purl.org/dc/elements/1.1/creator",
   "label": {
    "en": "creator"
   },
   "type": "text",
   "nodetype": "LANGUAGE_LITERAL"
  },
  {
   "id": "http://purl.org/dc/elements/1.1/subject",
   "property": "http://purl.org/dc/elements/1.1/subject",
   "label": {
    "en": "subject"
   },
   "type": "text",
   "nodetype": "LANGUAGE_LITERAL"
  },
  {
   "id": "http://purl.org/dc/elements/1.1/description",
   "property": "http://purl.org/dc/elements/1.1/description",
   "label": {
    "en": "description"
   },
   "type": "text",
   "nodetype": "LANGUAGE_LITERAL"
  },
  {
   "id": "http://purl.org/dc/elements/1.1/publisher",
   "property": "http://purl.org/dc/elements/1.1/publisher",
   "label": {
    "en": "publisher"
   },
   "type": "text",
   "nodetype": "LANGUAGE_LITERAL"
  },
  {
   "id": "http://purl.org/dc/elements/1.1/contributor",
   "property": "http://purl.org/dc/elements/1.1/contributor",
   "label": {
    "en": "contributor"
   },
   "type": "text",
   "nodetype": "LANGUAGE_LITERAL"
  },
  {
   "id": "http://purl.org/dc/elements/1.1/date",
   "property": "http://purl.org/dc/elements/1.1/date",
   "label": {
    "en": "date"
   },
   "type": "text",
   "nodetype": "LANGUAGE_LITERAL"
  },
  {
   "id": "http://purl.org/dc/elements/1.1/type",
   "property": "http://purl.org/dc/elements/1.1/type",
   "label": {
    "en": "type"
   },
   "type": "text",
   "nodetype": "LANGUAGE_LITERAL"
  },
  {
   "id": "http://purl.org/dc/elements/1.1/format",
   "property": "http://purl.org/dc/elements/1.1/format",
   "label": {
    "en": "format"
   },
   "type": "text",
   "nodetype": "LANGUAGE_LITERAL"
  },
  {
   "id": "http://purl.org/dc/elements/1.1/identifier",
   "property": "http://purl.org/dc/elements/1.1/identifier",
   "label": {
    "en": "identifier"
   },
   "type": "text",
   "nodetype": "LANGUAGE_LITERAL"
  },
  {
   "id": "http://purl.org/dc/elements/1.1/source",
   "property": "http://purl.org/dc/elements/1.1/source",
   "label": {
    "en": "source"
   },
   "type": "text",
   "nodetype": "LANGUAGE_LITERAL"
  },
  {
   "id": "http://purl.org/dc/elements/1.1/language",
   "property": "http://purl.org/dc/elements/1.1/language",
   "label": {
    "en": "language"
   },
   "type": "text",
   "nodetype": "LANGUAGE_LITERAL"
  },
  {
   "id": "http://purl.org/dc/elements/1.1/relation",
   "property": "http://purl.org/dc/elements/1.1/relation",
   "label": {
    "en": "relation"
   },
   "type": "text",
   "nodetype": "LANGUAGE_LITERAL"
  },
  {
   "id": "http://purl.org/dc/elements/1.1/coverage",
   "property": "http://purl.org/dc/elements/1.1/coverage",
   "label": {
    "en": "coverage"
   },
   "type": "text",
   "nodetype": "LANGUAGE_LITERAL"
  },
  {
   "id": "http://purl.org/dc/elements/1.1/rights",
   "property": "http://purl.org/dc/elements/1.1/rights",
   "label": {
    "en": "rights"
   },
   "type": "text",
   "nodetype": "LANGUAGE_LITERAL"
  },
  {
   "id": "dcterms:Agent",
   "label": {
    "en": "Agent"
   },
   "constraints": {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/Agent"
   },
   "description": {
    "en": "A resource that acts or has the power to act."
   },
   "type": "group",
   "content": []
  },
  {
   "id": "dcterms:AgentClass",
   "label": {
    "en": "Agent Class"
   },
   "constraints": {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/AgentClass"
   },
   "description": {
    "en": "A group of agents."
   },
   "type": "group",
   "content": []
  },
  {
   "id": "dcterms:BibliographicResource",
   "label": {
    "en": "Bibliographic Resource"
   },
   "constraints": {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/BibliographicResource"
   },
   "description": {
    "en": "A book, article, or other documentary resource."
   },
   "type": "group",
   "content": [
    {
     "id": "dcterms:bibliographicCitation"
    }
   ]
  },
  {
   "id": "dcterms:FileFormat",
   "label": {
    "en": "File Format"
   },
   "constraints": {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/FileFormat"
   },
   "description": {
    "en": "A digital resource format."
   },
   "type": "group",
   "content": []
  },
  {
   "id": "dcterms:Frequency",
   "label": {
    "en": "Frequency"
   },
   "constraints": {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/Frequency"
   },
   "description": {
    "en": "A rate at which something recurs."
   },
   "type": "group",
   "content": []
  },
  {
   "id": "dcterms:Jurisdiction",
   "label": {
    "en": "Jurisdiction"
   },
   "constraints": {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/Jurisdiction"
   },
   "description": {
    "en": "The extent or range of judicial, law enforcement, or other authority."
   },
   "type": "group",
   "content": []
  },
  {
   "id": "dcterms:LicenseDocument",
   "label": {
    "en": "License Document"
   },
   "constraints": {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/LicenseDocument"
   },
   "description": {
    "en": "A legal document giving official permission to do something with a Resource."
   },
   "type": "group",
   "content": []
  },
  {
   "id": "dcterms:LinguisticSystem",
   "label": {
    "en": "Linguistic System"
   },
   "constraints": {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/LinguisticSystem"
   },
   "description": {
    "en": "A system of signs, symbols, sounds, gestures, or rules used in communication."
   },
   "type": "group",
   "content": []
  },
  {
   "id": "dcterms:Location",
   "label": {
    "en": "Location"
   },
   "constraints": {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/Location"
   },
   "description": {
    "en": "A spatial region or named place."
   },
   "type": "group",
   "content": []
  },
  {
   "id": "dcterms:LocationPeriodOrJurisdiction",
   "label": {
    "en": "Location, Period, or Jurisdiction"
   },
   "constraints": {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/LocationPeriodOrJurisdiction"
   },
   "description": {
    "en": "A location, period of time, or jurisdiction."
   },
   "type": "group",
   "content": []
  },
  {
   "id": "dcterms:MediaType",
   "label": {
    "en": "Media Type"
   },
   "constraints": {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/MediaType"
   },
   "description": {
    "en": "A file format or physical medium."
   },
   "type": "group",
   "content": []
  },
  {
   "id": "dcterms:MediaTypeOrExtent",
   "label": {
    "en": "Media Type or Extent"
   },
   "constraints": {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/MediaTypeOrExtent"
   },
   "description": {
    "en": "A media type or extent."
   },
   "type": "group",
   "content": []
  },
  {
   "id": "dcterms:MethodOfInstruction",
   "label": {
    "en": "Method of Instruction"
   },
   "constraints": {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/MethodOfInstruction"
   },
   "description": {
    "en": "A process that is used to engender knowledge, attitudes, and skills."
   },
   "type": "group",
   "content": []
  },
  {
   "id": "dcterms:MethodOfAccrual",
   "label": {
    "en": "Method of Accrual"
   },
   "constraints": {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/MethodOfAccrual"
   },
   "description": {
    "en": "A method by which resources are added to a collection."
   },
   "type": "group",
   "content": []
  },
  {
   "id": "dcterms:PeriodOfTime",
   "label": {
    "en": "Period of Time"
   },
   "constraints": {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/PeriodOfTime"
   },
   "description": {
    "en": "An interval of time that is named or defined by its start and end dates."
   },
   "type": "group",
   "content": []
  },
  {
   "id": "dcterms:PhysicalMedium",
   "label": {
    "en": "Physical Medium"
   },
   "constraints": {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/PhysicalMedium"
   },
   "description": {
    "en": "A physical material or carrier."
   },
   "type": "group",
   "content": []
  },
  {
   "id": "dcterms:PhysicalResource",
   "label": {
    "en": "Physical Resource"
   },
   "constraints": {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/PhysicalResource"
   },
   "description": {
    "en": "A material thing."
   },
   "type": "group",
   "content": [
    {
     "id": "dcterms:medium"
    }
   ]
  },
  {
   "id": "dcterms:Policy",
   "label": {
    "en": "Policy"
   },
   "constraints": {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/Policy"
   },
   "description": {
    "en": "A plan or course of action by an authority, intended to influence and determine decisions, actions, and other matters."
   },
   "type": "group",
   "content": []
  },
  {
   "id": "dcterms:ProvenanceStatement",
   "label": {
    "en": "Provenance Statement"
   },
   "constraints": {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/ProvenanceStatement"
   },
   "description": {
    "en": "A statement of any changes in ownership and custody of a resource since its creation that are significant for its authenticity, integrity, and interpretation."
   },
   "type": "group",
   "content": []
  },
  {
   "id": "dcterms:RightsStatement",
   "label": {
    "en": "Rights Statement"
   },
   "constraints": {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/RightsStatement"
   },
   "description": {
    "en": "A statement about the intellectual property rights (IPR) held in or over a Resource, a legal document giving official permission to do something with a resource, or a statement about access rights."
   },
   "type": "group",
   "content": []
  },
  {
   "id": "dcterms:SizeOrDuration",
   "label": {
    "en": "Size or Duration"
   },
   "constraints": {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/SizeOrDuration"
   },
   "description": {
    "en": "A dimension or extent, or a time taken to play or execute."
   },
   "type": "group",
   "content": []
  },
  {
   "id": "dcterms:Standard",
   "label": {
    "en": "Standard"
   },
   "constraints": {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/Standard"
   },
   "description": {
    "en": "A basis for comparison; a reference point against which other things can be evaluated."
   },
   "type": "group",
   "content": []
  },
  {
   "id": "http://www.w3.org/2000/01/rdf-schema#Class",
   "label": {
    "en": "rdf-schema#Class"
   },
   "constraints": {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.w3.org/2000/01/rdf-schema#Class"
   },
   "type": "group",
   "content": []
  }
 ],
 "scope": "dcterms",
 "namespace": "http://purl.org/dc/terms/"
});