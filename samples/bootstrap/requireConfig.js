require.config({
    baseUrl: "../../libs",
    "paths": {
        "rdforms": "..",
        "text": "requirejs-text/text",
        "i18n": "requirejs-i18n/i18n",
        "fuelux": "fuelux/js",
        "bootstrap": "bootstrap-amd/lib",
        "select2": "select2/src/js",
        "moment": "moment/moment",
        "i18n": "di18n/i18n",
        "jquery": "jquery/src",
        "sizzle": "sizzle/dist/sizzle",
        "jquery.mousewheel": "select2/src/js/jquery.mousewheel.shim"
    },
    map: {
        "jquery": {
            "jquery" : "jquery",
            "jquery/selector": "jquery/selector-sizzle",
            "external/sizzle/dist/sizzle": "sizzle"
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
            "dojo/i18n": "di18n",
	    "di18n/i18n": "i18n"
        }
    },
    "deps": [
        'rdforms/view/nls/rdforms',
        'rdforms/view/bootstrap/all']
});
