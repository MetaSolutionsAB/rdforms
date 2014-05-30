/*global define*/
define(["dojo/_base/declare", 
	"dojo/_base/lang",
	"dojo/_base/array",
	'dojo/on',
	'dojo/promise/all',
	"dojo/Deferred",
	"dojo/request",
	"dojo/dom-style",
	"dojo/dom-construct",
	"dojo/dom-attr",
	"dijit/layout/_LayoutWidget",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"dijit/layout/TabContainer",
	"dijit/layout/ContentPane",
	"dijit/layout/BorderContainer",
	"dijit/form/TextBox",
	"dijit/Dialog",
	"dijit/ProgressBar",
	"rdforms/model/Engine",
	"rdforms/view/Presenter",
	"rdforms/apps/RDFView",
	'rdforms/model/system',
	'rdforms/template/ItemStore',
	"rdfjson/Graph",
	"rdfjson/formats/converters",
	'dojo/hash',
	'dojo/topic',
	'dojo/keys',
	'dojo/io-query',
	"dojo/text!./LDBrowserTemplate.html"
], function(declare, lang, array, on, all, Deferred, request, domStyle, domConstruct, domAttr, _LayoutWidget,  _TemplatedMixin,
            _WidgetsInTemplateMixin, TabContainer, ContentPane, BorderContainer, TextBox, Dialog, ProgressBar, Engine, Presenter,
            RDFView, system, ItemStore, Graph, converters, hash, topic, keys, ioQuery, template) {

    /**
     * Linked Data browser, initialize by:
     * var is = new ItemStore();
     * is.registerBundle(...);
     * var ldp = new LDBrowser({
     *      itemstore: is,
     *      initialURI: "http://example.com/a",
     *      loadResource: function(uri, callback) {...implement me...};
     *      suggestedTemplate: function(uri, graph) {... implement me...};
     *      }, someNode);
     */
    return declare([_LayoutWidget, _TemplatedMixin, _WidgetsInTemplateMixin], {
        itemStore: null,
        initialURI: "",
        exampleURIs: null,
        type2template: null,
        pattern2template: null,
        bundlePaths: null,
        keyInFragment: "uri",
        rdf: null,
        rdfFormat: "rdf/json",
        graph: null,
        proxyLoadResourcePattern: null,
        proxyLoadResourcePattern2: null,
	loadResourceMessage: "Loading Resource",
	loadResourceMessage2: "Loading Resource via secondary mechanism",
	loadResourceFailed: "Failed to load resource",

        showResource: function(uri) {
            this.textboxURI.set("value", uri);
            this.loadResource(uri).then(lang.hitch(this, function(graph) {
                this._showBrowse(uri, graph);
                this._rdfTab.setGraph(graph);
            }));
        },
	showOrUpdateLoadProgress: function(message) {
	    if (!this._progressDialog) {
		var node = domConstruct.create("div", {style: {"width": "400px", "height": "100px"}});
		this._progressMessage = domConstruct.create("div", {"class": "progressMessage"}, node);
		this._progressBar = new ProgressBar({value: "infinity", indeterminate: true}, domConstruct.create("div", null, node));
		this._progressDialog = new Dialog();
		this._progressDialog.setContent(node);
	    }
	    domAttr.set(this._progressMessage, "innerHTML", message);
	    this._progressDialog.show();
	},
	endLoadProgress: function() {
	    this._progressDialog.hide();
	},
	failedLoadProgress: function(message) {
	    this._progressDialog.hide();
	    alert(this.loadResourceFailed);
	},
        loadResource: function(uri, secondAttempt) {
	    var pattern = secondAttempt === true ? this.proxyLoadResourcePattern2 : this.proxyLoadResourcePattern;
            if (pattern) {
                var url = lang.replace(pattern, {uri: encodeURIComponent(uri)});
                var params;
                switch(this.rdfFormat) {
                    case "rdf/xml":
                        params = {headers: {"Accept": "application/rdf+xml"}, handleAs: "string"};
                        break;
                    case "rdf/json":
                    default:
                    params = {headers: {"Accept": "application/rdf+json"}, handleAs: "json"};
                }
		this.showOrUpdateLoadProgress(secondAttempt ? this.loadResourceMessage2 : this.loadResourceMessage);
                return request.get(url, params).then(lang.hitch(this, function(data) {
                    this.endLoadProgress();
		    return this._convertRDF(data);
                }), lang.hitch(this, function(err) {
		    if (secondAttempt === true || this.proxyLoadResourcePattern2 == null) {
			this.failedLoadProgress();
		    } else {
			return this.loadResource(uri, true);
		    }
                }));
            } else if (this.graph) {
                var d = new Deferred();
                d.resolve(this.graph);
                return d.promise;
            } else {
                console.warn("Loading of resource failed, you need to either set a proxyLoadResourcePattern, " +
                    "provide a graph or rdfjsonGraph, or override the method loadResource in LDBrowser.");
            }
        },
        loadJSON: function(uri) {
            return request.get(uri, {handleAs: "json"});
        },
        suggestedTemplate: function(uri, graph) {
            if (this.pattern2template) {
                for (var key in this.pattern2template) if (this.pattern2template.hasOwnProperty(key)) {
                    if (new RegExp(key).test(uri)) {
                        return this.pattern2template[key];
                    }
                }
            }
            if (this.type2template) {
                var stmts = graph.find(uri, "http://www.w3.org/1999/02/22-rdf-syntax-ns#type");
                for (var i = 0;i<stmts.length;i++) {
                    var template = this.type2template[stmts[i].getValue()];
                    if (template != null) {
                        return template;
                    }
                }
            }
            if (this.defaultTemplate) {
                return this.defaultTemplate;
            }
        },

        //===================================================
        // Inherited attributes, methods or private methods
        //===================================================
        templateString: template,
        _graph: null,
        _presenterTab: null, //From template
        _rdfTab: null, //From template

        postCreate: function() {
            this.inherited("postCreate", arguments);

            if (this.itemStore == null) {
                this.itemStore = new ItemStore();
            }

            var self = this;
            var f = function() {
                system.attachLinkBehaviour = function (node, binding) {
                    on(node, "click", function (e) {
                        e.preventDefault();
                        var obj = ioQuery.queryToObject(hash());
                        obj[self.keyInFragment] = binding.getValue();
                        hash(ioQuery.objectToQuery(obj));
                    });
                };

                var f = function () {
                    var obj = ioQuery.queryToObject(hash());
                    if (obj[self.keyInFragment]) {
                        self.showResource(obj[self.keyInFragment]);
                    } else if (self.initialURI) {
                        obj[self.keyInFragment] = self.initialURI;
                        hash(ioQuery.objectToQuery(obj));
                    }
                };
                topic.subscribe("/dojo/hashchange", f);
                setTimeout(f, 1);
            };

            var g = lang.hitch(this, function(config) {
                lang.mixin(this, this.config, config);
                this._convertRDF(this.rdf);

                if (this.exampleURIs) {
                    domStyle.set(this.examplesBlock, "display", "");
                    domStyle.set(this._borderContainer.domNode, "top", "55");
                    array.forEach(this.exampleURIs, function(exURI) {
                        var a = domConstruct.create("a", {href: exURI, innerHTML: exURI}, this.examples);
                        domConstruct.create("span", {innerHTML: ", "}, this.examples);
                        on(a, "click", function(e) {
                            e.preventDefault();
                            var obj = ioQuery.queryToObject(hash());
                            obj[self.keyInFragment] = exURI;
                            hash(ioQuery.objectToQuery(obj));
                        });
                    }, this);
                }

                if (this.bundlePaths != null && this.bundlePaths != null) {
                    all(array.map(this.bundlePaths, function(bundlePath) {
                        return this.loadJSON(bundlePath);
                    }, this)).then(lang.hitch(this, function(results) {
                        array.forEach(results, function(bundle, idx) {
                            this.itemStore.registerBundle({path: this.bundlePaths[idx], source: bundle});
                        }, this);
                        f();
                    }));
                } else {
                    f();
                }
            });

            if (this.configPath) {
                var path = this.configPath.substring(0, this.configPath.lastIndexOf("/"));
                this.loadJSON(this.configPath).then(function(config) {
                    if (path !== "" && config.bundlePaths != null) {
                        config.bundlePaths = array.map(config.bundlePaths, function(bpath) {
                            return path+bpath;
                        });
                    }
                    g(config);
                });
            } else {
                g();
            }
            this.startup();
        },
        resize: function( ){
            this.inherited("resize", arguments);
            if (this._borderContainer) {
                this._borderContainer.resize();
            }
        },
        _convertRDF: function(rdf) {
            this.rdf = rdf;
            if (this.rdf != null) {
                switch(this.rdfFormat) {
                    case "rdf/json":
                        return this.graph = new Graph(this.rdf, false);
                    case "rdf/xml":
                        return this.graph = converters.rdfxml2graph(this.rdf);
                }
            }
        },
        _showBrowse: function(uri, graph) {
            var requiredItems = this.suggestedTemplate(uri, graph) || [];
            if (lang.isString(requiredItems)) {
                requiredItems = [requiredItems];
            }
            var template = Engine.constructTemplate(graph, uri, this.itemStore, requiredItems);
            var binding = Engine.match(graph, uri, template);
            this.presenter.show({binding: binding});
        },
        _uriKeypress: function(ev) {
            if (ev.keyCode === keys.ENTER) {
                var obj = ioQuery.queryToObject(hash());
                obj[this.keyInFragment] = this.textboxURI.get("value");
                hash(ioQuery.objectToQuery(obj));
            }
        },
        _loadConfig: function(configPath) {

        }
    });
});
