/*global define*/
define([], function () {

    /**
     * rdfjson.Statement Represents a statement in a graph.
     * Never create directly, use the methods in rdfjson.Graph.
     * Constructs a statement from the provided parts, the object is assumed to be the same actual javascript object as is used in the graph.
     *
     * @param {rdfjson.Statement} graph the rdfjson.Graph we will manipulate.
     * @param {String} s the subject in the statement
     * @param {String} p the predicate in the statement.
     * @param {Object} o the object in the statement.
     * @param {Boolean} asserted indicates if the statement is asserted in the accompanied graph.
     * @class
     */
    var Statement = function (graph, s, p, o, asserted) {
        this._graph = graph;
        this._s = s;
        this._p = p;
        this._o = o;
        this._o._statement = this;
        this._asserted = asserted;
    };

    //===================================================
    // Public API
    //===================================================
    /**
     * The Graph this Statement is associated with.
     * @returns {rdfjson.Graph}
     */
    Statement.prototype.getGraph = function () {
        return this._graph;
    };

    /**
     * An asserted statement is present in its associated Graph
     * @param {Boolean} asserted
     */
    Statement.prototype.setAsserted = function (asserted) {
        if (asserted != this._asserted) {
            if (asserted) {
                this._graph.add(this);
            } else {
                this._graph.remove(this);
            }
            this._asserted = asserted;
        }
    };

    /**
     * True if the Statement is asserted in the Graph.
     * @returns {Boolean}
     */
    Statement.prototype.isAsserted = function () {
        return this._asserted;
    };

    /**
     * The subject of this statement.
     * @returns {String}
     */
    Statement.prototype.getSubject = function () {
        /**
         * @type {String}
         * @private
         */
        this._s;
        return this._s;
    };

    /**
     * Sets the subhect of this statement, other Statements with this resource as subject or object is not affected.
     * @param {String} s must be a valid URI.
     */
    Statement.prototype.setSubject = function (s) {
        if (this._asserted) {
            this._graph.remove(this);
            this._s = s;
            this._graph.add(this);
        } else {
            this._s = s;
        }
    };

    /**
     * The predicate of this Statement.
     * @returns {String}
     */
    Statement.prototype.getPredicate = function () {
        return this._p;
    };

    /**
     * Sets the predicate of this statement.
     * @param {String} p must be a valid URI.
     */
    Statement.prototype.setPredicate = function (p) {
        if (this._asserted) {
            this._graph.remove(this);
            this._p = p;
            this._graph.add(this);
        } else {
            this._p = p;
        }
    };
    /**
     * The object of the Statement.
     *
     * @returns {Object}
     */
    Statement.prototype.getObject = function () {
        return this._o;
    };

    /**
     * @returns {String} one of uri, bnode and literal
     */
    Statement.prototype.getType = function () {
        return this._o["type"];
    };

    /**
     * @param {String} type must be one of uri, bnode and literal.
     */
    Statement.prototype.setType = function (type) {
        throw "Changing the type of an object is not supported, create a new statement instead.";
    };

    /**
     * If type is uri it is a URI, if type is a literal it is the literal string.
     * If type is a bnode the value is a internal bnode identity, should only be used for references within the current graph.
     * @returns {String}
     */
    Statement.prototype.getValue = function () {
        return this._o.value;
    };

    /**
     * Sets the uri, literal or bnode of the current Statement depending on the type.
     * @param {String} value must be a uri if the type so indicates.
     */
    Statement.prototype.setValue = function (value) {
        this._o.value = value;
    };

    /**
     * @returns {String} a language expressed using RFC-3066
     */
    Statement.prototype.getLanguage = function () {
        return this._o.lang;
    };

    /**
     * Sets the language of the object, only acceptable if the type is literal.
     * @param {String} lang the language expressed using RFC-30-66
     */
    Statement.prototype.setLanguage = function (lang) {
        if (this._o.type !== 'literal') {
            throw "Cannot set the language for a resource, has to be a literal";
        }
        this._o.lang = lang;
    };

    /**
     * The datatype of this object, only acceptable if the type is literal.
     * @returns {String} the datatype is always represented via a URI.
     */
    Statement.prototype.getDatatype = function () {
        return this._o.datatype;
    };

    /**
     * Set the datatype, only acceptable if the type is literal and no language is set.
     * @param {String} datatype the datatype expressed as a URI.
     */
    Statement.prototype.setDatatype = function (datatype) {
        if (this._o.type !== 'literal' || this._o.lang != null) {
            throw "Cannot set the datatype for a resource, has to be a literal";
        }
        this._o.datatype = datatype;
    };

    return Statement;
});