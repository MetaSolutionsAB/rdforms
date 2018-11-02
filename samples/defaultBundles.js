export default [
  {
    "templates": [
      {
        "id": "skos:inScheme",
        "property": "http://www.w3.org/2004/02/skos/core#inScheme",
        "label": {
          "en": "In scheme",
          "sv": "Ingår i modell",
          "de": "In Schema"
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.w3.org/2004/02/skos/core#ConceptScheme"
        },
        "type": "choice",
        "nodetype": "RESOURCE",
        "cardinality": {
          "min": 0,
          "pref": 1
        }
      },
      {
        "id": "skos:hasTopConcept",
        "property": "http://www.w3.org/2004/02/skos/core#hasTopConcept",
        "label": {
          "en": "Has top concept",
          "sv": "Har huvudbegrepp",
          "de": "Hat Begriff oberster Ebene"
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.w3.org/2004/02/skos/core#Concept"
        },
        "type": "choice",
        "nodetype": "RESOURCE",
        "cardinality": {
          "min": 0,
          "pref": 1
        }
      },
      {
        "id": "skos:topConceptOf",
        "property": "http://www.w3.org/2004/02/skos/core#topConceptOf",
        "label": {
          "en": "Top concept of",
          "sv": "Huvudbegrepp i modellen",
          "de": "Begriff oberster Ebene von"
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.w3.org/2004/02/skos/core#ConceptScheme"
        },
        "type": "choice",
        "nodetype": "RESOURCE",
        "cardinality": {
          "min": 0,
          "pref": 1
        }
      },
      {
        "id": "skos:prefLabel",
        "property": "http://www.w3.org/2004/02/skos/core#prefLabel",
        "label": {
          "en": "Preferred label",
          "sv": "Föredragen term",
          "de": "Bevorzugter Name"
        },
        "description": {
          "en": "skos:prefLabel, skos:altLabel and skos:hiddenLabel are pairwise disjoint properties."
        },
        "type": "text",
        "nodetype": "LANGUAGE_LITERAL"
      },
      {
        "id": "skos:altLabel",
        "property": "http://www.w3.org/2004/02/skos/core#altLabel",
        "label": {
          "en": "Alternative label",
          "sv": "Alternativ term",
          "de": "Alternativer Name"
        },
        "description": {
          "en": "skos:prefLabel, skos:altLabel and skos:hiddenLabel are pairwise disjoint properties."
        },
        "type": "text",
        "nodetype": "LANGUAGE_LITERAL",
        "cardinality": {
          "min": 0,
          "pref": 1
        }
      },
      {
        "id": "skos:hiddenLabel",
        "property": "http://www.w3.org/2004/02/skos/core#hiddenLabel",
        "label": {
          "en": "Hidden label",
          "sv": "Dold term",
          "de": "Verborgener Name"
        },
        "description": {
          "en": "skos:prefLabel, skos:altLabel and skos:hiddenLabel are pairwise disjoint properties."
        },
        "type": "text",
        "nodetype": "LANGUAGE_LITERAL",
        "cardinality": {
          "min": 0,
          "pref": 1
        }
      },
      {
        "id": "skos:notation",
        "property": "http://www.w3.org/2004/02/skos/core#notation",
        "label": {
          "en": "Notation",
          "sv": "Notation",
          "de": "Notation"
        },
        "type": "group",
        "automatic": true,
        "nodetype": "RESOURCE",
        "items": []
      },
      {
        "id": "skos:note",
        "property": "http://www.w3.org/2004/02/skos/core#note",
        "label": {
          "en": "Note",
          "sv": "Anmärkning",
          "de": "Anmerkung"
        },
        "type": "text",
        "nodetype": "LANGUAGE_LITERAL",
        "styles": [
          "multiline"
        ]
      },
      {
        "id": "skos:changeNote",
        "property": "http://www.w3.org/2004/02/skos/core#changeNote",
        "label": {
          "en": "Change note",
          "sv": "Förändringsanmärkning",
          "de": "Änderungsvermerk"
        },
        "type": "text",
        "nodetype": "LANGUAGE_LITERAL",
        "styles": [
          "multiline"
        ]
      },
      {
        "id": "skos:definition",
        "property": "http://www.w3.org/2004/02/skos/core#definition",
        "label": {
          "en": "Definition",
          "sv": "Definition",
          "de": "Definition"
        },
        "type": "text",
        "nodetype": "LANGUAGE_LITERAL",
        "styles": [
          "multiline"
        ],
        "cardinality": {
          "pref": 1
        }
      },
      {
        "id": "skos:editorialNote",
        "property": "http://www.w3.org/2004/02/skos/core#editorialNote",
        "label": {
          "en": "Editorial note",
          "sv": "Redaktionell anmärkning",
          "de": "Redaktionelle Anmerkung"
        },
        "type": "text",
        "nodetype": "LANGUAGE_LITERAL",
        "styles": [
          "multiline"
        ]
      },
      {
        "id": "skos:example",
        "property": "http://www.w3.org/2004/02/skos/core#example",
        "label": {
          "en": "Example",
          "sv": "Exempel",
          "de": "Beispiel"
        },
        "type": "text",
        "nodetype": "LANGUAGE_LITERAL",
        "styles": [
          "multiline"
        ],
        "cardinality": {
          "pref": 1
        }
      },
      {
        "id": "skos:historyNote",
        "property": "http://www.w3.org/2004/02/skos/core#historyNote",
        "label": {
          "en": "History note",
          "sv": "Historisk anmärkning",
          "de": "Versionshinweis"
        },
        "type": "text",
        "nodetype": "LANGUAGE_LITERAL",
        "styles": [
          "multiline"
        ],
        "cardinality": {
          "pref": 1
        }
      },
      {
        "id": "skos:scopeNote",
        "property": "http://www.w3.org/2004/02/skos/core#scopeNote",
        "label": {
          "en": "Scope note",
          "sv": "Användningsanmärkning",
          "de": "Anwendungshinweis"
        },
        "type": "text",
        "nodetype": "LANGUAGE_LITERAL",
        "styles": [
          "multiline"
        ],
        "cardinality": {
          "min": 0,
          "pref": 1
        }
      },
      {
        "id": "skos:broader",
        "property": "http://www.w3.org/2004/02/skos/core#broader",
        "label": {
          "en": "Has broader concept",
          "sv": "Har överordnat begrepp",
          "de": "Hat Oberbegriff"
        },
        "description": {
          "en": "Broader concepts are typically rendered as parents in a concept hierarchy (tree)."
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.w3.org/2004/02/skos/core#Concept"
        },
        "type": "choice",
        "nodetype": "RESOURCE",
        "cardinality": {
          "min": 0,
          "pref": 1
        }
      },
      {
        "id": "skos:narrower",
        "property": "http://www.w3.org/2004/02/skos/core#narrower",
        "label": {
          "en": "Has narrower concept",
          "sv": "Har underordnat begrepp",
          "de": "Hat Unterbegriff"
        },
        "description": {
          "en": "Narrower concepts are typically rendered as children in a concept hierarchy (tree)."
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.w3.org/2004/02/skos/core#Concept"
        },
        "type": "choice",
        "nodetype": "RESOURCE",
        "cardinality": {
          "min": 0,
          "pref": 1
        }
      },
      {
        "id": "skos:related",
        "property": "http://www.w3.org/2004/02/skos/core#related",
        "label": {
          "en": "Has related concept",
          "sv": "Är relaterat med",
          "de": "Hat verwandten Begriff"
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
          "en": "Has broader transitive concept",
          "sv": "Har transitivt överordnat begrepp",
          "de": "Hat transitiven Oberbegriff"
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.w3.org/2004/02/skos/core#Concept"
        },
        "type": "choice",
        "nodetype": "RESOURCE",
        "cardinality": {
          "min": 0,
          "pref": 1
        }
      },
      {
        "id": "skos:narrowerTransitive",
        "property": "http://www.w3.org/2004/02/skos/core#narrowerTransitive",
        "label": {
          "en": "Has narrower transitive concept",
          "sv": "Har transitivt underordnat begrepp",
          "de": "Hat transitiven Unterbegriff"
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.w3.org/2004/02/skos/core#Concept"
        },
        "type": "choice",
        "nodetype": "RESOURCE",
        "cardinality": {
          "min": 0,
          "pref": 1
        }
      },
      {
        "id": "skos:member",
        "property": "http://www.w3.org/2004/02/skos/core#member",
        "label": {
          "en": "Member",
          "sv": "Medlem",
          "de": "Mitglied"
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.w3.org/2004/02/skos/core#Concept"
        },
        "type": "choice",
        "automatic": true,
        "nodetype": "RESOURCE"
      },
      {
        "id": "skos:memberList",
        "property": "http://www.w3.org/2004/02/skos/core#memberList",
        "label": {
          "en": "Member list",
          "sv": "Medlemsförteckning",
          "de": "Mitgliederliste"
        },
        "description": {
          "en": "For any resource, every item in the list given as the value of the skos:memberList property is also a value of the skos:member property."
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.w3.org/1999/02/22-rdf-syntax-ns#List"
        },
        "type": "group",
        "automatic": true,
        "nodetype": "RESOURCE",
        "items": []
      },
      {
        "id": "skos:mappingRelation",
        "property": "http://www.w3.org/2004/02/skos/core#mappingRelation",
        "label": {
          "en": "Mapping relation",
          "sv": "Ingår i en jämförande relation till",
          "de": "Verwandter Begriff"
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
          "en": "Has broader matching concept",
          "sv": "Har överordnat motsvarande begrepp",
          "de": "Gleichwertiger Oberbegriff"
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
          "en": "Has narrower matching concept",
          "sv": "Har underordnat motsvarande begrepp",
          "de": "Gleichwertiger Unterbegriff"
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
          "en": "Has related matching concept",
          "sv": "Har relaterat motsvarande begrepp",
          "de": "Gleichwertiger verwandter Begriff"
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.w3.org/2004/02/skos/core#Concept"
        },
        "type": "choice",
        "nodetype": "RESOURCE",
        "cardinality": {
          "min": 0,
          "pref": 1
        }
      },
      {
        "id": "skos:exactMatch",
        "property": "http://www.w3.org/2004/02/skos/core#exactMatch",
        "label": {
          "en": "Has exact matching concept",
          "sv": "Har exakt motsvarande begrepp",
          "de": "Exakt übereinstimmender Begriff"
        },
        "description": {
          "en": "skos:exactMatch is disjoint with each of the properties skos:broadMatch and skos:relatedMatch."
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.w3.org/2004/02/skos/core#Concept"
        },
        "type": "choice",
        "nodetype": "RESOURCE",
        "cardinality": {
          "min": 0,
          "pref": 1
        }
      },
      {
        "id": "skos:closeMatch",
        "property": "http://www.w3.org/2004/02/skos/core#closeMatch",
        "label": {
          "en": "Has close matching concept",
          "sv": "Har snarlikt motsvarande begrepp",
          "de": "Ähnlich übereinstimmender Begriff"
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.w3.org/2004/02/skos/core#Concept"
        },
        "type": "choice",
        "nodetype": "RESOURCE",
        "cardinality": {
          "min": 0,
          "pref": 1
        }
      },
      {
        "id": "http://www.w3.org/2000/01/rdf-schema#label",
        "property": "http://www.w3.org/2000/01/rdf-schema#label",
        "label": {
          "en": "rdf-schema#label"
        },
        "type": "group",
        "automatic": true,
        "nodetype": "RESOURCE",
        "items": []
      },
      {
        "id": "skos:Concept",
        "label": {
          "en": "Concept",
          "sv": "Begrepp",
          "de": "Begriff"
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.w3.org/2004/02/skos/core#Concept"
        },
        "type": "group",
        "nodetype": "RESOURCE",
        "items": [
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
            "id": "skos:broader"
          },
          {
            "id": "skos:narrower"
          },
          {
            "id": "skos:related"
          },
          {
            "id": "skos:inScheme"
          },
          {
            "id": "skos:topConceptOf"
          },
          {
            "cardinality": {
              "min": 1,
              "pref": 1,
              "max": 1
            },
            "type": "group",
            "label": {
              "en": "Labels and annotations",
              "sv": "Termer och kommentarer",
              "de": "Namen und Kommentare"
            },
            "nodetype": "RESOURCE",
            "styles": [
              "expandable"
            ],
            "items": [
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
            "label": {
              "en": "Additional concept relations",
              "sv": "Ytterligare begreppsrelationer",
              "de": "Zusätzliche Begriffsbeziehungen"
            },
            "nodetype": "RESOURCE",
            "styles": [
              "expandable"
            ],
            "items": [
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
          "en": "Concept scheme",
          "sv": "Begreppsmodell",
          "de": "Begriffsmodell"
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.w3.org/2004/02/skos/core#ConceptScheme"
        },
        "type": "group",
        "nodetype": "RESOURCE",
        "items": [
          {
            "id": "skos:hasTopConcept"
          }
        ]
      },
      {
        "id": "skos:Collection",
        "label": {
          "en": "Collection",
          "sv": "Samling",
          "de": "Sammlung"
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.w3.org/2004/02/skos/core#Collection"
        },
        "type": "group",
        "items": [
          {
            "id": "skos:member"
          }
        ]
      },
      {
        "id": "skos:OrderedCollection",
        "label": {
          "en": "Ordered collection",
          "sv": "Ordnad samling",
          "de": "Geordnete Sammlung"
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.w3.org/2004/02/skos/core#OrderedCollection"
        },
        "type": "group",
        "items": [
          {
            "id": "skos:memberList"
          },
          {
            "id": "skos:member"
          }
        ]
      },
      {
        "type": "group",
        "nodetype": "RESOURCE",
        "id": "skos:conceptLabels",
        "label": {
          "en": "Labels",
          "sv": "Termer",
          "de": "Namen"
        },
        "items": [
          {
            "extends": "skos:prefLabel",
            "cardinality": {
              "min": 1
            }
          },
          {
            "id": "skos:altLabel"
          },
          {
            "id": "skos:hiddenLabel"
          }
        ],
        "styles": [
          "heading"
        ]
      },
      {
        "type": "group",
        "nodetype": "RESOURCE",
        "id": "skos:conceptRelations",
        "label": {
          "en": "Relations",
          "sv": "Relationer",
          "de": "Beziehungen"
        },
        "items": [
          {
            "id": "skos:related"
          },
          {
            "id": "skos:broader"
          },
          {
            "id": "skos:broaderTransitive"
          },
          {
            "id": "skos:narrower"
          },
          {
            "id": "skos:narrowerTransitive"
          }
        ],
        "styles": [
          "heading"
        ]
      },
      {
        "type": "group",
        "nodetype": "RESOURCE",
        "id": "skos:conceptDocumentation",
        "label": {
          "en": "Documentation",
          "sv": "Dokumentation",
          "de": "Dokumentation"
        },
        "items": [
          {
            "id": "skos:definition"
          },
          {
            "id": "skos:scopeNote"
          },
          {
            "id": "skos:example"
          },
          {
            "id": "skos:historyNote"
          },
          {
            "id": "skos:editorialNote"
          },
          {
            "id": "skos:changeNote"
          },
          {
            "id": "skos:note"
          }
        ],
        "styles": [
          "heading"
        ]
      },
      {
        "type": "group",
        "nodetype": "RESOURCE",
        "id": "skos:conceptMappings",
        "label": {
          "en": "Mappings",
          "sv": "Mappningar",
          "de": "Zuordnungen"
        },
        "description": {},
        "items": [
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
            "id": "skos:broadMatch"
          },
          {
            "id": "skos:narrowMatch"
          }
        ],
        "styles": [
          "heading"
        ]
      },
      {
        "type": "group",
        "nodetype": "RESOURCE",
        "id": "skos:easyConcept",
        "items": [
          {
            "id": "skos:conceptLabels"
          },
          {
            "id": "skos:conceptDocumentation"
          },
          {
            "id": "skos:conceptRelations"
          },
          {
            "id": "skos:conceptMappings"
          }
        ]
      }
    ],
    "scope": "skos",
    "namespace": "http://www.w3.org/2004/02/skos/core#"
  },
  {
    "templates": [
      {
        "id": "dcterms:title",
        "property": "http://purl.org/dc/terms/title",
        "label": {
          "en": "Title",
          "sv": "Titel",
          "de": "Titel",
          "nb": "Tittel",
          "da": "Titel"
        },
        "description": {
          "en": "A name given to the resource."
        },
        "type": "text",
        "nodetype": "LANGUAGE_LITERAL",
        "cardinality": {
          "min": 0,
          "pref": 1
        }
      },
      {
        "id": "dcterms:creator",
        "property": "http://purl.org/dc/terms/creator",
        "label": {
          "en": "Creator",
          "sv": "Skapare",
          "de": "Urheber"
        },
        "description": {
          "en": "An entity primarily responsible for making the resource."
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/Agent"
        },
        "type": "choice",
        "nodetype": "RESOURCE",
        "cardinality": {
          "min": 0,
          "pref": 1
        }
      },
      {
        "id": "dcterms:subject",
        "property": "http://purl.org/dc/terms/subject",
        "label": {
          "en": "Subject",
          "sv": "Ämne",
          "de": "Thema"
        },
        "description": {
          "en": "The topic of the resource."
        },
        "type": "choice",
        "nodetype": "URI",
        "cardinality": {
          "min": 0,
          "pref": 1
        }
      },
      {
        "id": "dcterms:description",
        "property": "http://purl.org/dc/terms/description",
        "label": {
          "en": "Description",
          "sv": "Beskrivning",
          "de": "Beschreibung",
          "nb": "Beskrivelse",
          "da": "Beskrivelse"
        },
        "description": {
          "en": "An account of the resource."
        },
        "type": "text",
        "nodetype": "LANGUAGE_LITERAL",
        "styles": [
          "multiline"
        ]
      },
      {
        "id": "dcterms:publisher",
        "property": "http://purl.org/dc/terms/publisher",
        "label": {
          "en": "Publisher",
          "sv": "Utgivare",
          "de": "Herausgeber"
        },
        "description": {
          "en": "An entity responsible for making the resource available."
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/Agent"
        },
        "type": "choice",
        "nodetype": "RESOURCE",
        "cardinality": {
          "min": 0,
          "pref": 1
        }
      },
      {
        "id": "dcterms:contributor",
        "property": "http://purl.org/dc/terms/contributor",
        "label": {
          "en": "Contributor",
          "sv": "Bidragsgivare",
          "de": "Mitwirkender"
        },
        "description": {
          "en": "An entity responsible for making contributions to the resource."
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/Agent"
        },
        "type": "choice",
        "nodetype": "RESOURCE",
        "cardinality": {
          "min": 0,
          "pref": 1
        }
      },
      {
        "id": "dcterms:date",
        "property": "http://purl.org/dc/terms/date",
        "label": {
          "en": "Date",
          "sv": "Datum",
          "de": "Datum"
        },
        "description": {
          "en": "A point or period of time associated with an event in the lifecycle of the resource."
        },
        "type": "text",
        "nodetype": "DATATYPE_LITERAL",
        "datatype": "http://www.w3.org/2001/XMLSchema#date",
        "cardinality": {
          "min": 0,
          "pref": 1
        }
      },
      {
        "id": "dcterms:type",
        "property": "http://purl.org/dc/terms/type",
        "label": {
          "en": "Type",
          "sv": "Typ",
          "de": "Typ"
        },
        "description": {
          "en": "The nature or genre of the resource."
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.w3.org/2000/01/rdf-schema#Class"
        },
        "type": "choice"
      },
      {
        "id": "dcterms:format",
        "property": "http://purl.org/dc/terms/format",
        "label": {
          "en": "Format",
          "sv": "Format",
          "de": "Format"
        },
        "description": {
          "en": "The file format, physical medium, or dimensions of the resource."
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/MediaTypeOrExtent"
        },
        "type": "group",
        "automatic": true,
        "items": []
      },
      {
        "id": "dcterms:identifier",
        "property": "http://purl.org/dc/terms/identifier",
        "label": {
          "en": "Identifier",
          "sv": "Identifierare",
          "de": "Kennzeichnung"
        },
        "description": {
          "en": "An unambiguous reference to the resource within a given context."
        },
        "type": "text",
        "nodetype": "ONLY_LITERAL",
        "cardinality": {
          "min": 0,
          "pref": 1
        }
      },
      {
        "id": "dcterms:source",
        "property": "http://purl.org/dc/terms/source",
        "label": {
          "en": "Source",
          "sv": "Källa",
          "de": "Quelle"
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
          "en": "Language",
          "sv": "Språk",
          "de": "Sprache"
        },
        "description": {
          "en": "A language of the resource."
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/LinguisticSystem"
        },
        "type": "choice",
        "automatic": true,
        "content": [],
        "choices": [
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/ab",
            "label": {
              "en": "Abkhazian"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/aa",
            "label": {
              "en": "Afar"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/af",
            "label": {
              "en": "Afrikaans"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/ak",
            "label": {
              "en": "Akan"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/sq",
            "label": {
              "en": "Albanian"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/am",
            "label": {
              "en": "Amharic"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/ar",
            "label": {
              "en": "Arabic"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/an",
            "label": {
              "en": "Aragonese"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/hy",
            "label": {
              "en": "Armenian"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/as",
            "label": {
              "en": "Assamese"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/av",
            "label": {
              "en": "Avaric"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/ae",
            "label": {
              "en": "Avestan"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/ay",
            "label": {
              "en": "Aymara"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/az",
            "label": {
              "en": "Azerbaijani"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/bm",
            "label": {
              "en": "Bambara"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/ba",
            "label": {
              "en": "Bashkir"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/eu",
            "label": {
              "en": "Basque"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/be",
            "label": {
              "en": "Belarusian"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/bn",
            "label": {
              "en": "Bengali"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/bh",
            "label": {
              "en": "Bihari languages"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/bi",
            "label": {
              "en": "Bislama"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/nb",
            "label": {
              "en": "Bokmål, Norwegian |  Norwegian Bokmål"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/bs",
            "label": {
              "en": "Bosnian"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/br",
            "label": {
              "en": "Breton"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/bg",
            "label": {
              "en": "Bulgarian"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/my",
            "label": {
              "en": "Burmese"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/ca",
            "label": {
              "en": "Catalan |  Valencian"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/km",
            "label": {
              "en": "Central Khmer"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/ch",
            "label": {
              "en": "Chamorro"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/ce",
            "label": {
              "en": "Chechen"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/ny",
            "label": {
              "en": "Chichewa |  Chewa |  Nyanja"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/zh",
            "label": {
              "en": "Chinese"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/cu",
            "label": {
              "en": "Church Slavic |  Old Slavonic |  Church Slavonic |  Old Bulgarian |  Old Church Slavonic"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/cv",
            "label": {
              "en": "Chuvash"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/kw",
            "label": {
              "en": "Cornish"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/co",
            "label": {
              "en": "Corsican"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/cr",
            "label": {
              "en": "Cree"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/hr",
            "label": {
              "en": "Croatian"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/cs",
            "label": {
              "en": "Czech"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/da",
            "label": {
              "en": "Danish"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/dv",
            "label": {
              "en": "Divehi |  Dhivehi |  Maldivian"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/nl",
            "label": {
              "en": "Dutch |  Flemish"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/dz",
            "label": {
              "en": "Dzongkha"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/en",
            "label": {
              "en": "English"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/eo",
            "label": {
              "en": "Esperanto"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/et",
            "label": {
              "en": "Estonian"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/ee",
            "label": {
              "en": "Ewe"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/fo",
            "label": {
              "en": "Faroese"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/fj",
            "label": {
              "en": "Fijian"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/fi",
            "label": {
              "en": "Finnish"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/fr",
            "label": {
              "en": "French"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/ff",
            "label": {
              "en": "Fulah"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/gd",
            "label": {
              "en": "Gaelic |  Scottish Gaelic"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/gl",
            "label": {
              "en": "Galician"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/lg",
            "label": {
              "en": "Ganda"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/ka",
            "label": {
              "en": "Georgian"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/de",
            "label": {
              "en": "German"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/el",
            "label": {
              "en": "Greek, Modern (1453-)"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/gn",
            "label": {
              "en": "Guarani"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/gu",
            "label": {
              "en": "Gujarati"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/ht",
            "label": {
              "en": "Haitian |  Haitian Creole"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/ha",
            "label": {
              "en": "Hausa"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/he",
            "label": {
              "en": "Hebrew"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/hz",
            "label": {
              "en": "Herero"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/hi",
            "label": {
              "en": "Hindi"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/ho",
            "label": {
              "en": "Hiri Motu"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/hu",
            "label": {
              "en": "Hungarian"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/is",
            "label": {
              "en": "Icelandic"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/io",
            "label": {
              "en": "Ido"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/ig",
            "label": {
              "en": "Igbo"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/id",
            "label": {
              "en": "Indonesian"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/ia",
            "label": {
              "en": "Interlingua (International Auxiliary Language Association)"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/ie",
            "label": {
              "en": "Interlingue |  Occidental"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/iu",
            "label": {
              "en": "Inuktitut"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/ik",
            "label": {
              "en": "Inupiaq"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/ga",
            "label": {
              "en": "Irish"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/it",
            "label": {
              "en": "Italian"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/ja",
            "label": {
              "en": "Japanese"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/jv",
            "label": {
              "en": "Javanese"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/kl",
            "label": {
              "en": "Kalaallisut |  Greenlandic"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/kn",
            "label": {
              "en": "Kannada"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/kr",
            "label": {
              "en": "Kanuri"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/ks",
            "label": {
              "en": "Kashmiri"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/kk",
            "label": {
              "en": "Kazakh"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/ki",
            "label": {
              "en": "Kikuyu |  Gikuyu"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/rw",
            "label": {
              "en": "Kinyarwanda"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/ky",
            "label": {
              "en": "Kirghiz |  Kyrgyz"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/kv",
            "label": {
              "en": "Komi"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/kg",
            "label": {
              "en": "Kongo"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/ko",
            "label": {
              "en": "Korean"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/kj",
            "label": {
              "en": "Kuanyama |  Kwanyama"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/ku",
            "label": {
              "en": "Kurdish"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/lo",
            "label": {
              "en": "Lao"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/la",
            "label": {
              "en": "Latin"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/lv",
            "label": {
              "en": "Latvian"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/li",
            "label": {
              "en": "Limburgan |  Limburger |  Limburgish"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/ln",
            "label": {
              "en": "Lingala"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/lt",
            "label": {
              "en": "Lithuanian"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/lu",
            "label": {
              "en": "Luba-Katanga"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/lb",
            "label": {
              "en": "Luxembourgish |  Letzeburgesch"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/mk",
            "label": {
              "en": "Macedonian"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/mg",
            "label": {
              "en": "Malagasy"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/ms",
            "label": {
              "en": "Malay"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/ml",
            "label": {
              "en": "Malayalam"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/mt",
            "label": {
              "en": "Maltese"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/gv",
            "label": {
              "en": "Manx"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/mi",
            "label": {
              "en": "Maori"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/mr",
            "label": {
              "en": "Marathi"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/mh",
            "label": {
              "en": "Marshallese"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/mn",
            "label": {
              "en": "Mongolian"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/na",
            "label": {
              "en": "Nauru"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/nv",
            "label": {
              "en": "Navajo |  Navaho"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/nd",
            "label": {
              "en": "Ndebele, North |  North Ndebele"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/nr",
            "label": {
              "en": "Ndebele, South |  South Ndebele"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/ng",
            "label": {
              "en": "Ndonga"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/ne",
            "label": {
              "en": "Nepali"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/se",
            "label": {
              "en": "Northern Sami"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/no",
            "label": {
              "en": "Norwegian"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/nn",
            "label": {
              "en": "Norwegian Nynorsk |  Nynorsk, Norwegian"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/oc",
            "label": {
              "en": "Occitan (post 1500)"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/oj",
            "label": {
              "en": "Ojibwa"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/or",
            "label": {
              "en": "Oriya"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/om",
            "label": {
              "en": "Oromo"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/os",
            "label": {
              "en": "Ossetian |  Ossetic"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/pi",
            "label": {
              "en": "Pali"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/pa",
            "label": {
              "en": "Panjabi |  Punjabi"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/fa",
            "label": {
              "en": "Persian"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/pl",
            "label": {
              "en": "Polish"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/pt",
            "label": {
              "en": "Portuguese"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/ps",
            "label": {
              "en": "Pushto |  Pashto"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/qu",
            "label": {
              "en": "Quechua"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/ro",
            "label": {
              "en": "Romanian |  Moldavian |  Moldovan"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/rm",
            "label": {
              "en": "Romansh"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/rn",
            "label": {
              "en": "Rundi"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/ru",
            "label": {
              "en": "Russian"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/sm",
            "label": {
              "en": "Samoan"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/sg",
            "label": {
              "en": "Sango"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/sa",
            "label": {
              "en": "Sanskrit"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/sc",
            "label": {
              "en": "Sardinian"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/sr",
            "label": {
              "en": "Serbian"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/sn",
            "label": {
              "en": "Shona"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/ii",
            "label": {
              "en": "Sichuan Yi |  Nuosu"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/sd",
            "label": {
              "en": "Sindhi"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/si",
            "label": {
              "en": "Sinhala |  Sinhalese"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/sk",
            "label": {
              "en": "Slovak"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/sl",
            "label": {
              "en": "Slovenian"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/so",
            "label": {
              "en": "Somali"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/st",
            "label": {
              "en": "Sotho, Southern"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/es",
            "label": {
              "en": "Spanish |  Castilian"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/su",
            "label": {
              "en": "Sundanese"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/sw",
            "label": {
              "en": "Swahili"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/ss",
            "label": {
              "en": "Swati"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/sv",
            "label": {
              "en": "Swedish"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/tl",
            "label": {
              "en": "Tagalog"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/ty",
            "label": {
              "en": "Tahitian"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/tg",
            "label": {
              "en": "Tajik"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/ta",
            "label": {
              "en": "Tamil"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/tt",
            "label": {
              "en": "Tatar"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/te",
            "label": {
              "en": "Telugu"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/th",
            "label": {
              "en": "Thai"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/bo",
            "label": {
              "en": "Tibetan"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/ti",
            "label": {
              "en": "Tigrinya"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/to",
            "label": {
              "en": "Tonga (Tonga Islands)"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/ts",
            "label": {
              "en": "Tsonga"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/tn",
            "label": {
              "en": "Tswana"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/tr",
            "label": {
              "en": "Turkish"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/tk",
            "label": {
              "en": "Turkmen"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/tw",
            "label": {
              "en": "Twi"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/ug",
            "label": {
              "en": "Uighur |  Uyghur"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/uk",
            "label": {
              "en": "Ukrainian"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/ur",
            "label": {
              "en": "Urdu"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/uz",
            "label": {
              "en": "Uzbek"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/ve",
            "label": {
              "en": "Venda"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/vi",
            "label": {
              "en": "Vietnamese"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/vo",
            "label": {
              "en": "Volapük"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/wa",
            "label": {
              "en": "Walloon"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/cy",
            "label": {
              "en": "Welsh"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/fy",
            "label": {
              "en": "Western Frisian"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/wo",
            "label": {
              "en": "Wolof"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/xh",
            "label": {
              "en": "Xhosa"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/yi",
            "label": {
              "en": "Yiddish"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/yo",
            "label": {
              "en": "Yoruba"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/za",
            "label": {
              "en": "Zhuang |  Chuang"
            }
          },
          {
            "value": "http://id.loc.gov/vocabulary/iso639-1/zu",
            "label": {
              "en": "Zulu"
            }
          }
        ],
        "nodetype": "URI"
      },
      {
        "id": "dcterms:relation",
        "property": "http://purl.org/dc/terms/relation",
        "label": {
          "en": "Relation",
          "sv": "Relation",
          "de": "Beziehung"
        },
        "description": {
          "en": "A related resource."
        },
        "type": "choice",
        "nodetype": "URI"
      },
      {
        "id": "dcterms:coverage",
        "property": "http://purl.org/dc/terms/coverage",
        "label": {
          "en": "Coverage",
          "sv": "Utsträckning",
          "de": "Umfang"
        },
        "description": {
          "en": "The spatial or temporal topic of the resource, the spatial applicability of the resource, or the jurisdiction under which the resource is relevant."
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/LocationPeriodOrJurisdiction"
        },
        "type": "group",
        "automatic": true,
        "items": []
      },
      {
        "id": "dcterms:rights",
        "property": "http://purl.org/dc/terms/rights",
        "label": {
          "en": "Rights",
          "sv": "Rättigheter",
          "de": "Rechte"
        },
        "description": {
          "en": "Information about rights held in and over the resource."
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/RightsStatement"
        },
        "type": "group",
        "automatic": true,
        "items": []
      },
      {
        "id": "dcterms:audience",
        "property": "http://purl.org/dc/terms/audience",
        "label": {
          "en": "Audience",
          "sv": "Målgrupp",
          "de": "Zielgruppe"
        },
        "description": {
          "en": "A class of entity for whom the resource is intended or useful."
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/AgentClass"
        },
        "type": "group",
        "automatic": true,
        "items": []
      },
      {
        "id": "dcterms:alternative",
        "property": "http://purl.org/dc/terms/alternative",
        "label": {
          "en": "Alternative title",
          "sv": "Alternativ titel",
          "de": "Alternativer Titel"
        },
        "description": {
          "en": "An alternative name for the resource."
        },
        "type": "text",
        "nodetype": "LANGUAGE_LITERAL",
        "cardinality": {
          "min": 0,
          "pref": 1
        }
      },
      {
        "id": "dcterms:tableOfContents",
        "property": "http://purl.org/dc/terms/tableOfContents",
        "label": {
          "en": "Table Of Contents",
          "sv": "Innehållsförteckning",
          "de": "Inhaltsverzeichnis"
        },
        "description": {
          "en": "A list of subunits of the resource."
        },
        "type": "text",
        "nodetype": "LANGUAGE_LITERAL",
        "styles": [
          "multiline"
        ],
        "cardinality": {
          "min": 0,
          "pref": 1
        }
      },
      {
        "id": "dcterms:abstract",
        "property": "http://purl.org/dc/terms/abstract",
        "label": {
          "en": "Abstract",
          "sv": "Sammandrag",
          "de": "Zusammenfassung"
        },
        "description": {
          "en": "A summary of the resource."
        },
        "type": "text",
        "nodetype": "LANGUAGE_LITERAL",
        "styles": [
          "multiline"
        ],
        "cardinality": {
          "min": 0,
          "pref": 1
        }
      },
      {
        "id": "dcterms:created",
        "property": "http://purl.org/dc/terms/created",
        "label": {
          "en": "Date created",
          "sv": "Skapelsedatum",
          "de": "Erstellungsdatum",
          "da": "Dato for oprettelse"
        },
        "description": {
          "en": "Date of creation of the resource.",
          "sv": "Datum då resursen har skapats."
        },
        "type": "text",
        "nodetype": "DATATYPE_LITERAL",
        "datatype": "http://www.w3.org/2001/XMLSchema#date"
      },
      {
        "id": "dcterms:valid",
        "property": "http://purl.org/dc/terms/valid",
        "label": {
          "en": "Date valid",
          "sv": "Giltighetsdatum",
          "de": "Gültigheitsdatum"
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
          "en": "Date available",
          "sv": "Tillgänglighetsdatum",
          "de": "Verfügbarkeitsdatum"
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
          "en": "Date issued",
          "sv": "Utgivningsdatum",
          "de": "Veröffentlichungsdatum"
        },
        "description": {
          "en": "Date of formal issuance (e.g., publication) of the resource."
        },
        "type": "text",
        "nodetype": "DATATYPE_LITERAL",
        "datatype": "http://www.w3.org/2001/XMLSchema#date",
        "cardinality": {
          "min": 0,
          "pref": 1
        }
      },
      {
        "id": "dcterms:modified",
        "property": "http://purl.org/dc/terms/modified",
        "label": {
          "en": "Date modified",
          "sv": "Ändringsdatum",
          "de": "Änderungsdatum"
        },
        "description": {
          "en": "Date on which the resource was changed."
        },
        "type": "text",
        "nodetype": "DATATYPE_LITERAL",
        "datatype": "http://www.w3.org/2001/XMLSchema#date"
      },
      {
        "id": "dcterms:extent",
        "property": "http://purl.org/dc/terms/extent",
        "label": {
          "en": "Extent",
          "sv": "Utsträckning",
          "de": "Ausmaß"
        },
        "description": {
          "en": "The size or duration of the resource."
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/SizeOrDuration"
        },
        "type": "group",
        "automatic": true,
        "items": []
      },
      {
        "id": "dcterms:medium",
        "property": "http://purl.org/dc/terms/medium",
        "label": {
          "en": "Medium",
          "sv": "Medium",
          "de": "Medium"
        },
        "description": {
          "en": "The material or physical carrier of the resource."
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/PhysicalMedium"
        },
        "type": "group",
        "automatic": true,
        "items": []
      },
      {
        "id": "dcterms:isVersionOf",
        "property": "http://purl.org/dc/terms/isVersionOf",
        "label": {
          "en": "Is version of",
          "sv": "Är version av",
          "de": "Ist Version von"
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
          "en": "Has version",
          "sv": "Har version",
          "de": "Hat Version"
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
          "en": "Is replaced by",
          "sv": "Har ersatts med",
          "de": "Wurde ersetzt durch"
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
          "en": "Replaces",
          "sv": "Ersätter",
          "de": "Ersetzt"
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
          "en": "Is required by",
          "sv": "Krävs av",
          "de": "Wird benötigt von"
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
          "en": "Requires",
          "sv": "Kräver",
          "de": "Benötigt"
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
          "en": "Is part of",
          "sv": "Är del av",
          "de": "Ist Teil von"
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
          "en": "Has part",
          "sv": "Har del",
          "de": "Hat Teil"
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
          "en": "Is referenced by",
          "sv": "Refereras av",
          "de": "Wird referenziert von"
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
          "en": "References",
          "sv": "Referenser",
          "de": "Referenzen"
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
          "en": "Is format of",
          "sv": "Är format av",
          "de": "Ist Format von"
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
          "en": "Has format",
          "sv": "Har format",
          "de": "Hat Format"
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
          "en": "Conforms to",
          "sv": "Följer standard",
          "de": "Folgt Standard"
        },
        "description": {
          "en": "An established standard to which the described resource conforms."
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/Standard"
        },
        "type": "group",
        "automatic": true,
        "items": []
      },
      {
        "id": "dcterms:spatial",
        "property": "http://purl.org/dc/terms/spatial",
        "label": {
          "en": "Spatial Coverage",
          "sv": "Geografisk täckning",
          "de": "Geographischer Umfang"
        },
        "description": {
          "en": "Spatial characteristics of the resource."
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/Location"
        },
        "type": "group",
        "automatic": true,
        "items": []
      },
      {
        "id": "dcterms:temporal",
        "property": "http://purl.org/dc/terms/temporal",
        "label": {
          "en": "Temporal coverage",
          "sv": "Tidsmässig omfattning",
          "de": "Zeitlicher Umfang"
        },
        "description": {
          "en": "Temporal characteristics of the resource."
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/PeriodOfTime"
        },
        "type": "group",
        "automatic": true,
        "items": []
      },
      {
        "id": "dcterms:mediator",
        "property": "http://purl.org/dc/terms/mediator",
        "label": {
          "en": "Mediator",
          "sv": "Medlare",
          "de": "Vermittler"
        },
        "description": {
          "en": "An entity that mediates access to the resource and for whom the resource is intended or useful."
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/AgentClass"
        },
        "type": "group",
        "automatic": true,
        "items": []
      },
      {
        "id": "dcterms:dateAccepted",
        "property": "http://purl.org/dc/terms/dateAccepted",
        "label": {
          "en": "Date accepted",
          "sv": "Acceptansdatum",
          "de": "Abnahmedatum"
        },
        "description": {
          "en": "Date of acceptance of the resource."
        },
        "type": "text",
        "nodetype": "DATATYPE_LITERAL",
        "datatype": "http://www.w3.org/2001/XMLSchema#date",
        "cardinality": {
          "min": 0,
          "pref": 1
        }
      },
      {
        "id": "dcterms:dateCopyrighted",
        "property": "http://purl.org/dc/terms/dateCopyrighted",
        "label": {
          "en": "Date copyrighted",
          "sv": "Upphovsrättsskyddsdatum",
          "de": "Copyright-Datum"
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
          "en": "Date submitted",
          "sv": "Inlämningsdatum",
          "de": "Einreichungsdatum"
        },
        "description": {
          "en": "Date of submission of the resource."
        },
        "type": "text",
        "nodetype": "DATATYPE_LITERAL",
        "datatype": "http://www.w3.org/2001/XMLSchema#date",
        "cardinality": {
          "min": 0,
          "pref": 1
        }
      },
      {
        "id": "dcterms:educationLevel",
        "property": "http://purl.org/dc/terms/educationLevel",
        "label": {
          "en": "Audience Education Level",
          "sv": "Målgruppens utbildningsnivå",
          "de": "Ausbildungsniveau der Zielgruppe"
        },
        "description": {
          "en": "A class of entity, defined in terms of progression through an educational or training context, for which the described resource is intended."
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/AgentClass"
        },
        "type": "group",
        "automatic": true,
        "items": []
      },
      {
        "id": "dcterms:accessRights",
        "property": "http://purl.org/dc/terms/accessRights",
        "label": {
          "en": "Access rights",
          "sv": "Åtkomsträttighet",
          "de": "Zugriffsrechte"
        },
        "description": {
          "en": "Information about who can access the resource or an indication of its security status."
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/RightsStatement"
        },
        "type": "group",
        "automatic": true,
        "items": []
      },
      {
        "id": "dcterms:bibliographicCitation",
        "property": "http://purl.org/dc/terms/bibliographicCitation",
        "label": {
          "en": "Bibliographic citation",
          "sv": "Bibliografisk citering",
          "de": "Bibliographisches Zitat"
        },
        "description": {
          "en": "A bibliographic reference for the resource."
        },
        "type": "text",
        "nodetype": "LANGUAGE_LITERAL",
        "styles": [
          "multiline"
        ],
        "cardinality": {
          "min": 0,
          "pref": 1
        }
      },
      {
        "id": "dcterms:license",
        "label": {
          "en": "License",
          "sv": "Licens",
          "de": "Lizenz"
        },
        "description": {
          "en": "A legal document giving official permission to do something with the resource."
        },
        "type": "group",
        "automatic": true,
        "cardinality": {
          "min": 1,
          "pref": 1,
          "max": 1
        },
        "items": [
          {
            "type": "choice",
            "property": "http://purl.org/dc/terms/license",
            "nodetype": "URI",
            "extends": "dcterms:cc-license-choices",
            "label": {
              "en": "Choose a CC license"
            },
            "cardinality": {
              "min": 0,
              "pref": 1
            }
          },
          {
            "type": "text",
            "property": "http://purl.org/dc/terms/license",
            "label": {
              "de": "or provide a URL to a license"
            },
            "cardinality": {
              "min": 0,
              "pref": 1
            },
            "nodetype": "URI"
          }
        ]
      },
      {
        "id": "dcterms:rightsHolder",
        "property": "http://purl.org/dc/terms/rightsHolder",
        "label": {
          "en": "Rights holder",
          "sv": "Rättighetsinnehavare",
          "de": "Rechteinhaber"
        },
        "description": {
          "en": "A person or organization owning or managing rights over the resource.",
          "sv": "En person eller organisation som äger eller förvaltar resursens rättigheter."
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
          "en": "Provenance",
          "sv": "Ursprung",
          "de": "Herkunft"
        },
        "description": {
          "en": "A statement of any changes in ownership and custody of the resource since its creation that are significant for its authenticity, integrity, and interpretation."
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/ProvenanceStatement"
        },
        "type": "group",
        "automatic": true,
        "items": []
      },
      {
        "id": "dcterms:instructionalMethod",
        "property": "http://purl.org/dc/terms/instructionalMethod",
        "label": {
          "en": "Instructional method",
          "sv": "Instruktionsmetod",
          "de": "Lehrmethode"
        },
        "description": {
          "en": "A process, used to engender knowledge, attitudes and skills, that the described resource is designed to support."
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/MethodOfInstruction"
        },
        "type": "group",
        "automatic": true,
        "items": []
      },
      {
        "id": "dcterms:accrualMethod",
        "property": "http://purl.org/dc/terms/accrualMethod",
        "label": {
          "en": "Accrual method"
        },
        "description": {
          "en": "The method by which items are added to a collection."
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/MethodOfAccrual"
        },
        "type": "group",
        "automatic": true,
        "items": []
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
        "items": []
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
        "items": []
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
        "items": []
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
        "items": []
      },
      {
        "id": "dcterms:BibliographicResource",
        "label": {
          "en": "Bibliographic resource",
          "sv": "Bibliografisk resurs",
          "de": "Bibliographische Ressource"
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/BibliographicResource"
        },
        "description": {
          "en": "A book, article, or other documentary resource."
        },
        "type": "group",
        "items": [
          {
            "id": "dcterms:title"
          },
          {
            "id": "dcterms:alternative"
          },
          {
            "id": "dcterms:identifier"
          },
          {
            "id": "dcterms:abstract"
          },
          {
            "id": "dcterms:subject"
          },
          {
            "id": "dcterms:bibliographicCitation"
          },
          {
            "id": "dcterms:date"
          },
          {
            "id": "dcterms:dateAccepted"
          },
          {
            "id": "dcterms:dateSubmitted"
          },
          {
            "id": "dcterms:issued"
          },
          {
            "id": "dcterms:publisher"
          },
          {
            "id": "dcterms:creator"
          },
          {
            "id": "dcterms:contributor"
          },
          {
            "id": "dcterms:tableOfContents"
          }
        ]
      },
      {
        "id": "dcterms:FileFormat",
        "label": {
          "en": "File format",
          "sv": "Filformat",
          "de": "Dateiformat"
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/FileFormat"
        },
        "description": {
          "en": "A digital resource format."
        },
        "type": "group",
        "items": []
      },
      {
        "id": "dcterms:Frequency",
        "label": {
          "en": "Frequency",
          "sv": "",
          "de": ""
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/Frequency"
        },
        "description": {
          "en": "A rate at which something recurs."
        },
        "type": "group",
        "items": []
      },
      {
        "id": "dcterms:Jurisdiction",
        "label": {
          "en": "Jurisdiction",
          "sv": "Frekvens",
          "de": "Frequenz"
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/Jurisdiction"
        },
        "description": {
          "en": "The extent or range of judicial, law enforcement, or other authority."
        },
        "type": "group",
        "items": []
      },
      {
        "id": "dcterms:LicenseDocument",
        "label": {
          "en": "License document",
          "sv": "Licensdokument",
          "de": "Lizenzdokument"
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/LicenseDocument"
        },
        "description": {
          "en": "A legal document giving official permission to do something with a Resource."
        },
        "type": "group",
        "items": []
      },
      {
        "id": "dcterms:LinguisticSystem",
        "label": {
          "en": "Linguistic system",
          "sv": "Språksystem",
          "de": "Sprachsystem"
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/LinguisticSystem"
        },
        "description": {
          "en": "A system of signs, symbols, sounds, gestures, or rules used in communication."
        },
        "type": "group",
        "items": []
      },
      {
        "id": "dcterms:Location",
        "label": {
          "en": "Location",
          "sv": "Plats",
          "de": "Ort"
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/Location"
        },
        "description": {
          "en": "A spatial region or named place."
        },
        "type": "group",
        "items": []
      },
      {
        "id": "dcterms:LocationPeriodOrJurisdiction",
        "label": {
          "en": "Location, Period, or Jurisdiction",
          "sv": "Plats, period eller jurisdiktion",
          "de": "Ort, Zeitraum oder Gerichtsstand"
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/LocationPeriodOrJurisdiction"
        },
        "description": {
          "en": "A location, period of time, or jurisdiction."
        },
        "type": "group",
        "items": []
      },
      {
        "id": "dcterms:MediaType",
        "label": {
          "en": "Media type",
          "sv": "Mediatyp",
          "de": "Medientyp"
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/MediaType"
        },
        "description": {
          "en": "A file format or physical medium."
        },
        "type": "group",
        "items": []
      },
      {
        "id": "dcterms:MediaTypeOrExtent",
        "label": {
          "en": "Media type or extent",
          "sv": "Medietyp eller utsträckning",
          "de": "Medientyp oder Ausmaß"
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/MediaTypeOrExtent"
        },
        "description": {
          "en": "A media type or extent."
        },
        "type": "group",
        "items": []
      },
      {
        "id": "dcterms:MethodOfInstruction",
        "label": {
          "en": "Method of instruction",
          "sv": "Instruktionsmetod",
          "de": "Unterrichtsmethode"
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/MethodOfInstruction"
        },
        "description": {
          "en": "A process that is used to engender knowledge, attitudes, and skills."
        },
        "type": "group",
        "items": []
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
        "items": []
      },
      {
        "id": "dcterms:PeriodOfTime",
        "label": {
          "en": "Period of time",
          "sv": "Tidsperiod",
          "de": "Zeitspanne"
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/PeriodOfTime"
        },
        "description": {
          "en": "An interval of time that is named or defined by its start and end dates."
        },
        "type": "group",
        "items": []
      },
      {
        "id": "dcterms:PhysicalMedium",
        "label": {
          "en": "Physical medium",
          "sv": "Fysiskt medium",
          "de": "Physikalisches Medium"
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/PhysicalMedium"
        },
        "description": {
          "en": "A physical material or carrier."
        },
        "type": "group",
        "items": []
      },
      {
        "id": "dcterms:PhysicalResource",
        "label": {
          "en": "Physical resource",
          "sv": "Fysisk resurs",
          "de": "Physische Ressource"
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/PhysicalResource"
        },
        "description": {
          "en": "A material thing."
        },
        "type": "group",
        "items": [
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
        "items": []
      },
      {
        "id": "dcterms:ProvenanceStatement",
        "label": {
          "en": "Provenance statement"
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/ProvenanceStatement"
        },
        "description": {
          "en": "A statement of any changes in ownership and custody of a resource since its creation that are significant for its authenticity, integrity, and interpretation."
        },
        "type": "group",
        "items": []
      },
      {
        "id": "dcterms:RightsStatement",
        "label": {
          "en": "Rights statement",
          "de": "Rechteerklärung",
          "sv": "Rättighetsförklaring"
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/RightsStatement"
        },
        "description": {
          "en": "A statement about the intellectual property rights (IPR) held in or over a Resource, a legal document giving official permission to do something with a resource, or a statement about access rights."
        },
        "type": "group",
        "items": []
      },
      {
        "id": "dcterms:SizeOrDuration",
        "label": {
          "en": "Size or duration",
          "sv": "Storlek eller varaktighet",
          "de": "Größe oder Dauer"
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/SizeOrDuration"
        },
        "description": {
          "en": "A dimension or extent, or a time taken to play or execute."
        },
        "type": "group",
        "items": []
      },
      {
        "id": "dcterms:Standard",
        "label": {
          "en": "Standard",
          "sv": "Standard",
          "de": "Standard"
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/Standard"
        },
        "description": {
          "en": "A basis for comparison; a reference point against which other things can be evaluated."
        },
        "type": "group",
        "items": []
      },
      {
        "type": "choice",
        "id": "dcterms:cc-license-choices",
        "nodetype": "URI",
        "choices": [
          {
            "value": "http://creativecommons.org/licenses/by/3.0/",
            "label": {
              "en": "CC BY 3.0 (Attribution)"
            },
            "description": {
              "de": "Der Urheber gestattet die Ressource für kommerzielle Zwecke zu nutzen und Änderungen vorzunehmen",
              "sl": "Lastnik DOVOLJUJE komercialno rabo in spreminjanje vira.",
              "ro": "Autorul PERMITE utilizarea in scop comercial SI modificari asupra resursei",
              "el": "Άδεια που εφαρμόζεται στο αντικείμενο (αναφορικά με Creative Commons)",
              "hu": "A tulajdonos engedélyezi a kereskedelmi forgalomba hozatalt és a változásokat",
              "bg": "Притежателят ПОЗВОЛЯВА търговска употреба и промени в ресурса ",
              "fr": "Le détenteur des droits AUTORISE l'utilisation commerciale ET les modifications de la ressource",
              "en": "The owner ALLOWS commercial uses AND changes to the resource",
              "ru": "Владелец РАЗРЕШАЕТ как использование источника в коммерческих целях, ТАК И изменение содержания",
              "hi": "स्वामी वाणिज्यिक उपयोग एवं संसाधनों में परिवर्तन की अनुमति देता है",
              "et": "Omanik LUBAB kasutada allikat kommertslikel eesmärkidel JA muuta allika sisu",
              "es": "El propieatrio PERMITE uso comercial Y cambios en el recurso"
            }
          },
          {
            "value": "http://creativecommons.org/licenses/by-nc/3.0/",
            "label": {
              "en": "CC BY-NC 3.0 (Attribution, Non-Commercial)"
            },
            "description": {
              "de": "Der Urheber gestattet keine kommerzielle Nutzung, erlaubt aber Änderungen an der Ressource",
              "sl": "Lastnik NE dovoljuje komercialne rabe toda DOVOLJUJE spreminjanje vira.",
              "ro": "Autorul NU permite utilizarea in scop comercial dar PERMITE modificari asupra resursei",
              "el": "Ο ιδιοκτήτης του αντικειμένου ΔΕΝ επιτρέπει εμπορικές χρήσεις αλλά ΕΠΙΤΡΕΠΕΙ αλλαγές στο αντικείμενο",
              "hu": "A tulajdonos nem engedélyezi a kereskedelmi forgalomba hozatalt, de a módosítást igen. ",
              "bg": "Притежателят НЕ ПОЗВОЛЯВА за търговски цели, но ПОЗВОЛЯВА да се променя ресурса",
              "fr": "Le détenteur des droits N'AUTORISE PAS l'utilisation commerciale MAIS ACCEPTE les modifications de la ressource",
              "en": "The owner does NOT allow commercial uses but ALLOWS changes to the resource",
              "ru": "Владелец НЕ РАЗРЕШАЕТ использование источника в коммерческих целях, но РАЗРЕШАЕТ изменение содержания",
              "hi": "स्वामी वाणिज्यिक उपयोग की अनुमति नही देता है परंतु संसाधनों में परिवर्तन की अनुमति देता है",
              "et": "Omanik EI LUBA kasutada allikat kommertslikel eesmärkidel, kuid LUBAB muuta allika sisu",
              "es": "El propieatrio NO permite uso comercial pero PERMITE cambios en el recurso"
            }
          },
          {
            "value": "http://creativecommons.org/licenses/by-nc-nd/3.0/",
            "label": {
              "en": "CC BY-NC-ND 3.0 (Attribution, Non-Commercial, No Derivative Works)"
            },
            "description": {
              "de": "Der Urheber gestattet die nicht-kommerzielle Nutzung oder Änderungen an der Ressourcen",
              "sl": "Lastnik NE dovoljuje komercialne rabe ALI spreminjanja virov.",
              "ro": "Autorul NU permite nici utilizarea in scop comercial nici modificari asupra resursei",
              "el": "Ο ιδιοκτήτης του αντικειμένου ΕΠΙΤΡΕΠΕΙ εμπορικές χρήσεις αλλά ΌΧΙ αλλαγές στο αντικείμενο",
              "hu": "A tulajdonos nem engedélyezi a kereskedelmi forgalomba hozatalt és módosítást. ",
              "bg": "Притежателят НЕ позволява търговска употреба и ИЛИ да се променя ресурса ",
              "fr": "Le détenteur des droits N'AUTORISE PAS l'utilisation commerciale NI les modifications de la ressource",
              "en": "The owner does NOT allow commercial uses OR changes to the resource",
              "ru": "Владелец НЕ РАЗРЕШАЕТ как использование источника в коммерческих целях, ТАК И изменение содержания",
              "hi": "स्वामी वाणिज्यिक उपयोग और संसाधनों में परिवर्तन की अनुमति नहीं  देता है",
              "et": "Omanik EI LUBA kasutada allikat kommertslikel eesmärkidel EGA luba muuta allika sisu",
              "es": "El propieatrio NO permite uso comercial ni cambios en el recurso"
            }
          },
          {
            "value": "http://creativecommons.org/licenses/by-nc-sa/3.0/",
            "label": {
              "en": "CC BY-NC-SA 3.0 (Attribution, Non-Commercial, Share Alike)"
            }
          },
          {
            "value": "http://creativecommons.org/licenses/by-nd/3.0/",
            "label": {
              "en": "CC BY-ND 3.0 (Attribution, No Derivative Works)"
            },
            "description": {
              "de": "Der Urheber gestattet, die Ressource für kommerzielle Zwecke zu nutzen, es dürfen jedoch keine Änderungen vorgenommen werden",
              "sl": "Lastnik DOVOLJUJE komercialno rabo toda NE dovoli spreminjanja vira.",
              "ro": "Autorul PERMITE utilizarea in scop comercial dar nu permite modificari asupra resursei",
              "el": "Ο ιδιοκτήτης του αντικειμένου ΕΠΙΤΡΕΠΕΙ εμπορικές χρήσεις ΚΑΙ αλλαγές στο αντικείμενο",
              "hu": "A tulajdonos engedélyezi a kereskedelmi forgalomba hozatalt, változások nélkül.",
              "bg": "Притежателят ПОЗВОЛЯВА търговска употреба, но НЕ се позволява да се променя ресурса",
              "fr": "Le détenteur des droits AUTORISE l'utilisation commerciale MAIS REFUSE les modifications de la ressource",
              "en": "The owner ALLOWS commercial uses but does NOT allow changes to the resource",
              "ru": "Владелец РАЗРЕШАЕТ использование источника в коммерческих целях, но НЕ РАЗРЕШАЕТ изменение содержания",
              "hi": "स्वामी वाणिज्यिक उपयोग की अनुमति देता है परंतु  संसाधनों में परिवर्तन की अनुमति नहीं  देता है",
              "et": "Omanik LUBAB kasutada allikat kommertslikel eesmärkidel, kuid EI luba muuta allika sisu",
              "es": "El propieatrio PERMITE uso comercial pero NO permite cambios en el recurso"
            }
          },
          {
            "value": "http://creativecommons.org/licenses/by-sa/3.0/",
            "label": {
              "en": "CC BY-SA 3.0 (Attribution, Share Alike)"
            }
          },
          {
            "value": "http://creativecommons.org/publicdomain/zero/1.0/",
            "label": {
              "en": "CC0 1.0 (Public Domain Dedication, No Copyright)"
            }
          }
        ],
        "styles": [
          "verticalRadioButtons"
        ],
        "description": {}
      }
    ],
    "scope": "dcterms",
    "namespace": "http://purl.org/dc/terms/"
  },
  {
    "templates": [
      {
        "id": "foaf:mbox",
        "property": "http://xmlns.com/foaf/0.1/mbox",
        "label": {
          "en": "Personal mailbox",
          "sv": "Personlig e-postadress",
          "de": "Persönliche E-Mail-Adresse"
        },
        "description": {
          "en": "A personal mailbox, ie. an Internet mailbox associated with exactly one owner, the first owner of this mailbox. This is a 'static inverse functional property', in that  there is (across time and change) at most one individual that ever has any particular value for foaf:mbox."
        },
        "type": "text",
        "nodetype": "URI",
        "cardinality": {
          "pref": 1
        },
        "styles": [
          "email"
        ],
        "valueTemplate": "mailto:"
      },
      {
        "id": "foaf:mbox_sha1sum",
        "property": "http://xmlns.com/foaf/0.1/mbox_sha1sum",
        "label": {
          "en": "sha1sum of a personal mailbox URI name"
        },
        "description": {
          "en": "The sha1sum of the URI of an Internet mailbox associated with exactly one owner, the  first owner of the mailbox."
        },
        "type": "text",
        "nodetype": "ONLY_LITERAL",
        "cardinality": {
          "pref": 1
        }
      },
      {
        "id": "foaf:gender",
        "property": "http://xmlns.com/foaf/0.1/gender",
        "label": {
          "en": "Gender",
          "sv": "Kön",
          "de": "Geschlecht"
        },
        "description": {
          "en": "The gender of this Agent (typically but not necessarily 'male' or 'female')."
        },
        "type": "text",
        "nodetype": "ONLY_LITERAL",
        "cardinality": {
          "pref": 1
        }
      },
      {
        "id": "foaf:sha1",
        "property": "http://xmlns.com/foaf/0.1/sha1",
        "label": {
          "en": "sha1sum (hex)"
        },
        "description": {
          "en": "A sha1sum hash, in hex."
        },
        "type": "group",
        "automatic": true,
        "items": []
      },
      {
        "id": "foaf:based_near",
        "property": "http://xmlns.com/foaf/0.1/based_near",
        "label": {
          "en": "Based near",
          "sv": "I närheten",
          "de": "In der Nähe"
        },
        "description": {
          "en": "A location that something is based near, for some broadly human notion of near."
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.w3.org/2003/01/geo/wgs84_pos#SpatialThing"
        },
        "type": "group",
        "automatic": true,
        "items": [
          {
            "id": "foaf:based_near"
          },
          {
            "id": "foaf:name"
          },
          {
            "id": "foaf:homepage"
          },
          {
            "id": "foaf:maker"
          },
          {
            "id": "foaf:depiction"
          },
          {
            "id": "foaf:logo"
          },
          {
            "id": "foaf:isPrimaryTopicOf"
          },
          {
            "id": "foaf:page"
          },
          {
            "id": "foaf:img"
          },
          {
            "id": "foaf:homepage"
          },
          {
            "id": "foaf:openid"
          },
          {
            "id": "foaf:homepage"
          },
          {
            "id": "foaf:weblog"
          },
          {
            "id": "foaf:tipjar"
          },
          {
            "id": "foaf:homepage"
          },
          {
            "id": "foaf:openid"
          },
          {
            "id": "foaf:isPrimaryTopicOf"
          }
        ]
      },
      {
        "id": "foaf:title",
        "property": "http://xmlns.com/foaf/0.1/title",
        "label": {
          "en": "Title",
          "sv": "Titel",
          "de": "Titel"
        },
        "description": {
          "en": "Title (Mr, Mrs, Ms, Dr. etc)"
        },
        "type": "choice",
        "automatic": true,
        "content": [],
        "cardinality": {
          "min": 0,
          "pref": 1
        },
        "choices": [
          {
            "value": "Dr",
            "label": {
              "en": "Dr"
            }
          },
          {
            "value": "Mr",
            "label": {
              "en": "Mr"
            }
          },
          {
            "value": "Mrs",
            "label": {
              "en": "Mrs"
            }
          },
          {
            "value": "Ms",
            "label": {
              "en": "Ms"
            }
          }
        ],
        "nodetype": "ONLY_LITERAL"
      },
      {
        "id": "foaf:nick",
        "property": "http://xmlns.com/foaf/0.1/nick",
        "label": {
          "en": "Nickname",
          "sv": "Smeknamn",
          "de": "Spitzname"
        },
        "description": {
          "en": "A short informal nickname characterising an agent (includes login identifiers, IRC and other chat nicknames)."
        },
        "type": "group",
        "automatic": true,
        "items": []
      },
      {
        "id": "foaf:jabberID",
        "property": "http://xmlns.com/foaf/0.1/jabberID",
        "label": {
          "en": "Jabber ID"
        },
        "description": {
          "en": "A jabber ID for something."
        },
        "type": "text",
        "nodetype": "ONLY_LITERAL",
        "cardinality": {
          "pref": 1
        }
      },
      {
        "id": "foaf:aimChatID",
        "property": "http://xmlns.com/foaf/0.1/aimChatID",
        "label": {
          "en": "AIM chat ID"
        },
        "description": {
          "en": "An AIM chat ID"
        },
        "type": "text",
        "nodetype": "ONLY_LITERAL",
        "cardinality": {
          "pref": 1
        }
      },
      {
        "id": "foaf:skypeID",
        "property": "http://xmlns.com/foaf/0.1/skypeID",
        "label": {
          "en": "Skype ID"
        },
        "description": {
          "en": "A Skype ID"
        },
        "type": "text",
        "nodetype": "ONLY_LITERAL",
        "cardinality": {
          "pref": 1
        }
      },
      {
        "id": "foaf:icqChatID",
        "property": "http://xmlns.com/foaf/0.1/icqChatID",
        "label": {
          "en": "ICQ chat ID"
        },
        "description": {
          "en": "An ICQ chat ID"
        },
        "type": "text",
        "nodetype": "ONLY_LITERAL",
        "cardinality": {
          "pref": 1
        }
      },
      {
        "id": "foaf:yahooChatID",
        "property": "http://xmlns.com/foaf/0.1/yahooChatID",
        "label": {
          "en": "Yahoo chat ID"
        },
        "description": {
          "en": "A Yahoo chat ID"
        },
        "type": "text",
        "nodetype": "ONLY_LITERAL",
        "cardinality": {
          "pref": 1
        }
      },
      {
        "id": "foaf:msnChatID",
        "property": "http://xmlns.com/foaf/0.1/msnChatID",
        "label": {
          "en": "MSN chat ID"
        },
        "description": {
          "en": "An MSN chat ID"
        },
        "type": "text",
        "nodetype": "ONLY_LITERAL",
        "cardinality": {
          "pref": 1
        }
      },
      {
        "id": "foaf:name",
        "property": "http://xmlns.com/foaf/0.1/name",
        "label": {
          "en": "Name",
          "sv": "Namn",
          "nb": "Navn",
          "da": "Navn",
          "de": "Name"
        },
        "description": {
          "en": "A name for some thing."
        },
        "type": "text",
        "nodetype": "ONLY_LITERAL",
        "cardinality": {
          "pref": 1
        }
      },
      {
        "id": "foaf:firstName",
        "property": "http://xmlns.com/foaf/0.1/firstName",
        "label": {
          "en": "First name",
          "sv": "Förnamn",
          "de": "Vorname"
        },
        "description": {
          "en": "The first name of a person."
        },
        "type": "text",
        "nodetype": "ONLY_LITERAL",
        "cardinality": {
          "pref": 1
        }
      },
      {
        "id": "foaf:lastName",
        "property": "http://xmlns.com/foaf/0.1/lastName",
        "label": {
          "en": "Last name",
          "sv": "Efternamn",
          "de": "Nachname"
        },
        "description": {
          "en": "The last name of a person."
        },
        "type": "text",
        "nodetype": "ONLY_LITERAL",
        "cardinality": {
          "pref": 1
        }
      },
      {
        "id": "foaf:givenName",
        "property": "http://xmlns.com/foaf/0.1/givenName",
        "label": {
          "en": "Given name",
          "sv": "Förnamn",
          "de": "Vorname"
        },
        "description": {
          "en": "The given name of some person."
        },
        "type": "text",
        "automatic": true,
        "content": [],
        "nodetype": "ONLY_LITERAL"
      },
      {
        "id": "foaf:familyName",
        "property": "http://xmlns.com/foaf/0.1/familyName",
        "label": {
          "en": "Family name",
          "sv": "Familjenamn",
          "de": "Familienname"
        },
        "description": {
          "en": "The family name of some person."
        },
        "type": "text",
        "nodetype": "ONLY_LITERAL",
        "cardinality": {
          "pref": 1
        }
      },
      {
        "id": "foaf:phone",
        "property": "http://xmlns.com/foaf/0.1/phone",
        "label": {
          "en": "Phone",
          "sv": "Telefon",
          "de": "Telefon"
        },
        "description": {
          "en": "A phone, specified using fully qualified tel: URI scheme (refs: http://www.w3.org/Addressing/schemes.html#tel)."
        },
        "type": "group",
        "automatic": true,
        "items": []
      },
      {
        "id": "foaf:homepage",
        "property": "http://xmlns.com/foaf/0.1/homepage",
        "label": {
          "en": "Homepage",
          "sv": "Hemsida",
          "nb": "Hjemmeside",
          "da": "Hjemmeside",
          "de": "Homepage"
        },
        "description": {
          "en": "A homepage for some thing."
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://xmlns.com/foaf/0.1/Document"
        },
        "type": "text",
        "nodetype": "URI",
        "cardinality": {
          "pref": 1
        },
        "styles": [
          "externalLink"
        ]
      },
      {
        "id": "foaf:weblog",
        "property": "http://xmlns.com/foaf/0.1/weblog",
        "label": {
          "en": "Weblog"
        },
        "description": {
          "en": "A weblog of some thing (whether person, group, company etc.)."
        },
        "type": "text",
        "nodetype": "URI",
        "cardinality": {
          "pref": 1
        },
        "styles": [
          "externalLink"
        ]
      },
      {
        "id": "foaf:openid",
        "property": "http://xmlns.com/foaf/0.1/openid",
        "label": {
          "en": "OpenID"
        },
        "description": {
          "en": "An OpenID for an Agent."
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://xmlns.com/foaf/0.1/Document"
        },
        "type": "choice",
        "nodetype": "RESOURCE",
        "cardinality": {
          "pref": 1
        }
      },
      {
        "id": "foaf:tipjar",
        "property": "http://xmlns.com/foaf/0.1/tipjar",
        "label": {
          "en": "tipjar"
        },
        "description": {
          "en": "A tipjar document for this agent, describing means for payment and reward."
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://xmlns.com/foaf/0.1/Document"
        },
        "type": "choice",
        "nodetype": "RESOURCE",
        "cardinality": {
          "pref": 1
        }
      },
      {
        "id": "foaf:plan",
        "property": "http://xmlns.com/foaf/0.1/plan",
        "label": {
          "en": "plan"
        },
        "description": {
          "en": "A .plan comment, in the tradition of finger and '.plan' files."
        },
        "type": "text",
        "nodetype": "LANGUAGE_LITERAL",
        "styles": [
          "multiline"
        ],
        "cardinality": {
          "pref": 1
        }
      },
      {
        "id": "foaf:made",
        "property": "http://xmlns.com/foaf/0.1/made",
        "label": {
          "en": "made"
        },
        "description": {
          "en": "Something that was made by this agent."
        },
        "type": "choice",
        "nodetype": "RESOURCE",
        "cardinality": {
          "pref": 1
        }
      },
      {
        "id": "foaf:maker",
        "property": "http://xmlns.com/foaf/0.1/maker",
        "label": {
          "en": "maker"
        },
        "description": {
          "en": "An agent that \nmade this thing."
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://xmlns.com/foaf/0.1/Agent"
        },
        "type": "choice",
        "nodetype": "RESOURCE",
        "cardinality": {
          "pref": 1
        }
      },
      {
        "id": "foaf:img",
        "property": "http://xmlns.com/foaf/0.1/img",
        "label": {
          "en": "Image",
          "sv": "Bild",
          "de": "Bild"
        },
        "description": {
          "en": "An image that can be used to represent some thing (ie. those depictions which are particularly representative of something, eg. one's photo on a homepage)."
        },
        "type": "text",
        "nodetype": "URI",
        "cardinality": {
          "pref": 1
        }
      },
      {
        "id": "foaf:depiction",
        "property": "http://xmlns.com/foaf/0.1/depiction",
        "label": {
          "en": "depiction"
        },
        "description": {
          "en": "A depiction of some thing."
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://xmlns.com/foaf/0.1/Image"
        },
        "type": "text",
        "nodetype": "URI",
        "cardinality": {
          "pref": 1
        },
        "styles": [
          "image"
        ]
      },
      {
        "id": "foaf:depicts",
        "property": "http://xmlns.com/foaf/0.1/depicts",
        "label": {
          "en": "depicts"
        },
        "description": {
          "en": "A thing depicted in this representation."
        },
        "type": "text",
        "nodetype": "URI",
        "cardinality": {
          "pref": 1
        }
      },
      {
        "id": "foaf:thumbnail",
        "property": "http://xmlns.com/foaf/0.1/thumbnail",
        "label": {
          "en": "thumbnail"
        },
        "description": {
          "en": "A derived thumbnail image."
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://xmlns.com/foaf/0.1/Image"
        },
        "type": "choice",
        "nodetype": "RESOURCE",
        "cardinality": {
          "pref": 1
        }
      },
      {
        "id": "foaf:myersBriggs",
        "property": "http://xmlns.com/foaf/0.1/myersBriggs",
        "label": {
          "en": "myersBriggs"
        },
        "description": {
          "en": "A Myers Briggs (MBTI) personality classification."
        },
        "type": "text",
        "nodetype": "ONLY_LITERAL",
        "cardinality": {
          "pref": 1
        }
      },
      {
        "id": "foaf:workplaceHomepage",
        "property": "http://xmlns.com/foaf/0.1/workplaceHomepage",
        "label": {
          "en": "workplace homepage"
        },
        "description": {
          "en": "A workplace homepage of some person; the homepage of an organization they work for."
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://xmlns.com/foaf/0.1/Document"
        },
        "type": "choice",
        "nodetype": "RESOURCE",
        "cardinality": {
          "pref": 1
        },
        "styles": [
          "externalLink"
        ]
      },
      {
        "id": "foaf:workInfoHomepage",
        "property": "http://xmlns.com/foaf/0.1/workInfoHomepage",
        "label": {
          "en": "work info homepage"
        },
        "description": {
          "en": "A work info homepage of some person; a page about their work for some organization."
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://xmlns.com/foaf/0.1/Document"
        },
        "type": "choice",
        "nodetype": "RESOURCE",
        "cardinality": {
          "pref": 1
        },
        "styles": [
          "externalLink"
        ]
      },
      {
        "id": "foaf:schoolHomepage",
        "property": "http://xmlns.com/foaf/0.1/schoolHomepage",
        "label": {
          "en": "schoolHomepage"
        },
        "description": {
          "en": "A homepage of a school attended by the person."
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://xmlns.com/foaf/0.1/Document"
        },
        "type": "choice",
        "nodetype": "RESOURCE",
        "cardinality": {
          "pref": 1
        },
        "styles": [
          "externalLink"
        ]
      },
      {
        "id": "foaf:knows",
        "property": "http://xmlns.com/foaf/0.1/knows",
        "label": {
          "en": "Knows",
          "sv": "Känner",
          "de": "Kennt"
        },
        "description": {
          "en": "A person known by this person (indicating some level of reciprocated interaction between the parties)."
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://xmlns.com/foaf/0.1/Person"
        },
        "type": "choice",
        "nodetype": "RESOURCE",
        "cardinality": {
          "min": 0,
          "pref": 1
        }
      },
      {
        "id": "foaf:interest",
        "property": "http://xmlns.com/foaf/0.1/interest",
        "label": {
          "en": "interest"
        },
        "description": {
          "en": "A page about a topic of interest to this person."
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://xmlns.com/foaf/0.1/Document"
        },
        "type": "choice",
        "nodetype": "RESOURCE",
        "cardinality": {
          "pref": 1
        },
        "styles": [
          "externalLink"
        ]
      },
      {
        "id": "foaf:topic_interest",
        "property": "http://xmlns.com/foaf/0.1/topic_interest",
        "label": {
          "en": "topic_interest"
        },
        "description": {
          "en": "A thing of interest to this person."
        },
        "type": "text",
        "nodetype": "URI",
        "cardinality": {
          "pref": 1
        }
      },
      {
        "id": "foaf:publications",
        "property": "http://xmlns.com/foaf/0.1/publications",
        "label": {
          "en": "Publications",
          "sv": "Publikationer",
          "de": "Publikationen"
        },
        "description": {
          "en": "A link to the publications of this person."
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://xmlns.com/foaf/0.1/Document"
        },
        "type": "choice",
        "nodetype": "RESOURCE",
        "cardinality": {
          "pref": 1
        },
        "styles": [
          "externalLink"
        ]
      },
      {
        "id": "foaf:currentProject",
        "property": "http://xmlns.com/foaf/0.1/currentProject",
        "label": {
          "en": "current project"
        },
        "description": {
          "en": "A current project this person works on."
        },
        "type": "text",
        "nodetype": "URI",
        "cardinality": {
          "pref": 1
        }
      },
      {
        "id": "foaf:pastProject",
        "property": "http://xmlns.com/foaf/0.1/pastProject",
        "label": {
          "en": "past project"
        },
        "description": {
          "en": "A project this person has previously worked on."
        },
        "type": "text",
        "nodetype": "URI",
        "cardinality": {
          "pref": 1
        }
      },
      {
        "id": "foaf:logo",
        "property": "http://xmlns.com/foaf/0.1/logo",
        "label": {
          "en": "logo"
        },
        "description": {
          "en": "A logo representing some thing."
        },
        "type": "text",
        "nodetype": "URI",
        "cardinality": {
          "pref": 1
        }
      },
      {
        "id": "foaf:topic",
        "property": "http://xmlns.com/foaf/0.1/topic",
        "label": {
          "en": "topic"
        },
        "description": {
          "en": "A topic of some page or document."
        },
        "type": "text",
        "nodetype": "URI",
        "cardinality": {
          "pref": 1
        }
      },
      {
        "id": "foaf:primaryTopic",
        "property": "http://xmlns.com/foaf/0.1/primaryTopic",
        "label": {
          "en": "primary topic"
        },
        "description": {
          "en": "The primary topic of some page or document."
        },
        "type": "text",
        "nodetype": "URI",
        "cardinality": {
          "pref": 1
        }
      },
      {
        "id": "foaf:focus",
        "property": "http://xmlns.com/foaf/0.1/focus",
        "label": {
          "en": "focus"
        },
        "description": {
          "en": "The underlying or 'focal' entity associated with some SKOS-described concept."
        },
        "type": "text",
        "nodetype": "URI",
        "cardinality": {
          "pref": 1
        }
      },
      {
        "id": "foaf:isPrimaryTopicOf",
        "property": "http://xmlns.com/foaf/0.1/isPrimaryTopicOf",
        "label": {
          "en": "is primary topic of"
        },
        "description": {
          "en": "A document that this thing is the primary topic of."
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://xmlns.com/foaf/0.1/Document"
        },
        "type": "choice",
        "nodetype": "RESOURCE",
        "cardinality": {
          "pref": 1
        },
        "styles": [
          "externalLink"
        ]
      },
      {
        "id": "foaf:page",
        "property": "http://xmlns.com/foaf/0.1/page",
        "label": {
          "en": "Page",
          "sv": "Sida",
          "de": "Seite"
        },
        "description": {
          "en": "A page or document about this thing."
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://xmlns.com/foaf/0.1/Document"
        },
        "type": "choice",
        "nodetype": "RESOURCE",
        "cardinality": {
          "pref": 1
        },
        "styles": [
          "externalLink"
        ]
      },
      {
        "id": "foaf:account",
        "property": "http://xmlns.com/foaf/0.1/account",
        "label": {
          "en": "account"
        },
        "description": {
          "en": "Indicates an account held by this agent."
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://xmlns.com/foaf/0.1/OnlineAccount"
        },
        "type": "choice",
        "nodetype": "RESOURCE",
        "cardinality": {
          "pref": 1
        }
      },
      {
        "id": "foaf:accountServiceHomepage",
        "property": "http://xmlns.com/foaf/0.1/accountServiceHomepage",
        "label": {
          "en": "account service homepage"
        },
        "description": {
          "en": "Indicates a homepage of the service provide for this online account."
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://xmlns.com/foaf/0.1/Document"
        },
        "type": "choice",
        "nodetype": "RESOURCE",
        "cardinality": {
          "pref": 1
        },
        "styles": [
          "externalLink"
        ]
      },
      {
        "id": "foaf:accountName",
        "property": "http://xmlns.com/foaf/0.1/accountName",
        "label": {
          "en": "account name"
        },
        "description": {
          "en": "Indicates the name (identifier) associated with this online account."
        },
        "type": "text",
        "nodetype": "ONLY_LITERAL",
        "cardinality": {
          "pref": 1
        }
      },
      {
        "id": "foaf:member",
        "property": "http://xmlns.com/foaf/0.1/member",
        "label": {
          "en": "member"
        },
        "description": {
          "en": "Indicates a member of a Group"
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://xmlns.com/foaf/0.1/Agent"
        },
        "type": "choice",
        "nodetype": "RESOURCE",
        "cardinality": {
          "pref": 1
        }
      },
      {
        "id": "foaf:membershipClass",
        "property": "http://xmlns.com/foaf/0.1/membershipClass",
        "label": {
          "en": "membershipClass"
        },
        "description": {
          "en": "Indicates the class of individuals that are a member of a Group"
        },
        "type": "group",
        "automatic": true,
        "items": []
      },
      {
        "id": "foaf:birthday",
        "property": "http://xmlns.com/foaf/0.1/birthday",
        "label": {
          "en": "Birthday",
          "sv": "Födelsedag",
          "de": "Geburtstag"
        },
        "description": {
          "en": "The birthday of this Agent, represented in mm-dd string form, eg. '12-31'."
        },
        "type": "text",
        "nodetype": "ONLY_LITERAL",
        "cardinality": {
          "pref": 1
        }
      },
      {
        "id": "foaf:age",
        "property": "http://xmlns.com/foaf/0.1/age",
        "label": {
          "en": "Age",
          "sv": "Ålder",
          "de": "Alter"
        },
        "description": {
          "en": "The age in years of some agent."
        },
        "type": "text",
        "nodetype": "ONLY_LITERAL",
        "cardinality": {
          "pref": 1
        }
      },
      {
        "id": "foaf:status",
        "property": "http://xmlns.com/foaf/0.1/status",
        "label": {
          "en": "status"
        },
        "description": {
          "en": "A string expressing what the user is happy for the general public (normally) to know about their current activity."
        },
        "type": "text",
        "nodetype": "LANGUAGE_LITERAL",
        "styles": [
          "multiline"
        ],
        "cardinality": {
          "pref": 1
        }
      },
      {
        "id": "foaf:LabelProperty",
        "label": {
          "en": "Label Property"
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://xmlns.com/foaf/0.1/LabelProperty"
        },
        "description": {
          "en": "A foaf:LabelProperty is any RDF property with texual values that serve as labels."
        },
        "type": "group",
        "items": [
          {
            "id": "foaf:name"
          },
          {
            "id": "foaf:img"
          },
          {
            "id": "foaf:weblog"
          },
          {
            "id": "foaf:homepage"
          },
          {
            "id": "foaf:depiction"
          },
          {
            "id": "foaf:maker"
          },
          {
            "cardinality": {
              "min": 1,
              "pref": 1,
              "max": 1
            },
            "type": "group",
            "styles": [
              "expandable"
            ],
            "label": {
              "en": "Online accounts"
            },
            "content": [
              {
                "id": "foaf:openid"
              },
              {
                "id": "foaf:tipjar"
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
            "styles": [
              "expandable"
            ],
            "label": {
              "en": "Additional information"
            },
            "content": [
              {
                "id": "foaf:page"
              },
              {
                "id": "foaf:isPrimaryTopicOf"
              },
              {
                "id": "foaf:logo"
              }
            ]
          }
        ]
      },
      {
        "id": "foaf:Person",
        "label": {
          "en": "Person"
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://xmlns.com/foaf/0.1/Person"
        },
        "description": {
          "en": "A person."
        },
        "type": "group",
        "items": [
          {
            "id": "foaf:firstName"
          },
          {
            "id": "foaf:lastName"
          },
          {
            "id": "foaf:img"
          },
          {
            "id": "foaf:homepage"
          },
          {
            "id": "foaf:weblog"
          },
          {
            "id": "foaf:gender"
          },
          {
            "id": "foaf:age"
          },
          {
            "id": "foaf:birthday"
          },
          {
            "id": "foaf:knows"
          },
          {
            "id": "foaf:based_near"
          },
          {
            "id": "foaf:topic_interest"
          },
          {
            "id": "foaf:status"
          },
          {
            "id": "foaf:plan"
          },
          {
            "id": "foaf:depiction"
          },
          {
            "id": "foaf:maker"
          },
          {
            "cardinality": {
              "min": 1,
              "pref": 1,
              "max": 1
            },
            "type": "group",
            "styles": [
              "expandable"
            ],
            "label": {
              "en": "Online accounts"
            },
            "items": [
              {
                "id": "foaf:account"
              },
              {
                "id": "foaf:skypeID"
              },
              {
                "id": "foaf:aimChatID"
              },
              {
                "id": "foaf:icqChatID"
              },
              {
                "id": "foaf:msnChatID"
              },
              {
                "id": "foaf:yahooChatID"
              },
              {
                "id": "foaf:jabberID"
              },
              {
                "id": "foaf:openid"
              },
              {
                "id": "foaf:tipjar"
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
            "styles": [
              "expandable"
            ],
            "label": {
              "en": "Additional information"
            },
            "items": [
              {
                "id": "foaf:page"
              },
              {
                "id": "foaf:myersBriggs"
              },
              {
                "id": "foaf:familyName"
              },
              {
                "id": "foaf:interest"
              },
              {
                "id": "foaf:mbox_sha1sum"
              },
              {
                "id": "foaf:made"
              },
              {
                "id": "foaf:pastProject"
              },
              {
                "id": "foaf:currentProject"
              },
              {
                "id": "foaf:publications"
              },
              {
                "id": "foaf:isPrimaryTopicOf"
              },
              {
                "id": "foaf:logo"
              },
              {
                "id": "foaf:schoolHomepage"
              },
              {
                "id": "foaf:workInfoHomepage"
              },
              {
                "id": "foaf:workplaceHomepage"
              }
            ]
          }
        ]
      },
      {
        "id": "foaf:Agent",
        "label": {
          "en": "Agent"
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://xmlns.com/foaf/0.1/Agent"
        },
        "description": {
          "en": "An agent (eg. person, group, software or physical artifact)."
        },
        "type": "group",
        "items": [
          {
            "id": "foaf:name"
          },
          {
            "id": "foaf:img"
          },
          {
            "id": "foaf:mbox"
          },
          {
            "id": "foaf:weblog"
          },
          {
            "id": "foaf:homepage"
          },
          {
            "id": "foaf:topic_interest"
          },
          {
            "id": "foaf:status"
          },
          {
            "id": "foaf:depiction"
          },
          {
            "id": "foaf:maker"
          },
          {
            "cardinality": {
              "min": 1,
              "pref": 1,
              "max": 1
            },
            "type": "group",
            "styles": [
              "expandable"
            ],
            "label": {
              "en": "Online accounts"
            },
            "items": [
              {
                "id": "foaf:account"
              },
              {
                "id": "foaf:skypeID"
              },
              {
                "id": "foaf:aimChatID"
              },
              {
                "id": "foaf:icqChatID"
              },
              {
                "id": "foaf:msnChatID"
              },
              {
                "id": "foaf:yahooChatID"
              },
              {
                "id": "foaf:jabberID"
              },
              {
                "id": "foaf:openid"
              },
              {
                "id": "foaf:tipjar"
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
            "styles": [
              "expandable"
            ],
            "label": {
              "en": "Additional information"
            },
            "items": [
              {
                "id": "foaf:page"
              },
              {
                "id": "foaf:interest"
              },
              {
                "id": "foaf:mbox_sha1sum"
              },
              {
                "id": "foaf:made"
              },
              {
                "id": "foaf:isPrimaryTopicOf"
              },
              {
                "id": "foaf:logo"
              }
            ]
          }
        ]
      },
      {
        "id": "foaf:Document",
        "label": {
          "en": "Document",
          "de": "Dokument",
          "sv": "Dokument"
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://xmlns.com/foaf/0.1/Document"
        },
        "description": {
          "en": "A document."
        },
        "type": "group",
        "items": [
          {
            "id": "foaf:name"
          },
          {
            "id": "foaf:img"
          },
          {
            "id": "foaf:weblog"
          },
          {
            "id": "foaf:homepage"
          },
          {
            "id": "foaf:depiction"
          },
          {
            "id": "foaf:primaryTopic"
          },
          {
            "id": "foaf:topic"
          },
          {
            "id": "foaf:maker"
          },
          {
            "cardinality": {
              "min": 1,
              "pref": 1,
              "max": 1
            },
            "type": "group",
            "styles": [
              "expandable"
            ],
            "label": {
              "en": "Online accounts"
            },
            "content": [
              {
                "id": "foaf:openid"
              },
              {
                "id": "foaf:tipjar"
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
            "styles": [
              "expandable"
            ],
            "label": {
              "en": "Additional information"
            },
            "content": [
              {
                "id": "foaf:page"
              },
              {
                "id": "foaf:isPrimaryTopicOf"
              },
              {
                "id": "foaf:logo"
              },
              {
                "id": "foaf:sha1"
              }
            ]
          }
        ]
      },
      {
        "id": "foaf:Organization",
        "label": {
          "en": "Organization",
          "sv": "Organisation",
          "de": "Organisation"
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://xmlns.com/foaf/0.1/Organization"
        },
        "description": {
          "en": "An organization."
        },
        "type": "group",
        "items": [
          {
            "id": "foaf:name"
          },
          {
            "id": "foaf:img"
          },
          {
            "id": "foaf:mbox"
          },
          {
            "id": "foaf:weblog"
          },
          {
            "id": "foaf:homepage"
          },
          {
            "id": "foaf:topic_interest"
          },
          {
            "id": "foaf:status"
          },
          {
            "id": "foaf:depiction"
          },
          {
            "id": "foaf:maker"
          },
          {
            "cardinality": {
              "min": 1,
              "pref": 1,
              "max": 1
            },
            "type": "group",
            "styles": [
              "expandable"
            ],
            "label": {
              "en": "Online accounts"
            },
            "content": [
              {
                "id": "foaf:account"
              },
              {
                "id": "foaf:skypeID"
              },
              {
                "id": "foaf:aimChatID"
              },
              {
                "id": "foaf:icqChatID"
              },
              {
                "id": "foaf:msnChatID"
              },
              {
                "id": "foaf:yahooChatID"
              },
              {
                "id": "foaf:jabberID"
              },
              {
                "id": "foaf:openid"
              },
              {
                "id": "foaf:tipjar"
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
            "styles": [
              "expandable"
            ],
            "label": {
              "en": "Additional information"
            },
            "content": [
              {
                "id": "foaf:page"
              },
              {
                "id": "foaf:interest"
              },
              {
                "id": "foaf:mbox_sha1sum"
              },
              {
                "id": "foaf:made"
              },
              {
                "id": "foaf:isPrimaryTopicOf"
              },
              {
                "id": "foaf:logo"
              }
            ]
          }
        ]
      },
      {
        "id": "foaf:Group",
        "label": {
          "en": "Group",
          "sv": "Grupp",
          "de": "Gruppe"
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://xmlns.com/foaf/0.1/Group"
        },
        "description": {
          "en": "A class of Agents."
        },
        "type": "group",
        "items": [
          {
            "id": "foaf:name"
          },
          {
            "id": "foaf:img"
          },
          {
            "id": "foaf:mbox"
          },
          {
            "id": "foaf:weblog"
          },
          {
            "id": "foaf:homepage"
          },
          {
            "id": "foaf:gender"
          },
          {
            "id": "foaf:age"
          },
          {
            "id": "foaf:birthday"
          },
          {
            "id": "foaf:topic_interest"
          },
          {
            "id": "foaf:status"
          },
          {
            "id": "foaf:depiction"
          },
          {
            "id": "foaf:maker"
          },
          {
            "id": "foaf:member"
          },
          {
            "cardinality": {
              "min": 1,
              "pref": 1,
              "max": 1
            },
            "type": "group",
            "styles": [
              "expandable"
            ],
            "label": {
              "en": "Online accounts"
            },
            "items": [
              {
                "id": "foaf:account"
              },
              {
                "id": "foaf:skypeID"
              },
              {
                "id": "foaf:aimChatID"
              },
              {
                "id": "foaf:icqChatID"
              },
              {
                "id": "foaf:msnChatID"
              },
              {
                "id": "foaf:yahooChatID"
              },
              {
                "id": "foaf:jabberID"
              },
              {
                "id": "foaf:openid"
              },
              {
                "id": "foaf:tipjar"
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
            "styles": [
              "expandable"
            ],
            "label": {
              "en": "Additional information"
            },
            "items": [
              {
                "id": "foaf:page"
              },
              {
                "id": "foaf:interest"
              },
              {
                "id": "foaf:mbox_sha1sum"
              },
              {
                "id": "foaf:made"
              },
              {
                "id": "foaf:isPrimaryTopicOf"
              },
              {
                "id": "foaf:logo"
              }
            ]
          }
        ]
      },
      {
        "id": "foaf:Project",
        "label": {
          "en": "Project",
          "sv": "Projekt",
          "de": "Projekt"
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://xmlns.com/foaf/0.1/Project"
        },
        "description": {
          "en": "A project (a collective endeavour of some kind)."
        },
        "type": "group",
        "items": [
          {
            "id": "foaf:name"
          },
          {
            "id": "foaf:img"
          },
          {
            "id": "foaf:weblog"
          },
          {
            "id": "foaf:homepage"
          },
          {
            "id": "foaf:depiction"
          },
          {
            "id": "foaf:maker"
          },
          {
            "cardinality": {
              "min": 1,
              "pref": 1,
              "max": 1
            },
            "type": "group",
            "styles": [
              "expandable"
            ],
            "label": {
              "en": "Online accounts"
            },
            "content": [
              {
                "id": "foaf:openid"
              },
              {
                "id": "foaf:tipjar"
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
            "styles": [
              "expandable"
            ],
            "label": {
              "en": "Additional information"
            },
            "content": [
              {
                "id": "foaf:page"
              },
              {
                "id": "foaf:isPrimaryTopicOf"
              },
              {
                "id": "foaf:logo"
              }
            ]
          }
        ]
      },
      {
        "id": "foaf:Image",
        "label": {
          "en": "Image",
          "sv": "Bild",
          "de": "Bild"
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://xmlns.com/foaf/0.1/Image"
        },
        "description": {
          "en": "An image."
        },
        "type": "group",
        "items": [
          {
            "id": "foaf:name"
          },
          {
            "id": "foaf:img"
          },
          {
            "id": "foaf:weblog"
          },
          {
            "id": "foaf:homepage"
          },
          {
            "id": "foaf:depiction"
          },
          {
            "id": "foaf:primaryTopic"
          },
          {
            "id": "foaf:topic"
          },
          {
            "id": "foaf:depicts"
          },
          {
            "id": "foaf:maker"
          },
          {
            "id": "foaf:thumbnail"
          },
          {
            "cardinality": {
              "min": 1,
              "pref": 1,
              "max": 1
            },
            "type": "group",
            "styles": [
              "expandable"
            ],
            "label": {
              "en": "Online accounts"
            },
            "content": [
              {
                "id": "foaf:openid"
              },
              {
                "id": "foaf:tipjar"
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
            "styles": [
              "expandable"
            ],
            "label": {
              "en": "Additional information"
            },
            "content": [
              {
                "id": "foaf:page"
              },
              {
                "id": "foaf:isPrimaryTopicOf"
              },
              {
                "id": "foaf:logo"
              },
              {
                "id": "foaf:sha1"
              }
            ]
          }
        ]
      },
      {
        "id": "foaf:PersonalProfileDocument",
        "label": {
          "en": "Personal Profile Document"
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://xmlns.com/foaf/0.1/PersonalProfileDocument"
        },
        "description": {
          "en": "A personal profile RDF document."
        },
        "type": "group",
        "items": [
          {
            "id": "foaf:name"
          },
          {
            "id": "foaf:img"
          },
          {
            "id": "foaf:weblog"
          },
          {
            "id": "foaf:homepage"
          },
          {
            "id": "foaf:depiction"
          },
          {
            "id": "foaf:primaryTopic"
          },
          {
            "id": "foaf:topic"
          },
          {
            "id": "foaf:maker"
          },
          {
            "cardinality": {
              "min": 1,
              "pref": 1,
              "max": 1
            },
            "type": "group",
            "styles": [
              "expandable"
            ],
            "label": {
              "en": "Online accounts"
            },
            "content": [
              {
                "id": "foaf:openid"
              },
              {
                "id": "foaf:tipjar"
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
            "styles": [
              "expandable"
            ],
            "label": {
              "en": "Additional information"
            },
            "content": [
              {
                "id": "foaf:page"
              },
              {
                "id": "foaf:isPrimaryTopicOf"
              },
              {
                "id": "foaf:logo"
              },
              {
                "id": "foaf:sha1"
              }
            ]
          }
        ]
      },
      {
        "id": "foaf:OnlineAccount",
        "label": {
          "en": "Online Account"
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://xmlns.com/foaf/0.1/OnlineAccount"
        },
        "description": {
          "en": "An online account."
        },
        "type": "group",
        "items": [
          {
            "id": "foaf:name"
          },
          {
            "id": "foaf:img"
          },
          {
            "id": "foaf:weblog"
          },
          {
            "id": "foaf:homepage"
          },
          {
            "id": "foaf:depiction"
          },
          {
            "id": "foaf:accountName"
          },
          {
            "id": "foaf:accountServiceHomepage"
          },
          {
            "id": "foaf:maker"
          },
          {
            "cardinality": {
              "min": 1,
              "pref": 1,
              "max": 1
            },
            "type": "group",
            "styles": [
              "expandable"
            ],
            "label": {
              "en": "Online accounts"
            },
            "content": [
              {
                "id": "foaf:openid"
              },
              {
                "id": "foaf:tipjar"
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
            "styles": [
              "expandable"
            ],
            "label": {
              "en": "Additional information"
            },
            "content": [
              {
                "id": "foaf:page"
              },
              {
                "id": "foaf:isPrimaryTopicOf"
              },
              {
                "id": "foaf:logo"
              }
            ]
          }
        ]
      },
      {
        "id": "foaf:OnlineGamingAccount",
        "label": {
          "en": "Online Gaming Account"
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://xmlns.com/foaf/0.1/OnlineGamingAccount"
        },
        "description": {
          "en": "An online gaming account."
        },
        "type": "group",
        "items": [
          {
            "id": "foaf:name"
          },
          {
            "id": "foaf:img"
          },
          {
            "id": "foaf:weblog"
          },
          {
            "id": "foaf:homepage"
          },
          {
            "id": "foaf:depiction"
          },
          {
            "id": "foaf:accountName"
          },
          {
            "id": "foaf:accountServiceHomepage"
          },
          {
            "id": "foaf:maker"
          },
          {
            "cardinality": {
              "min": 1,
              "pref": 1,
              "max": 1
            },
            "type": "group",
            "styles": [
              "expandable"
            ],
            "label": {
              "en": "Online accounts"
            },
            "content": [
              {
                "id": "foaf:openid"
              },
              {
                "id": "foaf:tipjar"
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
            "styles": [
              "expandable"
            ],
            "label": {
              "en": "Additional information"
            },
            "content": [
              {
                "id": "foaf:page"
              },
              {
                "id": "foaf:isPrimaryTopicOf"
              },
              {
                "id": "foaf:logo"
              }
            ]
          }
        ]
      },
      {
        "id": "foaf:OnlineEcommerceAccount",
        "label": {
          "en": "Online E-commerce Account"
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://xmlns.com/foaf/0.1/OnlineEcommerceAccount"
        },
        "description": {
          "en": "An online e-commerce account."
        },
        "type": "group",
        "items": [
          {
            "id": "foaf:name"
          },
          {
            "id": "foaf:img"
          },
          {
            "id": "foaf:weblog"
          },
          {
            "id": "foaf:homepage"
          },
          {
            "id": "foaf:depiction"
          },
          {
            "id": "foaf:accountName"
          },
          {
            "id": "foaf:accountServiceHomepage"
          },
          {
            "id": "foaf:maker"
          },
          {
            "cardinality": {
              "min": 1,
              "pref": 1,
              "max": 1
            },
            "type": "group",
            "styles": [
              "expandable"
            ],
            "label": {
              "en": "Online accounts"
            },
            "content": [
              {
                "id": "foaf:openid"
              },
              {
                "id": "foaf:tipjar"
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
            "styles": [
              "expandable"
            ],
            "label": {
              "en": "Additional information"
            },
            "content": [
              {
                "id": "foaf:page"
              },
              {
                "id": "foaf:isPrimaryTopicOf"
              },
              {
                "id": "foaf:logo"
              }
            ]
          }
        ]
      },
      {
        "id": "foaf:OnlineChatAccount",
        "label": {
          "en": "Online Chat Account"
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://xmlns.com/foaf/0.1/OnlineChatAccount"
        },
        "description": {
          "en": "An online chat account."
        },
        "type": "group",
        "items": [
          {
            "id": "foaf:name"
          },
          {
            "id": "foaf:img"
          },
          {
            "id": "foaf:weblog"
          },
          {
            "id": "foaf:homepage"
          },
          {
            "id": "foaf:depiction"
          },
          {
            "id": "foaf:accountName"
          },
          {
            "id": "foaf:accountServiceHomepage"
          },
          {
            "id": "foaf:maker"
          },
          {
            "cardinality": {
              "min": 1,
              "pref": 1,
              "max": 1
            },
            "type": "group",
            "styles": [
              "expandable"
            ],
            "label": {
              "en": "Online accounts"
            },
            "content": [
              {
                "id": "foaf:openid"
              },
              {
                "id": "foaf:tipjar"
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
            "styles": [
              "expandable"
            ],
            "label": {
              "en": "Additional information"
            },
            "content": [
              {
                "id": "foaf:page"
              },
              {
                "id": "foaf:isPrimaryTopicOf"
              },
              {
                "id": "foaf:logo"
              }
            ]
          }
        ]
      },
      {
        "type": "group",
        "id": "foaf:Person-ref",
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://xmlns.com/foaf/0.1/Person"
        },
        "items": [
          {
            "id": "foaf:title"
          },
          {
            "id": "foaf:givenName"
          },
          {
            "id": "foaf:familyName"
          },
          {
            "id": "foaf:mbox"
          }
        ]
      },
      {
        "type": "group",
        "id": "foaf:Organization-ref",
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://xmlns.com/foaf/0.1/Organization"
        },
        "items": [
          {
            "type": "text",
            "nodetype": "LITERAL",
            "extends": "foaf:name",
            "cardinality": {
              "min": 1,
              "pref": 0
            }
          },
          {
            "id": "foaf:homepage"
          },
          {
            "type": "text",
            "extends": "foaf:mbox",
            "label": {
              "en": "Mailbox",
              "nb": "Epost-adresse",
              "sv": "Epostadress",
              "da": "Email"
            },
            "cardinality": {
              "min": 0,
              "pref": 1
            }
          }
        ]
      },
      {
        "type": "group",
        "nodetype": "RESOURCE",
        "id": "foaf:PersonName",
        "items": [
          {
            "id": "foaf:givenName"
          },
          {
            "id": "foaf:familyName"
          }
        ]
      }
    ],
    "scope": "foaf",
    "namespace": "http://xmlns.com/foaf/0.1/",
    "root": "foaf:Person"
  },
  {
    "templates": [
      {
        "id": "vc:organization-unit",
        "property": "http://www.w3.org/2006/vcard/ns#organization-unit",
        "label": {
          "en": "organizational unit name"
        },
        "description": {
          "en": "To specify the organizational unit name associated with the object"
        },
        "type": "text",
        "nodetype": "LITERAL"
      },
      {
        "id": "vc:organization-name",
        "property": "http://www.w3.org/2006/vcard/ns#organization-name",
        "label": {
          "en": "organization name"
        },
        "description": {
          "en": "To specify the organizational name associated with the object"
        },
        "type": "text",
        "nodetype": "LITERAL"
      },
      {
        "id": "vc:anniversary",
        "property": "http://www.w3.org/2006/vcard/ns#anniversary",
        "label": {
          "en": "anniversary"
        },
        "description": {
          "en": "The date of marriage, or equivalent, of the object"
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "_:genid1"
        },
        "type": "group",
        "automatic": true
      },
      {
        "id": "vc:bday",
        "property": "http://www.w3.org/2006/vcard/ns#bday",
        "label": {
          "en": "birth date"
        },
        "description": {
          "en": "To specify the birth date of the object"
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "_:genid4"
        },
        "type": "group",
        "automatic": true
      },
      {
        "id": "vc:category",
        "property": "http://www.w3.org/2006/vcard/ns#category",
        "label": {
          "en": "category"
        },
        "description": {
          "en": "The category information about the object, also known as tags"
        },
        "type": "text",
        "nodetype": "LITERAL"
      },
      {
        "id": "vc:language",
        "property": "http://www.w3.org/2006/vcard/ns#language",
        "label": {
          "en": "language"
        },
        "description": {
          "en": "To specify the language that may be used for contacting the object. May also be used as a property parameter."
        },
        "type": "group",
        "automatic": true
      },
      {
        "id": "vc:latitude",
        "property": "http://www.w3.org/2006/vcard/ns#latitude",
        "label": {
          "en": "latitude"
        },
        "description": {
          "en": "This data property has been deprecated. See hasGeo"
        },
        "type": "group",
        "automatic": true
      },
      {
        "id": "vc:note",
        "property": "http://www.w3.org/2006/vcard/ns#note",
        "label": {
          "en": "note"
        },
        "description": {
          "en": "A note associated with the object"
        },
        "type": "text",
        "nodetype": "LITERAL"
      },
      {
        "id": "vc:prodid",
        "property": "http://www.w3.org/2006/vcard/ns#prodid",
        "label": {
          "en": "product id"
        },
        "description": {
          "en": "To specify the identifier for the product that created the object"
        },
        "type": "text",
        "nodetype": "LITERAL"
      },
      {
        "id": "vc:rev",
        "property": "http://www.w3.org/2006/vcard/ns#rev",
        "label": {
          "en": "revision"
        },
        "description": {
          "en": "To specify revision information about the object"
        },
        "type": "text",
        "nodetype": "DATATYPE_LITERAL",
        "datatype": "http://www.w3.org/2001/XMLSchema#dateTime"
      },
      {
        "id": "vc:role",
        "property": "http://www.w3.org/2006/vcard/ns#role",
        "label": {
          "en": "role"
        },
        "description": {
          "en": "To specify the function or part played in a particular situation by the object"
        },
        "type": "text",
        "nodetype": "LITERAL"
      },
      {
        "id": "vc:sort-string",
        "property": "http://www.w3.org/2006/vcard/ns#sort-string",
        "label": {
          "en": "sort as"
        },
        "description": {
          "en": "To specify the string to be used for national-language-specific sorting. Used as a property parameter only."
        },
        "type": "text",
        "nodetype": "LITERAL"
      },
      {
        "id": "vc:title",
        "property": "http://www.w3.org/2006/vcard/ns#title",
        "label": {
          "en": "title"
        },
        "description": {
          "en": "To specify the position or job of the object"
        },
        "type": "text",
        "nodetype": "LITERAL"
      },
      {
        "id": "vc:tz",
        "property": "http://www.w3.org/2006/vcard/ns#tz",
        "label": {
          "en": "time zone"
        },
        "description": {
          "en": "To indicate time zone information that is specific to the object. May also be used as a property parameter."
        },
        "type": "text",
        "nodetype": "LITERAL"
      },
      {
        "id": "vc:value",
        "property": "http://www.w3.org/2006/vcard/ns#value",
        "label": {
          "en": "value"
        },
        "description": {
          "en": "Used to indicate the literal value of a data property that requires property parameters"
        },
        "type": "group",
        "automatic": true
      },
      {
        "id": "vc:fn",
        "property": "http://www.w3.org/2006/vcard/ns#fn",
        "label": {
          "en": "Formatted name",
          "sv": "Namn",
          "nb": "Formatert navn",
          "da": "Formateret navn",
          "de": "Name"
        },
        "description": {
          "en": "The formatted text corresponding to the name of the object"
        },
        "type": "text",
        "nodetype": "LITERAL",
        "cardinality": {
          "min": 1,
          "pref": 0
        }
      },
      {
        "id": "vc:nickname",
        "property": "http://www.w3.org/2006/vcard/ns#nickname",
        "label": {
          "en": "nickname"
        },
        "description": {
          "en": "The nick name associated with the object"
        },
        "type": "text",
        "nodetype": "LITERAL"
      },
      {
        "id": "vc:additional-name",
        "property": "http://www.w3.org/2006/vcard/ns#additional-name",
        "label": {
          "en": "additional name"
        },
        "description": {
          "en": "The additional name associated with the object"
        },
        "type": "text",
        "nodetype": "LITERAL"
      },
      {
        "id": "vc:country-name",
        "property": "http://www.w3.org/2006/vcard/ns#country-name",
        "label": {
          "en": "Country name",
          "sv": "Land",
          "nb": "Navn på land",
          "da": "Landenavn",
          "de": "Land"
        },
        "description": {
          "en": "The country name associated with the address of the object"
        },
        "type": "text",
        "nodetype": "LITERAL",
        "cardinality": {
          "min": 0,
          "pref": 1,
          "max": 1
        }
      },
      {
        "id": "vc:family-name",
        "property": "http://www.w3.org/2006/vcard/ns#family-name",
        "label": {
          "en": "family name"
        },
        "description": {
          "en": "The family name associated with the object"
        },
        "type": "text",
        "nodetype": "LITERAL"
      },
      {
        "id": "vc:given-name",
        "property": "http://www.w3.org/2006/vcard/ns#given-name",
        "label": {
          "en": "given name"
        },
        "description": {
          "en": "The given name associated with the object"
        },
        "type": "text",
        "nodetype": "LITERAL"
      },
      {
        "id": "vc:honorific-prefix",
        "property": "http://www.w3.org/2006/vcard/ns#honorific-prefix",
        "label": {
          "en": "honorific prefix"
        },
        "description": {
          "en": "The honorific prefix of the name associated with the object"
        },
        "type": "text",
        "nodetype": "LITERAL"
      },
      {
        "id": "vc:honorific-suffix",
        "property": "http://www.w3.org/2006/vcard/ns#honorific-suffix",
        "label": {
          "en": "honorific suffix"
        },
        "description": {
          "en": "The honorific suffix of the name associated with the object"
        },
        "type": "text",
        "nodetype": "LITERAL"
      },
      {
        "id": "vc:locality",
        "property": "http://www.w3.org/2006/vcard/ns#locality",
        "label": {
          "en": "Locality",
          "sv": "Postort",
          "nb": "Sted",
          "da": "Sted",
          "de": "Ort"
        },
        "description": {
          "en": "The locality (e.g. city or town) associated with the address of the object"
        },
        "type": "text",
        "nodetype": "LITERAL",
        "cardinality": {
          "min": 0,
          "pref": 1,
          "max": 1
        }
      },
      {
        "id": "vc:postal-code",
        "property": "http://www.w3.org/2006/vcard/ns#postal-code",
        "label": {
          "en": "Postal code",
          "sv": "Postkod",
          "nb": "Postnummer",
          "da": "Postnummer",
          "de": "Postleitzahl"
        },
        "description": {
          "en": "The postal code associated with the address of the object"
        },
        "type": "text",
        "nodetype": "LITERAL",
        "cardinality": {
          "min": 0,
          "pref": 1,
          "max": 1
        }
      },
      {
        "id": "vc:region",
        "property": "http://www.w3.org/2006/vcard/ns#region",
        "label": {
          "en": "region"
        },
        "description": {
          "en": "The region (e.g. state or province) associated with the address of the object"
        },
        "type": "text",
        "nodetype": "LITERAL"
      },
      {
        "id": "vc:street-address",
        "property": "http://www.w3.org/2006/vcard/ns#street-address",
        "label": {
          "en": "Street address",
          "sv": "Gatuadress",
          "nb": "Gateadresse",
          "da": "Gadeadresse",
          "de": "Straßenadresse"
        },
        "description": {
          "en": "The street address associated with the address of the object"
        },
        "type": "text",
        "nodetype": "LITERAL",
        "cardinality": {
          "min": 0,
          "pref": 1,
          "max": 1
        }
      },
      {
        "id": "vc:hasAdditionalName",
        "property": "http://www.w3.org/2006/vcard/ns#hasAdditionalName",
        "label": {
          "en": "has additional name"
        },
        "description": {
          "en": "Used to support property parameters for the additional name data property"
        },
        "type": "group",
        "automatic": true
      },
      {
        "id": "vc:hasCalendarBusy",
        "property": "http://www.w3.org/2006/vcard/ns#hasCalendarBusy",
        "label": {
          "en": "has calendar busy"
        },
        "description": {
          "en": "To specify the busy time associated with the object. (Was called FBURL in RFC6350)"
        },
        "type": "group",
        "automatic": true
      },
      {
        "id": "vc:hasCalendarLink",
        "property": "http://www.w3.org/2006/vcard/ns#hasCalendarLink",
        "label": {
          "en": "has calendar link"
        },
        "description": {
          "en": "To specify the calendar associated with the object. (Was called CALURI in RFC6350)"
        },
        "type": "group",
        "automatic": true
      },
      {
        "id": "vc:hasCalendarRequest",
        "property": "http://www.w3.org/2006/vcard/ns#hasCalendarRequest",
        "label": {
          "en": "has calendar request"
        },
        "description": {
          "en": "To specify the calendar user address to which a scheduling request be sent for the object. (Was called CALADRURI in RFC6350)"
        },
        "type": "group",
        "automatic": true
      },
      {
        "id": "vc:hasCategory",
        "property": "http://www.w3.org/2006/vcard/ns#hasCategory",
        "label": {
          "en": "has category"
        },
        "description": {
          "en": "Used to support property parameters for the category data property"
        },
        "type": "group",
        "automatic": true
      },
      {
        "id": "vc:hasCountryName",
        "property": "http://www.w3.org/2006/vcard/ns#hasCountryName",
        "label": {
          "en": "has country name"
        },
        "description": {
          "en": "Used to support property parameters for the country name data property"
        },
        "type": "group",
        "automatic": true
      },
      {
        "id": "vc:hasFN",
        "property": "http://www.w3.org/2006/vcard/ns#hasFN",
        "label": {
          "en": "has formatted name"
        },
        "description": {
          "en": "Used to support property parameters for the formatted name data property"
        },
        "type": "group",
        "automatic": true
      },
      {
        "id": "vc:hasFamilyName",
        "property": "http://www.w3.org/2006/vcard/ns#hasFamilyName",
        "label": {
          "en": "has family name"
        },
        "description": {
          "en": "Used to support property parameters for the family name data property"
        },
        "type": "group",
        "automatic": true
      },
      {
        "id": "vc:hasGender",
        "property": "http://www.w3.org/2006/vcard/ns#hasGender",
        "label": {
          "en": "has gender"
        },
        "description": {
          "en": "To specify  the sex or gender identity of the object. URIs are recommended to enable interoperable sex and gender codes to be used."
        },
        "type": "group",
        "automatic": true
      },
      {
        "id": "vc:hasGivenName",
        "property": "http://www.w3.org/2006/vcard/ns#hasGivenName",
        "label": {
          "en": "has given name"
        },
        "description": {
          "en": "Used to support property parameters for the given name data property"
        },
        "type": "group",
        "automatic": true
      },
      {
        "id": "vc:hasHonorificPrefix",
        "property": "http://www.w3.org/2006/vcard/ns#hasHonorificPrefix",
        "label": {
          "en": "has honorific prefix"
        },
        "description": {
          "en": "Used to support property parameters for the honorific prefix data property"
        },
        "type": "group",
        "automatic": true
      },
      {
        "id": "vc:hasHonorificSuffix",
        "property": "http://www.w3.org/2006/vcard/ns#hasHonorificSuffix",
        "label": {
          "en": "has honorific suffix"
        },
        "description": {
          "en": "Used to support property parameters for the honorific suffix data property"
        },
        "type": "group",
        "automatic": true
      },
      {
        "id": "vc:hasInstantMessage",
        "property": "http://www.w3.org/2006/vcard/ns#hasInstantMessage",
        "label": {
          "en": "has messaging"
        },
        "description": {
          "en": "To specify the instant messaging and presence protocol communications with the object. (Was called IMPP in RFC6350)"
        },
        "type": "group",
        "automatic": true
      },
      {
        "id": "vc:hasLanguage",
        "property": "http://www.w3.org/2006/vcard/ns#hasLanguage",
        "label": {
          "en": "has language"
        },
        "description": {
          "en": "Used to support property parameters for the language data property"
        },
        "type": "group",
        "automatic": true
      },
      {
        "id": "vc:hasLocality",
        "property": "http://www.w3.org/2006/vcard/ns#hasLocality",
        "label": {
          "en": "has locality"
        },
        "description": {
          "en": "Used to support property parameters for the locality data property"
        },
        "type": "group",
        "automatic": true
      },
      {
        "id": "vc:hasNickname",
        "property": "http://www.w3.org/2006/vcard/ns#hasNickname",
        "label": {
          "en": "has nickname"
        },
        "description": {
          "en": "Used to support property parameters for the nickname data property"
        },
        "type": "group",
        "automatic": true
      },
      {
        "id": "vc:hasNote",
        "property": "http://www.w3.org/2006/vcard/ns#hasNote",
        "label": {
          "en": "has note"
        },
        "description": {
          "en": "Used to support property parameters for the note data property"
        },
        "type": "group",
        "automatic": true
      },
      {
        "id": "vc:hasOrganizationName",
        "property": "http://www.w3.org/2006/vcard/ns#hasOrganizationName",
        "label": {
          "en": "has organization name"
        },
        "description": {
          "en": "Used to support property parameters for the organization name data property"
        },
        "type": "group",
        "automatic": true
      },
      {
        "id": "vc:hasOrganizationUnit",
        "property": "http://www.w3.org/2006/vcard/ns#hasOrganizationUnit",
        "label": {
          "en": "has organization unit name"
        },
        "description": {
          "en": "Used to support property parameters for the organization unit name data property"
        },
        "type": "group",
        "automatic": true
      },
      {
        "id": "vc:hasPostalCode",
        "property": "http://www.w3.org/2006/vcard/ns#hasPostalCode",
        "label": {
          "en": "has postal code"
        },
        "description": {
          "en": "Used to support property parameters for the postal code data property"
        },
        "type": "group",
        "automatic": true
      },
      {
        "id": "vc:hasRegion",
        "property": "http://www.w3.org/2006/vcard/ns#hasRegion",
        "label": {
          "en": "has region"
        },
        "description": {
          "en": "Used to support property parameters for the region data property"
        },
        "type": "group",
        "automatic": true
      },
      {
        "id": "vc:hasRelated",
        "property": "http://www.w3.org/2006/vcard/ns#hasRelated",
        "label": {
          "en": "has related"
        },
        "description": {
          "en": "To specify a relationship between another entity and the entity represented by this object"
        },
        "type": "group",
        "automatic": true
      },
      {
        "id": "vc:hasRole",
        "property": "http://www.w3.org/2006/vcard/ns#hasRole",
        "label": {
          "en": "has role"
        },
        "description": {
          "en": "Used to support property parameters for the role data property"
        },
        "type": "group",
        "automatic": true
      },
      {
        "id": "vc:hasSource",
        "property": "http://www.w3.org/2006/vcard/ns#hasSource",
        "label": {
          "en": "has source"
        },
        "description": {
          "en": "To identify the source of directory information of the object"
        },
        "type": "group",
        "automatic": true
      },
      {
        "id": "vc:hasStreetAddress",
        "property": "http://www.w3.org/2006/vcard/ns#hasStreetAddress",
        "label": {
          "en": "has street address"
        },
        "description": {
          "en": "Used to support property parameters for the street address data property"
        },
        "type": "group",
        "automatic": true
      },
      {
        "id": "vc:hasTitle",
        "property": "http://www.w3.org/2006/vcard/ns#hasTitle",
        "label": {
          "en": "has title"
        },
        "description": {
          "en": "Used to support property parameters for the title data property"
        },
        "type": "group",
        "automatic": true,
        "items": []
      },
      {
        "id": "vc:hasUID",
        "property": "http://www.w3.org/2006/vcard/ns#hasUID",
        "label": {
          "en": "has uid"
        },
        "description": {
          "en": "To specify a value that represents a globally unique identifier corresponding to the object"
        },
        "type": "group",
        "automatic": true
      },
      {
        "id": "vc:hasValue",
        "property": "http://www.w3.org/2006/vcard/ns#hasValue",
        "label": {
          "en": "has value"
        },
        "description": {
          "en": "Used to indicate the resource value of an object property that requires property parameters"
        },
        "type": "group",
        "automatic": true
      },
      {
        "id": "vc:hasAddress",
        "property": "http://www.w3.org/2006/vcard/ns#hasAddress",
        "label": {
          "en": "Address",
          "sv": "Adress",
          "nb": "Adresse",
          "da": "Adresse",
          "de": "Adresse"
        },
        "description": {
          "en": "To specify the components of the delivery address for the object"
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.w3.org/2006/vcard/ns#Address"
        },
        "type": "group",
        "automatic": true,
        "cardinality": {
          "min": 0,
          "pref": 1
        },
        "items": [
          {
            "id": "vc:street-address"
          },
          {
            "id": "vc:locality"
          },
          {
            "id": "vc:postal-code"
          },
          {
            "id": "vc:country-name"
          }
        ]
      },
      {
        "id": "vc:hasEmail",
        "property": "http://www.w3.org/2006/vcard/ns#hasEmail",
        "label": {
          "en": "Email",
          "sv": "E-postadress",
          "nb": "Epost",
          "da": "E-mail",
          "de": "E-Mail-Adresse"
        },
        "description": {
          "en": "To specify the electronic mail address for communication with the object"
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.w3.org/2006/vcard/ns#Email"
        },
        "type": "text",
        "automatic": true,
        "valueTemplate": "mailto:",
        "styles": [
          "email"
        ],
        "nodetype": "URI",
        "cardinality": {
          "min": 1,
          "pref": 0
        }
      },
      {
        "id": "vc:hasGeo",
        "property": "http://www.w3.org/2006/vcard/ns#hasGeo",
        "label": {
          "en": "has geo"
        },
        "description": {
          "en": "To specify information related to the global positioning of the object. May also be used as a property parameter."
        },
        "type": "group",
        "automatic": true
      },
      {
        "id": "vc:hasKey",
        "property": "http://www.w3.org/2006/vcard/ns#hasKey",
        "label": {
          "en": "has key"
        },
        "description": {
          "en": "To specify a public key or authentication certificate associated with the object"
        },
        "type": "group",
        "automatic": true
      },
      {
        "id": "vc:hasLogo",
        "property": "http://www.w3.org/2006/vcard/ns#hasLogo",
        "label": {
          "en": "has logo"
        },
        "description": {
          "en": "To specify a graphic image of a logo associated with the object "
        },
        "type": "group",
        "automatic": true
      },
      {
        "id": "vc:hasName",
        "property": "http://www.w3.org/2006/vcard/ns#hasName",
        "label": {
          "en": "has name"
        },
        "description": {
          "en": "To specify the components of the name of the object"
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.w3.org/2006/vcard/ns#Name"
        },
        "type": "group",
        "automatic": true
      },
      {
        "id": "vc:hasPhoto",
        "property": "http://www.w3.org/2006/vcard/ns#hasPhoto",
        "label": {
          "en": "has photo"
        },
        "description": {
          "en": "To specify an image or photograph information that annotates some aspect of the object"
        },
        "type": "group",
        "automatic": true
      },
      {
        "id": "vc:hasSound",
        "property": "http://www.w3.org/2006/vcard/ns#hasSound",
        "label": {
          "en": "has sound"
        },
        "description": {
          "en": "To specify a digital sound content information that annotates some aspect of the object"
        },
        "type": "group",
        "automatic": true
      },
      {
        "id": "vc:hasTelephone",
        "property": "http://www.w3.org/2006/vcard/ns#hasTelephone",
        "label": {
          "en": "Telephone",
          "sv": "Telefon",
          "nb": "Telefon",
          "da": "Telefon",
          "de": "Telefon"
        },
        "description": {
          "en": "The telephone number should be given including country calling code, e.g. +4618100000."
        },
        "type": "group",
        "automatic": true,
        "items": [
          {
            "type": "text",
            "nodetype": "URI",
            "cardinality": {
              "min": 1,
              "pref": 1,
              "max": 1
            },
            "description": {
              "": "The telephone number must be given as a valid resource URI, e.g. tel:+4618100000."
            },
            "property": "http://www.w3.org/2006/vcard/ns#hasValue",
            "pattern": "\\+?[0-9]*",
            "valueTemplate": "tel:$1"
          }
        ],
        "cardinality": {
          "min": 0,
          "pref": 1
        }
      },
      {
        "id": "vc:hasTelephone_complete",
        "property": "http://www.w3.org/2006/vcard/ns#hasTelephone",
        "label": {
          "en": "Telephone",
          "sv": "Telefon",
          "nb": "Telefon",
          "da": "Telefon",
          "de": "Telefon"
        },
        "description": {
          "en": "To specify the telephone number for telephony communication with the object"
        },
        "type": "group",
        "automatic": true,
        "items": [
          {
            "type": "text",
            "nodetype": "URI",
            "cardinality": {
              "min": 0,
              "pref": 1
            },
            "label": {
              "en": "Number",
              "sv": "Nummer",
              "da": "Nummer",
              "de": "Nummer"
            },
            "description": {
              "": "The telephone number must be given as a valid resource URI, e.g. tel:+4618100000."
            },
            "property": "http://www.w3.org/2006/vcard/ns#hasValue",
            "pattern": "\\+?[0-9]*",
            "valueTemplate": "tel:$1"
          },
          {
            "id": "vc:telephoneType"
          },
          {
            "id": "vc:vCardType"
          }
        ],
        "styles": [
          "table"
        ],
        "cardinality": {
          "min": 0,
          "pref": 1
        }
      },
      {
        "id": "vc:hasURL",
        "property": "http://www.w3.org/2006/vcard/ns#hasURL",
        "label": {
          "en": "has url"
        },
        "description": {
          "en": "To specify a uniform resource locator associated with the object"
        },
        "type": "group",
        "automatic": true
      },
      {
        "id": "vc:hasMember",
        "property": "http://www.w3.org/2006/vcard/ns#hasMember",
        "label": {
          "en": "has member"
        },
        "description": {
          "en": "To include a member in the group this object represents. (This property can only be used by Group individuals)"
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.w3.org/2006/vcard/ns#Kind"
        },
        "type": "group",
        "automatic": true
      },
      {
        "type": "choice",
        "nodetype": "URI",
        "id": "vc:vCardType",
        "property": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
        "label": {
          "en": "Context",
          "sv": "Sammanhang",
          "nb": "Kontekst",
          "da": "Kontekst",
          "de": "Zusammenhang"
        },
        "choices": [
          {
            "value": "http://www.w3.org/2006/vcard/ns#Home",
            "label": {
              "en": "Home",
              "sv": "Hem",
              "nb": "Hjemme",
              "da": "Hjemme",
              "de": "Zuhause"
            },
            "description": {
              "en": "This implies that the property is related to an individual's personal life"
            }
          },
          {
            "value": "http://www.w3.org/2006/vcard/ns#Work",
            "description": {
              "en": "This implies that the property is related to an individual's work place"
            },
            "label": {
              "en": "Work",
              "sv": "Arbete",
              "nb": "Arbeid",
              "da": "Arbejde",
              "de": "Arbeit"
            }
          }
        ],
        "cardinality": {
          "min": 0,
          "pref": 1
        },
        "styles": [
          "strictmatch"
        ]
      },
      {
        "type": "group",
        "nodetype": "RESOURCE",
        "id": "vc:IndOrGroup",
        "label": {
          "en": "Individual or Group"
        },
        "description": {},
        "items": [
          {
            "id": "vc:kindIndOrOrg"
          },
          {
            "id": "vc:fn"
          },
          {
            "id": "vc:hasEmail"
          },
          {
            "id": "vc:hasTelephone"
          },
          {
            "id": "vc:hasAddress"
          }
        ]
      },
      {
        "type": "choice",
        "nodetype": "URI",
        "id": "vc:kind",
        "property": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
        "label": {
          "en": "Kind",
          "sv": "Art",
          "de": "Art"
        },
        "choices": [
          {
            "value": "http://www.w3.org/2006/vcard/ns#Group",
            "label": {
              "en": "Group",
              "sv": "Grupp",
              "da": "Gruppe",
              "de": "Gruppe"
            },
            "description": {
              "en": "Object representing a group of persons or entities.  A group object will usually contain hasMember properties to specify the members of the group."
            }
          },
          {
            "value": "http://www.w3.org/2006/vcard/ns#Individual",
            "label": {
              "en": "Individual",
              "sv": "Individ",
              "da": "Individ",
              "de": "Einzelperson"
            },
            "description": {
              "en": "An object representing a single person or entity."
            }
          },
          {
            "value": "http://www.w3.org/2006/vcard/ns#Location",
            "label": {
              "en": "Location",
              "sv": "Plats",
              "da": "Sted",
              "de": "Ort"
            },
            "description": {
              "en": "An object representing a named geographical place."
            }
          },
          {
            "value": "http://www.w3.org/2006/vcard/ns#Organization",
            "label": {
              "en": "Organization",
              "sv": "Organisation",
              "da": "Organisation",
              "de": "Organisation"
            },
            "description": {
              "en": "An object representing an organization.  An organization is a single entity, and might represent a business or government, a department or division within a business or government, a club, an association, or the like."
            }
          }
        ],
        "cardinality": {
          "min": 1,
          "pref": 0,
          "max": 1
        }
      },
      {
        "type": "choice",
        "nodetype": "URI",
        "id": "vc:telephoneType",
        "property": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
        "label": {
          "en": "Type",
          "sv": "Typ",
          "nb": "Type",
          "da": "Type",
          "de": "Typ"
        },
        "description": {},
        "choices": [
          {
            "value": "http://www.w3.org/2006/vcard/ns#Cell",
            "label": {
              "en": "Cell (mobile)",
              "sv": "Mobiltelefon",
              "nb": "mobil",
              "da": "Mobiltelefon",
              "de": "Mobiltelefon"
            },
            "description": {
              "en": "Also called mobile telephone."
            }
          },
          {
            "value": "http://www.w3.org/2006/vcard/ns#Fax",
            "label": {
              "en": "Fax",
              "sv": "Fax",
              "nb": "Faks",
              "da": "Fax",
              "de": "Fax"
            },
            "description": {
              "en": "A faxmachine telephone number."
            }
          },
          {
            "value": "http://www.w3.org/2006/vcard/ns#Pager",
            "label": {
              "en": "Pager",
              "sv": "Personsökare",
              "nb": "Personsøker",
              "da": "Personsøger",
              "de": "Pager"
            },
            "description": {}
          },
          {
            "value": "http://www.w3.org/2006/vcard/ns#Text",
            "description": {
              "en": "Also called sms telephone"
            },
            "label": {
              "en": "Text (sms)",
              "sv": "Textmeddelande (sms)",
              "nb": "Sms",
              "da": "Tekstbesked (SMS)",
              "de": "SMS"
            }
          },
          {
            "value": "http://www.w3.org/2006/vcard/ns#TextPhone",
            "label": {
              "en": "Text phone",
              "sv": "Texttelefon",
              "nb": "Teksttelefon",
              "da": "Teksttelefon",
              "de": "Texttelefon"
            }
          },
          {
            "value": "http://www.w3.org/2006/vcard/ns#Video",
            "label": {
              "en": "Video",
              "sv": "Video",
              "nb": "Video",
              "da": "Video",
              "de": "Video"
            }
          },
          {
            "value": "http://www.w3.org/2006/vcard/ns#Voice",
            "label": {
              "en": "Voice",
              "sv": "Röst",
              "nb": "Stemme",
              "da": "Stemme",
              "de": "Stimme"
            },
            "description": {}
          }
        ],
        "cardinality": {
          "min": 0,
          "pref": 1
        },
        "styles": [
          "strictmatch"
        ]
      },
      {
        "type": "choice",
        "nodetype": "URI",
        "property": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
        "label": {
          "en": "Kind",
          "sv": "Typ",
          "da": "Type"
        },
        "choices": [
          {
            "value": "http://www.w3.org/2006/vcard/ns#Individual",
            "label": {
              "en": "Individual",
              "sv": "Individ",
              "nb": "Individ",
              "da": "Individ",
              "de": "Einzelperson"
            },
            "description": {
              "en": "An object representing a single person or entity."
            }
          },
          {
            "value": "http://www.w3.org/2006/vcard/ns#Organization",
            "label": {
              "en": "Organization",
              "sv": "Organisation",
              "nb": "Organisasjon",
              "da": "Organisation",
              "de": "Organisation"
            },
            "description": {
              "en": "An object representing an organization.  An organization is a single entity, and might represent a business or government, a department or division within a business or government, a club, an association, or the like."
            }
          }
        ],
        "cardinality": {
          "min": 1,
          "pref": 0,
          "max": 1
        },
        "id": "vc:kindIndOrOrg"
      }
    ],
    "scope": "vcard",
    "namespace": "http://www.w3.org/2006/vcard/ns#"
  },
  {
    "templates": [
      {
        "type": "group",
        "id": "odrs:RightsStatement-long",
        "items": [
          {
            "id": "odrs:databaseRightStatement"
          },
          {
            "id": "odrs:databaseRightYear"
          },
          {
            "id": "odrs:copyrightHolder"
          },
          {
            "id": "odrs:databaseRightHolder"
          },
          {
            "id": "odrs:jurisdiction"
          },
          {
            "id": "odrs:reuserGuidelines"
          },
          {
            "id": "odrs:dataLicense"
          },
          {
            "id": "odrs:contentLicense"
          }
        ],
        "extends": "odrs:RightsStatement-common"
      },
      {
        "type": "text",
        "id": "odrs:attributionText",
        "property": "http://schema.theodi.org/odrs#attributionText",
        "label": {
          "en": "Attribution text",
          "sv": "Erkännandetext",
          "nb": "Attribusjonstekst",
          "da": "Text på attribut",
          "de": "Namensnennungstext"
        },
        "description": {
          "en": "The text to use in an attribution link. This may be the name of the publisher or a reference to a community or group of contributors.",
          "nb": "Teksten som skal benyttes i en henvisningslenke (attribusjonslink). Dette kan være navnet på utgiveren eller en referanse til en gruppe bidragsytere.",
          "da": "Teksten som skal benyttes i en henvisning (link til attribut). Dette kan være navnet på den dataejende organisation eller en reference til en gruppe bidragsydere.",
          "sv": "Texten som ska användas i en erkännandetext. Detta kan vara namnet på utgivaren eller en hänvisning till ett gemenskap eller en grupp av bidragare.",
          "de": "Der Text, der in einer Namensnennung verwendet wird. Dies kann der Name des Verlages oder ein Verweis auf eine Gemeinschaft oder eine Gruppe von Mitwirkenden sein."
        },
        "cardinality": {
          "min": 0,
          "pref": 1
        },
        "styles": [
          "multiline"
        ],
        "nodetype": "LANGUAGE_LITERAL"
      },
      {
        "type": "text",
        "id": "odrs:attributionURL",
        "property": "http://schema.theodi.org/odrs#attributionURL",
        "nodetype": "URI",
        "label": {
          "en": "Attribution URL",
          "sv": "Erkännande URL",
          "nb": "Attribusjonslenke",
          "da": "Link til attribut",
          "de": "Webadresse zur Namensnennung"
        },
        "description": {
          "en": "The link (URL) which should be used when attributing a data source. The URL could be a reference to the dataset or publisher homepage, but may also be a dedicated attribution page. This is useful when providing onward attribution to upstream sources.",
          "nb": "Linken skal benyttes ved henvisning av datakilde. URLen kan referere til datasettet eller utgiverens hjemmeside, men kan også peke til en egen attribusjonsside. Dette er nyttig når du henviser tilbake til hovedkilden.",
          "da": "Link skal benyttes ved henvisning til datakilde. URLen kan referere til datasettet eller den dataejendes hjemmeside, men kan også pege til attributtens egen side. Dette er nyttigt når du henviser tilbage til hovedkilden."
        },
        "cardinality": {
          "min": 0,
          "pref": 1
        },
        "pattern": "https?://.+"
      },
      {
        "type": "text",
        "id": "odrs:copyrightNotice",
        "property": "http://schema.theodi.org/odrs#copyrightNotice",
        "label": {
          "en": "Copyright notice",
          "sv": "Meddelande om upphovsrätt",
          "nb": "Copyrighterklæring",
          "da": "Copyrighterklæring",
          "de": "Urheberrechtshinweis"
        },
        "description": {
          "en": "The copyright notice associated with a rights statement. A notice must typically be preserved and displayed when acknowledging the source of some data. This property is expressed as a simple literal value and so is suitable for simple copyright notices. Where a data publisher needs to reference a larger copyright statement and/or related guidance then the copyrightStatement property should be used instead.",
          "nb": "En copyrighterklæring som hører til en rettighetserklæring. En merknad må som regel beholdes og vises ved oppgivelse av kilden av enkelte data. Egenskapen er uttrykt som en enkel literalverdi og er egnet for enkle copyrighterklæringer. Dersom en dataeier trenger en mer utfyllende forklaring til copyrighten og/eller relatert veiledning, bør copyrightforklaring brukes.",
          "da": "En copyrighterklæring som hører til en rettighetserklæring. En besked må som regel bevares og vises ved anerkendelse af kilden til nogen data. Egenskaben er udtrykt som en simpel literalværdi og er egnet til enkle copyrighterklæringer. Hvis en dataejer har behov for en mere fuldstændig forklaring til copyrighten og/eller relateret vejledning, bør copyrightforklaring bruges."
        },
        "styles": [
          "multiline"
        ],
        "nodetype": "LANGUAGE_LITERAL"
      },
      {
        "type": "text",
        "id": "odrs:reuserGuidelines",
        "label": {
          "en": "Guidelines for re-users",
          "sv": "Riktlinjer för återanvändning",
          "nb": "Retningslinjer for gjenbrukere/viderebrukere",
          "da": "Retningslinjer for genbrugere/videreanvendere",
          "de": "Richtlinien für Wiederverwender"
        },
        "description": {
          "en": "Link (URL) to a document that provides guidelines for re-users of data that is covered by a specific rights statement. The guidelines may include more detail on attribution guidelines, a fuller copyright statement, and general guidance on how the data might be re-used",
          "nb": "Lenke til et dokument som gir veiledning for gjen- og viderebrukerne av data som er dekket av en spesifikk rettighetserklæring. Veiledningen kan inneholde mer detaljert informasjon om  retningslinjene for opphavsrett, en fyldigere forklaring til copyrighten, og en generell veiledning i hvordan data kan gjen- og videregjenbrukes.",
          "da": "Link (URL) til et dokument som giver vejledning for genbrug og videreanvendelse af data som er dækket af en specifik rettighetserklæring. Vejledningen kan indeholde mere detaljeret information om  retningslinjerne for ophavsret, en fyldigere forklaring til copyrighten, og en generel vejledning i hvordan data kan genbruges og videreanvendes."
        },
        "property": "http://schema.theodi.org/odrs#reuserGuidelines",
        "nodetype": "URI",
        "cardinality": {
          "min": 0,
          "pref": 1
        },
        "pattern": "https?://.+"
      },
      {
        "type": "text",
        "id": "odrs:copyrightStatement",
        "property": "http://schema.theodi.org/odrs#copyrightStatement",
        "nodetype": "URI",
        "label": {
          "en": "Copyright statement",
          "sv": "Upphovsrättsdokument",
          "nb": "Copyrightforklaring / forklaring til copyright",
          "da": "Copyrightforklaring / forklaring til copyright",
          "de": "Urheberrechtserklärung"
        },
        "description": {
          "en": "A link (URL) to a document that includes a statement about the copyright status of the content of a dataset. The web page might include both a copyright notice for a dataset, and any relevant guidance for re-users.",
          "nb": "En lenke til et dokument som inneholder en erklæring om opphavsretten til innholdet i et datasett. Nettsiden kan inkludere både copyrighterklæring for et datasett, og annen relevant veiledning for gjenbrukeren.",
          "da": "Et link (URL) til et dokument som indeholder en erklæring om ophavsretten til indholdet i et datasæt. Netsiden kan inkludere både copyrighterklæring for et datasæt, og anden relevant vejledning for genbrugeren."
        },
        "cardinality": {
          "min": 0,
          "pref": 1
        },
        "pattern": "https?://.+"
      },
      {
        "type": "group",
        "id": "odrs:copyrightHolder",
        "property": "http://schema.theodi.org/odrs#copyrightHolder",
        "extends": "foaf:Organization-ref",
        "label": {
          "en": "Copyright holder",
          "sv": "Ägare av upphovsrätten",
          "nb": "Copyrightinnehaver",
          "da": "Copyrightindehaver",
          "de": "Urheberrechtsinhaber"
        },
        "description": {
          "en": "A reference to the organization that holds copyright over the content of the dataset",
          "da": "En reference til den organisation der har ophavsretten over indholdet af datasættet"
        },
        "cardinality": {
          "min": 0,
          "pref": 1
        }
      },
      {
        "type": "group",
        "id": "odrs:databaseRightHolder",
        "property": "http://schema.theodi.org/odrs#databaseRightHolder",
        "extends": "foaf:Organization-ref",
        "label": {
          "en": "Database rights holder",
          "da": "Database rettighedsholder",
          "de": "Datenbankrechte-Inhaber",
          "sv": "Databasens rättighetsinnehavare"
        },
        "description": {
          "en": "A reference to the organization that holds database rights over the dataset",
          "da": "En reference til den organisation der har ophavsretten over databasen der indeholder datasættet"
        },
        "cardinality": {
          "min": 0,
          "pref": 1
        }
      },
      {
        "type": "text",
        "id": "odrs:jurisdiction",
        "property": "http://schema.theodi.org/odrs#jurisdiction",
        "nodetype": "URI",
        "label": {
          "en": "Jurisdiction",
          "sv": "Jurisdiktion",
          "nb": "Jurisdiksjon",
          "da": "Jurisdiktion",
          "de": "Gerichtsbarkeit"
        },
        "description": {
          "en": "A reference (URI) to the jurisdiction in which copyright and/or database rights have been asserts. It is recommended that this refer to the URI for a country or region.",
          "nb": "En referanse til jurisdiksjonen der opphavsretten og/eller databaserettighetene ble gjort gjeldende. Det er anbefalt at denne referere til URIen for et land eller en region.",
          "da": "En reference til jurisdiktionen der har gjort ophavsretten og/eller databaserettighederne gældende. Det er anbefalet at denne referere til URIen for et land eller en region."
        },
        "cardinality": {
          "min": 0,
          "pref": 1
        },
        "pattern": "https?://.+"
      },
      {
        "type": "text",
        "id": "odrs:copyrightYear",
        "property": "http://schema.theodi.org/odrs#copyrightYear",
        "nodetype": "ONLY_LITERAL",
        "label": {
          "en": "Copyright year",
          "sv": "Upphovsrättsår",
          "da": "Dato for copyright",
          "de": "Copyright-Jahr"
        },
        "description": {
          "en": "The year from which copyright over the content of the dataset is asserted.",
          "nb": "Året der opphavsretten for innholdet blir anført. ",
          "da": "Året hvor ophavsretten for indholdet er gældende fra. "
        }
      },
      {
        "type": "text",
        "id": "odrs:databaseRightYear",
        "property": "http://schema.theodi.org/odrs#databaseRightYear",
        "nodetype": "ONLY_LITERAL",
        "label": {
          "en": "Database rights year",
          "da": "Database rettigheds år",
          "de": "Datenbankrechte-Jahr",
          "sv": "Databasens rättighetsår"
        },
        "description": {
          "en": "The year from which a database right over the dataset is asserted.",
          "da": "Året hvor ophavsretten for databasen er gældende fra. "
        },
        "cardinality": {
          "min": 0,
          "pref": 1
        }
      },
      {
        "type": "choice",
        "id": "odrs:compatibleWith",
        "property": "http://schema.theodi.org/odrs#compatibleWith",
        "description": {
          "en": "This property is used to indicates that one license is compatible with another. A re-use that meets the requirements, permissions and prohibitions of the first license should also meet the requirements, permissions and prohibitions of the second, compatible license. The inverse is not necessarily true: the compatible license might have stricter requirements. This statement can be used as an indicator that a re-user could publish a derivative dataset under the compatible license, e.g. to help drive automated selection and guidance licenses for publishers of derived data. However it is not a substitute for properly reading and understanding the text of either license."
        },
        "label": {
          "en": "Compatible with",
          "de": "Kompatibel mit",
          "sv": "Kompatibel med"
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://schema.theodi.org/odrs#License"
        },
        "nodetype": "URI"
      },
      {
        "type": "group",
        "id": "odrs:dataLicense",
        "label": {
          "en": "Data license",
          "sv": "Datalicens",
          "de": "Datenlizenz"
        },
        "cardinality": {
          "min": 1,
          "pref": 1,
          "max": 1
        },
        "items": [
          {
            "type": "choice",
            "property": "http://schema.theodi.org/odrs#dataLicense",
            "label": {
              "en": "Choose an existing license",
              "sv": "Välj en befintlig licens",
              "de": "Wählen Sie eine vorhandene Lizenz"
            },
            "cardinality": {
              "min": 0,
              "pref": 1,
              "max": 1
            },
            "nodetype": "URI",
            "extends": "dcterms:cc-license-choices"
          },
          {
            "type": "text",
            "nodetype": "URI",
            "property": "http://schema.theodi.org/odrs#dataLicense",
            "label": {
              "en": "or, provide a URL to the license",
              "de": "oder stellen Sie eine Webadresse zur Lizenz zur Verfügung",
              "sv": "eller ange en webbadress till licensen"
            },
            "cardinality": {
              "min": 0,
              "pref": 1,
              "max": 1
            }
          }
        ]
      },
      {
        "type": "text",
        "property": "http://schema.theodi.org/odrs#databaseRightStatement",
        "nodetype": "URI",
        "label": {
          "en": "Database rights statement",
          "sv": "Rättighetsförklaring för databasen",
          "de": "Rechteerklärung für Datenbank"
        },
        "description": {
          "en": "A link to a document that includes a statement about the database rights that apply to this dataset. The web page might include both a statement on the applicable rights and any relevant guidance for re-users."
        },
        "cardinality": {
          "min": 0,
          "pref": 1
        },
        "id": "odrs:databaseRightStatement"
      },
      {
        "type": "group",
        "id": "odrs:contentLicense",
        "cardinality": {
          "min": 1,
          "pref": 1,
          "max": 1
        },
        "label": {
          "en": "Content license"
        },
        "items": [
          {
            "type": "choice",
            "property": "http://schema.theodi.org/odrs#contentLicense",
            "label": {
              "en": "Choose an existing license"
            },
            "cardinality": {
              "min": 0,
              "pref": 1,
              "max": 1
            },
            "nodetype": "URI",
            "extends": "dcterms:cc-license-choices"
          },
          {
            "type": "text",
            "nodetype": "URI",
            "property": "http://schema.theodi.org/odrs#contentLicense",
            "label": {
              "en": "or, provide a URL to the license"
            },
            "cardinality": {
              "min": 0,
              "pref": 1,
              "max": 1
            }
          }
        ]
      },
      {
        "type": "group",
        "id": "odrs:RightsStatement-short",
        "items": [
          {
            "id": "odrs:copyrightHolder"
          },
          {
            "id": "odrs:jurisdiction"
          },
          {
            "id": "odrs:reuserGuidelines"
          }
        ],
        "extends": "odrs:RightsStatement-common"
      },
      {
        "type": "group",
        "id": "odrs:RightsStatement-common",
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://schema.theodi.org/odrs#RightsStatement"
        },
        "label": {
          "en": "Rights statement",
          "sv": "Rättighetsförklaring",
          "nb": "Rettighetserklæring",
          "da": "Rettighedserklæring",
          "de": "Rechteerklärung"
        },
        "description": {
          "en": "A description of the rights and terms of re-use for a dataset. A rights statement will include a reference to one or more licences copyright notices, and attribution requirements. Where a Rights Statement refers to several licences the intention is that these should separately apply to the data and content associated with the dataset. An individual Rights Statement may be specific to a dataset or could be applied to a number of datasets published by the same organisation or person, where the rights associated with each dataset are identical.",
          "nb": "En beskrivelse av rettigheter og vilkår for gjen- og viderebruk av et datasett. En rettighetserklæring inkluderer referanse til en eller flere lisenser, copyrighterklæring og krav til henvisning/navngivelse. Der en rettighetserklæring refererer til flere lisenser, er intensjonen at disse hver for seg skal gjelde for data og innhold assosiert med datasettet. En egen rettighetserklæring kan gjelde for et spesifikk datasett, eller for en rekke datasett publisert av samme organisasjon eller person, der rettigheten for hvert datasett er identiske.",
          "da": "En beskrivelse af rettigheter og vilkår for genbrug og videreanvendelse af et datasæt. En rettighedserklæring inkluderer reference til en eller flere lisencer, copyrighterklæringer og krav til henvisning/navngivelse. Der hvor en rettighedserklæring refererer til flere licenser, er intentionen at disse hver for sig skal gælde for data og indhold associeret med datasættet. En individuel rettighedserklæring kan gælde for et specifikt datasæt, eller for en række datasæt publiceret af samme organisation eller person, hvor rettigheden for hvert datasæt er identiske."
        },
        "items": [
          {
            "id": "odrs:attributionText"
          },
          {
            "id": "odrs:attributionURL"
          },
          {
            "id": "odrs:copyrightNotice"
          },
          {
            "id": "odrs:copyrightStatement"
          },
          {
            "id": "odrs:copyrightYear"
          }
        ]
      },
      {
        "type": "group",
        "id": "odrs:RightsStatement-short-agent",
        "items": [
          {
            "type": "choice",
            "labelProperties": [
              "http://xmlns.com/foaf/0.1/name"
            ],
            "nodetype": "URI",
            "extends": "odrs:copyrightHolder",
            "constraints": {
              "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://xmlns.com/foaf/0.1/Agent"
            }
          },
          {
            "id": "odrs:jurisdiction"
          },
          {
            "id": "odrs:reuserGuidelines"
          }
        ],
        "extends": "odrs:RightsStatement-common"
      }
    ]
  },
  {
    "templates": [
      {
        "type": "text",
        "id": "dcat:dcterms:title",
        "extends": "dcterms:title",
        "cardinality": {
          "min": 0,
          "pref": 0
        },
        "nodetype": "LANGUAGE_LITERAL",
        "label": {
          "sv": "Titel",
          "da": "Titel",
          "en": "Title",
          "nb": "Tittel",
          "de": "Titel"
        }
      },
      {
        "type": "text",
        "id": "dcat:dcterms:title_da",
        "cardinality": {
          "min": 1,
          "pref": 0
        },
        "description": {
          "en": "This property contains a name given to the Dataset. This property can be repeated for parallel language versions of the name.",
          "nb": "Inneholder navnet på datasettet. Kan gjentas for parallelle språkversjoner av navnet",
          "da": "Datasættets formelle navn. Kan gentages for forskellige sprogversioner af navnet",
          "de": "Der Name des Datensatzes. Diese Eigenschaft kann für andere Sprachversionen des Namens wiederholt werden.",
          "sv": "Datamängdens namn. Denna egenskap kan upprepas för parallella språkversioner av namnet."
        },
        "nodetype": "LANGUAGE_LITERAL",
        "extends": "dcat:dcterms:title"
      },
      {
        "type": "text",
        "id": "dcat:dcterms:description",
        "extends": "dcterms:description",
        "styles": [
          "multiline"
        ],
        "cardinality": {
          "min": 0,
          "pref": 0
        },
        "label": {
          "nb": "Beskrivelse",
          "da": "Beskrivelse",
          "sv": "Beskrivning",
          "en": "Description",
          "de": "Beschreibung"
        }
      },
      {
        "type": "text",
        "id": "dcat:dcterms:description_da",
        "extends": "dcat:dcterms:description",
        "styles": [
          "multiline"
        ],
        "cardinality": {
          "min": 1,
          "pref": 0
        },
        "description": {
          "en": "This property contains a free-text description of the dataset. This property can be repeated for parallel  language versions of the description.",
          "nb": "Inneholder fritekstbeskrivelse av datasettet. Kan gjentas for parallelle språkversjoner",
          "da": "Beskrivelse af datasættet som angiver centrale kendetegn, og formålet med dataindsamlingen. Kan gentages for forskellige sprogversioner",
          "de": "Diese Eigenschaft enthält eine Beschreibung des Datensatzes. Diese Eigenschaft kann für andere Sprachversionen der Beschreibung wiederholt werden.",
          "sv": "Datamängdens beskrivning. Denna egenskap kan upprepas för parallella språkversioner av beskrivningen."
        }
      },
      {
        "type": "text",
        "id": "dcat:dcterms:identifier_da",
        "extends": "dcterms:identifier",
        "cardinality": {
          "min": 0,
          "pref": 0
        },
        "description": {
          "en": "This property contains the main identifier for the Dataset, e.g. the URI or other unique identifier in the context of the Catalogue.",
          "nb": "Hovedindentifikator for datasettet, feks URIen eller annen identifikator som er unik i kontekst av katalogen",
          "da": "Unik identifikator som kan anvendes til at identificere det pågældende sæt af metadata og håndtere relationen til det pågældende datasæt",
          "de": "Diese Eigenschaft enthält then Hauptidentifikator für den Datensatz, z.B. die URI oder eine andere eindeutige Kennung im Kontext des Kataloges.",
          "sv": "Datamängdens huvudidentifierare, t.ex. en URI eller annan unik identifierare i katalogens sammanhang."
        },
        "label": {
          "en": "Identifier",
          "da": "identifikator",
          "nb": "identifikator",
          "de": "Identifikator",
          "sv": "Identifierare"
        }
      },
      {
        "type": "choice",
        "id": "dcat:dcterms:language",
        "extends": "dcterms:language",
        "cardinality": {
          "min": 0,
          "pref": 0
        },
        "choices": [
          {
            "value": "http://publications.europa.eu/resource/authority/language/SQI",
            "label": {
              "en": "Albanian",
              "sv": "albanska",
              "da": "albansk",
              "de": "Albanisch"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/ARA",
            "label": {
              "en": "Arabic",
              "sv": "arabiska",
              "da": "arabisk",
              "de": "Arabisch"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/HYE",
            "label": {
              "en": "Armenian",
              "sv": "armeniska",
              "da": "armenisk",
              "de": "Armenisch"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/AZE",
            "label": {
              "en": "Azerbaijani",
              "sv": "azerbajdzjanska",
              "da": "azerbajdzjansk",
              "de": "Aserbaidschanisch"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/EUS",
            "label": {
              "en": "Basque",
              "sv": "baskiska",
              "da": "baskisk",
              "de": "Baskisch"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/BEL",
            "label": {
              "en": "Belarusian",
              "sv": "vitryska",
              "da": "hviderussisk",
              "de": "Belarussisch"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/BEN",
            "label": {
              "en": "Bengali",
              "sv": "bengali",
              "da": "bengalsk",
              "de": "Bengalisch"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/BOS",
            "label": {
              "en": "Bosnian",
              "sv": "bosniska",
              "da": "bosnisk",
              "de": "Bosnisch"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/BRE",
            "label": {
              "en": "Breton",
              "sv": "bretonska",
              "da": "bretonsk",
              "de": "Bretonisch"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/BUL",
            "label": {
              "en": "Bulgarian",
              "da": "bulgarisk",
              "sv": "bulgariska",
              "de": "Bulgarisch"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/CAT",
            "label": {
              "en": "Catalan",
              "sv": "katalanska",
              "da": "katalansk",
              "de": "Katalanisch"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/ZHO",
            "label": {
              "en": "Chinese",
              "sv": "kinesiska",
              "da": "kinesisk",
              "de": "Chinesisch"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/COS",
            "label": {
              "en": "Corsican",
              "da": "korsikansk",
              "sv": "korsikanska",
              "de": "Korsisch"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/HRV",
            "label": {
              "en": "Croatian",
              "sv": "kroatiska",
              "da": "kroatisk",
              "de": "Kroatisch"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/CES",
            "label": {
              "en": "Czech",
              "da": "tjekkisk",
              "sv": "tjeckiska",
              "de": "Tschechisch"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/DAN",
            "label": {
              "en": "Danish",
              "sv": "danska",
              "da": "dansk",
              "de": "Dänisch"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/DIV",
            "label": {
              "en": "Dhivehi",
              "sv": "divehi",
              "da": "maldivisk",
              "de": "Dhivehi"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/NLD",
            "label": {
              "en": "Dutch",
              "sv": "nederländska",
              "da": "hollandsk",
              "de": "Niederländisch"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/ENG",
            "label": {
              "en": "English",
              "sv": "engelska",
              "da": "engelsk",
              "de": "Englisch"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/EPO",
            "label": {
              "en": "Esperanto",
              "sv": "esperanto",
              "da": "esperanto",
              "de": "Esperanto"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/EST",
            "label": {
              "en": "Estonian",
              "sv": "estniska",
              "da": "estnisk",
              "de": "Estnisch"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/FAO",
            "label": {
              "en": "Faroese",
              "sv": "färöiska",
              "da": "færøsk",
              "de": "Färöisch"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/FIN",
            "label": {
              "en": "Finnish",
              "da": "finsk",
              "sv": "finska",
              "de": "Finnisch"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/VLS",
            "label": {
              "en": "Flemish",
              "sv": "flamländska",
              "da": "flamsk",
              "de": "Flämisch"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/FRA",
            "label": {
              "en": "French",
              "sv": "franska",
              "da": "fransk",
              "de": "Französisch"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/FRY",
            "label": {
              "en": "Frisian",
              "sv": "frisiska",
              "da": "frisisk",
              "de": "Friesisch"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/GLG",
            "label": {
              "en": "Galician",
              "sv": "galiciska",
              "da": "galisk",
              "de": "Gälisch"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/KAT",
            "label": {
              "en": "Georgian",
              "sv": "georgiska",
              "da": "georgisk",
              "de": "Georgisch"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/DEU",
            "label": {
              "en": "German",
              "sv": "tyska",
              "da": "tysk",
              "de": "Deutsch"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/ELL",
            "label": {
              "en": "Greek",
              "sv": "grekiska",
              "da": "græsk",
              "de": "Griechisch"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/KAL",
            "label": {
              "en": "Greenlandic",
              "sv": "grönländska",
              "da": "grønlandsk",
              "de": "Grönländisch"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/HEB",
            "label": {
              "en": "Hebrew",
              "sv": "hebreiska",
              "da": "hebraisk",
              "de": "Hebräisch"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/HIN",
            "label": {
              "en": "Hindi",
              "sv": "hindi",
              "da": "hindi",
              "de": "Hindi"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/HUN",
            "label": {
              "en": "Hungarian",
              "sv": "ungerska",
              "da": "ungarsk",
              "de": "Ungarisch"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/ISL",
            "label": {
              "en": "Icelandic",
              "sv": "isländska",
              "da": "islandsk",
              "de": "Isländisch"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/IND",
            "label": {
              "en": "Indonesian",
              "sv": "indonesiska",
              "da": "indonesisk",
              "de": "Indonesisch"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/INA",
            "label": {
              "en": "Interlingua",
              "sv": "interlingua",
              "da": "interlingua",
              "de": "Interlingua"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/GLE",
            "label": {
              "en": "Irish",
              "da": "irisk",
              "sv": "iriska",
              "de": "Irisch"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/ITA",
            "label": {
              "en": "Italian",
              "da": "italiensk",
              "sv": "italienska",
              "de": "Italienisch"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/JPN",
            "label": {
              "en": "Japanese",
              "sv": "japanska",
              "da": "japansk",
              "de": "Japanisch"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/CSB",
            "label": {
              "en": "Kashubian",
              "da": "kasjubisk",
              "sv": "kasjubiska",
              "de": "Kaschubisch"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/KAZ",
            "label": {
              "en": "Kazakh",
              "sv": "kazakiska",
              "da": "kazakisk",
              "de": "Kasachisch"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/KHM",
            "label": {
              "en": "Khmer",
              "sv": "khmer",
              "da": "khmer",
              "de": "Khmer"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/KOR",
            "label": {
              "en": "Korean",
              "da": "koreansk",
              "sv": "koreanska",
              "de": "Koreanisch"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/KUR",
            "label": {
              "en": "Kurdish",
              "sv": "kurdiska",
              "da": "kurdisk",
              "de": "Kurdisch"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/KIR",
            "label": {
              "en": "Kyrgyz",
              "sv": "kirgiziska",
              "da": "kirgizisk",
              "de": "Kirgisisch"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/LAO",
            "label": {
              "en": "Lao",
              "sv": "lao",
              "da": "lao",
              "de": "Lao"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/LAT",
            "label": {
              "en": "Latin",
              "sv": "latin",
              "da": "latin",
              "de": "Latein"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/LAV",
            "label": {
              "en": "Latvian",
              "da": "lettisk",
              "sv": "lettiska",
              "de": "Lettisch"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/LIT",
            "label": {
              "en": "Lithuanian",
              "da": "litauisk",
              "sv": "litauiska",
              "de": "Litauisch"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/LTZ",
            "label": {
              "en": "Luxembourgish",
              "da": "luxemburgisk",
              "sv": "luxemburgiska",
              "de": "Luxemburgisch"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/MKD",
            "label": {
              "en": "Macedonian",
              "da": "makedonsk",
              "sv": "makedonska",
              "de": "Mazedonisch"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/MLG",
            "label": {
              "en": "Malagasy",
              "da": "malagassisk",
              "sv": "malagassiska",
              "de": "Madagasisch"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/MSA",
            "label": {
              "en": "Malay",
              "da": "malajisk",
              "sv": "malajiska",
              "de": "Malaiisch"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/MLT",
            "label": {
              "en": "Maltese",
              "da": "maltesisk",
              "sv": "maltesiska",
              "de": "Maltesisch"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/MIN",
            "label": {
              "en": "Minangkabau",
              "sv": "minangkabau",
              "da": "minangkabau",
              "de": "Minangkabau"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/MOL",
            "label": {
              "en": "Moldavian",
              "da": "moldavisk",
              "sv": "moldaviska",
              "de": "Moldawisch"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/MON",
            "label": {
              "en": "Mongolian",
              "sv": "mongoliska",
              "da": "mongolisk",
              "de": "Mongolisch"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/0E0",
            "label": {
              "en": "Montenegrin",
              "da": "montenegrinsk",
              "sv": "montenegrinska",
              "de": "Montenegrinisch"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/NEP",
            "label": {
              "en": "Nepali",
              "sv": "nepali",
              "da": "nepalesisk",
              "de": "Nepalesisch"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/SME",
            "label": {
              "en": "Northern Sami",
              "sv": "nordsamiska",
              "da": "nordsamisk",
              "de": "Nord-Sami"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/NOR",
            "label": {
              "en": "Norwegian",
              "sv": "norska",
              "da": "norsk",
              "de": "Norwegisch"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/OCI",
            "label": {
              "en": "Occitan",
              "sv": "occitanska",
              "da": "occitansk",
              "de": "Okzitanisch"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/OSS",
            "label": {
              "en": "Ossetian",
              "sv": "ossetiska",
              "da": "ossetisk",
              "de": "Ossetisch"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/FAS",
            "label": {
              "en": "Persian",
              "sv": "persiska",
              "da": "persisk",
              "de": "Persisch"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/POL",
            "label": {
              "en": "Polish",
              "sv": "polska",
              "da": "polsk",
              "de": "Polnisch"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/POR",
            "label": {
              "en": "Portuguese",
              "sv": "portugisiska",
              "da": "portugisisk",
              "de": "Portugiesisch"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/ROM",
            "label": {
              "en": "Romani",
              "sv": "romani",
              "da": "romani",
              "de": "Romani"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/RON",
            "label": {
              "en": "Romanian",
              "sv": "rumänska",
              "da": "rumænsk",
              "de": "Rumänisch"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/ROH",
            "label": {
              "en": "Romansh",
              "sv": "rätoromanska",
              "da": "rætoromansk",
              "de": "Rätoromanisch"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/RUS",
            "label": {
              "en": "Russian",
              "sv": "ryska",
              "da": "russisk",
              "de": "Russisch"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/GLA",
            "label": {
              "en": "Scottish Gaelic",
              "sv": "skotsk gaeliska",
              "da": "skotsk gaelisk",
              "de": "Schottisches Gälisch"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/SRP",
            "label": {
              "en": "Serbian",
              "sv": "serbiska",
              "da": "serbisk",
              "de": "Serbisch"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/HBS",
            "label": {
              "en": "Serbo-Croatian",
              "sv": "serbokroatiska",
              "da": "serbokroatisk",
              "de": "Serbokroatisch"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/SIN",
            "label": {
              "en": "Sinhala",
              "da": "singalesisk",
              "sv": "singalesiska",
              "de": "Singhala"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/SLK",
            "label": {
              "en": "Slovak",
              "da": "slovakisk",
              "sv": "slovakiska",
              "de": "Slowakisch"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/SLV",
            "label": {
              "en": "Slovenian",
              "sv": "slovenska",
              "da": "slovensk",
              "de": "Slowenisch"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/SPA",
            "label": {
              "en": "Spanish",
              "da": "spansk",
              "sv": "spanska",
              "de": "Spanisch"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/SWA",
            "label": {
              "en": "Swahili",
              "sv": "swahili",
              "da": "swahili",
              "de": "Swahili"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/SWE",
            "label": {
              "en": "Swedish",
              "sv": "svenska",
              "da": "svensk",
              "de": "Schwedisch"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/TGK",
            "label": {
              "en": "Tajiks",
              "da": "tadzjikisk",
              "sv": "tadzjikiska",
              "de": "Tadschiksch"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/TAM",
            "label": {
              "en": "Tamil",
              "sv": "tamil",
              "da": "tamil",
              "de": "Tamilisch"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/THA",
            "label": {
              "en": "Thai",
              "da": "thai",
              "sv": "thai",
              "de": "Thai"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/BOD",
            "label": {
              "en": "Tibetan",
              "sv": "tibetanska",
              "da": "tibetansk",
              "de": "Tibetisch"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/TUR",
            "label": {
              "en": "Turkish",
              "sv": "turkiska",
              "da": "turkisk",
              "de": "Türkisch"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/TUK",
            "label": {
              "en": "Turkmen",
              "sv": "turkmeniska",
              "da": "turkmenisk",
              "de": "Turkmenisch"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/UKR",
            "label": {
              "en": "Ukrainian",
              "sv": "ukrainska",
              "da": "ukrainsk",
              "de": "Ukrainisch"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/URD",
            "label": {
              "en": "Urdu",
              "sv": "urdu",
              "da": "urdu",
              "de": "Urdu"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/UZB",
            "label": {
              "en": "Uzbek",
              "sv": "uzbekiska",
              "da": "uzbekisk",
              "de": "Usbekisch"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/0D0",
            "label": {
              "en": "Valencian",
              "sv": "valencianska",
              "da": "valenciansk",
              "de": "Valencianisch"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/VIE",
            "label": {
              "en": "Vietnamese",
              "sv": "vietnamesiska",
              "da": "vietnamesisk",
              "de": "Vietnamesisch"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/WLN",
            "label": {
              "en": "Walloon",
              "sv": "vallonska",
              "da": "vallonsk",
              "de": "Wallonisch"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/CYM",
            "label": {
              "en": "Welsh",
              "sv": "kymriska",
              "da": "walisisk",
              "de": "Walisisch"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/YID",
            "label": {
              "en": "Yiddish",
              "sv": "jiddisch",
              "da": "jiddisch",
              "de": "Jiddisch"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/language/ZUL",
            "label": {
              "en": "Zulu",
              "sv": "zulu",
              "da": "zulu",
              "de": "Zulu"
            }
          }
        ],
        "nodetype": "URI",
        "label": {
          "nb": "Språk",
          "sv": "Språk",
          "da": "Sprog",
          "en": "Language",
          "de": "Sprache"
        }
      },
      {
        "id": "dcat:dcterms:spatial_bb_da",
        "property": "http://purl.org/dc/terms/spatial",
        "label": {
          "en": "Boundingbox",
          "da": "Geografisk omkransende rektangel",
          "sv": "Geografisk omskrivande rektangel",
          "de": "Geografisches Begrenzungsrechteck"
        },
        "type": "group",
        "nodetype": "BLANK",
        "cardinality": {
          "min": 0,
          "pref": 0
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/Location"
        },
        "items": [
          {
            "type": "text",
            "nodetype": "DATATYPE_LITERAL",
            "cardinality": {
              "min": 0,
              "pref": 1,
              "max": 1
            },
            "datatype": "http://www.opengis.net/ont/geosparql#wktLiteral",
            "property": "http://www.w3.org/ns/locn#geometry",
            "styles": [
              "invisibleGroup"
            ]
          }
        ]
      },
      {
        "type": "choice",
        "id": "dcat:dcterms:accrualPeriodicity-cld_da",
        "label": {
          "en": "Frequency of update",
          "sv": "Uppdateringsfrekvens",
          "da": "Opdateringsfrekvens",
          "de": "Aktualisierungshäufigkeit"
        },
        "styles": [
          "strictmatch",
          "deprecated"
        ],
        "cardinality": {
          "min": 0,
          "pref": 0
        },
        "choices": [
          {
            "value": "http://purl.org/cld/freq/annual",
            "label": {
              "en": "Annual",
              "da": "Årlig",
              "de": "Jährlich",
              "sv": "Årlig"
            },
            "description": {
              "en": "The event occurs once a year.",
              "da": "Opdatering sker en gang årligt.",
              "de": "Eine Aktualisierung findet einmal pro Jahr statt.",
              "sv": "Uppdateringen sker en gång per år."
            }
          },
          {
            "value": "http://purl.org/cld/freq/biennial",
            "label": {
              "en": "Biennial",
              "da": "Hvert andet år",
              "de": "Zweijährig",
              "sv": "Varannat år"
            },
            "description": {
              "en": "The event occurs every two years.",
              "da": "Opdatering sker hvert andet år.",
              "de": "Eine Aktualisierung findet jedes zweite Jahr statt.",
              "sv": "Uppdateringen sker vartannat år."
            }
          },
          {
            "value": "http://purl.org/cld/freq/bimonthly",
            "label": {
              "en": "Bimonthly",
              "da": "Hver anden måned",
              "de": "Zweimonatlich",
              "sv": "Varannan månad"
            },
            "description": {
              "en": "The event occurs every two months.",
              "da": "Opdatering sker hver anden måned.",
              "de": "Eine Aktualisierung findet alle zwei Monate statt.",
              "sv": "Uppdateringen sker varannan månad."
            }
          },
          {
            "value": "http://purl.org/cld/freq/biweekly",
            "label": {
              "en": "Biweekly",
              "da": "Hver anden uge",
              "de": "Zweiwöchentlich",
              "sv": "Varannan vecka"
            },
            "description": {
              "en": "The event occurs every two weeks.",
              "da": "Opdatering sker hver anden uge.",
              "de": "Eine Aktualisierung findet alle zwei Wochen statt.",
              "sv": "Uppdateringen sker varannan vecka."
            }
          },
          {
            "value": "http://purl.org/cld/freq/continuous",
            "label": {
              "en": "Continuous",
              "da": "Kontinuerlig",
              "de": "Kontinuierlich",
              "sv": "Kontinuerlig"
            },
            "description": {
              "en": "The event repeats without interruption.",
              "da": "Opdatering sker kontinuerligt og uden afbrydelse.",
              "de": "Eine Aktualisierung findet kontinuierlich statt.",
              "sv": "Uppdateringen sker kontiuerlig."
            }
          },
          {
            "value": "http://purl.org/cld/freq/daily",
            "label": {
              "en": "Daily",
              "da": "Dagligt",
              "de": "Täglich",
              "sv": "Dagligen"
            },
            "description": {
              "en": "The event occurs once a day.",
              "da": "Opdatering sker dagligt."
            }
          },
          {
            "value": "http://purl.org/cld/freq/irregular",
            "label": {
              "en": "Irregular",
              "da": "Irregulært",
              "de": "Irregulär",
              "sv": "Oregelbunden"
            },
            "description": {
              "en": "The event occurs at uneven intervals.",
              "da": "Opdatering sker efter vilkårlige intervaller."
            }
          },
          {
            "value": "http://purl.org/cld/freq/monthly",
            "label": {
              "en": "Monthly",
              "da": "Månedligt",
              "de": "Monatlich",
              "sv": "Månatlig"
            },
            "description": {
              "en": "The event occurs once a month.",
              "da": "Opdatering sker en gang om måneden."
            }
          },
          {
            "value": "http://purl.org/cld/freq/quarterly",
            "label": {
              "en": "Quarterly",
              "da": "Kvartalsvis",
              "de": "Vierteljährlich",
              "sv": "Kvartalsvis"
            },
            "description": {
              "en": "The event occurs every three months.",
              "da": "Opdatering sker kvartalsvis."
            }
          },
          {
            "value": "http://purl.org/cld/freq/semiannual",
            "label": {
              "en": "Semiannual",
              "da": "Halvårligt",
              "de": "Halbjährlich",
              "sv": "Halvårlig"
            },
            "description": {
              "en": "The event occurs twice a year.",
              "da": "Opdatering sker halvårligt."
            }
          },
          {
            "value": "http://purl.org/cld/freq/semimonthly",
            "label": {
              "en": "Semimonthly",
              "da": "Bimånedligt",
              "de": "Halbmonatlich",
              "sv": "Varannan månad"
            },
            "description": {
              "en": "The event occurs twice a month.",
              "da": "Opdatering sker to gange om måneden."
            }
          },
          {
            "value": "http://purl.org/cld/freq/semiweekly",
            "label": {
              "en": "Semiweekly",
              "da": "Biugentligt",
              "de": "Halbwöchentlich",
              "sv": "Två gånger per vecka"
            },
            "description": {
              "en": "The event occurs twice a week.",
              "da": "Opdatering sker to gange om ugen."
            }
          },
          {
            "value": "http://purl.org/cld/freq/threeTimesAMonth",
            "label": {
              "en": "Three times a month",
              "da": "Tre gange om måneden",
              "de": "Drei Mal im Monat",
              "sv": "Tre gånger per månad"
            },
            "description": {
              "en": "The event occurs three times a month.",
              "da": "Opdatering sker tre gange om måneden."
            }
          },
          {
            "value": "http://purl.org/cld/freq/threeTimesAWeek",
            "label": {
              "en": "Three times a week",
              "da": "Tre gange om ugen",
              "de": "Drei Mal in der Woche",
              "sv": "Tre gånger per vecka"
            },
            "description": {
              "en": "The event occurs three times a week.",
              "da": "Opdatering sker tre gange om ugen."
            }
          },
          {
            "value": "http://purl.org/cld/freq/threeTimesAYear",
            "label": {
              "en": "Three times a year",
              "da": "Tre gange om året",
              "de": "Drei Mal im Jahr",
              "sv": "Tre gånger per år"
            },
            "description": {
              "en": "The event occurs three times a year.",
              "da": "Opdatering sker tre gange om året."
            }
          },
          {
            "value": "http://purl.org/cld/freq/triennial",
            "label": {
              "en": "Triennial",
              "da": "Hvert tredje år",
              "de": "Alle drei Jahre",
              "sv": "Vart tredje år"
            },
            "description": {
              "en": "The event occurs every three years.",
              "da": "Opdatering sker hvert tredje år."
            }
          },
          {
            "value": "http://purl.org/cld/freq/weekly",
            "label": {
              "en": "Weekly",
              "da": "Ugentligt",
              "de": "Wöchentlich",
              "sv": "Varje vecka"
            },
            "description": {
              "en": "The event occurs once a week.",
              "da": "Opdatering sker ugentligt."
            }
          }
        ],
        "nodetype": "URI",
        "property": "http://purl.org/dc/terms/accrualPeriodicity",
        "description": {
          "en": "This property refers to the frequency at which Dataset is updated.",
          "da": "Hvor ofte det pågældende datasæt bliver opdateret.",
          "de": "Diese Eigenschaft bezieht sich auf die Häufigkeit mit welcher der Datensatz aktualisiert wird.",
          "sv": "Denna egenskapen avser den datamängdens uppdateringsfrekvens."
        }
      },
      {
        "type": "group",
        "id": "dcat:dcterms:temporal_da",
        "property": "http://purl.org/dc/terms/temporal",
        "nodetype": "RESOURCE",
        "label": {
          "en": "Time period",
          "sv": "Tidsperiod",
          "nb": "Tidsperiode",
          "da": "Tidsperiode",
          "de": "Zeitperiode"
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://purl.org/dc/terms/PeriodOfTime"
        },
        "cardinality": {
          "min": 0,
          "pref": 0
        },
        "items": [
          {
            "type": "text",
            "nodetype": "DATATYPE_LITERAL",
            "property": "http://schema.org/startDate",
            "label": {
              "en": "Start",
              "sv": "Start",
              "nb": "Start",
              "da": "Start",
              "de": "Beginn"
            },
            "datatype": "http://www.w3.org/2001/XMLSchema#date"
          },
          {
            "type": "text",
            "nodetype": "DATATYPE_LITERAL",
            "property": "http://schema.org/endDate",
            "label": {
              "en": "End",
              "sv": "Slut",
              "nb": "Slutt",
              "da": "Slut",
              "de": "Ende"
            },
            "datatype": "http://www.w3.org/2001/XMLSchema#date"
          }
        ],
        "description": {
          "nb": "Referanse til en tidsperiode datasettet gjelder for (startdato og sluttdato)",
          "da": "Reference til en tidsperiode datasættet gælder for (startdato og slutdato)",
          "de": "Gültigkeitszeitraum für einen Datensatz (Start- und Enddatum)",
          "sv": "Datamängdens giltighetsperiod (startdatum och slutdatum)"
        }
      },
      {
        "type": "text",
        "id": "dcat:keyword_da",
        "nodetype": "LANGUAGE_LITERAL",
        "label": {
          "en": "Keyword",
          "sv": "Nyckelord",
          "nb": "Emneord",
          "da": "Nøgleord",
          "de": "Schlüsselwort"
        },
        "property": "http://www.w3.org/ns/dcat#keyword",
        "cardinality": {
          "min": 0,
          "pref": 1
        },
        "description": {
          "en": "This property contains a keyword or tag describing the Dataset",
          "nb": "Inneholder emneord (eller tag) som beskriver datasettet",
          "da": "Nøgleord for et datasæt baseret på FORM på forskelligt niveau",
          "de": "Diese Eigenschaft enthält ein Schlüsselwort das den Datensatz beschreibt",
          "sv": "Egenskapen innehåller ett nyckelord som beskriver datamängden"
        },
        "styles": [
          "viewAllTranslations"
        ]
      },
      {
        "type": "group",
        "nodetype": "RESOURCE",
        "label": {
          "en": "Contact point",
          "sv": "Kontakt",
          "da": "Kontaktpunkt",
          "de": "Kontaktpunkt"
        },
        "id": "dcat:contactPoint",
        "property": "http://www.w3.org/ns/dcat#contactPoint",
        "cardinality": {
          "min": 0,
          "pref": 1
        },
        "description": {
          "en": "This property contains contact information that can be used for flagging errors in the Dataset or sending comments",
          "da": "Kontaktinformation i forhold til spørgsmål og kommentarer til datasættet",
          "de": "Diese Eigenschaft enthält Kontaktinformationen die zum Melden von Fehlern im Datensatz oder zum Versenden von Kommentaren verwendet werden können",
          "sv": "Egenskapen innehåller kontaktuppgifter som kan användas för att flagga fel i datamängden eller för att skicka kommentarer"
        },
        "extends": "vc:IndOrGroup"
      },
      {
        "type": "text",
        "nodetype": "URI",
        "label": {
          "en": "Landing page",
          "sv": "Ingångssida",
          "nb": "Landingsside",
          "da": "Link til hjemmeside",
          "de": "Landing-Page"
        },
        "property": "http://www.w3.org/ns/dcat#landingPage",
        "id": "dcat:landingPage_da",
        "cardinality": {
          "min": 0,
          "pref": 0
        },
        "description": {
          "en": "This property refers to a web page that provides access to the Dataset, its Distributions and/or additional information. It is intended to point to a landing page at the original data provider, not to a page on a site of a third party, such as an aggregator.",
          "nb": "Referanse til nettside som gir tilgang til datasettet, dets distribusjoner og/eller tilleggsinformasjon. Dokumentasjon som ikke er spesifikt definisjon av felter, hører hjemme her.",
          "da": "Denne attribut refererer til en hjemmeside der giver adgang til datasættet, dens distribution eller yderligere information. Formålet er at pege på en start side hos den oprindelige dataejer.",
          "de": "Diese Eigenschaft bezieht sich auf eine Webseite die Zugriff auf den Datensatz, seine Distributionen und/oder zusätzliche Informationen bietet. Es sollte auf eine Webseite beim ursprünglichen Datenanbieter verweisen und nicht etwa auf eine Website eines Aggregators.",
          "sv": "Den här egenskapen hänvisar till en webbsida som ger tillgång till datamängden eller dess distributioner och/eller ytterligare information. Den bör peka på en landningssida hos den ursprungliga dataleverantören och inte till en sida på en webbplats av en tredje part, såsom en aggregator."
        },
        "pattern": "https?://.+"
      },
      {
        "type": "group",
        "id": "dcat:publisher-person",
        "extends": "foaf:Person-ref",
        "property": "http://purl.org/dc/terms/publisher",
        "label": {
          "en": "Publisher (person)",
          "da": "Dataansvarlig organisation"
        },
        "cardinality": {
          "min": 0,
          "pref": 1
        }
      },
      {
        "type": "choice",
        "id": "dcat:theme-1ev",
        "property": "http://www.w3.org/ns/dcat#theme",
        "nodetype": "URI",
        "label": {
          "en": "Eurovoc: first level",
          "sv": "Eurovoc: första nivån",
          "da": "Eurovoc: første niveau"
        },
        "styles": [
          "deprecated",
          "strictmatch"
        ],
        "cardinality": {
          "min": 0,
          "pref": 0
        },
        "choices": [
          {
            "value": "http://eurovoc.europa.eu/100142",
            "label": {
              "en": "04 POLITICS",
              "sv": "04 POLITIK",
              "da": "04 POLITIK"
            }
          },
          {
            "value": "http://eurovoc.europa.eu/100143",
            "label": {
              "en": "08 INTERNATIONAL RELATIONS",
              "sv": "08 INTERNATIONELLA FÖRBINDELSER",
              "da": "08 INTERNATIONALE FORHOLD"
            },
            "description": {}
          },
          {
            "value": "http://eurovoc.europa.eu/100144",
            "label": {
              "en": "10 EUROPEAN UNION",
              "sv": "10 EUROPEISKA UNIONEN",
              "da": "10 EUROPÆISKE UNION"
            }
          },
          {
            "value": "http://eurovoc.europa.eu/100145",
            "label": {
              "en": "12 LAW",
              "sv": "12 LAG OCH RÄTT",
              "da": "12 LOVGIVNING"
            }
          },
          {
            "value": "http://eurovoc.europa.eu/100146",
            "label": {
              "en": "16 ECONOMICS",
              "sv": "16 EKONOMI",
              "da": "16 ØKONOMI"
            }
          },
          {
            "value": "http://eurovoc.europa.eu/100147",
            "label": {
              "en": "20 TRADE",
              "sv": "20 HANDEL OCH AFFÄRSVERKSAMHET",
              "da": "20 HANDEL"
            }
          },
          {
            "value": "http://eurovoc.europa.eu/100148",
            "label": {
              "en": "24 FINANCE",
              "sv": "24 FINANSER",
              "da": "24 FINANS"
            }
          },
          {
            "value": "http://eurovoc.europa.eu/100149",
            "label": {
              "en": "28 SOCIAL QUESTIONS",
              "sv": "28 SOCIALA FRÅGOR",
              "da": "28 SOCIALE ANLIGGENDER"
            }
          },
          {
            "value": "http://eurovoc.europa.eu/100150",
            "label": {
              "en": "32 EDUCATION AND COMMUNICATIONS",
              "sv": "32 UTBILDNING OCH KOMMUNIKATION",
              "ek": "32 UDDANNELSE OG KOMMUNIKATION"
            }
          },
          {
            "value": "http://eurovoc.europa.eu/100151",
            "label": {
              "en": "36 SCIENCE",
              "sv": "36 VETENSKAP",
              "da": "36 VIDENSKAB"
            }
          },
          {
            "value": "http://eurovoc.europa.eu/100152",
            "label": {
              "en": "40 BUSINESS AND COMPETITION",
              "sv": "40 FÖRETAG OCH KONKURRENS",
              "da": "40 ERHVERV OG KONKURRENCE"
            }
          },
          {
            "value": "http://eurovoc.europa.eu/100153",
            "label": {
              "en": "44 EMPLOYMENT AND WORKING CONDITIONS",
              "sv": "44 SYSSELSÄTTNING OCH ARBETE",
              "da": "44 ARBEJDSMARKEDSFORHOLD"
            }
          },
          {
            "value": "http://eurovoc.europa.eu/100154",
            "label": {
              "en": "48 TRANSPORT",
              "sv": "48 TRANSPORT",
              "da": "48 TRANSPORT"
            }
          },
          {
            "value": "http://eurovoc.europa.eu/100155",
            "label": {
              "en": "52 ENVIRONMENT",
              "sv": "52 MILJÖ",
              "da": "52 MILJØ"
            }
          },
          {
            "value": "http://eurovoc.europa.eu/100156",
            "label": {
              "en": "56 AGRICULTURE, FORESTRY AND FISHERIES",
              "sv": "56 JORDBRUK, SKOGSBRUK OCH FISKE",
              "da": "56 LANDBRUG, SKOVBRUG OG FISKERI"
            }
          },
          {
            "value": "http://eurovoc.europa.eu/100157",
            "label": {
              "en": "60 AGRI-FOODSTUFFS",
              "sv": "60 JORDBRUKSLIVSMEDELSINDUSTRI",
              "da": "60 LANDBRUGSMIDDELINDUSTRI"
            }
          },
          {
            "value": "http://eurovoc.europa.eu/100158",
            "label": {
              "en": "64 PRODUCTION, TECHNOLOGY AND RESEARCH",
              "sv": "64 PRODUKTION, TEKNIK OCH FORSKNING",
              "da": "64 PRODUKTION, TEKNIK OG FORSKNING"
            }
          },
          {
            "value": "http://eurovoc.europa.eu/100159",
            "label": {
              "en": "66 ENERGY",
              "sv": "66 ENERGI",
              "da": "66 ENERGI"
            }
          },
          {
            "value": "http://eurovoc.europa.eu/100160",
            "label": {
              "en": "68 INDUSTRY",
              "sv": "68 INDUSTRI",
              "da": "68 INDUSTRI"
            }
          },
          {
            "value": "http://eurovoc.europa.eu/100161",
            "label": {
              "en": "72 GEOGRAPHY",
              "sv": "72 GEOGRAFI",
              "da": "72 GEOGRAFI"
            }
          },
          {
            "value": "http://eurovoc.europa.eu/100162",
            "label": {
              "en": "76 INTERNATIONAL ORGANISATIONS",
              "sv": "76 INTERNATIONELLA ORGANISATIONER",
              "da": "76 INTERNATIONALE ORGANISATIONER"
            }
          }
        ],
        "description": {
          "en": "This is a list of the first level Eurovoc categories.",
          "da": "Dette er en liste over Eurovoc kategorier på første niveau."
        }
      },
      {
        "type": "group",
        "id": "dcat:format-group_di",
        "label": {
          "en": "Format",
          "sv": "Format",
          "nb": "Format",
          "da": "Format",
          "de": "Format"
        },
        "cardinality": {
          "min": 1,
          "pref": 1,
          "max": 1
        },
        "styles": [
          "disjoint"
        ],
        "items": [
          {
            "id": "dcat:format-group_di_choices"
          },
          {
            "type": "text",
            "property": "http://purl.org/dc/terms/format",
            "description": {
              "en": "If you cannot find your mediatype in the list above you can provide one by hand. See list of established mediatypes at: http://www.iana.org/assignments/media-types/media-types.xhtml."
            },
            "label": {
              "en": "Other mediatypes",
              "sv": "Övriga mediatyper",
              "nb": "Andre",
              "da": "Andre filtyper",
              "de": "Sonstige Medientypen"
            },
            "nodetype": "ONLY_LITERAL",
            "cardinality": {
              "min": 0,
              "pref": 1,
              "max": 1
            }
          }
        ]
      },
      {
        "type": "choice",
        "id": "dcat:format-group_di_choices",
        "property": "http://purl.org/dc/terms/format",
        "nodetype": "ONLY_LITERAL",
        "label": {
          "en": "Common mediatypes",
          "sv": "Vanliga mediatyper",
          "nb": "Vanlige filtyper",
          "da": "Almindelige filtyper",
          "de": "Verbreitete Medientypen"
        },
        "choices": [
          {
            "value": "text/csv",
            "label": {
              "en": "Comma Separated Values (.csv)"
            },
            "description": {
              "en": "CSV is a simple spreadsheet format where rows are separeted by newlines and columns by commas , semicolon or some other special character."
            }
          },
          {
            "value": "application/x-shp",
            "label": {
              "en": "ESRI Shapefile (.zip containing .shp)"
            },
            "description": {
              "en": "ESRI Shapefile developed by ESRI for ArcMap which is a multi-file GIS format that uses DBase files for the attribution and a prf file for the coordinate system. "
            }
          },
          {
            "value": "application/gml+xml",
            "label": {
              "en": "GML (.gml)"
            },
            "description": {
              "en": "Geography Markup Language (GML) is an international standard for exchange of geographical feature maintained by the Open Geospatial Consortium (OGC)."
            }
          },
          {
            "value": "text/html",
            "label": {
              "en": "HTML (.html)"
            },
            "description": {
              "en": "HTML or HyperText Markup Language is the standard markup language used to create web pages."
            }
          },
          {
            "value": "application/json",
            "label": {
              "en": "JSON (.json)"
            },
            "description": {
              "en": "JSON or JavaScript Object Notation, is an open standard format that uses human-readable text to transmit data objects consisting of attribute–value pairs. It is used primarily to transmit data between a server and web application, as an alternative to XML."
            }
          },
          {
            "value": "application/vnd.google-earth.kml+xml",
            "label": {
              "en": "KML (.kml)"
            },
            "description": {
              "en": "Keyhole Markup Language (KML) is used to display geographic data in an Earth browser, such as Google Earth. KML is an international standard maintained by the Open Geospatial Consortium, Inc. (OGC)."
            }
          },
          {
            "value": "application/vnd.ms-excel",
            "label": {
              "en": "Microsoft Excel (.xls)"
            },
            "description": {}
          },
          {
            "value": "application/n-triples",
            "label": {
              "en": "N-Triples (.n3)"
            },
            "description": {
              "en": "A line-based syntax for an RDF graph."
            }
          },
          {
            "value": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet ",
            "label": {
              "en": "OOXML Spreadsheet (.xlsx)"
            },
            "description": {
              "en": "Office Open XML Spreadsheet is a zipped, XML-based file format developed by Microsoft, standardized in ECMA-376 and later in ISO/IEC 29500."
            }
          },
          {
            "value": "application/vnd.oasis.opendocument.spreadsheet",
            "label": {
              "en": "OpenDocument Spreadsheet (.ods)"
            },
            "description": {
              "en": "The Open Document Format for spreadsheets is an XML based format standardized first by OASIS and later by ISO/IEC: ISO/IEC 26300:2006/Amd 1:2012 — Open Document Format for Office Applications (OpenDocument) v1.1."
            }
          },
          {
            "value": "application/pdf",
            "description": {
              "en": "Portable Document Format (PDF) is a file format used to present documents encapsulating a complete description of a fixed-layout flat document, including the text, fonts, graphics, and other information needed to display it."
            },
            "label": {
              "en": "PDF (.pdf)"
            }
          },
          {
            "value": "application/rdf+xml",
            "label": {
              "en": "RDF/XML (.rdf)"
            },
            "description": {
              "en": "This is an XML syntax for RDF as introduced in the RDF/XML Syntax Specification by W3C in 2004."
            }
          },
          {
            "value": "application/sparql-query",
            "label": {
              "en": "SPARQL Query Language for RDF (API)"
            },
            "description": {
              "en": "SPARQL (pronounced \"sparkle\", an acronym for SPARQL Protocol and RDF Query Language) is an RDF query language, that is, a query language for databases, able to retrieve and manipulate data stored in Resource Description Framework format."
            }
          },
          {
            "value": "text/plain",
            "label": {
              "en": "Text (.txt)"
            },
            "description": {
              "en": "Plain text file."
            }
          },
          {
            "value": "text/turtle; charset=utf-8",
            "description": {
              "en": "Turtle is a syntax for RDF that allows an RDF graph to be completely written in a compact and natural text form, with abbreviations for common usage patterns and datatypes. "
            },
            "label": {
              "en": "Turtle (.ttl)"
            }
          },
          {
            "value": "application/xml",
            "label": {
              "en": "XML data (.xml)"
            },
            "description": {
              "en": "Extensible Markup Language (XML) is a markup language that defines a set of rules for encoding documents in a format that is both human-readable and machine-readable. It is defined in the XML 1.0 Specification produced by the W3C."
            }
          },
          {
            "value": "application/zip",
            "label": {
              "en": "ZIP (.zip)"
            },
            "description": {
              "en": ".ZIP is an archive file format that supports lossless data compression."
            }
          }
        ],
        "cardinality": {
          "min": 0,
          "pref": 1,
          "max": 1
        },
        "description": {
          "en": "A selection of common mediatypes according to the list suggested by the DCAT-AP recommendation."
        },
        "styles": [
          "strictmatch"
        ]
      },
      {
        "type": "text",
        "id": "dcat:byteSize_di",
        "property": "http://www.w3.org/ns/dcat#byteSize",
        "nodetype": "DATATYPE_LITERAL",
        "cardinality": {
          "min": 0,
          "pref": 0,
          "max": 1
        },
        "label": {
          "en": "Size (in bytes)",
          "sv": "Storlek (i bytes)",
          "nb": "Filstørrelse (i bytes)",
          "da": "Filstørrelse (i bytes)",
          "de": "Größe (in Bytes)"
        },
        "description": {
          "en": "The size in bytes can be approximated when the precise size is not known.",
          "nb": "Distribusjonens størrelse oppgitt i bytes",
          "da": "Distribusionens størrelse i bytes",
          "de": "Die Größe der Distribution kann geschätzt werden wenn die genaue Größe nicht bekannt ist.",
          "sv": "Distributionens storleken kan uppskattas när den exakta storleken är okänd."
        },
        "datatype": "http://www.w3.org/2001/XMLSchema#decimal"
      },
      {
        "type": "text",
        "id": "dcat:accessURL_di",
        "nodetype": "URI",
        "label": {
          "en": "Web address for access",
          "sv": "Webbadress för åtkomst",
          "nb": "TilgangsURL",
          "da": "Adgang til datasæt",
          "de": "Webadresse für den Zugriff"
        },
        "property": "http://www.w3.org/ns/dcat#accessURL",
        "description": {
          "en": "This property contains a URL that gives access to a Distribution of the Dataset. The resource at the access URL may contain information about how to get the Dataset. (1) Use accessURL, and not downloadURL,  when it is definitely not a download or when you are not sure whether it is. (2) If the distribution(s) are accessible only through a landing page (i.e. direct download URLs are not known), then the landing page link SHOULD be duplicated as accessURL on a distribution.",
          "nb": "En URL som gir tilgang til en distribusjon av datasettet. Ressursen det pekes til kan gi informasjon om hvordan en kan få tilgang til i datasettet",
          "da": "Link til hjemmeside der giver adgang til datasættet og dets distribution. Ressursen der peges på kan give informasion om hvordan en bruger kan få adgang til datasættet",
          "de": "Eine Webadresse für den Zugriff auf eine Distribution.",
          "sv": "En webbadress till datamängdens distribution."
        },
        "cardinality": {
          "min": 1,
          "pref": 1
        },
        "pattern": "https?://.+"
      },
      {
        "type": "text",
        "nodetype": "URI",
        "label": {
          "en": "Web address for download",
          "sv": "Webbadress för nedladdning",
          "nb": "Nedlastningslenke",
          "da": "Download URL",
          "de": "Webadresse zum Download"
        },
        "property": "http://www.w3.org/ns/dcat#downloadURL",
        "description": {
          "en": "A file that contains the distribution of the dataset in a given format. dcat:downloadURL is a specific form of dcat:accessURL. Nevertheless, DCAT does not define dcat:downloadURL as a subproperty of dcat:accessURL not to enforce this entailment as DCAT profiles may wish to impose a stronger separation where they only use accessURL for non-download locations.",
          "nb": "Direktelenke (URL) til en nedlastbar fil i et gitt format",
          "da": "Angiver et direkte link til at downloade filen i et givent format.",
          "de": "Die Webadresse zur Datei welche eine Distribution des Datensatzes in einem gegebenen Format enthält.",
          "sv": "En fil som innehåller datamängdens distribution i ett givet format."
        },
        "id": "dcat:downloadURL_di",
        "cardinality": {
          "min": 0,
          "pref": 0
        },
        "pattern": "(http|https|ftp|ftps)://.*"
      },
      {
        "type": "choice",
        "nodetype": "URI",
        "id": "dcat:dcterms:spatial",
        "extends": "dcterms:spatial",
        "label": {
          "en": "Spatial coverage",
          "nb": "Dekningsområde",
          "sv": "Geografiskt område",
          "da": "Datasættets administrative grænser",
          "de": "Geographische Abdeckung"
        }
      },
      {
        "type": "choice",
        "id": "dcat:dcterms:spatial_da",
        "nodetype": "URI",
        "description": {
          "en": "A spatial region or named place. The geographical area covered by the dataset. It is recommended to use URIs from Geonames in the form: http://sws.geonames.org/6695072",
          "nb": "Referanse til et geografisk område datasettet ",
          "da": "Det geografiske område som datasættet dækker. (Eksempelvis DAGI områder)",
          "de": "Das geographische Gebiet das durch den Datensatz abgedeckt wird. Es wird empfohlen URIs von Geonames in der folgenden Form zu verwenden: http://sws.geonames.org/6695072",
          "sv": "Det geografiska området som omfattas av datamängden. Det rekommenderas att använda Geonames URI:er i följande form: http://sws.geonames.org/6695072"
        },
        "extends": "dcat:dcterms:spatial"
      },
      {
        "type": "choice",
        "nodetype": "URI",
        "id": "dcat:dcterms:conformsTo",
        "extends": "dcterms:conformsTo",
        "label": {
          "en": "Conforms to",
          "nb": "I samsvar med",
          "sv": "Uppfyller",
          "da": "Overholdelse af regel eller specifikation",
          "de": "Folgt Standard oder Spezifikation"
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "dcterms:Standard"
        },
        "pattern": "https?://.+"
      },
      {
        "type": "text",
        "nodetype": "ONLY_LITERAL",
        "id": "dcat:adms:identifier_da",
        "property": "http://www.w3.org/ns/adms#identifier",
        "label": {
          "en": "Other identifier",
          "sv": "Övrig identifierare",
          "nb": "Annen identifikator",
          "da": "Anden identifikator",
          "de": "Anderer Identifikator"
        },
        "description": {
          "en": "This property refers to a secondary identifier of the Dataset, such as MAST/ADS 48, DataCite 49 , DOI 50 , EZID 51 or W3ID 52.",
          "nb": "Referanse til en sekundær identifikator av datasettet som MAST/ADS, DataCite, DOI, EZID eller W3ID.",
          "da": "Denne attribut referer til en sekundær identifikator for datasætter.",
          "de": "Diese Eigenschaft bezieht sich auf eine sekundäre Kennung des Datensatzes wie z.B. MAST/ADS 48, DataCite 49 , DOI 50 , EZID 51 or W3ID 52",
          "sv": "Egenskapen avser en sekundär identifierare för datamängden"
        }
      },
      {
        "type": "text",
        "nodetype": "ONLY_LITERAL",
        "id": "dcat:owl:versionInfo_da",
        "label": {
          "en": "Version",
          "sv": "Version",
          "nb": "Versjon",
          "da": "Version",
          "de": "Version"
        },
        "property": "http://www.w3.org/2002/07/owl#versionInfo",
        "cardinality": {
          "min": 0,
          "pref": 0,
          "max": 1
        },
        "description": {
          "nb": "Et versjonsnummer eller annen versjonsbetegnelse for datasettet",
          "en": "This property contains a version number or other version designation of the Dataset.",
          "da": "Angiver et versionsnummer for datasættet.",
          "de": "Eine Versionsnummer oder eine andere Versionsbezeichnung des Datensatzes.",
          "sv": "Ett versionsnummer eller annan versionsbeteckning för datamängden."
        }
      },
      {
        "type": "text",
        "nodetype": "LANGUAGE_LITERAL",
        "id": "dcat:adms:versionNotes_da",
        "property": "http://www.w3.org/ns/adms#versionNotes",
        "styles": [
          "multiline"
        ],
        "label": {
          "en": "Version notes",
          "sv": "Versionsanteckningar",
          "nb": "Versjonsnote",
          "da": "Versionsnoter",
          "de": "Versionshinweise"
        },
        "description": {
          "en": "This property contains a description of the differences between this version and a previous version of the Dataset. This property can be repeated for parallel language versions of the version notes.",
          "nb": "En beskrivelse av endringene fra forrige versjon til denne versjonen av datasettet",
          "da": "Angiver forskellen mellem denne version og den forrige.",
          "de": "Enthält eine Beschreibung der Unterschiede zwischen dieser Version und einer früheren Version des Datensatzes. Diese Eigenschaft kann für parallele Sprachversionen der Versionshinweise wiederholt werden.",
          "sv": "Innehåller en beskrivning av skillnaderna mellan denna version och en tidigare version av datamängden. Denna egenskap kan upprepas för parallella språkversioner av versionsanteckningar."
        }
      },
      {
        "type": "choice",
        "nodetype": "URI",
        "id": "dcat:adms:status_di",
        "property": "http://www.w3.org/ns/adms#status",
        "label": {
          "en": "Status",
          "sv": "Status",
          "nb": "Status",
          "da": "Status",
          "de": "Status"
        },
        "choices": [
          {
            "value": "http://purl.org/adms/status/Completed",
            "label": {
              "en": "Completed",
              "sv": "Färdig",
              "nb": "Fullført",
              "da": "Fuldført",
              "de": "Fertiggestellt"
            }
          },
          {
            "value": "http://purl.org/adms/status/Deprecated",
            "label": {
              "en": "Deprecated",
              "sv": "Avvecklad",
              "nb": "Utgått",
              "da": "Udgået",
              "de": "Veraltet"
            }
          },
          {
            "value": "http://purl.org/adms/status/UnderDevelopment",
            "label": {
              "en": "Under development",
              "sv": "Under utveckling",
              "nb": "Under utvikling",
              "da": "Under udvikling",
              "de": "In Entwicklung"
            }
          },
          {
            "value": "http://purl.org/adms/status/Withdrawn",
            "label": {
              "en": "Withdrawn",
              "sv": "Tillbakadragen",
              "nb": "Trekt tilbake",
              "da": "Trukket tilbage",
              "de": "Zurückgezogen"
            }
          }
        ],
        "cardinality": {
          "min": 0,
          "pref": 0,
          "max": 1
        },
        "styles": [
          "verticalRadioButtons"
        ],
        "description": {
          "nb": "Distribusjonens modenhet (fullført, under utvikling, utgått, trekt tilbake)",
          "en": "This property refers to the maturity of the Distribution",
          "da": "Angiver modenheden af distributionen.",
          "de": "Reifegrad der Distribution",
          "sv": "Distributionens mognadsgrad"
        }
      },
      {
        "id": "adms:publishertype",
        "type": "choice",
        "nodetype": "URI",
        "property": "http://purl.org/dc/terms/type",
        "label": {
          "en": "Type",
          "sv": "Typ",
          "nb": "Type",
          "da": "Type",
          "de": "Typ"
        },
        "choices": [
          {
            "value": "http://purl.org/adms/publishertype/Academia-ScientificOrganisation",
            "label": {
              "en": "Academia/Scientific organisation",
              "sv": "Akademia/Vetenskaplig organisation",
              "nb": "Akademia/Forskningsorganisasjon",
              "da": "Akademia/Forskningsorganisation",
              "de": "Akademie/Wissenschaftliche Organisation"
            }
          },
          {
            "value": "http://purl.org/adms/publishertype/Company",
            "label": {
              "en": "Company",
              "sv": "Företag",
              "nb": "Virksomhet",
              "da": "Virksomhed",
              "de": "Unternehmen"
            }
          },
          {
            "value": "http://purl.org/adms/publishertype/IndustryConsortium",
            "label": {
              "en": "Industry consortium",
              "sv": "Industrikonsortium",
              "nb": "Industrikonsortium",
              "da": "Industrikonsortium",
              "de": "Industriekonsortium"
            }
          },
          {
            "value": "http://purl.org/adms/publishertype/LocalAuthority",
            "label": {
              "en": "Local Authority",
              "sv": "Lokal myndighet/kommun",
              "nb": "Lokal myndighet",
              "da": "Lokal myndighed",
              "de": "Lokale Behörde/Bezirk/Gemeinde"
            }
          },
          {
            "value": "http://purl.org/adms/publishertype/NationalAuthority",
            "label": {
              "en": "National authority",
              "sv": "Nationell myndighet",
              "nb": "Nasjonal myndighet",
              "da": "National myndighed",
              "de": "Nationale Behörde"
            }
          },
          {
            "value": "http://purl.org/adms/publishertype/NonGovernmentalOrganisation",
            "label": {
              "en": "Non-Governmental Organisation",
              "sv": "Icke-statlig organisation",
              "nb": "Ikke-statlig organisasjon",
              "da": "Ikke-statslig organisation",
              "de": "Nicht-Regierungs-Organisation"
            }
          },
          {
            "value": "http://purl.org/adms/publishertype/NonProfitOrganisation",
            "label": {
              "en": "Non-Profit Organisation",
              "sv": "Ej vinstdrivande organisation",
              "nb": "Non-profit organisasjon",
              "da": "Non-profit organisaton",
              "de": "Non-Profit-Organisation"
            }
          },
          {
            "value": "http://purl.org/adms/publishertype/PrivateIndividual(s)",
            "label": {
              "en": "Private Individual(s)",
              "sv": "Privatperson(er)",
              "nb": "Privatperson(er)",
              "da": "Privatperson(er)",
              "de": "Privatperson(en)"
            }
          },
          {
            "value": "http://purl.org/adms/publishertype/RegionalAuthority",
            "label": {
              "en": "Regional authority",
              "sv": "Regional myndighet/landsting",
              "nb": "Regional myndighet",
              "da": "Regional myndighed",
              "de": "Regionale Behörde/Bundesland"
            }
          },
          {
            "value": "http://purl.org/adms/publishertype/StandardisationBody",
            "label": {
              "en": "Standardisation body",
              "sv": "Standardiseringsorganisation",
              "nb": "Standardiseringsråd",
              "da": "Standardiseringsorganisation",
              "de": "Standardisierungsorganisation"
            }
          },
          {
            "value": "http://purl.org/adms/publishertype/SupraNationalAuthority",
            "label": {
              "en": "Supra-national authority",
              "sv": "Över-/mellanstatlig myndighet",
              "nb": "Overnasjonal myndighet",
              "da": "Overnational myndighed",
              "de": "Supranationale/Überstaatliche Behörde"
            }
          }
        ],
        "cardinality": {
          "min": 0,
          "pref": 1,
          "max": 1
        }
      },
      {
        "type": "group",
        "nodetype": "RESOURCE",
        "id": "dcat:foaf:Agent",
        "property": "http://purl.org/dc/terms/publisher",
        "items": [
          {
            "type": "text",
            "nodetype": "LANGUAGE_LITERAL",
            "extends": "foaf:name",
            "cardinality": {
              "min": 1,
              "pref": 0
            }
          },
          {
            "id": "adms:publishertype"
          },
          {
            "type": "text",
            "nodetype": "URI",
            "extends": "foaf:homepage",
            "cardinality": {
              "min": 0,
              "pref": 0
            },
            "pattern": "https?://.+"
          },
          {
            "type": "text",
            "nodetype": "URI",
            "extends": "foaf:mbox",
            "valueTemplate": "mailto:",
            "cardinality": {
              "min": 0,
              "pref": 0
            },
            "label": {
              "en": "Email address",
              "sv": "E-postadress",
              "da": "Email adresse",
              "de": "E-Mail-Adresse"
            }
          }
        ],
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": [
            "http://xmlns.com/foaf/0.1/Agent",
            "http://xmlns.com/foaf/0.1/Person",
            "http://xmlns.com/foaf/0.1/Organization"
          ]
        },
        "label": {
          "en": "Publisher",
          "sv": "Tillhandahållande organisation",
          "nb": "Utgiver",
          "da": "Dataansvarlig organisation",
          "de": "Herausgeber"
        }
      },
      {
        "type": "group",
        "nodetype": "RESOURCE",
        "id": "dcat:dcterms:license",
        "styles": [
          "disjoint"
        ],
        "items": [
          "dcat:dcterms:cc-license-choices",
          {
            "type": "choice",
            "nodetype": "URI",
            "property": "http://purl.org/dc/terms/license",
            "constraints": {
              "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "dcterms:LicenseDocument"
            },
            "label": {
              "en": "Other",
              "sv": "Övriga",
              "da": "Øvrige",
              "de": "Andere"
            },
            "cardinality": {
              "min": 0,
              "pref": 1
            }
          }
        ],
        "label": {
          "en": "License",
          "sv": "Licens",
          "nb": "Lisens",
          "da": "Licens",
          "de": "Lizenz"
        },
        "cardinality": {
          "min": 0,
          "pref": 0,
          "max": 1
        }
      },
      {
        "type": "choice",
        "nodetype": "URI",
        "id": "dcat:dcterms:cc-license-choices",
        "extends": "dcterms:cc-license-choices",
        "label": {
          "en": "Creative Commons"
        },
        "choices": [
          {
            "value": "http://creativecommons.org/licenses/by/4.0/",
            "label": {
              "en": "CC BY 4.0 (Attribution)"
            },
            "description": {
              "de": "Der Urheber gestattet die Ressource für kommerzielle Zwecke zu nutzen und Änderungen vorzunehmen",
              "sl": "Lastnik DOVOLJUJE komercialno rabo in spreminjanje vira.",
              "ro": "Autorul PERMITE utilizarea in scop comercial SI modificari asupra resursei",
              "el": "Άδεια που εφαρμόζεται στο αντικείμενο (αναφορικά με Creative Commons)",
              "hu": "A tulajdonos engedélyezi a kereskedelmi forgalomba hozatalt és a változásokat",
              "bg": "Притежателят ПОЗВОЛЯВА търговска употреба и промени в ресурса ",
              "fr": "Le détenteur des droits AUTORISE l'utilisation commerciale ET les modifications de la ressource",
              "en": "The owner ALLOWS commercial uses AND changes to the resource",
              "ru": "Владелец РАЗРЕШАЕТ как использование источника в коммерческих целях, ТАК И изменение содержания",
              "hi": "स्वामी वाणिज्यिक उपयोग एवं संसाधनों में परिवर्तन की अनुमति देता है",
              "et": "Omanik LUBAB kasutada allikat kommertslikel eesmärkidel JA muuta allika sisu",
              "es": "El propieatrio PERMITE uso comercial Y cambios en el recurso"
            }
          },
          {
            "value": "http://creativecommons.org/licenses/by-nc/4.0/",
            "label": {
              "en": "CC BY-NC 4.0 (Attribution, Non-Commercial)"
            },
            "description": {
              "de": "Der Urheber gestattet keine kommerzielle Nutzung, erlaubt aber Änderungen an der Ressource",
              "sl": "Lastnik NE dovoljuje komercialne rabe toda DOVOLJUJE spreminjanje vira.",
              "ro": "Autorul NU permite utilizarea in scop comercial dar PERMITE modificari asupra resursei",
              "el": "Ο ιδιοκτήτης του αντικειμένου ΔΕΝ επιτρέπει εμπορικές χρήσεις αλλά ΕΠΙΤΡΕΠΕΙ αλλαγές στο αντικείμενο",
              "hu": "A tulajdonos nem engedélyezi a kereskedelmi forgalomba hozatalt, de a módosítást igen. ",
              "bg": "Притежателят НЕ ПОЗВОЛЯВА за търговски цели, но ПОЗВОЛЯВА да се променя ресурса",
              "fr": "Le détenteur des droits N'AUTORISE PAS l'utilisation commerciale MAIS ACCEPTE les modifications de la ressource",
              "en": "The owner does NOT allow commercial uses but ALLOWS changes to the resource",
              "ru": "Владелец НЕ РАЗРЕШАЕТ использование источника в коммерческих целях, но РАЗРЕШАЕТ изменение содержани��",
              "hi": "स���वामी वाणिज्यिक उपयोग की अनुमति नही देता है परंतु संसाधनों में परिवर्तन की अनुमति देता है",
              "et": "Omanik EI LUBA kasutada allikat kommertslikel eesmärkidel, kuid LUBAB muuta allika sisu",
              "es": "El propieatrio NO permite uso comercial pero PERMITE cambios en el recurso"
            }
          },
          {
            "value": "http://creativecommons.org/licenses/by-nc-nd/4.0/",
            "label": {
              "en": "CC BY-NC-ND 4.0 (Attribution, Non-Commercial, No Derivative Works)"
            },
            "description": {
              "de": "Der Urheber gestattet die nicht-kommerzielle Nutzung oder Änderungen an der Ressourcen",
              "sl": "Lastnik NE dovoljuje komercialne rabe ALI spreminjanja virov.",
              "ro": "Autorul NU permite nici utilizarea in scop comercial nici modificari asupra resursei",
              "el": "Ο ιδιοκτήτης του αντικειμένου ΕΠΙΤΡΕΠΕΙ εμπορικές χρήσεις αλλά ΌΧΙ αλλαγές στο αντικείμενο",
              "hu": "A tulajdonos nem engedélyezi a kereskedelmi forgalomba hozatalt és módosítást. ",
              "bg": "Притежателят НЕ позволява търговска употреба и ИЛИ да се променя ресурса ",
              "fr": "Le détenteur des droits N'AUTORISE PAS l'utilisation commerciale NI les modifications de la ressource",
              "en": "The owner does NOT allow commercial uses OR changes to the resource",
              "ru": "Владелец НЕ РАЗРЕШАЕТ как использование источника в коммерческих целях, ТАК И изменение содержания",
              "hi": "स्वामी वाणिज्यिक उपयोग और संसाधनों में परिवर्तन की अनुमति नहीं  देता है",
              "et": "Omanik EI LUBA kasutada allikat kommertslikel eesmärkidel EGA luba muuta allika sisu",
              "es": "El propieatrio NO permite uso comercial ni cambios en el recurso"
            }
          },
          {
            "value": "http://creativecommons.org/licenses/by-nc-sa/4.0/",
            "label": {
              "en": "CC BY-NC-SA 4.0 (Attribution, Non-Commercial, Share Alike)"
            }
          },
          {
            "value": "http://creativecommons.org/licenses/by-nd/4.0/",
            "label": {
              "en": "CC BY-ND 4.0 (Attribution, No Derivative Works)"
            },
            "description": {
              "de": "Der Urheber gestattet, die Ressource für kommerzielle Zwecke zu nutzen, es dürfen jedoch keine Änderungen vorgenommen werden",
              "sl": "Lastnik DOVOLJUJE komercialno rabo toda NE dovoli spreminjanja vira.",
              "ro": "Autorul PERMITE utilizarea in scop comercial dar nu permite modificari asupra resursei",
              "el": "Ο ιδιοκτήτης του αντικειμένου ΕΠΙΤΡΕΠΕΙ εμπορικές χρήσεις ΚΑΙ αλλαγές στο αντικείμενο",
              "hu": "A tulajdonos engedélyezi a kereskedelmi forgalomba hozatalt, változások nélkül.",
              "bg": "Притежателят ПОЗВОЛЯВА търговска употреба, но НЕ се позволява да се променя ресурса",
              "fr": "Le détenteur des droits AUTORISE l'utilisation commerciale MAIS REFUSE les modifications de la ressource",
              "en": "The owner ALLOWS commercial uses but does NOT allow changes to the resource",
              "ru": "Владелец РАЗРЕШАЕТ использование источника в коммерческих целях, но НЕ РАЗРЕШАЕТ изменение содержания",
              "hi": "स्वामी वाणिज्यिक उपयोग की अनुमति देता है परंतु  संसाधनों में परिवर्तन की अनुमति नहीं  देता है",
              "et": "Omanik LUBAB kasutada allikat kommertslikel eesmärkidel, kuid EI luba muuta allika sisu",
              "es": "El propieatrio PERMITE uso comercial pero NO permite cambios en el recurso"
            }
          },
          {
            "value": "http://creativecommons.org/licenses/by-sa/4.0/",
            "label": {
              "en": "CC BY-SA 4.0 (Attribution, Share Alike)"
            }
          },
          {
            "value": "http://creativecommons.org/publicdomain/zero/1.0/",
            "label": {
              "en": "CC0 1.0 (Public Domain Dedication, No Copyright)"
            }
          }
        ],
        "property": "http://purl.org/dc/terms/license",
        "description": {},
        "cardinality": {
          "min": 0,
          "pref": 1
        },
        "styles": [
          "verticalRadioButtons",
          "strictmatch"
        ]
      },
      {
        "type": "text",
        "nodetype": "URI",
        "id": "dcat:theme",
        "property": "http://www.w3.org/ns/dcat#theme",
        "label": {
          "en": "Theme/category",
          "sv": "Tema/klassificering",
          "da": "Tema/klassificering",
          "de": "Thema/Kategorie"
        },
        "description": {
          "en": "This property refers to a category of the Dataset. A Dataset may be associated with multiple themes.",
          "da": "Denne attribut refererer til en kategori for datasættet. Et datasæt kan være associeret med flere temaer.",
          "de": "Diese Eigenschaft bezieht sich auf eine Kategorie des Datensatzes. Ein Datensatz kann mit mehreren Themen verknüpft sein.",
          "sv": "En kategori för datamängden. En datamängd kan associeras med flera teman."
        },
        "cardinality": {
          "min": 0,
          "pref": 1
        },
        "pattern": "https?://.+"
      },
      {
        "type": "choice",
        "nodetype": "URI",
        "id": "dcat:theme-isa",
        "property": "http://www.w3.org/ns/dcat#theme",
        "styles": [
          "strictmatch"
        ],
        "label": {
          "en": "Data Theme Vocabulary",
          "de": "Data Theme Vocabulary",
          "sv": "Data Theme Vocabulary"
        },
        "description": {
          "en": "This property refers to a category of the Dataset. A Dataset may be associated with multiple themes."
        },
        "choices": [
          {
            "value": "http://publications.europa.eu/resource/authority/data-theme/AGRI",
            "label": {
              "en": "Agriculture, fisheries, forestry and food",
              "sv": "Jordbruk, fiske, skogsbruk och livsmedel",
              "nb": "Jordbruk, fiskeri, skogbruk og mat",
              "da": "Landbrug, fiskeri, skovbrug og mad",
              "de": "Landwirtschaft, Fischerei, Forstwirtschaft und Lebensmittel"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/data-theme/ECON",
            "label": {
              "en": "Economy and finance",
              "sv": "Ekonomi och finans",
              "nb": "Økonomi og finans",
              "da": "Økonomi og finans",
              "de": "Wirtschaft und Finanzen"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/data-theme/EDUC",
            "label": {
              "en": "Education, culture and sport",
              "sv": "Utbildning, kultur och sport",
              "nb": "Utdanning, kultur og sport",
              "da": "Uddannelse, kultur og sport",
              "de": "Bildung, Kultur und Sport"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/data-theme/ENER",
            "label": {
              "en": "Energy",
              "sv": "Energi",
              "nb": "Energi",
              "da": "Energi",
              "de": "Energie"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/data-theme/ENVI",
            "label": {
              "en": "Environment",
              "sv": "Miljö",
              "nb": "Miljø",
              "da": "Miljø",
              "de": "Umwelt"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/data-theme/GOVE",
            "label": {
              "en": "Government and public sector",
              "sv": "Regeringen och den offentliga sektorn",
              "nb": "Forvaltning og offentlig sektor",
              "da": "Forvaltning og offentlig sektor",
              "de": "Regierung und öffentlicher Sektor"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/data-theme/HEAL",
            "label": {
              "en": "Health",
              "sv": "Hälsa",
              "nb": "Helse",
              "da": "Helbred",
              "de": "Gesundheit"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/data-theme/INTR",
            "label": {
              "en": "International issues",
              "sv": "Internationella frågor",
              "nb": "Internasjonale temaer",
              "da": "Internationale forhold",
              "de": "Internationale Angelegenheiten"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/data-theme/JUST",
            "label": {
              "en": "Justice, legal system and public safety",
              "sv": "Rättvisa, rättsliga system och allmän säkerhet",
              "nb": "Justis, rettssystem og allmenn sikkerhet",
              "da": "Justits, rettssystem og almen sikkerhed",
              "de": "Gerechtigkeit, Rechtsordnung und öffentliche Sicherheit"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/data-theme/SOCI",
            "label": {
              "en": "Population and society",
              "sv": "Befolkning och samhälle",
              "nb": "Befolkning og samfunn",
              "da": "Befolkning og samfund",
              "de": "Bevölkerung und Gesellschaft"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/data-theme/REGI",
            "label": {
              "en": "Regions and cities",
              "sv": "Regioner och städer",
              "nb": "Regioner og byer",
              "da": "Regioner og byer",
              "de": "Regionen und Städte"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/data-theme/TECH",
            "label": {
              "en": "Science and technology",
              "sv": "Vetenskap och teknik",
              "nb": "Vitenskap og teknologi",
              "da": "Videnskab og teknologi",
              "de": "Wissenschaft und Technik"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/data-theme/TRAN",
            "label": {
              "en": "Transport",
              "sv": "Transport",
              "nb": "Transport",
              "da": "Transport",
              "de": "Transport"
            }
          }
        ],
        "cardinality": {
          "min": 0,
          "pref": 1
        }
      },
      {
        "type": "choice",
        "nodetype": "RESOURCE",
        "id": "dcat:theme-da",
        "extends": "dcat:theme-isa",
        "label": {
          "en": "Category (Data Theme Vocabulary)",
          "sv": "Kategori (Data Theme Vocabulary)",
          "nb": "Tema (Data Theme Vocabulary)",
          "da": "Kategori (Data Theme Vocabulary)",
          "de": "Kategorie (Data Theme Vocabulary)"
        },
        "description": {
          "en": "This property refers to a category of the Dataset. A Dataset may be associated with multiple themes.",
          "nb": "Referanse til en tema/kategori for datasettet. Et datasett kan assosieres med flere tema",
          "da": "Refererer til et tema/kategori for datasættet. Et datasæt kan være associeret med flere temaer",
          "de": "Diese Eigenschaft bezieht sich auf eine Kategorie des Datensatzes. Ein Datensatz kann mit mehreren Themen verknüpft sein.",
          "sv": "En kategori för datamängden. En datamängd kan associeras med flera teman."
        },
        "cardinality": {
          "min": 0,
          "pref": 1
        }
      },
      {
        "type": "group",
        "nodetype": "RESOURCE",
        "id": "dcat:theme-group_da",
        "label": {
          "en": "Theme/category",
          "sv": "Tema/kategori",
          "nb": "Tema",
          "da": "Tema/kategori",
          "de": "Thema/Kategorie"
        },
        "description": {
          "en": "This property refers to a category of the Dataset. A Dataset may be associated with multiple themes.",
          "nb": "Referanse til en tema/kategori for datasettet. Et datasett kan assosieres med flere tema",
          "da": "Refererer til et tema/kategori for datasættet. Et datasæt kan være associeret med flere temaer",
          "de": "Diese Eigenschaft bezieht sich auf eine Kategorie des Datensatzes. Ein Datensatz kann mit mehreren Themen verknüpft sein.",
          "sv": "En kategori för datamängden. En datamängd kan associeras med flera teman."
        },
        "cardinality": {
          "min": 0,
          "pref": 1,
          "max": 1
        },
        "items": [
          {
            "id": "dcat:theme-1ev"
          },
          {
            "id": "dcat:theme-isa"
          },
          {
            "type": "text",
            "nodetype": "URI",
            "extends": "dcat:theme",
            "label": {
              "en": "Other themes",
              "sv": "Övriga klassificeringar",
              "da": "Øvrige klassificeringer",
              "de": "Andere Klassifikationen"
            },
            "description": {
              "en": "Use this field in case you want to provide another vocabulary, in addition to the first level Eurovoc values.  The value must be a valid URL."
            },
            "cardinality": {
              "min": 0,
              "pref": 0
            }
          }
        ]
      },
      {
        "type": "group",
        "nodetype": "RESOURCE",
        "id": "dcat:spdx:checksum_di",
        "description": {
          "en": "This property provides a mechanism that can be used to verify that the contents of a distribution have not changed.",
          "nb": "Brukes for å oppgi en mekanisme som kan brukes til å verifisere at innhold i en distribusjon ikke har endret seg",
          "da": "Checksum bruges til at angive en mekaniske som kan bruges til at verificere at indholdet i en distribution ikke har ændret sig.",
          "de": "Diese Eigenschaft kann verwendet werden um zu überprüfen ob sich der Inhalt einer Distribution geändert hat.",
          "sv": "Denna egenskap kan användas för att kontrollera om innehållet i en distribution har förändrats."
        },
        "label": {
          "en": "Checksum",
          "nb": "Sjekksum",
          "sv": "Checksumma",
          "da": "Checksum",
          "de": "Prüfsumme"
        },
        "cardinality": {
          "min": 0,
          "pref": 0,
          "max": 1
        },
        "property": "http://spdx.org/rdf/terms#checksum",
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://spdx.org/rdf/terms#Checksum"
        },
        "items": [
          {
            "type": "text",
            "nodetype": "LITERAL",
            "property": "http://spdx.org/rdf/terms#checksumValue",
            "label": {
              "en": "Checksum value",
              "sv": "Värde",
              "nb": "Sjekksumverdi",
              "da": "Checksumsværdi",
              "de": "Prüfsummenwert"
            },
            "description": {
              "en": "This property provides a lower case hexadecimal encoded digest value produced using a specific algorithm.",
              "nb": "Denne egenskapen brukes til å oppgi en heksadesimal-kodet verdi med små bokstaver, produsert ved hjelp av en spesifikk algoritme.",
              "da": "Denne attribut bruges til at angive en heksadesimal-kode værdi med små bogstaver, og genereret ved hjælp af en specifik algoritme.",
              "de": "Ein hexadezimaler Digest-Wert in Kleinbuchstaben der unter Verwendung eines spezifischen Algorithmus erzeugt wird.",
              "sv": "Ett hexadecimalt Digest-värde i gemener som genereras med hjälp av en särskild algoritm."
            },
            "cardinality": {
              "min": 1,
              "pref": 0,
              "max": 1
            }
          },
          {
            "type": "choice",
            "nodetype": "URI",
            "choices": [
              {
                "value": "http://spdx.org/rdf/terms#checksumAlgorithm_sha1",
                "label": {
                  "en": "SHA-1"
                }
              }
            ],
            "property": "http://spdx.org/rdf/terms#algorithm",
            "label": {
              "en": "Algorithm",
              "nb": "Algoritme",
              "sv": "Algoritm",
              "da": "Algoritme",
              "de": "Algorithmus"
            },
            "description": {
              "en": "This property identifies the algorithm used to produce the subject Checksum. Currently, SHA-1 is the only supported algorithm. It is anticipated that other algorithms will be supported at a later time.",
              "nb": "Identifiserer algoritmen som er brukt til å produsere sjekksum. For øyeblikket er SHA-1 den eneste algoritmen som er støttet. Det er forventet støtte for andre algoritmer på et senere tidspunkt.",
              "da": "Identifiserer algoritmen som er brugt til at generere checksummen. I øjeblikket er SHA-1 den eneste algoritme som er understøttet. Der forventes understøttelse af andre algoritmer på et senere tidspunkt.",
              "de": "Der Algorithmus der verwendet wird um die Prüfsumme zu erzeugen.",
              "sv": "Algoritmen som används för att generera checksumman."
            },
            "cardinality": {
              "min": 1,
              "pref": 0,
              "max": 1
            }
          }
        ]
      },
      {
        "type": "choice",
        "nodetype": "URI",
        "id": "dcat:themeTaxonomy_ca",
        "property": "http://www.w3.org/ns/dcat#themeTaxonomy",
        "label": {
          "en": "Theme",
          "nb": "Tema",
          "sv": "Tema",
          "da": "Tema",
          "de": "Theme"
        },
        "description": {
          "en": "This property refers to a knowledge organization system used to classify the Catalogue's Datasets.",
          "nb": "Referer til et kunnskapsorganiseringssystem (KOS) som er brukt for å klassifisere katalogens datasett",
          "da": "Refererer til et emneklassificeringssystem som er brugt til at klassificere katalogets datasæt",
          "de": "Diese Eigenschaft bezieht sich auf ein Wissensorganisationssystem das zur Klassifizierung der Datensätze des Kataloges verwendet wird.",
          "sv": "Den här egenskapen hänvisar till ett kunskapsorganisationssystem som används för att klassificera katalogens datamängder."
        },
        "choices": [
          {
            "value": "http://publications.europa.eu/resource/authority/data-theme",
            "label": {
              "en": "Data Theme Vocabulary"
            },
            "description": {
              "en": "MRD Data Themes Named Authority List"
            }
          }
        ],
        "cardinality": {
          "min": 0,
          "pref": 1
        }
      },
      {
        "id": "dcat:dcterms:source_da",
        "type": "choice",
        "nodetype": "URI",
        "description": {
          "en": "This property refers to a related Dataset from which the described Dataset is derived.",
          "nb": "Referanse til et datasett som gjeldende datasett er avledet fra.",
          "da": "Det eller de  oprindelige datasæt, som dette datasæt stammer fra. Eksempelvis ved sammenstillede datasæt.",
          "de": "Diese Eigenschaft bezieht sich auf einen verwandten Datensatz von dem der beschriebene Datensatz abgeleitet wurde.",
          "sv": "En referens till en relaterad datamängd från vilken den beskrivna datamängden härleds."
        },
        "label": {
          "en": "Source",
          "sv": "Källa",
          "nb": "Kilde",
          "da": "Kildedatasæt",
          "de": "Quelle"
        },
        "property": "http://purl.org/dc/terms/source",
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.w3.org/ns/dcat#Dataset"
        }
      },
      {
        "id": "dcat:dcterms:accessRights_da",
        "type": "choice",
        "nodetype": "URI",
        "property": "http://purl.org/dc/terms/accessRights",
        "label": {
          "en": "Access rights",
          "nb": "Tilgangsnivå",
          "sv": "Åtkomsträttigheter",
          "da": "Adgangsrettigheder",
          "de": "Zugriffsrechte"
        },
        "description": {
          "en": "This property refers to information that indicates whether the Dataset is open data, has access restrictions or is not public.",
          "nb": "Refaranse til informasjon som indikerer om datasettet er åpne data, har tilgangsbegrensninger eller er unntatt offentlighet.",
          "da": "Angiver information om hvilke begrænsninger der eksisterer for adgangen til data.",
          "de": "Diese Eigenschaft bezieht sich auf Informationen die angeben ob der Datensatz offene Daten beinhaltet, Zugriffsbeschränkungen hat oder nicht öffentlich ist.",
          "sv": "Den här egenskapen hänvisar till information som indikerar huruvida datamängden innehåller öppna data, har åtkomstrestriktioner eller är inte offentlig."
        },
        "cardinality": {
          "min": 0,
          "pref": 0,
          "max": 1
        },
        "choices": [
          {
            "value": "http://publications.europa.eu/resource/authority/access-right/NON_PUBLIC",
            "label": {
              "en": "Non-public",
              "nb": "Unntatt offentlighet",
              "da": "Ikke offentligt",
              "de": "Nicht öffentlich",
              "sv": "Ej offentlig"
            },
            "description": {
              "en": "Not publicly accessible for privacy, security or other reasons. Usage note: This category may include resources that contain sensitive or personal information.",
              "da": "Ikke offentligt pga. privatlivs, sikkerheds eller andre forhold. Note om anvendelse: Denne kategori kan inkluderer ressurser der indeholder sensitive eller personlige informationer.",
              "de": "Nicht öffentlich zugänglich wegen Privatsphäre, Sicherheit oder aus anderen Gründe. Verwendungshinweis: Diese Kategorie kann Ressourcen enthalten die sensible oder persönliche Informationen enthalten.",
              "sv": "Inte tillgänglig för allmänheten pga integritet, säkerhet eller andra orsaker. Användningsanmärkning: Denna kategori kan omfatta resurser som innehåller känslig eller personlig information."
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/access-right/PUBLIC",
            "label": {
              "en": "Public",
              "nb": "Offentlig",
              "sv": "Publik",
              "da": "Offentlig",
              "de": "Öffentlich"
            },
            "description": {
              "en": "Publicly accessible by everyone. Usage note: Permissible obstacles include registration and request for API keys, as long as anyone can request such registration and/or API keys.",
              "da": "Offentligt tilgængelig for alle. Note om anvendelse: Andre begrænsninger for adgang kan inkludereregi registrering og anmodning om API koder, så længe hvem som helst kan anmode om sådan registrering og/eller API koder.",
              "de": "Öffentlich zugänglich für alle. Verwendungshinweis: Zulässige Hindernisse beinhalten die Registrierung und die Anforderung von API-Schlüsseln, solange jedermann solche Registrierungs- und/oder API-Schlüssel anfordern kann.",
              "sv": "Tillgängligt för allmänheten. Användningsanmärkning: Tillåtna hinder inkluderar registrering och begäran av API-nycklar, så länge vem som helst kan begära registrering och/eller API-nycklar."
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/access-right/RESTRICTED",
            "label": {
              "en": "Restricted",
              "nb": "Begrenset offentlighet",
              "da": "Begrænset offentlighed",
              "de": "Eingeschränkt",
              "sv": "Begränsad"
            },
            "description": {
              "en": "Only available under certain conditions. Usage note: This category may include resources that require payment, resources shared under non-disclosure agreements, resources for which the publisher or owner has not yet decided if they can be publicly released.",
              "da": "Kun tilgængelig under særlige vilkår. Note om anvendelse: Denne kategori kan indeholde ressurser This cate der kræver betaling, ressurser delt under 'non-disclosure agreements', ressurcer for hvem den dataejende organisation ikke endnu har besluttet om datasættet kan publiceres offentligt.",
              "de": "Nur unter bestimmten Bedingungen verfügbar. Verwendungshinweis: Diese Kategorie kann auch Ressourcen enthalten die eine Zahlung verlangen, Ressourcen die im Rahmen von Geheimhaltungsvereinbarungen verfügbar gemacht werden, und Ressourcen für die der Herausgeber oder Eigentümer noch nicht entschieden hat ob sie öffentlich freigegeben werden können.",
              "sv": "Endast tillgängligt under särskilda villkor. Användningsanmärkning: Denna kategori kan omfatta resurser som kräver betalning, resurser som tillgängliggörs inom ramen för sekretessavtal, eller resurser där utgivaren eller ägaren ännu inte har beslutat om de kan offentliggjöras."
            }
          }
        ],
        "styles": [
          "verticalRadioButtons"
        ]
      },
      {
        "id": "dcat:hasVersion_da",
        "type": "choice",
        "nodetype": "URI",
        "property": "http://www.w3.org/ns/dcat#hasVersion",
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.w3.org/ns/dcat#Dataset"
        },
        "label": {
          "en": "Has version",
          "nb": "Har versjon",
          "sv": "Har version",
          "da": "Har version",
          "de": "Hat Version"
        },
        "description": {
          "en": "This property refers to a related Dataset that is a version, edition, or adaptation of the described Dataset.",
          "nb": "Referanse til et datasett som er en versjon, utgave, eller tilpasning av det beskrevne datasettet",
          "da": "Refererer til et konkret datasæt som er en udgave af det beskrevne datasæt.",
          "de": "Ein verwandter Datensatz, der eine Version, eine Ausgabe oder eine Anpassung des beschriebenen Datensatzes ist.",
          "sv": "En relaterad datamängd som är en version, utgåva, eller anpassning av den beskrivna datamängden."
        }
      },
      {
        "id": "dcat:isVersionOf_da",
        "type": "choice",
        "nodetype": "URI",
        "property": "http://www.w3.org/ns/dcat#isVersionOf",
        "label": {
          "en": "Is version of",
          "nb": "Er versjon av",
          "sv": "Är version av",
          "da": "Er version af",
          "de": "Ist Version von"
        },
        "description": {
          "en": "This property refers to a related Dataset of which the described Dataset is a version, edition, or adaptation.",
          "nb": "Referanse til et beslektet datasett som det beskrevne datasettet er en versjon, utgave, eller tilpasning av",
          "da": "Refererer til et konkret relateret datasæt som det beskrevne datasæt er en udgave af.",
          "de": "Einen verwandter Datensatz von dem der beschriebene Datensatz eine Version, eine Edition oder eine Anpassung ist.",
          "sv": "En relaterad datamängd som den beskrivna datamängden är en version, utgåva, eller anpassning av."
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.w3.org/ns/dcat#Dataset"
        }
      },
      {
        "id": "dcat:dcterms:hasPart_ca",
        "type": "choice",
        "nodetype": "RESOURCE",
        "property": "http://purl.org/dc/terms/hasPart",
        "label": {
          "en": "Has part",
          "sv": "Består av",
          "nb": "Har del",
          "da": "Består af",
          "de": "Besteht aus"
        },
        "description": {
          "en": "This property refers to a related Catalogue that is part of the described Catalogue.",
          "nb": "Referanse til en beslektet katalog som er en del av den beskrevne katalogen.",
          "da": "Reference til et beslægtet katalog som er en del af det beskrevne katalog.",
          "de": "Diese Eigenschaft bezieht sich auf einen verwandten Katalog, der Teil des beschriebenen Kataloges ist.",
          "sv": "Hänvisar till en relaterad katalog som är del av den beskrivna katalogen."
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.w3.org/ns/dcat#Catalog"
        }
      },
      {
        "id": "dcat:dcterms:isPartOf_ca",
        "type": "choice",
        "nodetype": "RESOURCE",
        "property": "http://purl.org/dc/terms/isPartOf",
        "label": {
          "en": "Is part of",
          "sv": "Är del av",
          "nb": "Er del av",
          "da": "Er del af",
          "de": "Ist Teil von"
        },
        "description": {
          "en": "This property refers to a related Catalogue in which the described Catalogue is physically or logically included.",
          "nb": "Refereranse til en beslektet katalog som denne katalogen er fysisk eller logisk inkludert i.",
          "da": "Refererence til et beslægtet katalog som dette katalog er fysisk eller logisk inkluderet i.",
          "de": "Diese Eigenschaft bezieht sich auf einen verwandten Katalog, in welchen der beschriebene Katalog physisch oder logisch einbezogen ist.",
          "sv": "Hänvisar till en närstående katalog där den beskrivna katalogen fysiskt eller logiskt ingår."
        },
        "cardinality": {
          "min": 0,
          "pref": 0,
          "max": 1
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.w3.org/ns/dcat#Catalog"
        }
      },
      {
        "type": "choice",
        "nodetype": "URI",
        "id": "dcat:dcterms:accrualPeriodicity_da",
        "property": "http://purl.org/dc/terms/accrualPeriodicity",
        "label": {
          "en": "Frequency of update",
          "sv": "Uppdateringsfrekvens",
          "nb": "Frekvens",
          "da": "Opdateringsfrekvens",
          "de": "Aktualisierungshäufigkeit"
        },
        "description": {
          "en": "This property refers to the frequency at which Dataset is updated.",
          "nb": "Referer til oppdateringsfrekvensen for datasettet",
          "da": "Refererer til opdateringsfrekvensen for datasættet",
          "de": "Diese Eigenschaft bezieht sich auf die Häufigkeit mit welcher der Datensatz aktualisiert wird.",
          "sv": "Avser datamängdens uppdateringsfrekvens."
        },
        "cardinality": {
          "min": 0,
          "pref": 0,
          "max": 1
        },
        "choices": [
          {
            "value": "http://publications.europa.eu/resource/authority/frequency/ANNUAL",
            "label": {
              "bg": "годишен",
              "cs": "roční",
              "da": "årligt",
              "de": "jährlich",
              "el": "ετήσιος",
              "en": "annual",
              "et": "aastane",
              "fi": "vuotuinen",
              "fr": "annuel",
              "ga": "bliantúil",
              "hr": "godišnje",
              "hu": "évenkénti",
              "it": "annuale",
              "lv": "reizi gadā",
              "lt": "kasmetinis",
              "mt": "annwali",
              "nl": "jaarlijks",
              "pl": "roczny",
              "pt": "anual",
              "ro": "anual",
              "sk": "ročný",
              "sl": "letni",
              "es": "anual",
              "sv": "årlig",
              "nb": "årlig"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/frequency/BIENNIAL",
            "label": {
              "bg": "двегодишен",
              "cs": "dvouletý",
              "da": "toårigt",
              "de": "zweijährlich",
              "el": "διετής",
              "en": "biennial",
              "et": "iga kahe aasta järel",
              "fi": "kaksivuotinen",
              "fr": "biennal",
              "ga": "dhébhliantúil",
              "hr": "bijenale",
              "hu": "kétévenkénti",
              "it": "biennale",
              "lv": "reizi divos gados",
              "lt": "dvimetis",
              "mt": "biennali",
              "nl": "tweejaarlijks",
              "pl": "dwuletni",
              "pt": "bienal",
              "ro": "bienal",
              "sk": "dvojročný",
              "sl": "bienale",
              "es": "bienal",
              "sv": "vartannat år",
              "nb": "annethvert år"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/frequency/BIMONTHLY",
            "label": {
              "bg": "двухмесечен",
              "cs": "dvouměsíční",
              "da": "hver anden måned",
              "de": "zweimonatlich",
              "el": "διμηνιαίος",
              "en": "bimonthly",
              "et": "kord kahe kuu jooksul",
              "fi": "kahdesti kuussa",
              "fr": "bimestriel",
              "ga": "gach dhá mhí",
              "hr": "dvomjesečno",
              "hu": "kéthavonkénti",
              "it": "bimestrale",
              "lv": "reizi divos mēnešos",
              "lt": "dviejų mėnesių",
              "mt": "bimensili",
              "nl": "tweemaandelijks",
              "pl": "dwumiesięcznik",
              "pt": "quinzenal",
              "ro": "bilunar",
              "sk": "dvojmesačný",
              "sl": "dvomesečen",
              "es": "bimestral",
              "sv": "varannan månad",
              "nb": "annenhver måned"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/frequency/BIWEEKLY",
            "label": {
              "bg": "на две седмици",
              "cs": "čtrnáctidenní",
              "da": "hver fjortende dag",
              "de": "zweiwöchentlich",
              "el": "δισεβδομαδιαίος",
              "en": "biweekly",
              "et": "kahenädalane",
              "fi": "joka toinen viikko",
              "fr": "tous les quinze jours",
              "ga": "gach coicís",
              "hr": "polumjesečno",
              "hu": "kéthetenkénti",
              "it": "quindicinale",
              "lv": "reizi divās nedēļās",
              "lt": "dvisavaitinis",
              "mt": "ta’ kull ħmistax",
              "nl": "veertiendaags",
              "pl": "dwutygodnik",
              "pt": "quinzenal",
              "ro": "la fiecare două săptămâni",
              "sk": "dvojtýždenný",
              "sl": "vsakih štirinajst dni",
              "es": "quincenal",
              "sv": "var fjortonde dag",
              "nb": "hver fjortende dag"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/frequency/CONT",
            "label": {
              "bg": "постоянен",
              "cs": "průběžný",
              "da": "kontinuerligt",
              "de": "kontinuierlich",
              "el": "συνεχής",
              "en": "continuous",
              "et": "pidev",
              "fi": "jatkuva",
              "fr": "continuel",
              "ga": "leanúnach",
              "hr": "stalan",
              "hu": "folyamatos",
              "it": "continuo",
              "lv": "pastāvīgs",
              "lt": "nenutrūkstamas",
              "mt": "kontinwu",
              "nl": "voortdurend",
              "pl": "ciągły",
              "pt": "continuo",
              "ro": "continuu",
              "sk": "priebežný",
              "sl": "nenehen",
              "es": "continuo",
              "sv": "kontinuerlig",
              "nb": "kontinuerlig"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/frequency/UPDATE_CONT",
            "label": {
              "bg": "постоянно се актуализира",
              "cs": "průběžně aktualizovaný",
              "da": "opdateres løbende",
              "de": "ständige Aktualisierung",
              "el": "ενημερώνεται συνεχώς",
              "en": "continuously updated",
              "et": "ajakohastatakse pidevalt",
              "fi": "päivitetään jatkuvasti",
              "fr": "mise à jour continuelle",
              "ga": "á leasú chun dáta go leanúnach",
              "hr": "stalno ažuriraju",
              "hu": "folyamatosan frissített",
              "it": "in continuo aggiornamento",
              "lv": "pastāvīgi tiek atjaunots",
              "lt": "nuolat atnaujinama",
              "mt": "kontinwament aġġornata",
              "nl": "voortdurend geactualiseerd",
              "pl": "stale aktualizowany",
              "pt": "continuamente atualizado",
              "ro": "actualizare continuă",
              "sk": "priebežne aktualizovaný",
              "sl": "nenehno posodobljen",
              "es": "continuamente actualizado",
              "sv": "uppdateras kontinuerligt",
              "nb": "kontinuerlig oppdatert"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/frequency/DAILY",
            "label": {
              "bg": "ежедневен",
              "cs": "denní",
              "da": "dagligt",
              "de": "täglich",
              "el": "ημερήσιος",
              "en": "daily",
              "et": "päevane",
              "fi": "päivittäin",
              "fr": "quotidien",
              "ga": "laethúil",
              "hr": "dnevni",
              "hu": "naponkénti",
              "it": "quotidiano",
              "lv": "katru dienu",
              "lt": "kasdieninis",
              "mt": "kuljum",
              "nl": "dagelĳks",
              "pl": "dziennik",
              "pt": "diário",
              "ro": "zilnic",
              "sk": "denný",
              "sl": "dnevni",
              "es": "diario",
              "sv": "dagligen",
              "nb": "daglig"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/frequency/IRREG",
            "label": {
              "bg": "неправилен",
              "cs": "nepravidelný",
              "da": "uregelmæssigt",
              "de": "unregelmäßig",
              "el": "μη τακτικός",
              "en": "irregular",
              "et": "ebakorrapärane",
              "fi": "epäsäännöllinen",
              "fr": "irrégulier",
              "ga": "neamhrialta",
              "hr": "neredovit",
              "hu": "rendszertelen",
              "it": "irregolare",
              "lv": "neregulāri",
              "lt": "nereguliarus",
              "mt": "irregolari",
              "nl": "onregelmatig",
              "pl": "nieregularny",
              "pt": "irregular",
              "ro": "neregulat",
              "sk": "nepravidelný",
              "sl": "nepravilen",
              "es": "irregular",
              "sv": "oregelbundet",
              "nb": "uregelmessig"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/frequency/MONTHLY",
            "label": {
              "bg": "месечен",
              "cs": "měsíční",
              "da": "månedligt",
              "de": "monatlich",
              "el": "μηνιαίος",
              "en": "monthly",
              "et": "igakuine",
              "fi": "kuukausittainen",
              "fr": "mensuel",
              "ga": "míosúil",
              "hr": "mjesečno",
              "hu": "havonkénti",
              "it": "mensile",
              "lv": "reizi mēnesī",
              "lt": "kas mėnesį",
              "mt": "mensili",
              "nl": "maandelijks",
              "pl": "miesięcznik",
              "pt": "mensal",
              "ro": "lunar",
              "sk": "mesačný",
              "sl": "mesečen",
              "es": "mensual",
              "sv": "månatligen",
              "nb": "månedlig"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/frequency/OTHER",
            "label": {
              "bg": "друг",
              "cs": "ostatní",
              "da": "andet",
              "de": "anderer",
              "el": "άλλο",
              "en": "other",
              "et": "muu",
              "fi": "muut",
              "fr": "autre",
              "ga": "eile",
              "hr": "drugi",
              "hu": "egyéb",
              "it": "altro",
              "lv": "citi",
              "lt": "kitas",
              "mt": "oħra",
              "nl": "overige",
              "pl": "inne",
              "pt": "outro",
              "ro": "altele",
              "sk": "ostatné",
              "sl": "ostali",
              "es": "otro",
              "sv": "andra",
              "nb": "annet"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/frequency/QUARTERLY",
            "label": {
              "bg": "тримесечен",
              "cs": "čtvrtletní",
              "da": "kvartalsvis",
              "de": "vierteljährlich",
              "el": "τριμηνιαίος",
              "en": "quarterly",
              "et": "kvartaalne",
              "fi": "vuosineljänsittäin",
              "fr": "trimestriel",
              "ga": "ráitheachán",
              "hr": "tromjesečno",
              "hu": "negyedévenkénti",
              "it": "trimestrale",
              "lv": "reizi trīs mēnešos",
              "lt": "kas ketvirtį",
              "mt": "kull tliet xhur",
              "nl": "driemaandelijks",
              "pl": "kwartalnik",
              "pt": "trimestral",
              "ro": "trimestrial",
              "sk": "štvrťročný",
              "sl": "četrtletni",
              "es": "trimestral",
              "sv": "kvartalsvis",
              "nb": "kvartalsvis"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/frequency/ANNUAL_2",
            "label": {
              "bg": "два пъти на година",
              "cs": "pololetní",
              "da": "halvårligt",
              "de": "halbjährlich",
              "el": "εξαμηνιαίος",
              "en": "semiannual",
              "et": "pooleaastane",
              "fi": "puolivuotinen",
              "fr": "semestriel",
              "ga": "leathbhliantúil",
              "hr": "polugodišnje",
              "hu": "félévenkénti",
              "it": "semestrale",
              "lv": "reizi pusgadā",
              "lt": "kas pusę metų",
              "mt": "kull sitt xhur",
              "nl": "halfjaarlĳks",
              "pl": "półroczny",
              "pt": "semianual",
              "ro": "semestrial",
              "sk": "polročný",
              "sl": "polletni",
              "es": "semestral",
              "sv": "halvårs",
              "nb": "halvårlig"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/frequency/MONTHLY_2",
            "label": {
              "bg": "на половин месец",
              "cs": "nědvakrát za měsíc",
              "da": "to gange månedligt",
              "de": "zweimal im Monat",
              "el": "δεκαπενθήμερος",
              "en": "semimonthly",
              "et": "kaks korda kuus",
              "fi": "kaksi kertaa kuukaudessa",
              "fr": "bimensuel",
              "ga": "leath-míosúil",
              "hr": "dvaput mjesečno",
              "hu": "félhavonkénti",
              "it": "bimensile",
              "lv": "divreiz mēnesī",
              "lt": "dukart per mėnesį",
              "mt": "darbtejn fix-xahar",
              "nl": "twee keer per maand",
              "pl": "dwukrotnie w miesiącu",
              "pt": "duas vezes por mês",
              "ro": "se două ori pe lună",
              "sk": "dvakrát mesačne",
              "sl": "dvakrat na mesec",
              "es": "bimensual",
              "sv": "två gånger per månad",
              "nb": "to ganger i måneden"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/frequency/WEEKLY_2",
            "label": {
              "bg": "дваж на седмица",
              "cs": "dvakrát týdně",
              "da": "to gange ugentligt",
              "de": "zweimal in Woche",
              "el": "διεβδομαδιαίος",
              "en": "semiweekly",
              "et": "kaks korda nädalas",
              "fi": "kaksi kertaa viikossa",
              "fr": "bihebdomadaire",
              "ga": "dhá uair in aghaidh na seachtaine",
              "hr": "dvaput tjedno",
              "hu": "hetente kétszeri",
              "it": "bisettimanale",
              "lv": "divreiz nedēļā",
              "lt": "dukart per savaitę",
              "mt": "darbtejn fil-ġimgħa",
              "nl": "twee keer per week",
              "pl": "dwa razy w tygodniu",
              "pt": "duas vezes por semana",
              "ro": "de două ori pe săptămână",
              "sk": "dvakrát týždenne",
              "sl": "dvakrat tedensko",
              "es": "bisemanal",
              "sv": "två gånge per vecka",
              "nb": "to ganger i uken"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/frequency/MONTHLY_3",
            "label": {
              "bg": "три пъти месечно",
              "cs": "třikrát za měsíc",
              "da": "tre gange månedligt",
              "de": "dreimal im Monat",
              "el": "τρεις φορές τον μήνα",
              "en": "three times a month",
              "et": "kolm korda kuus",
              "fi": "kolme kertaa kuukaudessa",
              "fr": "trois fois par mois",
              "ga": "trí uair sa mhí",
              "hr": "triput mjesečno",
              "hu": "havonta háromszori",
              "it": "tre volte al mese",
              "lv": "trīsreiz mēnesī",
              "lt": "tris kartus per mėnesį",
              "mt": "tliet darbiet fix-xahar",
              "nl": "drie keer per maand",
              "pl": "trzy razy w miesiącu",
              "pt": "três vezes por mês",
              "ro": "de trei ori pe lună",
              "sk": "trikrát mesačne",
              "sl": "trikrat na mesec",
              "es": "tres veces por mes",
              "sv": "tre gånger per månad",
              "nb": "tre ganger i måneden"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/frequency/WEEKLY_3",
            "label": {
              "bg": "три пъти на седмица",
              "cs": "třikrát týdně",
              "da": "tre gange ugentligt",
              "de": "dreimal in Woche",
              "el": "τριεβδομαδιαίος",
              "en": "three times a week",
              "et": "kolm korda nädalas",
              "fi": "kolme kertaa viikossa",
              "fr": "trois fois par semaine",
              "ga": "trí uair in aghaidh na seachtaine",
              "hr": "triput tjedno",
              "hu": "hetente háromszori",
              "it": "tre volte a settimana",
              "lv": "trīsreiz nedēļā",
              "lt": "tris kartus per savaitę",
              "mt": "tliet darbiet fil-ġimgħa",
              "nl": "drie keer per week",
              "pl": "trzy razy w tygodniu",
              "pt": "três vezes por semana",
              "ro": "de trei ori pe săptămână",
              "sk": "trikrát týždenne",
              "sl": "trikrat tedensko",
              "es": "tres veces por semana",
              "sv": "tre gånger per vecka",
              "nb": "tre ganger i uken"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/frequency/ANNUAL_3",
            "label": {
              "bg": "три пъти на година",
              "cs": "třikrát do roka",
              "da": "tre gange årligt",
              "de": "dreimal im Jahr",
              "el": "τετραμηνιαίος",
              "en": "three times a year",
              "et": "kolm korda aastas",
              "fi": "kolme kertaa vuodessa",
              "fr": "trois fois par an",
              "ga": "trí uair sa bhliain",
              "hr": "triput godišnje",
              "hu": "évente háromszori",
              "it": "tre volte all'anno",
              "lv": "trīsreiz gadā",
              "lt": "tris kartus per metus",
              "mt": "tliet darbiet fis-sena",
              "nl": "drie keer per jaar",
              "pl": "trzy razy w roku",
              "pt": "três vezes por ano",
              "ro": "de trei ori pe an",
              "sk": "trikrát do roka",
              "sl": "trikrat na leto",
              "es": "cuatrimestral",
              "sv": "tre gånger per år",
              "nb": "tre ganger per år"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/frequency/TRIENNIAL",
            "label": {
              "bg": "тригодишен",
              "cs": "tříletý",
              "da": "treårligt",
              "de": "dreijährlich",
              "el": "τριετής",
              "en": "triennial",
              "et": "iga kolme aasta järel",
              "fi": "kolmivuotinen",
              "fr": "triennal",
              "ga": "tríbhliantúil",
              "hr": "trijenale",
              "hu": "háromévenkénti",
              "it": "triennale",
              "lv": "reizi trīs gados",
              "lt": "trimetis",
              "mt": "triennali",
              "nl": "driejaarlijks",
              "pl": "trzyletni",
              "pt": "trienal",
              "ro": "trienal",
              "sk": "trojročný",
              "sl": "trienale",
              "es": "trienal",
              "sv": "vart tredje år",
              "nb": "hvert tredje år"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/frequency/DAILY_2",
            "label": {
              "bg": "два пъти на ден",
              "cs": "dvakrát denně",
              "da": "to gange om dagen",
              "de": "zweimal täglich",
              "el": "δύο φορές την ημέρα",
              "en": "twice a day",
              "et": "kaks korda päevas",
              "fi": "kahdesti päivässä",
              "fr": "deux fois par jour",
              "ga": "dhá uair sa lá",
              "hr": "dvaput dnevno",
              "hu": "naponta kétszeri",
              "it": "due volte al giorno",
              "lv": "divreiz dienā",
              "lt": "dukart per dieną",
              "mt": "darbtejn kuljum",
              "nl": "tweemaal per dag",
              "pl": "dwa razy dziennie",
              "pt": "duas vezes por dia",
              "ro": "de două ori pe zi",
              "sk": "dvakrát denne",
              "sl": "dvakrat dnevno",
              "es": "dos veces al día",
              "sv": "två gånger per dag",
              "nb": "daglig"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/frequency/UNKNOWN",
            "label": {
              "bg": "непознат",
              "cs": "neznámý",
              "da": "ubekendt",
              "de": "unbekannt",
              "el": "άγνωστος",
              "en": "unknown",
              "et": "tundmatu",
              "fi": "tuntematon",
              "fr": "inconnu",
              "ga": "anaithnid",
              "hr": "nepoznat",
              "hu": "ismeretlen",
              "it": "sconosciuto",
              "lv": "nav zināms",
              "lt": "nežinomas",
              "mt": "mhux magħruf",
              "nl": "onbekend",
              "pl": "nieznany",
              "pt": "desconhecido",
              "ro": "necunoscut",
              "sk": "neznámy",
              "sl": "nepoznan",
              "es": "desconocido",
              "sv": "obekant",
              "nb": "ukjent"
            }
          },
          {
            "value": "http://publications.europa.eu/resource/authority/frequency/WEEKLY",
            "label": {
              "bg": "седмичен",
              "cs": "týdenní",
              "da": "ugentligt",
              "de": "wöchentlich",
              "el": "εβδομαδιαίος",
              "en": "weekly",
              "et": "nädalane",
              "fi": "viikoittainen",
              "fr": "hebdomadaire",
              "ga": "in aghaidh na seachtaine",
              "hr": "tjedni",
              "hu": "hetenkénti",
              "it": "settimanale",
              "lv": "reizi nedēļā",
              "lt": "kas savaitę",
              "mt": "kull ġimgħa",
              "nl": "wekelijks",
              "pl": "tygodnik",
              "pt": "hebdomadário",
              "ro": "săptămânal",
              "sk": "týždenný",
              "sl": "tedensko",
              "es": "semanal",
              "sv": "veckovis",
              "nb": "ukentlig"
            }
          }
        ]
      },
      {
        "type": "choice",
        "nodetype": "RESOURCE",
        "id": "dcat:contactPoint-choice_da",
        "labelProperties": [
          "http://www.w3.org/2006/vcard/ns#fn"
        ],
        "property": "http://www.w3.org/ns/dcat#contactPoint",
        "description": {
          "en": "This property contains contact information that can be used for flagging errors in the Dataset or sending comments.",
          "de": "Diese Eigenschaft enthält Kontaktinformationen die zum Melden von Fehlern im Datensatz oder zum Versenden von Kommentaren verwendet werden können",
          "sv": "Egenskapen innehåller kontaktuppgifter som kan användas för att flagga fel i datamängden eller för att skicka kommentarer"
        },
        "label": {
          "en": "Contact point",
          "sv": "Kontakt",
          "nb": "Kontaktpunkt",
          "da": "Kontaktpunkt",
          "de": "Kontaktpunkt"
        },
        "cardinality": {
          "min": 0,
          "pref": 1
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": [
            "http://www.w3.org/2006/vcard/ns#Organization",
            "http://www.w3.org/2006/vcard/ns#Individual",
            "http://www.w3.org/2006/vcard/ns#Kind"
          ]
        }
      },
      {
        "type": "text",
        "nodetype": "URI",
        "id": "dcat:foaf:page",
        "label": {
          "en": "Documentation",
          "nb": "Dokumentasjon",
          "sv": "Dokumentation",
          "da": "Dokumentation",
          "de": "Dokumentation"
        },
        "property": "http://xmlns.com/foaf/0.1/page",
        "pattern": "https?://.+"
      },
      {
        "type": "text",
        "id": "dcat:dcterms:description_ca",
        "extends": "dcat:dcterms:description",
        "styles": [
          "multiline"
        ],
        "cardinality": {
          "min": 1,
          "pref": 0
        },
        "description": {
          "en": "This property contains a free-text account of the Catalogue. This property can be repeated for parallel language versions of the description.",
          "nb": "Fritekst-beskrivelse av innholdet i katalogen. Egenskapen kan bli gjentatt for parallelle språkversjoner av beskrivelsen.",
          "da": "Beskrivelse af datasættet som angiver centrale kendetegn, og formålet med dataindsamlingen. Attributten kan gentages for forskellige sprogversion af beskrivelsen.",
          "de": "Diese Eigenschaft enthält eine Beschreibung des Kataloges. Diese Eigenschaft kann für andere Sprachversionen der Beschreibung wiederholt werden.",
          "sv": "Katalogens beskrivning. Denna egenskap kan upprepas för parallella språkversioner av beskrivningen."
        }
      },
      {
        "type": "choice",
        "id": "dcat:foaf:Agent_ca",
        "labelProperties": [
          "http://xmlns.com/foaf/0.1/name",
          [
            "http://xmlns.com/foaf/0.1/givenName",
            "http://xmlns.com/foaf/0.1/familyName"
          ]
        ],
        "extends": "dcat:foaf:Agent",
        "description": {
          "en": "This property refers to an entity (organisation) responsible for making the Catalogue available.",
          "nb": "Referer til en enhet (organisasjon) som er ansvarlig for å gjøre katalogen tilgjengelig. Bør være autoritativ URI for enhet, sekundært organisasjonsnummer.",
          "da": "Refererer til en enhed (organisation) som er ansvarlig for at gøre kataloget tilgængeligt. Bør være en autoritativ URI for enhed, alternativt organisationsnummer.",
          "de": "Diese Eigenschaft bezieht sich auf eine Einrichtung (Organisation), die für die Erstellung des Kataloges verantwortlich ist.",
          "sv": "Egenskapen hänvisar till en enhet (organisation) som ansvarar för att göra katalogen tillgänglig."
        },
        "cardinality": {
          "min": 1,
          "pref": 0,
          "max": 1
        }
      },
      {
        "type": "choice",
        "id": "dcat:foaf:Agent_da",
        "labelProperties": [
          "http://xmlns.com/foaf/0.1/name",
          [
            "http://xmlns.com/foaf/0.1/givenName",
            "http://xmlns.com/foaf/0.1/familyName"
          ]
        ],
        "extends": "dcat:foaf:Agent",
        "description": {
          "en": "This property refers to an entity (organisation) responsible for making the Dataset available.",
          "nb": "Refererer til en enhet (organisasjon) som er ansvarlig for å gjøre datasettet tilgjengelig. Bør være autoritativ URI for enhet, sekundært organisasjonsnummer.",
          "da": "Refererer til en enhed (organisation) som ejer datasættet. Bør være en autoritativ URI for enhed, alternativt organisationsnummer.",
          "de": "Diese Eigenschaft bezieht sich auf eine Einrichtung (Organisation), die für die Erstellung des Datensatzes verantwortlich ist.",
          "sv": "Egenskapen hänvisar till en enhet (organisation) som ansvarar för att göra datamängden tillgänglig."
        },
        "cardinality": {
          "min": 0,
          "pref": 1,
          "max": 1
        }
      },
      {
        "type": "text",
        "nodetype": "DATATYPE_LITERAL",
        "id": "dcat:dcterms:issued",
        "extends": "dcterms:issued",
        "label": {
          "en": "Release date",
          "sv": "Utgivningsdatum",
          "nb": "Utgivelsesdato",
          "da": "Udgivelsesdato",
          "de": "Veröffentlichungsdatum"
        },
        "cardinality": {
          "min": 0,
          "pref": 0
        },
        "datatype": "http://www.w3.org/2001/XMLSchema#date"
      },
      {
        "type": "text",
        "nodetype": "DATATYPE_LITERAL",
        "id": "dcat:dcterms:issued_ca",
        "description": {
          "en": "This property contains the date of formal issuance (e.g., publication) of the Catalogue.",
          "nb": "Dato for formell utgivelse (publisering) av katalogen.",
          "da": "Dato for formel udgivelse af datasættet.",
          "de": "Diese Eigenschaft enthält das Datum der Veröffentlichung des Kataloges.",
          "sv": "Egenskapen innehåller katalogens utgivningsdatum."
        },
        "cardinality": {
          "min": 0,
          "pref": 1,
          "max": 1
        },
        "extends": "dcat:dcterms:issued"
      },
      {
        "type": "choice",
        "nodetype": "URI",
        "id": "dcat:dcterms:language_ca",
        "description": {
          "en": "This property refers to a language used in the textual metadata describing titles, descriptions, etc. of the Datasets in the Catalogue. This property can be repeated if the metadata is provided in multiple languages.",
          "nb": "Viser til et språk som brukes i tekstlige metadata som beskriver titler, beskrivelser, osv av datasettene i katalogen. Egenskapen kan gjentas hvis metadata er gitt i flere språk.",
          "da": "Refererer til det sprog som bruges i de tekstlige metadata som beskriver titler, beskrivelser, osv af datasættene i kataloget. Attributten gentages hvis metadata er beskrevet i flere sprog.",
          "de": "Diese Eigenschaft bezieht sich auf die Sprache die in den Metadaten verwendet wird und die Titel, Beschreibungen usw. der Datensätze im Katalog beschreiben. Diese Eigenschaft kann wiederholt werden wenn die Metadaten in mehreren Sprachen bereitgestellt werden.",
          "sv": "Egenskapen anger vilket språk som används i metadata som titlar, beskrivningar etc. av datamängder i katalogen. Egenskapen kan upprepas om metadata anges på flera språk."
        },
        "extends": "dcat:dcterms:language",
        "cardinality": {
          "min": 0,
          "pref": 1
        }
      },
      {
        "type": "choice",
        "nodetype": "URI",
        "id": "dcat:dcterms:language_da",
        "extends": "dcat:dcterms:language",
        "cardinality": {
          "min": 0,
          "pref": 0
        },
        "description": {
          "en": "This property refers to a language of the Dataset. This property can be repeated if there are multiple languages in the Dataset.",
          "nb": "Referanse til språket som datasettet er på. Kan repeteres dersom det er flere språk i datasettet",
          "da": "Sprog der er brugt i datasættet. Gentages hvis det er anvendt forskellige sprog i datasættet",
          "de": "Diese Eigenschaft bezieht sich auf eine Sprache des Datensatzes. Diese Eigenschaft kann wiederholt werden wenn mehrere Sprachen im Datensatz vorhanden sind.",
          "sv": "Egenskapen hänvisar till datamängdens språk. Egenskapen kan upprepas om det finns flera språk i datamängden."
        }
      },
      {
        "type": "text",
        "nodetype": "DATATYPE_LITERAL",
        "id": "dcat:dcterms:modified",
        "extends": "dcterms:modified",
        "cardinality": {
          "min": 0,
          "pref": 0
        },
        "label": {
          "en": "Date modified",
          "sv": "Ändringsdatum",
          "nb": "Modifiseringsdato",
          "da": "Senest opdateret",
          "de": "Änderungsdatum"
        }
      },
      {
        "type": "text",
        "nodetype": "DATATYPE_LITERAL",
        "id": "dcat:dcterms:modified_ca",
        "cardinality": {
          "min": 0,
          "pref": 1,
          "max": 1
        },
        "description": {
          "en": "This property contains the most recent date on which the Catalogue was changed or modified.",
          "nb": "Dato for siste oppdatering/endring av katalogen",
          "da": "Dato for hvornår kataloget senest er ændret eller modificeret.",
          "de": "Diese Eigenschaft enthält das aktuellste Datum an dem der Katalog geändert wurde.",
          "sv": "Datum för senaste ändring av katalogen."
        },
        "extends": "dcat:dcterms:modified"
      },
      {
        "type": "text",
        "nodetype": "DATATYPE_LITERAL",
        "id": "dcat:dcterms:modified_da",
        "extends": "dcat:dcterms:modified",
        "cardinality": {
          "min": 0,
          "pref": 0,
          "max": 1
        },
        "description": {
          "en": "This property contains the most recent date on which the Dataset was changed or modified.",
          "nb": "Dato for siste oppdatering av datasettet",
          "da": "Dato for hvornår datasættet senest er ændret eller modificeret.",
          "de": "Diese Eigenschaft enthält das aktuellste Datum an dem der Datensatz geändert wurde.",
          "sv": "Datum för senaste ändring av datamängden."
        }
      },
      {
        "type": "text",
        "nodetype": "DATATYPE_LITERAL",
        "id": "dcat:dcterms:modified_di",
        "extends": "dcat:dcterms:modified",
        "cardinality": {
          "min": 0,
          "pref": 0,
          "max": 1
        },
        "description": {
          "en": "This property contains the most recent date on which the Distribution was changed or modified.",
          "nb": "Dato for siste modifisering av distribusjonen",
          "da": "Dato for hvornår distributionen senest er ændret eller modificeret.",
          "de": "Diese Eigenschaft enthält das aktuellste Datum an dem die Distribution geändert wurde.",
          "sv": "Datum för senaste ändring av distributionen."
        }
      },
      {
        "type": "text",
        "nodetype": "URI",
        "id": "dcat:foaf:homepage_ca",
        "extends": "foaf:homepage",
        "description": {
          "en": "This property refers to a web page that acts as the main page for the Catalogue.",
          "nb": "Nettside som fungerer som hovedside for katalogen.",
          "da": "Denne attribut refererer til en hjemmeside der giver adgang til kataloget.",
          "de": "Webadresse zur Hauptseite des Kataloges.",
          "sv": "Webadress till katalogens huvudsida."
        },
        "cardinality": {
          "min": 0,
          "pref": 1,
          "max": 1
        },
        "label": {
          "en": "Homepage",
          "nb": "Hjemmeside",
          "sv": "Hemsida",
          "da": "Link til hjemmeside",
          "de": "Homepage"
        }
      },
      {
        "type": "choice",
        "nodetype": "URI",
        "id": "dcat:dcterms:spatial_ca",
        "description": {
          "en": "The geographical area covered by the catalogue. It is recommended to use URIs from Geonames in the form: http://sws.geonames.org/6695072",
          "nb": "Referanse til et geografisk område som er dekket av katalogen",
          "da": "Reference til et geografisk område som er dækket af kataloget",
          "de": "Das geographische Gebiet das durch den Katalog abgedeckt wird. Es wird empfohlen URIs von Geonames in der folgenden Form zu verwenden: http://sws.geonames.org/6695072",
          "sv": "Det geografiska området som omfattas av katalogen. Det rekommenderas att använda URI:er från Geonames i följande form: http://sws.geonames.org/6695072"
        },
        "extends": "dcat:dcterms:spatial"
      },
      {
        "type": "group",
        "nodetype": "RESOURCE",
        "id": "dcat:dcterms:license_ca",
        "extends": "dcat:dcterms:license",
        "cardinality": {
          "min": 0,
          "pref": 1,
          "max": 1
        },
        "description": {
          "en": "This property refers to the licence under which the Catalogue can be used or reused.",
          "nb": "Viser til lisens for datakatalogen som beskriver hvordan den kan viderebrukes.",
          "da": "Angiver den licens hvorunder kataloget kan anvendes og genbruges.",
          "de": "Diese Eigenschaft bezieht sich auf die Lizenz, unter der der Katalog verwendet oder wiederverwendet werden kann.",
          "sv": "Den här egenskapen hänvisar till licensen enligt vilken katalogen kan användas eller återanvändas."
        }
      },
      {
        "type": "group",
        "nodetype": "RESOURCE",
        "id": "dcat:dcterms:license_di",
        "extends": "dcat:dcterms:license",
        "cardinality": {
          "min": 0,
          "pref": 1,
          "max": 1
        },
        "description": {
          "en": "This property refers to the licence under which the Distribution is made available.",
          "nb": "Referanse til lisensen distribusjonen er gjort tilgjengelig under. Bør oppgis som URI, feks http://data.norge.no/nlod/no/1.0",
          "da": "Reference til lisencen som distributioonen er gjort tilgængelig under. Bør angives som en URI, feks http://data.danmark.dk/nlod/dk/1.0",
          "de": "Diese Eigenschaft bezieht sich auf die Lizenz unter der die Distribution zur Verfügung gestellt wird.",
          "sv": "Den här egenskapen hänvisar till licensen enligt vilken distributionen görs tillgänglig."
        }
      },
      {
        "type": "group",
        "nodetype": "RESOURCE",
        "id": "dcat:odrs:RSSA",
        "extends": "odrs:RightsStatement-short-agent",
        "cardinality": {
          "min": 0,
          "pref": 0,
          "max": 1
        },
        "property": "http://purl.org/dc/terms/rights",
        "label": {
          "en": "Rights statement",
          "nb": "Rettigheter",
          "sv": "Rättigheter",
          "da": "Rettigheder",
          "de": "Rechteerklärung"
        }
      },
      {
        "type": "group",
        "nodetype": "RESOURCE",
        "id": "dcat:odrs:RSSA_ca",
        "cardinality": {
          "min": 0,
          "pref": 0,
          "max": 1
        },
        "description": {
          "en": "This property refers to a statement that specifies rights associated with the Catalogue.",
          "nb": "Uttalelse som spesifiserer rettigheter knyttet til katalogen",
          "da": "Beskrivelse som specificerer rettighederne tilknyttet kataloget",
          "de": "Diese Eigenschaft bezieht sich auf eine Erklärung die die mit dem Katalog verknüpften Rechte angibt.",
          "sv": "Egenskapen anger förklaring för rättigheterna som är förknippade med katalogen."
        },
        "extends": "dcat:odrs:RSSA"
      },
      {
        "type": "group",
        "nodetype": "RESOURCE",
        "id": "dcat:odrs:RSSA_di",
        "cardinality": {
          "min": 0,
          "pref": 0,
          "max": 1
        },
        "description": {
          "en": "This property refers to a statement that specifies rights associated with the Distribution.",
          "nb": "Viser til en uttalelse som angir rettigheter knyttet til distribusjonen.",
          "da": "Beskrivelse som specificerer rettighederne tilknyttet distributionen.",
          "de": "Diese Eigenschaft bezieht sich auf eine Erklärung die die mit der Distribution verknüpften Rechte angibt.",
          "sv": "Egenskapen anger förklaring för rättigheterna som är förknippade med distributionen."
        },
        "extends": "dcat:odrs:RSSA"
      },
      {
        "type": "text",
        "nodetype": "DATATYPE_LITERAL",
        "id": "dcat:dcterms:issued_da",
        "description": {
          "en": "This property contains the date of formal issuance (e.g., publication) of the Dataset.",
          "nb": "Dato for den formelle utgivelsen av datasettet",
          "da": "Dato for formel udgivelse af datasættet.",
          "de": "Diese Eigenschaft enthält das Datum der Veröffentlichung des Datensatzes.",
          "sv": "Egenskapen anger datamängdens utgivningsdatum."
        },
        "cardinality": {
          "min": 0,
          "pref": 0,
          "max": 1
        },
        "extends": "dcat:dcterms:issued"
      },
      {
        "type": "text",
        "nodetype": "DATATYPE_LITERAL",
        "id": "dcat:dcterms:issued_di",
        "cardinality": {
          "min": 0,
          "pref": 0,
          "max": 1
        },
        "extends": "dcat:dcterms:issued",
        "description": {
          "en": "This property contains the date of formal issuance (e.g., publication) of the Distribution.",
          "nb": "Dato for formell utgivelse/publisering av distribusjonen",
          "da": "Dato for formel offentliggørelse af distributionen.",
          "de": "Diese Eigenschaft enthält das Datum der Veröffentlichung der Distribution.",
          "sv": "Egenskapen anger distributionens utgivningsdatum."
        }
      },
      {
        "type": "text",
        "nodetype": "URI",
        "id": "dcat:dcterms:relation_da",
        "extends": "dcterms:relation",
        "label": {
          "en": "Related resource",
          "nb": "Relasjon",
          "sv": "Relaterad resurs",
          "da": "Relateret datasæt",
          "de": "Verwandte Ressource"
        },
        "description": {
          "en": "This property refers to a related resource.",
          "nb": "Referanse til en beslektet ressurs",
          "da": "Andre datasæt som dette datasæt har relationer til.",
          "de": "Diese Eigenschaft gibt eine verwandte Ressource an.",
          "sv": "Egenskapen anger en relaterad resurs."
        },
        "pattern": "https?://.+"
      },
      {
        "type": "text",
        "id": "dcat:dcterms:title_di",
        "cardinality": {
          "min": 0,
          "pref": 0
        },
        "description": {
          "en": "This property contains a name given to the distribution. This property can be repeated for parallel language versions of the name.",
          "nb": "Navn på distribusjonen",
          "da": "Distributionens navn.",
          "de": "Der Name der Distribution. Diese Eigenschaft kann für andere Sprachversionen des Namens wiederholt werden.",
          "sv": "Distributionens namn. Denna egenskap kan upprepas för parallella språkversioner av namnet."
        },
        "nodetype": "LANGUAGE_LITERAL",
        "extends": "dcat:dcterms:title"
      },
      {
        "type": "text",
        "id": "dcat:dcterms:description_di",
        "extends": "dcat:dcterms:description",
        "styles": [
          "multiline"
        ],
        "cardinality": {
          "min": 0,
          "pref": 1
        },
        "description": {
          "en": "This property contains a free-text description of the distribution. This property can be repeated for parallel language versions of the description.",
          "nb": "Fritekstbeskrivelse av distribusjonen. Kan repeteres for parallelle språkversjoner",
          "da": "Beskrivelse af distributionen. Gentages for forskellige sprogversioner.",
          "de": "Diese Eigenschaft enthält eine Beschreibung der Distribution. Diese Eigenschaft kann für andere Sprachversionen der Beschreibung wiederholt werden.",
          "sv": "Distributionens beskrivning. Denna egenskap kan upprepas för parallella språkversioner av beskrivningen."
        }
      },
      {
        "type": "choice",
        "nodetype": "URI",
        "id": "dcat:foaf:page_da",
        "description": {
          "en": "This property refers to a page or document about this Dataset.",
          "nb": "Referanse til en side eller et dokument om dette datasettet.",
          "da": "Direkte henvisning til ekstern dokumentation af datasættet i et vilkårligt format som er tilgængeligt via internettet.",
          "de": "Diese Eigenschaft bezieht sich auf eine Seite oder ein Dokument über diesen Datensatz.",
          "sv": "En sida eller ett dokument om denna datamängd."
        },
        "extends": "dcat:foaf:page",
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "foaf:Document"
        }
      },
      {
        "type": "choice",
        "nodetype": "URI",
        "id": "dcat:foaf:page_di",
        "extends": "dcat:foaf:page",
        "description": {
          "en": "This property refers to a page or document about this Distribution.",
          "nb": "En side eller et dokument om gjeldende distribusjon",
          "da": "Direkte henvisning til ekstern dokumentation af distributionen i et vilkårligt format som er tilgængeligt via internettet.",
          "de": "Diese Eigenschaft bezieht sich auf eine Seite oder ein Dokument über diese Distribution.",
          "sv": "En sida eller ett dokument om denna distribution."
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "foaf:Document"
        }
      },
      {
        "type": "text",
        "id": "dcat:dcterms:title_ca",
        "cardinality": {
          "min": 1,
          "pref": 0
        },
        "nodetype": "LANGUAGE_LITERAL",
        "description": {
          "en": "This property contains a name given to the Catalogue. This property can be repeated for parallel language versions of the name.",
          "nb": "Inneholder navnet på katalogen. Egenskapen kan bli gjentatt for parallelle språkversjoner av navnet.",
          "da": "Katalogets formelle navn. Attributten gentages for forskellige sprogversioner.",
          "de": "Der Name des Kataloges. Diese Eigenschaft kann für andere Sprachversionen des Namens wiederholt werden.",
          "sv": "Katalogens namn. Denna egenskap kan upprepas för parallella språkversioner av namnet."
        },
        "extends": "dcat:dcterms:title"
      },
      {
        "type": "choice",
        "nodetype": "URI",
        "id": "dcat:dcterms:conformsTo_da",
        "extends": "dcat:dcterms:conformsTo",
        "description": {
          "en": "This property refers to an implementing rule or other specification.",
          "nb": "Referanse til en applikasjonsprofil som datasettets metadata er i samsvar med.",
          "da": "Reference til en etableret standard eller regler som det beskrevne datasæt overholder.",
          "de": "Diese Eigenschaft bezieht sich auf eine Implementierungsregel oder eine andere Spezifikation.",
          "sv": "Egenskapen hänvisar till en tillämpningsföreskrift eller annan specifikation."
        }
      },
      {
        "type": "choice",
        "nodetype": "URI",
        "id": "dcat:dcterms:conformsTo_di",
        "extends": "dcat:dcterms:conformsTo",
        "description": {
          "en": "This property refers to an established schema to which the described Distribution conforms.",
          "nb": "Referanse til et etablert skjema som distribusjonen er i samsvar med",
          "da": "Reference til et skema som den beskrevne distribution anvender.",
          "de": "Diese Eigenschaft bezieht sich auf ein etabliertes Schema dem die beschriebene Distribution entspricht.",
          "sv": "Egenskapen hänvisar till ett etablerat schema som den beskrivna distribution använder."
        },
        "label": {
          "en": "Linked schemas",
          "de": "Verknüpfte Schemata",
          "sv": "Länkade scheman"
        }
      },
      {
        "type": "choice",
        "nodetype": "URI",
        "id": "dcat:dcterms:language_di",
        "extends": "dcat:dcterms:language",
        "cardinality": {
          "min": 0,
          "pref": 0
        },
        "description": {
          "en": "This property refers to a language used in the Distribution. This property can be repeated if the metadata is provided in multiple languages.",
          "nb": "Referanse til språket som distribusjon er på. Kan repeteres dersom det er flere språk i distribusjon",
          "da": "Sprog der er brugt i distributionen. Gentages for forskellige sprogversioner.",
          "de": "Diese Eigenschaft bezieht sich auf eine Sprache der Distribution. Diese Eigenschaft kann wiederholt werden wenn mehrere Sprachen in der Distribution vorhanden sind.",
          "sv": "Egenskapen hänvisar till distributionens språk. Egenskapen kan upprepas om det finns flera språk i distributionen."
        }
      },
      {
        "type": "choice",
        "nodetype": "RESOURCE",
        "id": "adms:contactPoint-choice_da",
        "extends": "dcat:contactPoint-choice_da",
        "styles": [
          "strictmatch",
          "deprecated"
        ],
        "property": "http://www.w3.org/ns/adms#contactPoint"
      },
      {
        "type": "text",
        "nodetype": "ONLY_LITERAL",
        "id": "dcat:adms:version",
        "extends": "dcat:owl:versionInfo_da",
        "styles": [
          "strictmatch",
          "deprecated"
        ]
      },
      {
        "type": "choice",
        "nodetype": "URI",
        "id": "dcat:themeTaxonomy_ca_deprecated",
        "extends": "dcat:themeTaxonomy_ca",
        "choices": [
          {
            "value": "http://eurovoc.europa.eu/domains",
            "label": {
              "en": "Eurovoc"
            }
          }
        ],
        "styles": [
          "strictmatch",
          "deprecated"
        ]
      },
      {
        "type": "text",
        "nodetype": "LANGUAGE_LITERAL",
        "id": "dcat:dcterms:provenance_da",
        "property": "http://purl.org/dc/terms/provenance",
        "label": {
          "en": "Provenance",
          "sv": "Ursprung",
          "da": "Proveniens",
          "de": "Herkunft"
        },
        "description": {
          "en": "This property contains a statement about the lineage of a Dataset.",
          "da": "Fritekst beskrivelse af et datasæts stamtræ.",
          "de": "Diese Eigenschaft enthält eine Aussage über die Abstammung eines Datensatzes.",
          "sv": "Egenskapen innehåller ett uttalande om härstamningen av en datamängd."
        },
        "styles": [
          "multiline"
        ]
      },
      {
        "type": "choice",
        "id": "dcat:documentType",
        "property": "rdf:type",
        "nodetype": "URI",
        "label": {
          "sv": "Dokumenttyp",
          "en": "Document type",
          "de": "Art des Dokuments"
        },
        "cardinality": {
          "min": 1
        },
        "choices": [
          {
            "value": "foaf:Document",
            "label": {
              "en": "Documentation",
              "sv": "Dokumentation",
              "de": "Dokumentation"
            }
          },
          {
            "value": "dcterms:LicenseDocument",
            "label": {
              "en": "License",
              "sv": "Licens",
              "de": "Lizenz"
            }
          },
          {
            "value": "dcterms:Standard",
            "label": {
              "en": "Standard/Recommendation/Specification",
              "sv": "Standard/rekommendation/specifikation",
              "de": "Standard/Empfehlung/Spezifikation"
            }
          }
        ]
      }
    ]
  },
  {
    "templates": [
      {
        "type": "group",
        "id": "dcat:OnlyDataset",
        "label": {
          "en": "Dataset",
          "sv": "Dataset",
          "de": "Datensatz"
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.w3.org/ns/dcat#Dataset"
        },
        "items": [
          {
            "id": "dcat:dcterms:title_da"
          },
          {
            "id": "dcat:dcterms:description_da"
          },
          {
            "id": "dcat:foaf:Agent_da"
          },
          {
            "id": "adms:contactPoint-choice_da"
          },
          {
            "id": "dcat:contactPoint-choice_da"
          },
          {
            "id": "dcat:keyword_da"
          },
          {
            "id": "dcat:theme-da"
          },
          {
            "id": "dcat:dcterms:identifier_da"
          },
          {
            "id": "dcat:adms:identifier_da"
          },
          {
            "id": "dcat:dcterms:issued_da"
          },
          {
            "id": "dcat:dcterms:modified_da"
          },
          {
            "id": "dcat:dcterms:language_da"
          },
          {
            "id": "dcat:landingPage_da"
          },
          {
            "id": "dcat:dcterms:conformsTo_da"
          },
          {
            "id": "dcat:dcterms:spatial_da"
          },
          {
            "id": "dcat:dcterms:spatial_bb_da"
          },
          {
            "id": "dcat:dcterms:temporal_da"
          },
          {
            "id": "dcat:dcterms:accrualPeriodicity-cld_da"
          },
          {
            "id": "dcat:dcterms:accrualPeriodicity_da"
          },
          {
            "id": "dcat:adms:version"
          },
          {
            "id": "dcat:owl:versionInfo_da"
          },
          {
            "id": "dcat:adms:versionNotes_da"
          },
          {
            "id": "dcat:dcterms:source_da"
          },
          {
            "id": "dcat:dcterms:accessRights_da"
          },
          {
            "id": "dcat:hasVersion_da"
          },
          {
            "id": "dcat:isVersionOf_da"
          },
          {
            "id": "dcat:dcterms:relation_da"
          },
          {
            "id": "dcat:foaf:page_da"
          },
          {
            "id": "dcat:dcterms:provenance_da"
          }
        ]
      },
      {
        "type": "group",
        "id": "dcat:OnlyDistribution",
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.w3.org/ns/dcat#Distribution"
        },
        "label": {},
        "items": [
          {
            "id": "dcat:dcterms:title_di"
          },
          {
            "id": "dcat:dcterms:description_di"
          },
          {
            "id": "dcat:accessURL_di"
          },
          {
            "id": "dcat:downloadURL_di"
          },
          {
            "id": "dcat:format-group_di"
          },
          {
            "id": "dcat:byteSize_di"
          },
          {
            "id": "dcat:dcterms:language_di"
          },
          {
            "id": "dcat:dcterms:issued_di"
          },
          {
            "id": "dcat:dcterms:modified_di"
          },
          {
            "id": "dcat:adms:status_di"
          },
          {
            "id": "dcat:dcterms:license_di"
          },
          {
            "id": "dcat:odrs:RSSA_di"
          },
          {
            "id": "dcat:spdx:checksum_di"
          },
          {
            "id": "dcat:foaf:page_di"
          },
          {
            "id": "dcat:dcterms:conformsTo_di"
          }
        ],
        "cardinality": {
          "min": 0,
          "pref": 0
        },
        "description": {},
        "nodetype": "URI"
      },
      {
        "type": "group",
        "nodetype": "RESOURCE",
        "id": "dcat:OnlyCatalog",
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.w3.org/ns/dcat#Catalog"
        },
        "items": [
          {
            "id": "dcat:dcterms:title_ca"
          },
          {
            "id": "dcat:dcterms:description_ca"
          },
          {
            "id": "dcat:foaf:Agent_ca"
          },
          {
            "id": "dcat:dcterms:issued_ca"
          },
          {
            "id": "dcat:dcterms:language_ca"
          },
          {
            "id": "dcat:dcterms:modified_ca"
          },
          {
            "id": "dcat:foaf:homepage_ca"
          },
          {
            "id": "dcat:dcterms:spatial_ca"
          },
          {
            "id": "dcat:dcterms:license_ca"
          },
          {
            "id": "dcat:odrs:RSSA_ca"
          },
          {
            "id": "dcat:dcterms:hasPart_ca"
          },
          {
            "id": "dcat:dcterms:isPartOf_ca"
          },
          {
            "id": "dcat:themeTaxonomy_ca_deprecated"
          },
          {
            "id": "dcat:themeTaxonomy_ca"
          }
        ]
      },
      {
        "type": "group",
        "nodetype": "RESOURCE",
        "id": "dcat:Documentish",
        "styles": [
          "showLink"
        ],
        "items": [
          "dcat:documentType",
          {
            "extends": "dcat:dcterms:title",
            "cardinality": {
              "min": 1
            }
          },
          {
            "cardinality": {
              "min": 0,
              "pref": 1
            },
            "extends": "dcat:dcterms:description"
          }
        ]
      }
    ]
  },
  {
    "templates": [
      {
        "type": "group",
        "nodetype": "RESOURCE",
        "id": "esc:Group",
        "label": {
          "en": "Group",
          "sv": "Grupp",
          "de": "Gruppe"
        },
        "items": [
          {
            "type": "text",
            "nodetype": "LITERAL",
            "extends": "foaf:name",
            "cardinality": {
              "min": 1,
              "pref": 0
            }
          },
          {
            "type": "text",
            "nodetype": "URI",
            "extends": "foaf:homepage",
            "cardinality": {
              "min": 0,
              "pref": 0
            }
          }
        ]
      },
      {
        "type": "group",
        "nodetype": "RESOURCE",
        "id": "esc:User",
        "label": {
          "en": "User",
          "sv": "Användare",
          "de": "Benutzer"
        },
        "items": [
          {
            "type": "text",
            "nodetype": "LITERAL",
            "extends": "foaf:givenName",
            "cardinality": {
              "min": 1,
              "pref": 0
            }
          },
          {
            "type": "text",
            "nodetype": "LITERAL",
            "extends": "foaf:familyName",
            "cardinality": {
              "min": 1,
              "pref": 0
            }
          },
          {
            "type": "text",
            "nodetype": "LITERAL",
            "extends": "foaf:mbox"
          }
        ]
      },
      {
        "type": "group",
        "nodetype": "RESOURCE",
        "id": "esc:Context",
        "label": {
          "en": "Project",
          "sv": "Projekt",
          "de": "Projekt"
        },
        "items": [
          {
            "type": "text",
            "nodetype": "LANGUAGE_LITERAL",
            "extends": "dcterms:title",
            "cardinality": {
              "min": 1,
              "pref": 0
            }
          },
          {
            "type": "text",
            "nodetype": "LANGUAGE_LITERAL",
            "extends": "dcterms:description",
            "cardinality": {
              "min": 0,
              "pref": 1
            }
          },
          {
            "type": "text",
            "extends": "dcterms:identifier",
            "cardinality": {
              "min": 0,
              "pref": 0
            }
          }
        ]
      },
      {
        "type": "group",
        "nodetype": "RESOURCE",
        "id": "esc:DatasetCandidate",
        "items": [
          {
            "extends": "dcterms:title",
            "cardinality": {
              "min": 1
            }
          },
          {
            "extends": "dcterms:description",
            "cardinality": {
              "min": 0,
              "pref": 1
            }
          }
        ]
      },
      {
        "type": "group",
        "id": "esc:Results",
        "label": {
          "en": "Results",
          "sv": "Resultat",
          "de": "Ergebnisse"
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://entryscape.com/terms/#Result"
        },
        "items": [
          {
            "id": "results:dcterms:title"
          },
          {
            "id": "results:dcterms:description"
          },
          {
            "id": "results:dataset:source"
          },
          {
            "id": "results:foaf:page"
          },
          {
            "id": "results:dcterms:created"
          },
          {
            "id": "results:foaf:Agent"
          }
        ]
      },
      {
        "id": "results:dataset:source",
        "property": "http://purl.org/dc/terms/source",
        "label": {
          "en": "Dataset",
          "sv": "Datamängd",
          "da": "Datasæt",
          "nb": "Datasett",
          "de": "Datensatz"
        },
        "description": {
          "en": "This dataset was used to produce the result."
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.w3.org/ns/dcat#Dataset"
        },
        "type": "choice",
        "nodetype": "RESOURCE",
        "cardinality": {
          "min": 1,
          "pref": 1
        }
      },
      {
        "type": "text",
        "id": "results:dcterms:title",
        "extends": "dcterms:title",
        "cardinality": {
          "min": 1,
          "pref": 0
        },
        "description": {
          "en": "This property contains a name given to the result. This property can be repeated for parallel language versions of the name."
        },
        "nodetype": "LANGUAGE_LITERAL",
        "label": {
          "sv": "Titel",
          "en": "Title",
          "no": "Tittel",
          "de": "Titel"
        }
      },
      {
        "type": "text",
        "id": "results:dcterms:description",
        "extends": "dcterms:description",
        "styles": [
          "multiline"
        ],
        "cardinality": {
          "min": 1,
          "pref": 0
        },
        "description": {
          "en": "This property contains a free-text description of the reuslt. This property can be repeated for parallel language versions of the description."
        },
        "label": {
          "no": "Beskrivelse",
          "sv": "Beskrivning",
          "en": "Description",
          "de": "Beschreibung"
        }
      },
      {
        "type": "choice",
        "nodetype": "URI",
        "id": "results:foaf:Agent",
        "labelProperties": [
          "http://xmlns.com/foaf/0.1/name",
          [
            "http://xmlns.com/foaf/0.1/givenName",
            "http://xmlns.com/foaf/0.1/familyName"
          ]
        ],
        "property": "http://purl.org/dc/terms/contributor",
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": [
            "http://xmlns.com/foaf/0.1/Agent",
            "http://xmlns.com/foaf/0.1/Person",
            "http://xmlns.com/foaf/0.1/Organization"
          ]
        },
        "label": {
          "en": "Contributor",
          "sv": "Medverkande",
          "da": "Medvirkende",
          "de": "Mitwirkender"
        },
        "description": {
          "en": "This property refers to an entity (organisation) responsible for making the result available."
        },
        "cardinality": {
          "min": 0,
          "pref": 1,
          "max": 1
        }
      },
      {
        "id": "results:foaf:page",
        "property": "http://xmlns.com/foaf/0.1/page",
        "label": {
          "en": "Web page",
          "sv": "Webbsida",
          "da": "Hjemmeside",
          "nb": "Nettside",
          "de": "Webseite"
        },
        "description": {
          "en": "A page or document about this result."
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://xmlns.com/foaf/0.1/Document"
        },
        "type": "text",
        "nodetype": "URI",
        "cardinality": {
          "pref": 1
        },
        "styles": [
          "externalLink"
        ],
        "pattern": "https?://.+"
      },
      {
        "id": "results:dcterms:created",
        "extends": "dcterms:created",
        "type": "text"
      },
      {
        "type": "group",
        "nodetype": "RESOURCE",
        "id": "skosmos:labels",
        "label": {
          "en": "Labels",
          "sv": "Termer",
          "de": "Namen"
        },
        "items": [
          {
            "type": "text",
            "nodetype": "PLAIN_LITERAL",
            "extends": "skos:prefLabel",
            "cardinality": {
              "min": 0,
              "pref": 1
            }
          },
          {
            "type": "text",
            "nodetype": "PLAIN_LITERAL",
            "extends": "skos:altLabel"
          },
          {
            "type": "text",
            "nodetype": "PLAIN_LITERAL",
            "extends": "skos:hiddenLabel"
          }
        ],
        "styles": [
          "heading"
        ]
      },
      {
        "type": "group",
        "nodetype": "RESOURCE",
        "id": "skosmos:concept",
        "items": [
          {
            "id": "skos:conceptLabels"
          },
          {
            "id": "skos:conceptDocumentation"
          },
          {
            "id": "skosmos:relations"
          },
          {
            "id": "skos:conceptMappings"
          }
        ],
        "label": {
          "en": "Concept",
          "sv": "Begrepp",
          "de": "Begriff"
        }
      },
      {
        "type": "group",
        "nodetype": "RESOURCE",
        "id": "skosmos:relations",
        "items": [
          {
            "extends": "skos:related",
            "cardinality": {
              "pref": 1
            }
          },
          {
            "type": "choice",
            "nodetype": "URI",
            "extends": "skos:broader",
            "styles": [
              "nonEditable"
            ]
          },
          {
            "type": "choice",
            "nodetype": "URI",
            "extends": "skos:broaderTransitive",
            "styles": [
              "nonEditable"
            ]
          },
          {
            "type": "choice",
            "nodetype": "URI",
            "extends": "skos:narrower",
            "styles": [
              "nonEditable"
            ]
          },
          {
            "type": "choice",
            "nodetype": "URI",
            "extends": "skos:narrowerTransitive",
            "styles": [
              "nonEditable"
            ]
          },
          {
            "type": "choice",
            "nodetype": "URI",
            "extends": "skos:inScheme",
            "styles": [
              "nonEditable"
            ]
          },
          {
            "type": "choice",
            "nodetype": "URI",
            "extends": "skos:topConceptOf",
            "styles": [
              "nonEditable"
            ]
          }
        ],
        "label": {
          "en": "Relations",
          "sv": "Relationer",
          "de": "Beziehungen"
        },
        "styles": [
          "heading"
        ]
      },
      {
        "type": "group",
        "nodetype": "RESOURCE",
        "id": "skosmos:conceptScheme",
        "label": {
          "en": "Concept scheme",
          "sv": "Begreppsmodell",
          "de": "Begriffsmodell"
        },
        "items": [
          {
            "extends": "dcterms:title",
            "cardinality": {
              "min": 1
            }
          },
          {
            "extends": "dcterms:description",
            "cardinality": {
              "pref": 1
            }
          }
        ]
      },
      {
        "type": "group",
        "id": "esc:Ideas",
        "label": {
          "en": "Ideas",
          "sv": "Ideas",
          "de": "Ideas"
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://entryscape.com/terms/#Idea"
        },
        "items": [
          {
            "id": "ideas:dcterms:title"
          },
          {
            "id": "ideas:dcterms:description"
          },
          {
            "id": "ideas:dataset:source"
          },
          {
            "id": "ideas:foaf:page"
          },
          {
            "id": "ideas:dcterms:created"
          },
          {
            "id": "ideas:foaf:Agent"
          }
        ]
      },
      {
        "id": "ideas:dataset:source",
        "property": "http://purl.org/dc/terms/source",
        "label": {
          "en": "Dataset",
          "sv": "Datamängd",
          "da": "Datasæt",
          "nb": "Datasett",
          "de": "Datensatz"
        },
        "description": {
          "en": "This dataset was used to produce the idea."
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.w3.org/ns/dcat#Dataset"
        },
        "type": "choice",
        "nodetype": "RESOURCE",
        "cardinality": {
          "min": 0,
          "pref": 1
        }
      },
      {
        "type": "text",
        "id": "ideas:dcterms:title",
        "extends": "dcterms:title",
        "cardinality": {
          "min": 1,
          "pref": 0
        },
        "description": {
          "en": "This property contains a name given to the idea. This property can be repeated for parallel language versions of the name."
        },
        "nodetype": "LANGUAGE_LITERAL",
        "label": {
          "sv": "Titel",
          "en": "Title",
          "no": "Tittel",
          "de": "Titel"
        }
      },
      {
        "type": "text",
        "id": "ideas:dcterms:description",
        "extends": "dcterms:description",
        "styles": [
          "multiline"
        ],
        "cardinality": {
          "min": 1,
          "pref": 0
        },
        "description": {
          "en": "This property contains a free-text description of the reuslt. This property can be repeated for parallel language versions of the description."
        },
        "label": {
          "no": "Beskrivelse",
          "sv": "Beskrivning",
          "en": "Description",
          "de": "Beschreibung"
        }
      },
      {
        "type": "choice",
        "nodetype": "URI",
        "id": "ideas:foaf:Agent",
        "labelProperties": [
          "http://xmlns.com/foaf/0.1/name",
          [
            "http://xmlns.com/foaf/0.1/givenName",
            "http://xmlns.com/foaf/0.1/familyName"
          ]
        ],
        "property": "http://purl.org/dc/terms/contributor",
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": [
            "http://xmlns.com/foaf/0.1/Agent",
            "http://xmlns.com/foaf/0.1/Person",
            "http://xmlns.com/foaf/0.1/Organization"
          ]
        },
        "label": {
          "en": "Contributor",
          "sv": "Medverkande",
          "da": "Medvirkende",
          "de": "Mitwirkender"
        },
        "description": {
          "en": "This property refers to an entity (organisation) responsible for making the idea available."
        },
        "cardinality": {
          "min": 0,
          "pref": 1,
          "max": 1
        }
      },
      {
        "id": "ideas:foaf:page",
        "property": "http://xmlns.com/foaf/0.1/page",
        "label": {
          "en": "Web page",
          "sv": "Webbsida",
          "da": "Hjemmeside",
          "nb": "Nettside",
          "de": "Webseite"
        },
        "description": {
          "en": "A page or document about this idea."
        },
        "constraints": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://xmlns.com/foaf/0.1/Document"
        },
        "type": "text",
        "nodetype": "URI",
        "cardinality": {
          "pref": 1
        },
        "styles": [
          "externalLink"
        ],
        "pattern": "https?://.+"
      },
      {
        "id": "ideas:dcterms:created",
        "extends": "dcterms:created",
        "type": "text"
      }
    ]
  },
]
