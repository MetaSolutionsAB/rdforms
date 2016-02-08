require.config({
    baseUrl: "../libs", //Path relative to bootstrapping html file.
    paths: {   //Paths relative baseUrl, only those that deviate from baseUrl/{modulename} are explicitly listed.
        "rdforms": "..",
        "text": "requirejs-text/text",
        "fuelux": "fuelux/js",
        "bootstrap": "bootstrap-amd/lib",
        "select2": "select2/src/js",
        "moment": "moment/moment",
        "momentl": "moment/locale",
        "i18n": "di18n/i18n",
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
            "dojo/i18n": "i18n",
            "di18n/i18n": "i18n"
        },
        "rdforms/template/bundleLoader": {
            "dojo/request": "dojo/request/xhr"  //Force using xhr since we know we are in the browser
        }
    },
    deps: [
        'rdfjson/Graph',             //Rdfjson Graph API
        'rdforms/template/ItemStore', //Stores all the RDForm templates
        'rdforms/view/Editor',        //The editor User interface
        'rdforms/view/nls/rdforms',
        'rdforms/view/bootstrap/all',
        'dojo/domReady'
    ]
});