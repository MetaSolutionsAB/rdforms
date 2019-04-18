const nss = {
  ical: 'http://www.w3.org/2002/12/cal/ical#',
  vcard: 'http://www.w3.org/2006/vcard/ns#',
  dcterms: 'http://purl.org/dc/terms/',
  skos: 'http://www.w3.org/2004/02/skos/core#',
  rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
  rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
  owl: 'http://www.w3.org/2002/07/owl#',
  vs: 'http://www.w3.org/2003/06/sw-vocab-status/ns#',
  foaf: 'http://xmlns.com/foaf/0.1/',
  wot: 'http://xmlns.com/wot/0.1/',
  dc: 'http://purl.org/dc/elements/1.1/',
  xsd: 'http://www.w3.org/2001/XMLSchema#',
  dcat: 'http://www.w3.org/ns/dcat#',
  org: 'http://www.w3.org/ns/org#',
  gn: 'http://www.geonames.org/ontology#',
  locn: 'http://www.w3.org/ns/locn#',
  schema: 'http://schema.org/',
  ex: 'http://example.com/',
  gsp: 'http://www.opengis.net/ont/geosparql#',
  odrs: 'http://schema.theodi.org/odrs#',
};
let nscounter = 0;
const _nsify = (ns, expanded, localname) => {
  if (!nss[ns]) {
    nss[ns] = expanded;
  }
  return {
    abbrev: ns,
    ns: expanded,
    localname,
    full: expanded + localname,
    pretty: `${ns}:${localname}`,
  };
};

/**
 * Returns an object that contain the following attributes:
 *
 * abbrev - the short namespace
 * ns - what the short namespace abbreviates
 * localname - the localname of the URI, given the current namespace
 * full - the original URI
 * pretty - the shortened version of the URI using the abbreviation, e.g. foaf:name
 *
 * @param uri
 * @return {{abbrev, ns, localname, full, pretty}}
 */
const nsify = (uri) => {
  const ens = Object.keys(nss).find(ns => uri.indexOf(nss[ns]) === 0);
  if (ens) {
    return _nsify(ens, nss[ens], uri.substring(nss[ens].length));
  }

  let slash = uri.lastIndexOf('/');
  const hash = uri.lastIndexOf('#');
  if (hash > slash) {
    slash = hash;
  }
  nscounter += 1;
  return _nsify(`ns${nscounter}`, uri.substring(0, slash + 1), uri.substring(slash + 1));
};

/**
 * Only abbreviates a URI if it can be matched to one of the already registered namespaces.
 *
 * @param {string} uri for example: http://xmlns.com/foaf/0.1/name
 * @return {string} in the form "foaf:name"
 */
const shortenKnown = (uri) => {
  const ens = Object.keys(nss).find(ns => uri.indexOf(nss[ns]) === 0);
  if (ens) {
    return _nsify(ens, nss[ens], uri.substring(nss[ens].length)).pretty;
  }
  return uri;
};

/**
 * Abbreviates all uris, if no matching namespace is found a suitable one is generated and
 * registered automatically.
 *
 * @param {string} uri for example: http://xmlns.com/foaf/0.1/name
 * @return {string} in the form "foaf:name" or "ns1:name" if foaf would not be registered already.
 */
const shorten = uri => nsify(uri).pretty;

/**
 * Expands an abbreviated URI from the list of registered namespaces.
 *
 * @param {string} nsuri a namespaced uri like "foaf:name"
 * @return {string} a full URI like "http://xmlns.com/foaf/0.1/name"
 */
const expand = (nsuri) => {
  const arr = nsuri.split(':');
  if (arr.length === 2 && nss.hasOwnProperty(arr[0])) {
    return nss[arr[0]] + arr[1];
  }
  return nsuri;
};

/**
 * Registers a namespace, both the abbreviation and its expansion.
 *
 * @param {string} ns the abbreviation, e.g. "foaf"
 * @param {string} full the expansion for the abbreviation, e.g. "http://xmlns.com/foaf/0.1/name"
 */
const add = (ns, full) => {
  if (typeof ns === 'string') {
    nss[ns] = full;
  } else if (typeof ns === 'object') {
    Object.keys(ns).forEach((nskey) => {
      nss[nskey] = ns[nskey];
    });
  }
};

/**
 * Provides access to the currently registered namespaces as an object with abbreviations as
 * keys and their expansions as the values.
 *
 * @return {object}
 */
const registry = () => nss;

export default {
    nsify,
    shortenKnown,
    shorten,
    expand,
    add,
    registry,
};
