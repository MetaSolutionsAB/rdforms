import Graph from './Graph';
import ns from './namespaces';
import md5 from 'md5';

/**
 * Copies over a subset of statements from one metadata graph to another.
 * The statements copied are those with the provided uri in subject position, or
 * statements reachable via intermediate blank nodes from that uri.
 * Statements are not copied over if the predicate is listed in the ignore array,
 * unless the excludeAfterIgnore is specified in which case the triple is included
 * but no further triples reachable via the object.
 *
 * @param {rdfjson/Graph} inGraph graph which holds rdf data in graph format
 * @param {string} uri a starting point to find all statements to include
 * @param {object=} ignore is an object with predicates as attributes,
 * which are to be ignored (excluded)
 * @param {rdfjson/Graph=} outGraph optional graph which will hold copied statements,
 *  if no outGraph is provided a new will be created.
 * @return {rdfjson/Graph} same as the provided outGraph
 */
const extract = (inGraph, outGraph, uri, ignore, excludeAfterIgnore) => {
  const _outGraph = outGraph || new Graph();
  const _ignore = ignore || {};
  inGraph.find(uri, null, null).forEach((stmt) => {
    if (!_ignore[stmt.getPredicate()]) {
      outGraph.add(stmt);
      if (stmt.getType() === 'bnode') {
        extract(inGraph, outGraph, stmt.getValue(), _ignore);
      }
    } else if (excludeAfterIgnore) {
      outGraph.add(stmt);
    }
  });
  return outGraph;
};

/**
 * Removes an entire subgraph from a given graph.
 * The subgraph is calculated by traversing triples in the forward direction
 * from a starting resource. A triple is included in the subgraph if it can be reached
 * via a path of triples from the starting resource that only passes triples that have
 * blank nodes in object position. The triples in the path may not include predicates
 * in the ignore list except the last triple in the path.
 *
 * @param {rdfjson/Graph} graph the graph to remove triples from
 * @param {string} uri the starting resource to calculate the subgraph from
 * @param {object} ignore an hash of predicates (with the boolean true as value)
 * to ignore when calculating the subgraph to remove, see explanation above.
 */
const remove = (graph, uri, ignore) => {
  const _ignore = ignore || {};
  graph.find(uri, null, null).forEach((stmt) => {
    graph.remove(stmt);
    if (!_ignore[stmt.getPredicate()]) {
      if (stmt.getType() === 'bnode') {
        remove(graph, stmt.getValue(), _ignore);
      }
    }
  });
};

/**
 * Creates a fingerprint of a graph by including all statements' subjects, predicates
 * and objects but excluding blank nodes wherever they occur. The result is sorted and a
 * md5-sum is calculated.
 *
 * Two isomorphic graphs will always have the same fingerprint, i.e. graphs that are similar
 * when disregarding names of blank nodes.
 *
 * Unfortunately, there are false positivies, i.e. two graphs may under certain circumstances
 * have the same fingerprint despite the fact that they are not isomorphic.
 * There are two situations when this can occur:
 *
 * Md5 collisions: Due to the way md5 works there are situations when two different
 * inputs can generate the same sum. However, this is very unlikely to happen for regular RDF
 * graphs.
 *
 * Algorithm deficiencies: If the graph has blank nodes that are connected to each other,
 * the fingerprint algorithm may fail.
 *
 * Briefly about the algorithm: Since blank nodes are often renamed upon serialization an
 * de-serialization these cannot be used in the fingerprinting algorithm. To overcome this
 * problem the algorithm gives each blank node an identifier via a deterministic process
 * that takes all incoming and outgoing triples into account. Clearly this approach will give
 * two blank nodes in two different graphs the same identifier if they have the same incoming
 * and outgoing triples. But, they may still correspond to different blank nodes
 * (in the isomorphic sense) if longer blank node traversal path are taken into account.
 *
 * Lets Look at two different graphs that will have the same fingerprint:
 * Graph 1: John indirectly knows Eric and Anna indirectly knows Linda
 * _:b1     foaf:name    'John'
 * _:b1     foaf:knows   _:b2
 * _:b2     foaf:knows   _:b3
 * _:b3     foaf:name    "Eric"
 * _:b4     foaf:name    'Anna'
 * _:b4     foaf:knows   _:b5
 * _:b5     foaf:knows   _:b6
 * _:b6     foaf:name    "Linda"
 *
 * Graph 2: John indirectly knows Linda and Anna indirectly knows Eric
 * _:b1     foaf:name    'John'
 * _:b1     foaf:knows   _:b2
 * _:b2     foaf:knows   _:b3
 * _:b3     foaf:name    "Linda"
 * _:b4     foaf:name    'Anna'
 * _:b4     foaf:knows   _:b5
 * _:b5     foaf:knows   _:b6
 * _:b6     foaf:name    "Eric"
 *
 * In practise this situation only occurs when you have longer paths of blank nodes without
 * additional distinguishing triples. However, from a modeling standpoint these kind of
 * expressions with long chains of nodes are seldom used and if they are used, there are
 * certainly distinguishing triples along the way.
 *
 * The conclusion is that checking if real world graphs are the same or not can be safely
 * determined with the help of this fingerprint method.
 *
 * @param {rdfjson/Graph} graph is the graph to fingerprint.
 * @param {array} excludeProperties a list of properties to exclude when calculating
 * the fingerprint.
 * @return {string} a md5 sum of the graph.
 */
const fingerprint = (graph, excludeProperties) => {
  const fpg = [];
  const exclude = new Set((excludeProperties || []).map(prop => ns.expand(prop)));
  const blankStmts = [];
  const blankIdx = {};

  const serializeObj = (stmt) => {
    let val = stmt.getValue();
    if (stmt.getLanguage()) {
      val += `@${stmt.getLanguage()}`;
    }
    if (stmt.getDatatype()) {
      val += `^^${stmt.getDatatype()}`;
    }
    return val;
  };
  const addToBlankRels = (bn, str) => {
    const idx = blankIdx[bn] || { rels: [] };
    blankIdx[bn] = idx;
    idx.rels.push(str);
  };

  graph.find().forEach((stmt) => {
    const s = stmt.getSubject();
    const p = stmt.getPredicate();
    if (exclude.has(p)) {
      return;
    }
    const oBlank = stmt.getType() === 'bnode';
    const sBlank = stmt.isSubjectBlank();
    if (sBlank || oBlank) {
      blankStmts.push(stmt);
      if (sBlank) {
        addToBlankRels(stmt.getSubject(), oBlank ? p : p + serializeObj(stmt));
      }
      if (stmt.getType() === 'bnode') {
        addToBlankRels(stmt.getValue(), sBlank ? p : s + p);
      }
      return;
    }

    fpg.push(s + p + serializeObj(stmt));
  });

  // Calculate a stable hash for each blank based on incoming and outgoing tripples.
  Object.values(blankIdx).forEach((blank) => {
    blank.rels.sort();
    blank.hash = md5(blank.rels.join(''));
  });

  // Add all statements with blanks in them
  blankStmts.forEach((stmt) => {
    const fps = [];
    fps.push(stmt.isSubjectBlank() ? blankIdx[stmt.getSubject()].hash : stmt.getSubject());
    fps.push(stmt.getPredicate());
    fps.push(stmt.getType() === 'bnode' ? blankIdx[stmt.getValue()].hash : serializeObj(stmt));
    fpg.push(fps.join(''));
  });

  fpg.sort();
  return md5(fpg.join(''));
};

export default {
  extract,
  remove,
  fingerprint,
};
