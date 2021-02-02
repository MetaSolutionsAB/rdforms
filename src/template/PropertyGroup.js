import Group from './Group';

export default class PropertyGroup extends Group {
  /**
   * A PropertyGroup captures the special case when both the predicate and object of a
   * tripple should be changable. This is achieved by having a PropertyGroup where the
   * first child is a Choice item corresponding to the predicate and the second being
   * an item corresponding to the object in the triple. The second item can be either a
   * Text, Choice or Group item depending on the kind of object envisioned in the triple.
   */
  getChildren(original) {
    if (this._delegatedChildren == null) {
      const getCardinality = () => ({ min: 1, max: 1, pref: 1 });
      const children = super.getChildren(original) || [];
      this._delegatedChildren = children.map((child) => {
        const delegate = Object.create(child);
        delegate.getCardinality = getCardinality;
        return delegate;
      });
    }
    return this._delegatedChildren;
  }

  getPropertyItem() {
    return this.getChildren()[0];
  }

  getObjectItem() {
    return this.getChildren()[1];
  }
};
