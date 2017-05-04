require([
    'rdfjson/Graph',             //Rdfjson Graph API
    'rdforms/template/ItemStore', //Stores all the RDForm templates
    'rdforms/view/Editor',        //The editor User interface
    'dojo/domReady!'             //Wait until the dom is ready.
], function (Graph, ItemStore, Editor) {
    var graph = new Graph({
        "http://example.org/about": {
            "http://example.com/terms/colorOfHouse": [{
                type: "uri",
                value: "http://example.com/color/blue"
            }]
        }
    });
    var itemStore = new ItemStore();
    itemStore.createItem({
        "type": "choice",
        "nodetype": "URI",
        "id": "ex:color",
        "property": "http://example.com/terms/colorOfHouse",
        "label": {"en": "Color of house", "sv": "Färg på huset"},
        "choices": [
            {"value": "http://example.com/color/blue", "label": {"en": "Blue"}},
            {"value": "http://example.com/color/red", "label": {"en": "Red"}}
        ],
        "cardinality": {"min": 1, "pref": 1, "max": 1}
    });
    new Editor({
        graph: graph,
        resource: "http://example.org/about",
        template: itemStore.createTemplateFromChildren(["ex:color"]),
        compact: true
    }, "node");
});