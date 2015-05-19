var dojoConfig = {
    async: true,
    packages: [
        {name: "rdforms", location: "../.."},
        {name: "fuelux", location: "../fuelux/js"},
        {name: "jquery", location: "../jquery/src", main: "jquery"},
        {name: 'sizzle', location: '../jquery/src/sizzle/dist', main: 'sizzle'},
        {name: "bootstrap", location: "../bootstrap-amd/lib"},
        {name: "select2", location: "../select2/src/js"},
        {name: "jquery.mousewheel", location: "../select2/src/js", main: "jquery.mousewheel.shim"}
    ],
    map: {
        "*": {
            "moment": "moment/min/moment.min",
            //Below is a hack to overcome that dojos define does not handle purely a dependency array
            "jquery/selector": "jquery/selector-sizzle"
        }
    }
};