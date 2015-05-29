/*global define*/
define([
    "dojo/_base/declare",
    "dojo/_base/array"
], function(declare, array) {

    var matchRdfType = function(item, type) {
        var constr= item.getConstraints();
        return constr != null && constr[rdfType] === type;
    };
    var matchConstraint = function(item, constraints) {
        if (constraints == null) {
            return true;
        }
        var constr = item.getConstraints(), match = true;
        if (constr == null) {
            return false;
        }
        for (var key in constr) if (constr.hasOwnProperty(key)) {
            if (constraints[key] !== constr[key]) {
                match = false;
                break;
            }
        }
        return match;
    };

    var filterMethods = [
        "itemtype",
        "choices",
        "nodetype",
        "datatype",
        "rdftype",
        "constraint",
        "predicate",
        "style",
        "item",
        "check"];
    var Filter = function(registry) {
        this.filterObj = {};
        this.registry = registry;
    };

    Filter.prototype.register = function(component) {
        this.registry.register(this.filterObj, component);
    };

    array.forEach(filterMethods, function(meth) {
        Filter.prototype[meth] = function(value) {
            this.filterObj[meth] = value || true;
            return this;
        }
    });

	return declare(null, {
        components: [],
        priorities: {
            CHECK: 1,
            ITEMTYPE: 2,
            CHOICES: 4,
            NODETYPE: 8,
            DATATYPE: 16,
            RDFTYPE: 32,
            CONSTRAINT: 64,
            PREDICATE: 128,
            STYLE: 256,
            ITEM: 512
        },
        constructor: function() {
            this.components = [];
        },

        calculatePriority: function(item, filter) {
            var prio = 0;
            if (filter.itemtype) {
                prio += this.priorities.ITEMTYPE;
                if (item.getType() !== filter.itemtype) {
                    return -1;
                }
            }

            if (filter.choices) {
                prio += this.priorities.CHOICES;
                switch (filter.choices) {
                    case "static":
                        if (!item.hasStaticChoices()) {
                            return  -1;
                        }
                        break;
                    case "dynamic":
                        if (!item.hasChoices() || item.hasStaticChoices()) {
                            return  -1;
                        }
                        break;
                    case "none":
                        if (item.hasChoices()) {
                            return -1;
                        }
                        break;
                    case "any":
                    default:
                        if (!item.hasChoices()) {
                            return  -1;
                        }
                }
            }

            if (filter.nodetype) {
                prio += this.priorities.NODETYPE;
                if (item.getNodetype() !== filter.nodetype) {
                    return -1;
                }
            }

            if (filter.datatype) {
                prio += this.priorities.DATATYPE;
                if (item.getDatatype() !== filter.datatype) {
                    return -1;
                }
            }

            if (filter.rdftype) {
                prio += this.priorities.RDFTYPE;
                if (!matchRdfType(item, filter.rdftype)) {
                    return -1;
                }
            }

            if (filter.constraint) {
                prio += this.priorities.CONSTRAINT;
                if (!matchConstraint(item, filter.constraint)) {
                    return -1;
                }
            }

            if (filter.predicate) {
                prio += this.priorities.PREDICATE;
                if (item.getProperty() !== filter.predicate) {
                    return -1;
                }
            }

            if (filter.style) {
                prio += this.priorities.STYLE;
                if (!item.hasStyle(filter.style)) {
                    return -1;
                }
            }

            if (filter.item) {
                prio += this.priorities.ITEM;
                if (item !== filter.item && (!filter.item.getId || item.getId() !== filter.item.getId())) {
                    return -1;
                }
            }

            if (filter.check) {
                if (!filter.check(item)) {
                    return -1;
                }
            }

            return prio;
        },

        getComponent: function(item) {
            var bestComponent, bestPrio = -1, prio, component;
            for (var i=0;i<this.components.length;i++) {
                component = this.components[i];
                prio = this.calculatePriority(item, component.filter);
                if (prio > bestPrio) {
                    bestComponent = component;
                    bestPrio = prio;
                }
            }
            if (bestComponent) {
                return bestComponent.component;
            }
        },

        register: function(filter, component) {
            this.components.push({component: component, filter: filter});
        },
        itemtype: function(itemtype) {
            return (new Filter(this)).itemtype(itemtype);
        },
        choices: function(kindOfChoicesRequired) { //'none', 'static', 'dynamic' or 'any', 'any' is default.
            return (new Filter(this)).choices(kindOfChoicesRequired);
        },
        nodetype: function(nodetype) {
            return (new Filter(this)).nodetype(nodetype);
        },
        datatype: function(datatype) {
            return (new Filter(this)).datatype(datatype);
        },
        rdftype: function(rdftype) {
            return (new Filter(this)).rdftype(rdftype);
        },
        constraint: function(constraint) {
            return (new Filter(this)).constraint(constraint);
        },
        predicate: function(predicate) {
            return (new Filter(this)).predicate(predicate);
        },
        style: function(style) {
            return (new Filter(this)).style(style);
        },
        item: function(item) {
            return (new Filter(this)).item(item);
        },
        check: function(func) {
            return (new Filter(this)).check(func);
        }
    });
});