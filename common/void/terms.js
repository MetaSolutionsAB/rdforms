define({
 "templates": [
  {
   "id": "void:feature",
   "property": "http://rdfs.org/ns/void#feature",
   "label": {
    "en": "feature"
   },
   "constraints": {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://rdfs.org/ns/void#TechnicalFeature"
   },
   "type": "group",
   "automatic": true,
   "content": []
  },
  {
   "id": "void:subset",
   "property": "http://rdfs.org/ns/void#subset",
   "label": {
    "en": "has subset"
   },
   "constraints": {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://rdfs.org/ns/void#Dataset"
   },
   "type": "choice",
   "nodetype": "RESOURCE",
   "cardinality": {
    "pref": 1
   }
  },
  {
   "id": "void:target",
   "property": "http://rdfs.org/ns/void#target",
   "label": {
    "en": "Target"
   },
   "description": {
    "en": "One of the two datasets linked by the Linkset."
   },
   "constraints": {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://rdfs.org/ns/void#Dataset"
   },
   "type": "choice",
   "nodetype": "RESOURCE",
   "cardinality": {
    "pref": 1
   }
  },
  {
   "id": "void:sparqlEndpoint",
   "property": "http://rdfs.org/ns/void#sparqlEndpoint",
   "label": {
    "en": "has a SPARQL endpoint at"
   },
   "type": "text",
   "nodetype": "URI",
   "cardinality": {
    "pref": 1
   }
  },
  {
   "id": "void:linkPredicate",
   "property": "http://rdfs.org/ns/void#linkPredicate",
   "label": {
    "en": "a link predicate"
   },
   "type": "text",
   "nodetype": "URI",
   "cardinality": {
    "pref": 1
   }
  },
  {
   "id": "void:exampleResource",
   "property": "http://rdfs.org/ns/void#exampleResource",
   "label": {
    "en": "example resource of dataset"
   },
   "type": "text",
   "nodetype": "URI",
   "cardinality": {
    "pref": 1
   }
  },
  {
   "id": "void:vocabulary",
   "property": "http://rdfs.org/ns/void#vocabulary",
   "label": {
    "en": "vocabulary"
   },
   "description": {
    "en": "A vocabulary that is used in the dataset."
   },
   "type": "text",
   "nodetype": "URI",
   "cardinality": {
    "pref": 1
   }
  },
  {
   "id": "void:subjectsTarget",
   "property": "http://rdfs.org/ns/void#subjectsTarget",
   "label": {
    "en": "Subjects Target"
   },
   "description": {
    "en": "The dataset describing the subjects of triples contained in the Linkset."
   },
   "constraints": {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://rdfs.org/ns/void#Dataset"
   },
   "type": "choice",
   "nodetype": "RESOURCE",
   "cardinality": {
    "pref": 1
   }
  },
  {
   "id": "void:objectsTarget",
   "property": "http://rdfs.org/ns/void#objectsTarget",
   "label": {
    "en": "Objects Target"
   },
   "description": {
    "en": "The dataset describing the objects of the triples contained in the Linkset."
   },
   "constraints": {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://rdfs.org/ns/void#Dataset"
   },
   "type": "choice",
   "nodetype": "RESOURCE",
   "cardinality": {
    "pref": 1
   }
  },
  {
   "id": "void:dataDump",
   "property": "http://rdfs.org/ns/void#dataDump",
   "label": {
    "en": "Data Dump"
   },
   "description": {
    "en": "An RDF dump, partial or complete, of a void:Dataset."
   },
   "type": "text",
   "nodetype": "URI",
   "cardinality": {
    "pref": 1
   }
  },
  {
   "id": "void:uriLookupEndpoint",
   "property": "http://rdfs.org/ns/void#uriLookupEndpoint",
   "label": {
    "en": "has an URI look-up endpoint at"
   },
   "description": {
    "en": "Defines a simple URI look-up protocol for accessing a dataset."
   },
   "type": "text",
   "nodetype": "URI",
   "cardinality": {
    "pref": 1
   }
  },
  {
   "id": "void:uriRegexPattern",
   "property": "http://rdfs.org/ns/void#uriRegexPattern",
   "label": {
    "en": "has URI regular expression pattern"
   },
   "description": {
    "en": "Defines a regular expression pattern matching URIs in the dataset."
   },
   "type": "text",
   "nodetype": "LITERAL",
   "cardinality": {
    "pref": 1
   }
  },
  {
   "id": "void:class",
   "property": "http://rdfs.org/ns/void#class",
   "label": {
    "en": "class"
   },
   "description": {
    "en": "The rdfs:Class that is the rdf:type of all entities in a class-based partition."
   },
   "type": "text",
   "nodetype": "URI",
   "cardinality": {
    "pref": 1
   }
  },
  {
   "id": "void:classes",
   "property": "http://rdfs.org/ns/void#classes",
   "label": {
    "en": "classes"
   },
   "description": {
    "en": "The total number of distinct classes in a void:Dataset. In other words, the number of distinct resources occuring as objects of rdf:type triples in the dataset."
   },
   "type": "text",
   "nodetype": "DATATYPE_LITERAL",
   "datatype": "http://www.w3.org/2001/XMLSchema#integer",
   "cardinality": {
    "pref": 1
   }
  },
  {
   "id": "void:classPartition",
   "property": "http://rdfs.org/ns/void#classPartition",
   "label": {
    "en": "class partition"
   },
   "description": {
    "en": "A subset of a void:Dataset that contains only the entities of a certain rdfs:Class."
   },
   "constraints": {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://rdfs.org/ns/void#Dataset"
   },
   "type": "group",
   "automatic": true,
   "content": [
    {
     "id": "void:feature"
    },
    {
     "id": "void:subset"
    },
    {
     "id": "void:sparqlEndpoint"
    },
    {
     "id": "void:exampleResource"
    },
    {
     "id": "void:vocabulary"
    },
    {
     "id": "void:dataDump"
    },
    {
     "id": "void:uriLookupEndpoint"
    },
    {
     "id": "void:uriRegexPattern"
    },
    {
     "id": "void:class"
    },
    {
     "id": "void:classes"
    },
    {
     "id": "void:classPartition"
    },
    {
     "id": "void:distinctObjects"
    },
    {
     "id": "void:distinctSubjects"
    },
    {
     "id": "void:documents"
    },
    {
     "id": "void:entities"
    },
    {
     "id": "void:openSearchDescription"
    },
    {
     "id": "void:properties"
    },
    {
     "id": "void:property"
    },
    {
     "id": "void:propertyPartition"
    },
    {
     "id": "void:rootResource"
    },
    {
     "id": "void:triples"
    },
    {
     "id": "void:uriSpace"
    },
    {
     "id": "void:classPartition"
    },
    {
     "id": "void:propertyPartition"
    }
   ]
  },
  {
   "id": "void:distinctObjects",
   "property": "http://rdfs.org/ns/void#distinctObjects",
   "label": {
    "en": "distinct objects"
   },
   "description": {
    "en": "The total number of distinct objects in a void:Dataset. In other words, the number of distinct resources that occur in the object position of triples in the dataset. Literals are included in this count."
   },
   "type": "text",
   "nodetype": "DATATYPE_LITERAL",
   "datatype": "http://www.w3.org/2001/XMLSchema#integer",
   "cardinality": {
    "pref": 1
   }
  },
  {
   "id": "void:distinctSubjects",
   "property": "http://rdfs.org/ns/void#distinctSubjects",
   "label": {
    "en": "distinct subjects"
   },
   "description": {
    "en": "The total number of distinct subjects in a void:Dataset. In other words, the number of distinct resources that occur in the subject position of triples in the dataset."
   },
   "type": "text",
   "nodetype": "DATATYPE_LITERAL",
   "datatype": "http://www.w3.org/2001/XMLSchema#integer",
   "cardinality": {
    "pref": 1
   }
  },
  {
   "id": "void:documents",
   "property": "http://rdfs.org/ns/void#documents",
   "label": {
    "en": "number of documents"
   },
   "description": {
    "en": "The total number of documents, for datasets that are published as a set of individual documents, such as RDF/XML documents or RDFa-annotated web pages. Non-RDF documents, such as web pages in HTML or images, are usually not included in this count. This property is intended for datasets where the total number of triples or entities is hard to determine. void:triples or void:entities should be preferred where practical."
   },
   "type": "text",
   "nodetype": "DATATYPE_LITERAL",
   "datatype": "http://www.w3.org/2001/XMLSchema#integer",
   "cardinality": {
    "pref": 1
   }
  },
  {
   "id": "void:entities",
   "property": "http://rdfs.org/ns/void#entities",
   "label": {
    "en": "number of entities"
   },
   "description": {
    "en": "The total number of entities that are described in a void:Dataset."
   },
   "type": "text",
   "nodetype": "DATATYPE_LITERAL",
   "datatype": "http://www.w3.org/2001/XMLSchema#integer",
   "cardinality": {
    "pref": 1
   }
  },
  {
   "id": "void:inDataset",
   "property": "http://rdfs.org/ns/void#inDataset",
   "label": {
    "en": "in dataset"
   },
   "description": {
    "en": "Points to the void:Dataset that a document is a part of."
   },
   "constraints": {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://rdfs.org/ns/void#Dataset"
   },
   "type": "choice",
   "nodetype": "RESOURCE",
   "cardinality": {
    "pref": 1
   }
  },
  {
   "id": "void:openSearchDescription",
   "property": "http://rdfs.org/ns/void#openSearchDescription",
   "label": {
    "en": "open search description"
   },
   "description": {
    "en": "An OpenSearch description document for a free-text search service over a void:Dataset."
   },
   "type": "text",
   "nodetype": "URI",
   "cardinality": {
    "pref": 1
   }
  },
  {
   "id": "void:properties",
   "property": "http://rdfs.org/ns/void#properties",
   "label": {
    "en": "number of properties"
   },
   "description": {
    "en": "The total number of distinct properties in a void:Dataset. In other words, the number of distinct resources that occur in the predicate position of triples in the dataset."
   },
   "type": "text",
   "nodetype": "DATATYPE_LITERAL",
   "datatype": "http://www.w3.org/2001/XMLSchema#integer",
   "cardinality": {
    "pref": 1
   }
  },
  {
   "id": "void:property",
   "property": "http://rdfs.org/ns/void#property",
   "label": {
    "en": "property"
   },
   "description": {
    "en": "The rdf:Property that is the predicate of all triples in a property-based partition."
   },
   "type": "text",
   "nodetype": "URI",
   "cardinality": {
    "pref": 1
   }
  },
  {
   "id": "void:propertyPartition",
   "property": "http://rdfs.org/ns/void#propertyPartition",
   "label": {
    "en": "property partition"
   },
   "description": {
    "en": "A subset of a void:Dataset that contains only the triples of a certain rdf:Property."
   },
   "constraints": {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://rdfs.org/ns/void#Dataset"
   },
   "type": "group",
   "automatic": true,
   "content": [
    {
     "id": "void:feature"
    },
    {
     "id": "void:subset"
    },
    {
     "id": "void:sparqlEndpoint"
    },
    {
     "id": "void:exampleResource"
    },
    {
     "id": "void:vocabulary"
    },
    {
     "id": "void:dataDump"
    },
    {
     "id": "void:uriLookupEndpoint"
    },
    {
     "id": "void:uriRegexPattern"
    },
    {
     "id": "void:class"
    },
    {
     "id": "void:classes"
    },
    {
     "id": "void:classPartition"
    },
    {
     "id": "void:distinctObjects"
    },
    {
     "id": "void:distinctSubjects"
    },
    {
     "id": "void:documents"
    },
    {
     "id": "void:entities"
    },
    {
     "id": "void:openSearchDescription"
    },
    {
     "id": "void:properties"
    },
    {
     "id": "void:property"
    },
    {
     "id": "void:propertyPartition"
    },
    {
     "id": "void:rootResource"
    },
    {
     "id": "void:triples"
    },
    {
     "id": "void:uriSpace"
    },
    {
     "id": "void:classPartition"
    },
    {
     "id": "void:propertyPartition"
    }
   ]
  },
  {
   "id": "void:rootResource",
   "property": "http://rdfs.org/ns/void#rootResource",
   "label": {
    "en": "root resource"
   },
   "description": {
    "en": "A top concept or entry point for a void:Dataset that is structured in a tree-like fashion. All resources in a dataset can be reached by following links from its root resources in a small number of steps."
   },
   "type": "text",
   "nodetype": "URI",
   "cardinality": {
    "pref": 1
   }
  },
  {
   "id": "void:triples",
   "property": "http://rdfs.org/ns/void#triples",
   "label": {
    "en": "number of triples"
   },
   "description": {
    "en": "The total number of triples contained in a void:Dataset."
   },
   "type": "text",
   "nodetype": "DATATYPE_LITERAL",
   "datatype": "http://www.w3.org/2001/XMLSchema#integer",
   "cardinality": {
    "pref": 1
   }
  },
  {
   "id": "void:uriSpace",
   "property": "http://rdfs.org/ns/void#uriSpace",
   "label": {
    "en": "URI space"
   },
   "description": {
    "en": "A URI that is a common string prefix of all the entity URIs in a void:Dataset."
   },
   "type": "text",
   "nodetype": "LITERAL",
   "cardinality": {
    "pref": 1
   }
  },
  {
   "id": "void:Dataset",
   "label": {
    "en": "dataset"
   },
   "constraints": {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://rdfs.org/ns/void#Dataset"
   },
   "description": {
    "en": "A set of RDF triples that are published, maintained or aggregated by a single provider."
   },
   "type": "group",
   "content": [
    {
     "id": "void:feature"
    },
    {
     "id": "void:subset"
    },
    {
     "id": "void:sparqlEndpoint"
    },
    {
     "id": "void:exampleResource"
    },
    {
     "id": "void:vocabulary"
    },
    {
     "id": "void:dataDump"
    },
    {
     "id": "void:uriLookupEndpoint"
    },
    {
     "id": "void:uriRegexPattern"
    },
    {
     "id": "void:class"
    },
    {
     "id": "void:classes"
    },
    {
     "id": "void:classPartition"
    },
    {
     "id": "void:distinctObjects"
    },
    {
     "id": "void:distinctSubjects"
    },
    {
     "id": "void:documents"
    },
    {
     "id": "void:entities"
    },
    {
     "id": "void:openSearchDescription"
    },
    {
     "id": "void:properties"
    },
    {
     "id": "void:property"
    },
    {
     "id": "void:propertyPartition"
    },
    {
     "id": "void:rootResource"
    },
    {
     "id": "void:triples"
    },
    {
     "id": "void:uriSpace"
    },
    {
     "id": "void:classPartition"
    },
    {
     "id": "void:propertyPartition"
    }
   ]
  },
  {
   "id": "void:Linkset",
   "label": {
    "en": "linkset"
   },
   "constraints": {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://rdfs.org/ns/void#Linkset"
   },
   "description": {
    "en": "A collection of RDF links between two void:Datasets."
   },
   "type": "group",
   "content": [
    {
     "id": "void:target"
    },
    {
     "id": "void:linkPredicate"
    },
    {
     "id": "void:subjectsTarget"
    },
    {
     "id": "void:objectsTarget"
    },
    {
     "id": "void:subjectsTarget"
    },
    {
     "id": "void:objectsTarget"
    },
    {
     "id": "void:feature"
    },
    {
     "id": "void:subset"
    },
    {
     "id": "void:sparqlEndpoint"
    },
    {
     "id": "void:exampleResource"
    },
    {
     "id": "void:vocabulary"
    },
    {
     "id": "void:dataDump"
    },
    {
     "id": "void:uriLookupEndpoint"
    },
    {
     "id": "void:uriRegexPattern"
    },
    {
     "id": "void:class"
    },
    {
     "id": "void:classes"
    },
    {
     "id": "void:classPartition"
    },
    {
     "id": "void:distinctObjects"
    },
    {
     "id": "void:distinctSubjects"
    },
    {
     "id": "void:documents"
    },
    {
     "id": "void:entities"
    },
    {
     "id": "void:openSearchDescription"
    },
    {
     "id": "void:properties"
    },
    {
     "id": "void:property"
    },
    {
     "id": "void:propertyPartition"
    },
    {
     "id": "void:rootResource"
    },
    {
     "id": "void:triples"
    },
    {
     "id": "void:uriSpace"
    },
    {
     "id": "void:classPartition"
    },
    {
     "id": "void:propertyPartition"
    }
   ]
  },
  {
   "id": "void:TechnicalFeature",
   "label": {
    "en": "technical feature"
   },
   "constraints": {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://rdfs.org/ns/void#TechnicalFeature"
   },
   "description": {
    "en": "A technical feature of a void:Dataset, such as a supported RDF serialization format."
   },
   "type": "group",
   "content": []
  },
  {
   "id": "void:DatasetDescription",
   "label": {
    "en": "dataset description"
   },
   "constraints": {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://rdfs.org/ns/void#DatasetDescription"
   },
   "description": {
    "en": "A web resource whose foaf:primaryTopic or foaf:topics include void:Datasets."
   },
   "type": "group",
   "content": [
    {
     "id": "void:inDataset"
    }
   ]
  },
  {
   "id": "http://xmlns.com/foaf/0.1/Document",
   "label": {
    "en": "Document"
   },
   "constraints": {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://xmlns.com/foaf/0.1/Document"
   },
   "type": "group",
   "content": [
    {
     "id": "void:inDataset"
    }
   ]
  },
  {
   "id": "http://www.w3.org/2002/07/owl#Thing",
   "label": {
    "en": "owl#Thing"
   },
   "constraints": {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.w3.org/2002/07/owl#Thing"
   },
   "type": "group",
   "content": []
  }
 ],
 "scope": "void",
 "namespace": "http://rdfs.org/ns/void#",
 "root": {
  "id": "void:Dataset"
 }
});