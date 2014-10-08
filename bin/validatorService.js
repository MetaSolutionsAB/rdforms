/*global require*/

if (process.argv.length <= 3) {
    console.log("You have to provide two arguments:");
    console.log("$ node validatorService path-to-config.json port-to-use");
    process.exit(1);
}

dojoConfig = {
    baseUrl: "../libs/", // Where we will put our packages
    async: 1, // We want to make sure we are using the "modern" loader
    hasCache: {
        "host-node": 1, // Ensure we "force" the loader into Node.js mode
        "dom": 0 // Ensure that none of the code assumes we have a DOM
    },
    packages: [ "dojo", "rdfjson", {name: "rdforms", location: "../"}],
    deps: [ "rdforms/apps/validator/ValidatorService"]
};

// Now load the Dojo loader
require("../libs/dojo/dojo.js");
