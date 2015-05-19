({
    baseUrl: "../libs",
    dir: "../dist-bootstrap/",
    name: "rdforms",
    create: true,
    optimize: "none",
    deps: [
        "rdfjson/Graph",
        "rdforms/model/Engine",
        "rdforms/template/ItemStore",
        "rdforms/view/Editor",
        "rdforms/view/bootstrap/components",
        "dojo/i18n!rdforms/view/nls/rdforms"
    ],
    paths: {
        "rdforms": "..",
        "text": "requirejs-text/text",
        "i18n": "requirejs-i18n/i18n",
        "fuelux": "fuelux/js",
        "bootstrap": "bootstrap-amd/lib",
        "select2": "select2/src/js",
        "moment": "moment/moment",
        "di18n": "../build/di18n",
        "jquery": "jquery/src",
        "sizzle": "jquery/src/sizzle/dist/sizzle",
        "jquery.mousewheel": "select2/src/js/jquery.mousewheel.shim"
    },
    map: {
        "jquery": {
            "jquery" : "jquery",
            "jquery/selector": "jquery/selector-sizzle"
        },
        "bootstrap": {
            "jquery": "jquery",
            "jquery/selector": "jquery/selector-sizzle"
        },
        "*": {
            "jquery": "jquery/jquery",
            "jquery/selector": "jquery/selector-sizzle",
            "has": "dojo/has",
            "dojo/text": "text",
            "dojo/i18n": "di18n"
        }
    },
    skipDirOptimize: true,
    normalizeDirDefines: "skip",
    skipModuleInsertion: true,
    removeCombined: true,
    fileExclusionRegExp: /^(\.|node_modules|release|dist-dojo|dist-bootstrap)/,
    onModuleBundleComplete: function (data) {
        var fs = module.require('fs'),
            amdclean = module.require('amdclean'),
            outputFile = "../dist-bootstrap/"+data.path,
            cleanedCode = amdclean.clean({
                'filePath': outputFile,
                'globalModules': [
                    'rdfjson_Graph',
                    'rdforms_model_Engine',
                    'rdforms_template_ItemStore',
                    'rdforms_view_Editor',
                    'rdforms_view_Presenter',
                ],
                'prefixMode': 'standard',
                'prefixTransform': function(postNormalizedModuleName, preNormalizedModuleName) {
                    if (postNormalizedModuleName.indexOf("dojo_text_") === 0) {
                        return postNormalizedModuleName.substr(5);
                    } else if (postNormalizedModuleName === "dojo_text") {
                        return "text";
                    } else if (postNormalizedModuleName.indexOf("dojo_i18n_") === 0) {
                        return postNormalizedModuleName.substr(10);
                    } else if (postNormalizedModuleName === "dojo_i18n") {
                        return "di18n";
                    } else if (preNormalizedModuleName.indexOf("./i18n") >= 0) { //Captures both ../i18n and ./i18n
                        return postNormalizedModuleName.substr(5);
                    }
                    return postNormalizedModuleName;
                }
        });
        fs.writeFileSync(outputFile+".noAmd.js", cleanedCode);
    },
    onBuildRead: function (moduleName, path, contents) {
        switch (moduleName) {
            case "dojo/hccss":
                return contents.replace("require.toUrl(\"./resources/blank.gif\")", "'../libs/dojo/resources/blank.gif'");
            case "dojo/i18n":
                return contents.replace("./has!host-browser?", "");
            case "dojo/date/locale":
                return contents.replace(/module\.id/g, "\"dojo/date/locale\"");
            case "dojo/on":
                //Inluding aspect always... maybe unneccessary.
                return contents.replace("./has!dom-addeventlistener?:", "");
            case "dojo/ready":
                return contents.replace("./has!host-browser?", "");
            case "dojo/Deferred":
                return contents.replace(/,\s*"\.\/has!.*instrumentation"/, "");
            case "dojo/request/watch":
                return contents.replace("../has!host-browser?../_base/window:", "../_base/window")
                    .replace(/,\s*'\.\.\/has.*'/, ""); //Never including on, problematic?
            case "dijit/_Widget":
                return contents.replace("dojo/query", "jquery")
                    .replace("query('[widgetId]', this.containerNode).map(registry.byNode)",
                "query('[widgetId').map(function(idx, item) {return registry.byNode(item);})");
            case "dijit/_WidgetBase":
                return contents.replace("dojo/has!dojo-bidi?", "")
                    .replace("require.toUrl(\"dojo/resources/blank.gif\")","''");
            case "dojo/selector/acme":
                return contents.replace("win.doc", "win.doc || {firstChild: {}, compatMode: 'CSS1Compat'}");
            case "dojo/query":
                return contents
                    .replace("\"./selector/_loader\", \"./selector/_loader!default\"", "\"dojo/selector/acme\"")
                    .replace("loader, defaultEngine){", "defaultEngine){var loader;")
                    .replace("dojo._filterQueryResult", "query.load = function(id, parentRequire, loaded){" +
                    "loaded(queryForEngine(defaultEngine, NodeList));" +
                    "};" +
                    "dojo._filterQueryResult");
            default:
                return contents;
        }
    }
})