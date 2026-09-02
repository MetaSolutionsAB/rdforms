// Default label predicates, ordered by preference, used to derive a human
// label for a resource. Kept in its own module so both model/system.js and
// utils.js can use it without importing each other (avoids a circular
// dependency). system.js re-exports it as `system.labelProperties`.
export default [
  'http://www.w3.org/2000/01/rdf-schema#label',
  'http://purl.org/dc/terms/title',
  'http://purl.org/dc/elements/1.1/title',
  'http://www.w3.org/2004/02/skos/core#prefLabel',
  'http://xmlns.com/foaf/0.1/name',
  'http://xmlns.com/foaf/name',
];
