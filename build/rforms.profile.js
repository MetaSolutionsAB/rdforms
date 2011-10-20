dependencies = {
   layers: [
				{
					name: "../dijit/dijit.js",
	            	resourceName: "dijit.dijit-all",
					layerDependencies: [],
					dependencies: [
						"dijit.dijit"
					]
				},
                {
					name: "../dijit/dijit-all.js",
					resourceName: "dijit.dijit-all",
					layerDependencies: [
						"../dijit/dijit.js"
					],
					dependencies: [
						"dijit.dijit-all"
					]
                },
				{
				  	 name: "../rforms/rforms.js",
            		 resourceName: "rforms.rforms",
                     layerDependencies: [
					 	"dijit.dijit-all"
					 ],
                     dependencies: [
                		"rforms.rforms"
            		 ]
				}
    ],
    prefixes: [
        [ "dijit", "../dijit" ],
        [ "dojox", "../dojox" ],
        [ "rdfjson", "../../../src/rdfjson" ],
        [ "rforms", "../../../src/rforms" ]
    ]
}