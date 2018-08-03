import ValueBinding from "./ValueBinding";
import Group from "../template/Group";
import Choice from "../template/Choice";
import ChoiceBinding from "./ChoiceBinding";
import GroupBinding from "./GroupBinding";

export default class PropertyGroupBinding extends GroupBinding {
  /**
   * This is a syntactical grouping to capture the case when both the predicate and
   * the object is variable. It is achieved by having exactly two children, the first being
   * a binding for the predicate in the form of a PredicateChoiceBinding and the second
   * being a binding for the object. The object binding can be a ValueBinding, ChoiceBinding or
   * a GroupBinding. It is not allowed to be another PropertyGroupBinding though.
   *
   * @see rforms.template.PropertyGroup
   */
  constructor({statement, constraints}) {
    super({statement, constraints});

    this._statement = undefined;
    this._validPredicate = true; //Reset to initial value to ignore check from incorrect given statement in this case.
    this._constraints = [];

    const children = this._item.getChildren();
    const pItem = children[0];
    const item = children[1];
    let pBinding;
    let oBinding;

    if (item instanceof Group) {
      oBinding = new GroupBinding({item, statement, constraints});
    } else if (item instanceof Choice) {
      oBinding = new ChoiceBinding({item, statement});
    } else {
      oBinding = new ValueBinding({item, statement});
    }
    pBinding = new PropertyChoiceBinding({item: children[0], objectBinding: oBinding});

    this.addChildBinding(pBinding);
    this.addChildBinding(oBinding);
  }

  //===================================================
  // Public API
  //===================================================
  getPredicateBinding() {
    return this._childBindings[0][0];
  }

  getObjectBinding() {
    return this._childBindings[1][0];
  }

  getGraph() {
    return this.getObjectBinding().getGraph();
  }
};