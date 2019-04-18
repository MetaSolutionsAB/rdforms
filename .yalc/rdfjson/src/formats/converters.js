import xmldom from 'xmldom';
import Graph from '../Graph';
import ns from '../namespaces';
import util from './rdfjson/util';
import Rdfparser from './rdfxml/Rdfparser';
import { RDFBlankNode, RDFFormula, RDFLiteral, RDFSymbol } from './rdfxml/terms';

const sp = '  ';
const sp2 = '    ';

let xml2string;
let string2xml;

if (typeof window !== 'undefined' && (typeof window.DOMParser !== 'undefined' || typeof ActiveXObject !== 'undefined')) { // In browser
  xml2string = xml => xml.xml;

  string2xml = (text) => {
    let doc;
    try {
      if (window.DOMParser) {
        const parser = new DOMParser();
        doc = parser.parseFromString(text, 'text/xml');
      } else { // Internet Explorer
        doc = new ActiveXObject('Microsoft.XMLDOM');
        doc.async = 'false';
        doc.loadXML(text);
      }
    } catch (e) {
      doc = null;
    }
    if (!doc || !doc.documentElement || doc.getElementsByTagName('parsererror').length) {
      throw new Error('Could not parse text as xml');
    }

    return doc;
  };
} else { // Not in browser
         // Non-browser environment, requires the XMLSerializer and xmldom libraries.
  xml2string = xml => new XMLSerializer().serializeToString(xml);

  const DOMParser = xmldom.DOMParser;
  string2xml = text => new DOMParser().parseFromString(text, 'text/xml');
}

