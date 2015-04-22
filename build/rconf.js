({
    baseUrl: "../libs",
    dir: "../dist/",
    //out: "../dist/rdforms.js",
    name: "rdforms",
    create: true,
    optimize: "none",
    deps: [
        "rdfjson/Graph",
        "rdforms/model/Engine",
        "rdforms/template/ItemStore",
        "dojo/dom-attr", //Circular dependency not resolved nicely if not defined first.
        "rdforms/view/Editor",
        "dojo/i18n!rdforms/view/nls/rdforms"
    ],
    paths: {
        "rdforms": "..",
        "text": "requirejs-text/text",
        "i18n": "requirejs-i18n/i18n",
        "di18n": "../di18n"
    },
    map: {
        "*": {
            "has": "dojo/has",
            "dojo/text": "text",
            "dojo/i18n": "di18n"
        }
    },
    skipDirOptimize: true,
    normalizeDirDefines: "skip",
    skipModuleInsertion: false,
    removeCombined: true,
    fileExclusionRegExp: /^(\.|node_modules|release|dist)/,
    onModuleBundleComplete: function (data) {
        var fs = module.require('fs'),
            amdclean = module.require('amdclean'),
            outputFile = "../dist/"+data.path,
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
        fs.writeFileSync(outputFile, cleanedCode);
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
            case "dojo/selector/acme":
                return contents.replace("win.doc", "win.doc || {firstChild: {}, compatMode: 'CSS1Compat'}");
            case "dojo/request/watch":
                return contents.replace("../has!host-browser?../_base/window:", "../_base/window")
                    .replace(/,\s*'\.\.\/has.*'/, ""); //Never including on, problematic?
            case "dijit/_WidgetBase":
                return contents.replace("dojo/has!dojo-bidi?", "")
                    .replace("require.toUrl(\"dojo/resources/blank.gif\")","''");
            case "dijit/form/_RadioButtonMixin":
                return contents.replace("dojo/query!css2", "dojo/query");
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