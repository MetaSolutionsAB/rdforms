/*global define*/
define([
        "rdforms/model/system"
    ],
function(system) {

    var choosers = [];

    var priorities = {
        AVOID: -1,
        NONE: 0,
        CONSTRAINT: 1,
        PREDICATE: 2,
        CANDP: 3,
        ITEM: 4,
        GRAPH: 5
    };

    var getChooser = function(item) {
        var bestChooser, bestPrio = -1, prio, chooser;
        for (var i=0;i<choosers.length;i++) {
            chooser = choosers[i];
            prio = chooser.priority(item);
            if (prio > bestPrio) {
                bestChooser = chooser;
                bestPrio = prio;
            }
        }
        return bestChooser;
    };

    system.getChoice = function(item, value) {
        var chooser = getChooser(item);
        if (chooser == null) {
            throw("Error, no chooser available to retrieve a choice for item: "+item.getId());
        }
        return chooser.chooser.getChoice(item, value);
    };

    system.openChoiceSelector = function(binding, callback) {
        var chooser = getChooser(binding.getItem());
        if (chooser == null) {
            throw("Error, no chooser available to open a choice selector for: "+item.getId());
        }
        chooser.chooser.show(binding, callback);
    };

    var matchPredicate = function(item, predicate) {
        return item.getProperty() === predicate;
    };
    var matchType = function(item, type) {
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

	var chooserRegistry = {
        priorities: priorities,
        forPredicate: function(predicate) {
            return function (item) {
                if (matchPredicate(item, predicate)) {
                    return priorities.PREDICATE;
                }
                return priorities.NONE;
            };
        },
        forConstraint: function(constraint) {
            return function (item) {
                if (matchConstraint(item, constraint)) {
                    return priorities.CONSTRAINT;
                }
                return priorities.NONE;
            };
        },
        forPredicateAndConstraint: function(predicate, constraint) {
            return function (item) {
                var pm = matchPredicate(item, predicate), cm = matchConstraint(item, constraint);
                if (pm && cm) {
                    return priorities.CANDP;
                } else if (pm) {
                    return priorities.PREDICATE;
                } else if (cm) {
                    return priorities.CONSTRAINT;
                }
                return priorities.NONE;
            };
        },

        /**
         * A chooser is an object with the following attributes:
         * getChoice - function(item, value) -> choice
         *  (i.e. a function that takes the arguments item and value and returns a choice.
         *   If the choice cannot be provided in full directly it is possible to include a
         *   load method in the object with a onSuccess and onError methods as parameters.)
         * getPriority - function(item) -> integer
         *   (I.e. a function that provides a priority for the chooser given an item,
         *   use the priorities specified in this module.)
         * show - function(binding, onSelect)
         *   (I.e. a function that given a binding launches the chooser dialog, when the user is finished
         *   and has made his selection the onSelect method will be called with the selected choice.)
         * registerDefaults: function()
         *   (I.e. a function that registers the choosers own default priorities when it is to be used.)
         *
         * @param {object} chooser
         */
        register: function(chooser) {
            choosers.push({chooser: chooser, priority: chooser.getPriority});
        },
        registerForPredicate: function(chooser, property) {
            choosers.push({chooser: chooser, priority: chooserRegistry.forPredicate(property)});
        },
        registerForConstraint: function(chooser, constraint) {
            choosers.push({chooser: chooser, priority: chooserRegistry.forConstraint(constraint)});
        },
        registerForPredicateAndConstraint: function(chooser, predicate, constraint) {
            choosers.push({chooser: chooser, priority: chooserRegistry.forPredicateAndConstraint(predicate, constraint)});
        }
    };
    return chooserRegistry;
});