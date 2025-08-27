import { isEqual } from 'lodash';

export default class OntologyStore {
  /**
   * Simple store of ontologies to allow reuse across templates and items.
   */
  constructor() {
    this._registry = {};
  }

  //= ==================================================
  // Public API
  //= ==================================================
  importRegistry(registry) {
    Object.assign(this._registry, registry);
  }

  getChoices(choiceItem, callback) {
    const choices = this._findChoices(choiceItem);
    if (choices == null) {
      // TODO load via xhr and deferred.
    } else {
      if (callback == null) {
        return choices;
      }
      callback(choices);
    }
    return undefined;
  }

  //= ==================================================
  // Private methods
  //= ==================================================
  _findChoices(item) {
    const ontologyChoiceArr = this._registry[item.getOntologyUrl()];
    if (ontologyChoiceArr != null) {
      for (let ind = 0; ind < ontologyChoiceArr.length; ind++) {
        const obj = ontologyChoiceArr[ind];
        if (isEqual(obj.constraints, item.getConstraints()) &&
          item.getParentProperty() === obj.parentProperty &&
          item.getHierarchyProperty() === obj.hierarchyProperty &&
          item.isParentPropertyInverted() === (obj.isParentPropertyInverted || false) &&
          item.isHierarchyPropertyInverted() === (obj.isHierarchyPropertyInverted || false)) {
          return obj.choices;
        }
      }
    }
    return undefined;
  }

  // eslint-disable-next-line class-methods-use-this
  _constructLoadUrl(choiceItem) {
    const params = [];
    params.push(`constr=${encodeURIComponent(JSON.stringify(choiceItem.getConstraints()))}`);
    if (choiceItem.getParentProperty() != null) {
      const pp = choiceItem.isParentPropertyInverted() === true ? 'ipp=' : 'pp=';
      params.push(pp + encodeURIComponent(choiceItem.getParentProperty()));
    }
    if (choiceItem.getHierarchyProperty() != null) {
      const hp = choiceItem.isHierarchyPropertyInverted() === true ? 'ihp=' : 'hp=';
      params.push(hp + encodeURIComponent(choiceItem.getHierarchyProperty()));
    }
    return `${choiceItem.getOntologyUrl()}?${params.join('&')}`;
  }
}
