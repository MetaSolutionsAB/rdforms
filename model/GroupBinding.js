/*global define*/
define(["dojo/_base/declare", "./Binding", "./CardinalityTracker"], function(declare, Binding, CardinalityTracker) {

    /**
     * Corresponds to a binding for a Group item type.
     * Handles sub-bindings grouped by item.
     * Validity of a group is determined by at least one of the sub-bindings being valid.
     * All sub-bindings must notify when their validity changed so that the validity of
     * the parent group can be checked and possibly updated.
     * Potential statement and constraints are asserted when both parents are valid and this GroupBinding is valid.
     * 
     * @see rforms.template.Group
     */
    var GroupBinding = declare(Binding, {
	//===================================================
	// Private attributes
	//===================================================
	_oneValidChild: undefined,
	_validPredicate: true,
	_childBindings: null,
	_constraints: null,
	_cachedChildBindings: null,
	_rootUri: null,

	//===================================================
	// Public API
	//===================================================
	oneChildValidityChanged: function(valid) {
		if (valid === this._oneValidChild) {
			return;
		}
		if (!valid) {
			//Since we do not keep track of which children have valid values, 
			//we need to iterate through all children to check if some other child has a valid value
			//(and check if valid predicate) if so, abort change.
			delete this._oneValidChild;
			if (this.isValid()) {
				return false; //No change
			}
		}
		
		//Below we change the valid state of this group.
		this._oneValidChild = valid;
		//If there is no parent or it's valid state did not change,
		//then the groups assertions has not been changed and the children
		//have not been notified of this group change in validity.
		this._notifyValidityChange(valid && this._validPredicate);
		return this._validPredicate; //Validity of group changed only if valid predicate.
	},
	getChildrenRootUri: function() {
		if (this._statement) { //Either the object of the statement.
			return this._statement.getValue();
		} else if (this._rootUri !== undefined){
			return this._rootUri;
		} else if (this._parent !== undefined) {
			return this._parent.getChildrenRootUri();
		}
	},
	addChildBinding: function(binding) {
		this.addChildBindings([binding]);
	},
	addChildBindings: function(bindings) {
		this._cachedChildBindings = null;
		if (!dojo.isArray(bindings) || bindings.length === 0) {
			return;
		}
		var item = bindings[0].getItem(), children = this._item.getChildren();
		for (var i=children.length;i>=0;i--) {
			if (item === children[i]) {
				var cardTracker = this._childBindings[i].length > 0 ? 
						this._childBindings[i][0].getCardinalityTracker() :
						new CardinalityTracker(item);
				this._childBindings[i] = this._childBindings[i].concat(bindings);
				dojo.forEach(bindings, function(binding) {
					binding.setParent(this);
					binding.setCardinalityTracker(cardTracker);
					cardTracker.increment();
				}, this);
				break;
			}
		}
	},
	removeChildBinding: function(binding) {
		this._cachedChildBindings = null;
		var children = this._item.getChildren();
		for (var i=children.length;i>=0;i--) {
			if (binding.getItem() === children[i]) {
				this._childBindings[i].splice(dojo.indexOf(this._childBindings[i], binding), 1);
				delete binding._parent;
				binding.getCardinalityTracker().decrement();
				break;
			}
		}
		this.oneChildValidityChanged();
	},
	getChildBindingsFor: function(item) {
		var children = this._item.getChildren();
		for (var i=children.length;i>=0;i--) {
			if (item === children[i]) {
				return this._childBindings[i];
			}
		}
	},
	getItemGroupedChildBindings: function() {
		return this._childBindings;
	},
	getChildBindings: function() {
		if (this._cachedChildBindings === null) {
			if (this._childBindings && this._childBindings.length > 0) {
				var arr = [];
				this._cachedChildBindings = arr.concat.apply(arr,this._childBindings);
			} else {
				this._cachedChildBindings = [];
			}
		}
		return this._cachedChildBindings;
	},
	setPredicate: function(predicate) {
		var oValidPredicate = this._validPredicate;
		if (this._isValidValue(predicate)) {
			this._statement.setPredicate(predicate);
			this._validPredicate = true;
			if (oValidPredicate !== true && this._oneValidChild === true) {
				this._notifyValidityChange(true);
			}
		} else {
			//Note that we actually do not set the invalid value, just unassert the statement.
			this._validPredicate = false;
			if (oValidPredicate !== false && this._oneValidChild === true) {
				this._notifyValidityChange(false);
			}
		}
		this.updateAssertions();
	},
	getPredicate: function() {
		return this._statement.getPredicate();
	},
	
	report: function(report) {
		if (report == null) {
			report = {errors: [], warnings: []};
		}
		
		var childrenItems = this.getItem().getChildren();
		var countValidBindings = function(bindings) {
			var counter = 0;
			for (var i=0;i<bindings.length;i++) {
				if (bindings[i].isValid()) {
					counter++;
				}
			}
			return counter;
		};
		dojo.forEach(this.getItemGroupedChildBindings(), function(bindings, index) {
			var item = childrenItems[index];

			if (item.getProperty() != null) {
				var nrOfValid = countValidBindings(bindings);
				var card = item.getCardinality();
				if (card.min != null && card.min > nrOfValid) {
					report.errors.push({parentBinding: this, item: item, message: "Too few valid values"})
				} else if (card.pref != null && card.pref > nrOfValid) {
					report.warnings.push({parentBinding: this, item: item, message: "Too few valid values"})
				}
				if (card.max != null && card.max < nrOfValid) {
					report.errors.push({parentBinding: this, item: item, message: "Too many values"})
				}
			}

			// if (item instanceof GroupBinding){
			if (item.getType() === "group") {
				dojo.forEach(bindings, function(binding) {
					binding.report(report);
				});
			}
		}, this);
		return report;
	},
	
	//===================================================
	// Inherited methods
	//===================================================
	constructor: function(args) {
		this._constraints = args.constraints || [];
		//Generates an array of arrays, one array for each child item.
		this._childBindings = dojo.map(this._item.getChildren(), function(child) {
			return [];
		});
		this._rootUri = args.childrenRootUri;
		if (this._statement) {
			this._validPredicate = this._isValidValue(this._statement.getPredicate());
		}
	},
	remove: function() {
		this._oneValidChild = false;
        this.setAncestorValid(false);
		if (this._parent !== undefined) {
			this._parent.removeChildBinding(this);
		}
		this.inherited("remove", arguments);
	},
	isValid: function() {
		if (this._oneValidChild === undefined) {
			this._oneValidChild = this._forceOneValidChildCheck();
		}
		return this._oneValidChild && this._validPredicate;
	},
	setAncestorValid: function(valid) {
		this._ancestorValid = valid;
		this.updateAssertions();
		dojo.forEach(this._childBindings, function(bindingArr) {
			dojo.forEach(bindingArr, function(binding) {
				binding.setAncestorValid(valid && this._oneValidChild && this._validPredicate);
			}, this);
		}, this);
	},
	updateAssertions: function() {
		if(this._oneValidChild === undefined){
			this.isValid()
		}
		var assert = this._ancestorValid && this._oneValidChild && this._validPredicate;
		if (this._statement !== undefined) {
			this._statement.setAsserted(assert);
		}
		dojo.forEach(this._constraints, function(constraintStmt) {
			constraintStmt.setAsserted(assert);
		});
        dojo.forEach(this.getChildBindings(), function(binding) {
            binding.updateAssertions();
        })
	},

	//===================================================
	// Private methods
	//===================================================
	_forceOneValidChildCheck: function() {
		return dojo.some(this._childBindings, function(arr) {
			return dojo.some(arr, function(binding) {
				return binding.isValid();
			});
		});
	},
	_notifyValidityChange: function(newValidity) {
		if (!this._parent || !this._parent.oneChildValidityChanged(newValidity)) {
			//We can reuse the setAncestorValid method by setting the current value.
			this.updateAssertions();
			dojo.forEach(this._childBindings, function(bindingArr) {
				dojo.forEach(bindingArr, function(binding) {
					binding.setAncestorValid(newValidity);
				});
			});
		}
	}
    });
    return GroupBinding;
});