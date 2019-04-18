import ns from './namespaces';

/**
 * @param {rdfjson.Graph} graph
 * @param {String} subject a URI for the subject to focus on
 */
const pretty = (graph, subject) => {
  const pretty = {};
  const stmts = graph.find(subject);
  for (let i = 0; i < stmts.length; i++) {
    const stmt = stmts[i];
    if (stmt.getType() !== 'bnode') {
      pretty[ns.shorten(stmt.getPredicate())] = stmt.getValue();
    }
  }
  return pretty;
};

const statementTree = (graph, subject, visited) => {
  const _visited = visited || {};
  const stmts = graph ? graph.find(subject) : [];
  const arr = [];
  for (let i = 0; i < stmts.length; i++) {
    const stmt = stmts[i];
    if (stmt.getType() === 'literal') {
      arr.push({ stmt });
    } else {
      const row = { stmt };
      const obj = stmt.getValue();
      if (!_visited[obj]) {
        _visited[obj] = true;
        row.children = statementTree(graph, obj, _visited);
      }
    }
  }
  return arr;
};

const statementList = (graph, subject) => {
  const tree = statementTree(graph, subject);
  const arr = [];
  const f = (stmts, level) => {
    for (let i = 0; i < stmts.length; i++) {
      const stmt = stmts[i];
      stmt.indent = level;
      arr.push(stmt);
      if (stmt.children) {
        f(stmt.children, level + 1);
        delete stmt.children;
      }
    }
  };
  f(tree, 1);
  return arr;
};

const prettyTree = (graph, subject) => {
  const delegates = statementList(graph, subject);
  for (let i = 0; i < delegates.length; i++) {
    const delegate = delegates[i];
    const stmt = delegate.stmt;
    if (stmt.isSubjectBlank()) {
      delegate.s = stmt.getSubject();
    } else {
      delegate.s = ns.shorten(stmt.getSubject());
    }
    delegate.p = ns.shorten(stmt.getPredicate());
    const t = stmt.getType();
    if (t === 'uri') {
      delegate.o = ns.shorten(stmt.getValue());
      const lang = stmt.getLanguage();
      const dt = stmt.getDatatype();
      if (lang != null) {
        delegate.o += `@@${lang}`;
      } else if (dt != null) {
        delegate.o += `^^${dt}`;
      }
    } else if (t === 'literal') {
      delegate.o = `"${stmt.getValue()}"`;
    } else {
      delegate.o = `"${stmt.getValue()}"`;
    }
  }
  return delegates;
};

export {
  pretty,
  statementList,
  statementTree,
  prettyTree
}

export default {
  pretty,
  statementList,
  statementTree,
  prettyTree
}