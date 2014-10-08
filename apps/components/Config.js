/*global define*/
define([
    "exports",
    "dojo/_base/declare",
	"dojo/_base/lang",
    "dojo/_base/array",
	"dojo/json",
    "rdfjson/formats/converters",
	"rdforms/template/ItemStore"
], function(exports, declare, lang, array, json, converters, ItemStore) {

    var onRDF = function(config) {
        if (config.bundles) {
            if (config._basePath != "" && config.bundles != null) {
                config.bundles = array.map(config.bundles, function(bpath) {
                    return config._basePath+bpath;
                });
            }
            config.itemStore.loadBundles(config.bundles, config.postConfig);
        } else {
            config.postConfig();
        }
    };
    var onConfig = function(config) {
        config.itemStore = config.itemStore || new ItemStore();
        config._basePath = "";
        if (config.configPath) {
            config._basePath = "./"+config.configPath.substring(0, config.configPath.lastIndexOf("/") + 1);
        }
        if (config.namespaces) {
            for (key in config.namespaces) if (config.namespaces.hasOwnProperty(key)) {
                converters.addNamespace(key, config.namespaces[key]);
            }
        }
        if (config.rdf) {
            onRDF(config);
        } else if (config.rdfPath) {
            require(["dojo/text!./"+config._basePath+config.rdfPath], function(rdf) {
                if (config.rdfFormat === "rdf/xml") {
                    config.rdf = converters.rdfxml2graph(rdf);
                } else {
                    config.rdf = json.parse(rdf);
                }
                onRDF(config);
            });
        } else {
            self.rdf = {};
            onRDF(config);
        }
    };


    exports.init = function(config, postConfig) {
        if (typeof config === "string") {
            require(["dojo/text!./"+config], function(conf) {
                var configObj = json.parse(conf);
                configObj.configPath = config;
                configObj.postConfig = lang.hitch(this, postConfig, configObj);
                onConfig(configObj);
            });
        } else if (config.configPath) {
            require(["dojo/text!./" + config.configPath], function (conf) {
                var configObj = json.parse(conf);
                lang.mixin(configObj, config);
                configObj.postConfig = lang.hitch(this, postConfig, configObj);
                onConfig(configObj);
            });
        } else {
            config.postConfig = lang.hitch(this, postConfig, config);
            onConfig(config);
        }
    };

    /**
     * Handles a config object, either directly in the config variable or loading it from the configPath attribute.
     * The config object itself is mixed into the current instance, the following attributes have special meaning
     * in the config object:
     * rdf - an inline RDF graph in RDF/JSON
     * rdfPath - path to an RDF graph to load
     * rdfFormat - the format the RDF is in, e.g. rdf/xml or rdf/json
     * bundles - an array of strings that the ItemStore will try to load.
     */
    exports.Cls = declare(null, {
        postConfig: function(config) {
            this.config = config;
            if (config.header) {
                document.title = config.header;
            }
        },

        postCreate: function() {
            this.inherited("postCreate", arguments);
            exports.init(this.config || this.configPath, lang.hitch(this, this.postConfig));
        }
    });
});