const throwIfRelative = (url) => {
  // Removed test for \ temporary
  if (/["<>^`{|}]/i.test(url)) {
    throw Error({
      message: `URL "${url}" is not allowed to contain special characters " < > \\ ^ \` { | or }.`,
      character: true,
    });
  }

  // if (/ /i.test(url)) {
  // throw {message: `Spaces inside of URL not supported: ${url}`, space: true};
  // }
  if (!/^(?:[a-z][a-z0-9+.-]*:)/i.test(url)) {
    throw Error({ message: `Relative URL not supported: ${url}`, relative: true });
  }
  if (/ /i.test(url)) {
    if (exports.convertSpacesInURIs) {
      return url.replace(/ /g, '%20');
    }
    throw Error({ message: `Spaces inside of URL not supported: ${url}`, space: true });
  }
  return url;
};
/**
 *
 * Imports RDF/XML into a Graph
 *
 * @param {Node|String} xml this is the XML document or XML string from where the RDF will
 * be parsed.
 * @param {rdfjson.Graph|null} graph Where all tripples will be added, if null a new graph
 * will be created.
 * @returns {rdfjson.Graph} where all found tripples have been added.
 */
const rdfxml2graph = (xml, graph = null) => {
  let _xml = xml;
  if (util.isString(_xml)) {
    _xml = string2xml(_xml);
  }
  /**
   * @type {rdfjson.Graph}
   */
  const g = graph || new Graph({});
  const store = new RDFFormula();
  store.add = (s, p, o) => {
    let subj;
    let pred;
    const obj = {};
    // Subject
    if (s instanceof RDFBlankNode) {
      subj = s.toString();
      g.registerBNode(subj);
    } else {
      s.uri = throwIfRelative(s.uri);
      subj = s.uri;
    }

    // Predicate
    if (p instanceof RDFBlankNode) {
      pred = p.toString();
      g.registerBNode(pred);
    } else {
      p.uri = throwIfRelative(p.uri);
      pred = p.uri;
    }

    // Object
    if (o instanceof RDFLiteral) {
      obj.type = 'literal';
      obj.value = o.value;
      if (o.lang) {
        obj.lang = o.lang;
      }
      if (o.datatype) {
        obj.datatype = o.datatype.uri;
      }
    } else if (o instanceof RDFSymbol) {
      o.uri = throwIfRelative(o.uri);
      obj.type = 'uri';
      obj.value = o.uri;
    } else if (o instanceof RDFBlankNode) {
      obj.value = o.toString();
      g.registerBNode(obj.value);
      obj.type = 'bnode';
    }
    g.create(subj, pred, obj, true);
  };
  const parser = new Rdfparser(store);
  parser.parse(_xml, '', '');
  return g;
};

const xmlEncode = url => encodeURI(decodeURI(url)).replace(/&/g, '&amp;');

const rdfjson2rdfxml = (graph) => {
  const g = graph instanceof Graph ? graph._graph : graph || {};
  const nsUsed = [];
  const nsAdded = {};
  const nsify = function (prop) {
    const _o = ns.nsify(prop);
    if (!nsAdded[_o.abbrev]) {
      nsUsed.push(_o.abbrev);
      nsAdded[_o.abbrev] = _o.ns;
    }
    return _o.pretty;
  };

  const strs = [];
  Object.keys(g).forEach((s) => {
    if (s.substr(0, 2) === '_:') {
      strs.push(`${sp}<rdf:Description rdf:nodeID="_${s.substring(2)}">\n`);
    } else {
      strs.push(`${sp}<rdf:Description rdf:about="${xmlEncode(s)}">\n`);
    }
    const props = g[s];
    Object.keys(props).forEach((p) => {
      const nsp = nsify(p);
      props[p].forEach((o) => {
        let v;
        switch (o.type) {
          case 'literal':
            v = o.value.replace('&', '&amp;').replace('<', '&lt;');
            if (o.lang != null) {
              strs.push(`${sp2}<${nsp} xml:lang="${o.lang}">${v}</${nsp}>\n`);
            } else if (o.datatype != null) {
              strs.push(`${sp2}<${nsp} rdf:datatype="${o.datatype}">${v}</${nsp}>\n`);
            } else {
              strs.push(`${sp2}<${nsp}>${v}</${nsp}>\n`);
            }
            break;
          case 'uri':
            strs.push(`${sp2}<${nsp} rdf:resource="${xmlEncode(o.value)}"/>\n`);
            break;
          case 'bnode':
            if (o.value.substr(0, 2) === '_:') {
              strs.push(`${sp2}<${nsp} rdf:nodeID="_${o.value.substring(2)}"/>\n`);
            } else {
              strs.push(`${sp2}<${nsp} rdf:nodeID="${o.value}"/>\n`);
            }
            break;
          default:
        }
      });
    });
    strs.push(`${sp}</rdf:Description>\n`);
  });
  const initialStrs = ['<?xml version="1.0"?>\n<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"'];
  for (let j = 0; j < nsUsed.length; j++) {
    if (nsUsed[j] !== 'rdf') {
      initialStrs.push(`\n\txmlns:${nsUsed[j]}="${nsAdded[nsUsed[j]]}"`);
    }
  }
  initialStrs.push('>\n');
  strs.unshift(initialStrs.join(''));
  strs.push('</rdf:RDF>');
  return strs.join('');
};

/**
 * Detects RDF as a string in the RDF/XML, as an instance of Graph or as a object literal
 * corresponding to a RDF/JSON structure.
 * Limitation: Parse JSON strings into object literals if the JSON.parse is available in the
 * environment.
 *
 * @param {string|object} rdf in RDF/XML, RDF/JSON or a object literal corresponding to already
 * parsed RDF/JSON.
 * @returns {Object} a report with the attributes: graph, format and potentially an error.
 */
const detect = (rdf) => {
  const report = {};
  if (typeof rdf === 'string') {
    const taste = rdf.substr(0, 200);
    if (taste.toLowerCase().indexOf('<rdf:rdf') !== -1) {
      report.format = 'rdf/xml';
      try {
        report.graph = rdfxml2graph(rdf);
      } catch (e) {
        if (e.relative || e.space || e.character) {
          report.error = e.message;
          report.errorCode = 1;
        } else {
          report.error = 'Invalid rdf/xml';
          report.errorCode = 2;
        }
      }
    } else if (rdf.substring(0, 2) === '{"') {
      report.format = 'rdf/json';
      try {
        const jsonrdf = JSON.parse(this.rdfjson);
        report.graph = new Graph(jsonrdf);
      } catch (e) {
        report.error = 'Invalid json.';
        report.errorCode = 3;
      }
    } else {
      report.error = 'No RDF detected.';
      report.errorCode = 4;
    }
  } else if (rdf instanceof Graph) {
    report.format = 'rdf/json';
    report.graph = rdf;
  } else if (typeof rdf === 'object') {
    report.format = 'rdf/json';
    report.graph = new Graph(rdf);
  } else {
    report.error = 'unknown format';
    report.errorCode = 5;
  }
  if (!report.error) {
    const r = report.graph.validate();
    if (!r.valid) {
      report.error = 'RDF/JSON is not valid.';
      report.errorCode = 6;
    }
  }
  return report;
};

export default {
  xml2string,
  string2xml,
  rdfxml2graph,
  rdfjson2rdfxml,
  detect,
};
