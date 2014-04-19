define({
 "auxilliary": [
  {
   "id": "skos:inScheme",
   "property": "http://www.w3.org/2004/02/skos/core#inScheme",
   "label": {
    "en": "is in scheme"
   },
   "constraints": {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.w3.org/2004/02/skos/core#ConceptScheme"
   },
   "type": "choice",
   "nodetype": "RESOURCE"
  },
  {
   "id": "skos:hasTopConcept",
   "property": "http://www.w3.org/2004/02/skos/core#hasTopConcept",
   "label": {
    "en": "has top concept"
   },
   "constraints": {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.w3.org/2004/02/skos/core#Concept"
   },
   "type": "choice",
   "nodetype": "RESOURCE"
  },
  {
   "id": "skos:topConceptOf",
   "property": "http://www.w3.org/2004/02/skos/core#topConceptOf",
   "label": {
    "en": "is top concept in scheme"
   },
   "constraints": {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.w3.org/2004/02/skos/core#ConceptScheme"
   },
   "type": "choice",
   "nodetype": "RESOURCE"
  },
  {
   "id": "skos:prefLabel",
   "property": "http://www.w3.org/2004/02/skos/core#prefLabel",
   "label": {
    "en": "preferred label"
   },
   "description": {
    "en": "skos:prefLabel, skos:altLabel and skos:hiddenLabel are pairwise\n      disjoint properties."
   },
   "type": "text",
   "nodetype": "LANGUAGE_LITERAL"
  },
  {
   "id": "skos:altLabel",
   "property": "http://www.w3.org/2004/02/skos/core#altLabel",
   "label": {
    "en": "alternative label"
   },
   "description": {
    "en": "skos:prefLabel, skos:altLabel and skos:hiddenLabel are pairwise disjoint properties."
   },
   "type": "text",
   "nodetype": "LANGUAGE_LITERAL"
  },
  {
   "id": "skos:hiddenLabel",
   "property": "http://www.w3.org/2004/02/skos/core#hiddenLabel",
   "label": {
    "en": "hidden label"
   },
   "description": {
    "en": "skos:prefLabel, skos:altLabel and skos:hiddenLabel are pairwise disjoint properties."
   },
   "type": "text",
   "nodetype": "LANGUAGE_LITERAL"
  },
  {
   "id": "skos:notation",
   "property": "http://www.w3.org/2004/02/skos/core#notation",
   "label": {
    "en": "notation"
   },
   "type": "group",
   "automatic": true,
   "content": []
  },
  {
   "id": "skos:note",
   "property": "http://www.w3.org/2004/02/skos/core#note",
   "label": {
    "en": "note"
   },
   "type": "text",
   "nodetype": "LANGUAGE_LITERAL",
   "cls": [
    "rformsmultiline"
   ]
  },
  {
   "id": "skos:changeNote",
   "property": "http://www.w3.org/2004/02/skos/core#changeNote",
   "label": {
    "en": "change note"
   },
   "type": "text",
   "nodetype": "LANGUAGE_LITERAL",
   "cls": [
    "rformsmultiline"
   ]
  },
  {
   "id": "skos:definition",
   "property": "http://www.w3.org/2004/02/skos/core#definition",
   "label": {
    "en": "definition"
   },
   "type": "text",
   "nodetype": "LANGUAGE_LITERAL",
   "cls": [
    "rformsmultiline"
   ]
  },
  {
   "id": "skos:editorialNote",
   "property": "http://www.w3.org/2004/02/skos/core#editorialNote",
   "label": {
    "en": "editorial note"
   },
   "type": "text",
   "nodetype": "LANGUAGE_LITERAL",
   "cls": [
    "rformsmultiline"
   ]
  },
  {
   "id": "skos:example",
   "property": "http://www.w3.org/2004/02/skos/core#example",
   "label": {
    "en": "example"
   },
   "type": "text",
   "nodetype": "LANGUAGE_LITERAL",
   "cls": [
    "rformsmultiline"
   ]
  },
  {
   "id": "skos:historyNote",
   "property": "http://www.w3.org/2004/02/skos/core#historyNote",
   "label": {
    "en": "history note"
   },
   "type": "text",
   "nodetype": "LANGUAGE_LITERAL",
   "cls": [
    "rformsmultiline"
   ]
  },
  {
   "id": "skos:scopeNote",
   "property": "http://www.w3.org/2004/02/skos/core#scopeNote",
   "label": {
    "en": "scope note"
   },
   "type": "text",
   "nodetype": "LANGUAGE_LITERAL",
   "cls": [
    "rformsmultiline"
   ]
  },
  {
   "id": "skos:broader",
   "property": "http://www.w3.org/2004/02/skos/core#broader",
   "label": {
    "en": "has broader"
   },
   "description": {
    "en": "Broader concepts are typically rendered as parents in a concept hierarchy (tree)."
   },
   "constraints": {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.w3.org/2004/02/skos/core#Concept"
   },
   "type": "choice",
   "nodetype": "RESOURCE"
  },
  {
   "id": "skos:narrower",
   "property": "http://www.w3.org/2004/02/skos/core#narrower",
   "label": {
    "en": "has narrower"
   },
   "description": {
    "en": "Narrower concepts are typically rendered as children in a concept hierarchy (tree)."
   },
   "constraints": {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.w3.org/2004/02/skos/core#Concept"
   },
   "type": "choice",
   "nodetype": "RESOURCE"
  },
  {
   "id": "skos:related",
   "property": "http://www.w3.org/2004/02/skos/core#related",
   "label": {
    "en": "has related"
   },
   "description": {
    "en": "skos:related is disjoint with skos:broaderTransitive"
   },
   "constraints": {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.w3.org/2004/02/skos/core#Concept"
   },
   "type": "choice",
   "nodetype": "RESOURCE"
  },
  {
   "id": "skos:broaderTransitive",
   "property": "http://www.w3.org/2004/02/skos/core#broaderTransitive",
   "label": {
    "en": "has broader transitive"
   },
   "constraints": {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.w3.org/2004/02/skos/core#Concept"
   },
   "type": "choice",
   "nodetype": "RESOURCE"
  },
  {
   "id": "skos:narrowerTransitive",
   "property": "http://www.w3.org/2004/02/skos/core#narrowerTransitive",
   "label": {
    "en": "has narrower transitive"
   },
   "constraints": {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.w3.org/2004/02/skos/core#Concept"
   },
   "type": "choice",
   "nodetype": "RESOURCE"
  },
  {
   "id": "skos:member",
   "property": "http://www.w3.org/2004/02/skos/core#member",
   "label": {
    "en": "has member"
   },
   "constraints": {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.w3.org/2004/02/skos/core#Concept"
   },
   "type": "group",
   "automatic": true,
   "content": [
    {
     "id": "skos:member"
    }
   ]
  },
  {
   "id": "skos:memberList",
   "property": "http://www.w3.org/2004/02/skos/core#memberList",
   "label": {
    "en": "has member list"
   },
   "description": {
    "en": "For any resource, every item in the list given as the value of the\n      skos:memberList property is also a value of the skos:member property."
   },
   "constraints": {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.w3.org/1999/02/22-rdf-syntax-ns#List"
   },
   "type": "group",
   "automatic": true,
   "content": []
  },
  {
   "id": "skos:mappingRelation",
   "property": "http://www.w3.org/2004/02/skos/core#mappingRelation",
   "label": {
    "en": "is in mapping relation with"
   },
   "description": {
    "en": "These concept mapping relations mirror semantic relations, and the data model defined below is similar (with the exception of skos:exactMatch) to the data model defined for semantic relations. A distinct vocabulary is provided for concept mapping relations, to provide a convenient way to differentiate links within a concept scheme from links between concept schemes. However, this pattern of usage is not a formal requirement of the SKOS data model, and relies on informal definitions of best practice."
   },
   "constraints": {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.w3.org/2004/02/skos/core#Concept"
   },
   "type": "choice",
   "nodetype": "RESOURCE"
  },
  {
   "id": "skos:broadMatch",
   "property": "http://www.w3.org/2004/02/skos/core#broadMatch",
   "label": {
    "en": "has broader match"
   },
   "constraints": {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.w3.org/2004/02/skos/core#Concept"
   },
   "type": "choice",
   "nodetype": "RESOURCE"
  },
  {
   "id": "skos:narrowMatch",
   "property": "http://www.w3.org/2004/02/skos/core#narrowMatch",
   "label": {
    "en": "has narrower match"
   },
   "constraints": {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.w3.org/2004/02/skos/core#Concept"
   },
   "type": "choice",
   "nodetype": "RESOURCE"
  },
  {
   "id": "skos:relatedMatch",
   "property": "http://www.w3.org/2004/02/skos/core#relatedMatch",
   "label": {
    "en": "has related match"
   },
   "constraints": {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.w3.org/2004/02/skos/core#Concept"
   },
   "type": "choice",
   "nodetype": "RESOURCE"
  },
  {
   "id": "skos:exactMatch",
   "property": "http://www.w3.org/2004/02/skos/core#exactMatch",
   "label": {
    "en": "has exact match"
   },
   "description": {
    "en": "skos:exactMatch is disjoint with each of the properties skos:broadMatch and skos:relatedMatch."
   },
   "constraints": {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.w3.org/2004/02/skos/core#Concept"
   },
   "type": "choice",
   "nodetype": "RESOURCE"
  },
  {
   "id": "skos:closeMatch",
   "property": "http://www.w3.org/2004/02/skos/core#closeMatch",
   "label": {
    "en": "has close match"
   },
   "constraints": {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.w3.org/2004/02/skos/core#Concept"
   },
   "type": "choice",
   "nodetype": "RESOURCE"
  },
  {
   "id": "http://www.w3.org/2000/01/rdf-schema#label",
   "property": "http://www.w3.org/2000/01/rdf-schema#label",
   "label": {
    "en": "rdf-schema#label"
   },
   "type": "group",
   "automatic": true,
   "content": []
  },
  {
   "id": "skos:Concept",
   "label": {
    "en": "Concept"
   },
   "constraints": {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.w3.org/2004/02/skos/core#Concept"
   },
   "type": "group",
   "content": [
    {
     "id": "skos:prefLabel"
    },
    {
     "id": "skos:definition"
    },
    {
     "id": "skos:example"
    },
    {
     "id": "skos:topConceptOf"
    },
    {
     "id": "skos:inScheme"
    },
    {
     "id": "skos:broader"
    },
    {
     "id": "skos:narrower"
    },
    {
     "id": "skos:related"
    },
    {
     "cardinality": {
      "min": 1,
      "pref": 1,
      "max": 1
     },
     "type": "group",
     "cls": [
      "rformsexpandable"
     ],
     "label": {
      "en": "Labels and annotations"
     },
     "content": [
      {
       "id": "skos:altLabel"
      },
      {
       "id": "skos:hiddenLabel"
      },
      {
       "id": "skos:note"
      },
      {
       "id": "skos:editorialNote"
      },
      {
       "id": "skos:scopeNote"
      },
      {
       "id": "skos:changeNote"
      },
      {
       "id": "skos:historyNote"
      }
     ]
    },
    {
     "cardinality": {
      "min": 1,
      "pref": 1,
      "max": 1
     },
     "type": "group",
     "cls": [
      "rformsexpandable"
     ],
     "label": {
      "en": "Additional concept relations"
     },
     "content": [
      {
       "id": "skos:broaderTransitive"
      },
      {
       "id": "skos:narrowerTransitive"
      },
      {
       "id": "skos:broadMatch"
      },
      {
       "id": "skos:narrowMatch"
      },
      {
       "id": "skos:exactMatch"
      },
      {
       "id": "skos:closeMatch"
      },
      {
       "id": "skos:relatedMatch"
      },
      {
       "id": "skos:mappingRelation"
      }
     ]
    }
   ]
  },
  {
   "id": "skos:ConceptScheme",
   "label": {
    "en": "Concept Scheme"
   },
   "constraints": {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.w3.org/2004/02/skos/core#ConceptScheme"
   },
   "type": "group",
   "content": [
    {
     "id": "skos:hasTopConcept"
    }
   ]
  },
  {
   "id": "skos:Collection",
   "label": {
    "en": "Collection"
   },
   "constraints": {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.w3.org/2004/02/skos/core#Collection"
   },
   "type": "group",
   "content": [
    {
     "id": "skos:member"
    }
   ]
  },
  {
   "id": "skos:OrderedCollection",
   "label": {
    "en": "Ordered Collection"
   },
   "constraints": {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.w3.org/2004/02/skos/core#OrderedCollection"
   },
   "type": "group",
   "content": [
    {
     "id": "skos:memberList"
    },
    {
     "id": "skos:member"
    }
   ]
  }
 ],
 "scope": "skos",
 "namespace": "http://www.w3.org/2004/02/skos/core#"
});