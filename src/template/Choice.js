import { namespaces as ns } from '@entryscape/rdfjson';
import Item from './Item';

const expandValues = (choices) => {
  if (choices == null) {
    return;
  }
  choices.forEach((c) => {
    c.value = ns.expand(c.value);
  });
};

export default class Choice extends Item {
  /**
   * A choice item type indicates that the value should be one of a range of predefined choices,
   * these predefined choices can be defined manually in the template or extracted from an external
   * ontology (indicated by the ontologyUrl) by means of a query that can be constructed from the constraints.
   *
   * TODO:
   * The choices can also be organized into a hierarchy using the parent and hierarchy properties.
   */
  constructor(params) {
    super(params);
    this._ontologyStore = params.ontologyStore;
  }

  // ===================================================
  // Public API
  // ===================================================
  /**
   *  A choice is an object which looks like:
   * {"value": "http://example.com/choice1",
   *  "label": {"en": "First choice", "sv": "FÃ¶rsta valet"}
   * }
   *
   * @return {Array} of choices.
   */
  getChoices(original) {
    return this.getStaticChoices(original) || this.getDynamicChoices(original) || [];
  }

  /**
   * @return {Boolean} true if there is an ontology or static choices.
   */
  hasChoices(original) {
    const s = this.getSource(original);
    return s.ontologyUrl != null || s.choices != null;
  }

  hasStaticChoices(original) {
    const s = this.getSource(original);
    return s.choices != null;
  }

  /**
   * @return {Array} of choices defined manually in the Template.
   */
  getStaticChoices(original) {
    const s = this.getSource(original);
    if (s.choices) {
      const isURI = this.getNodetype().indexOf('LITERAL') === -1;
      if (original && this.isExtention()) {
        if (!this._origStaticIsSorted) {
          if (isURI) {
            expandValues(s.choices);
          }
          this._origStaticIsSorted = true;
        }
      } else if (!this._staticIsSorted) {
        if (isURI) expandValues(s.choices);
        this._staticIsSorted = true;
      }
    }
    return s.choices;
  }

  setStaticChoices(choices) {
    const s = this.getSource(true);
    if (s.choices === choices) {
      return;
    }
    if (choices != null) {
      this._origStaticIsSorted = true;
    }
    s.choices = choices;
    this.refreshExtends();
  }

  setExtends(extendsStr) {
    super.setExtends(extendsStr);
    delete this._staticIsSorted;
    delete this._origStaticIsSorted;
  }

  /**
   * Fetches choices from an external ontology.
   *
   * @param {Object} callback will be called asynchronously, if undefined the call is made synchronously.
   * @return {Array} of choice objects, only provided if method called without callback.
   */
  getDynamicChoices(callback) {
    if (this._dynamicChoices == null) {
      if (callback == null) {
        this._dynamicChoices = this._ontologyStore.getChoices(this);
        return this._dynamicChoices;
      }
      this._ontologyStore.getChoices(this, (choices) => {
        this._dynamicChoices = choices;
        if (this._dynamicChoices == null) {
          console.log(`Failed lookup of choices for ${this.getLabel()}`);
          console.log(`OntologyUrl is: ${this._source.ontologyUrl}`);
        }
        callback(this._dynamicChoices);
      });
    } else {
      if (callback == null) {
        return this._dynamicChoices;
      }
      callback(this._dynamicChoices);
    }
    return undefined;
  }

  getOntologyUrl(original) {
    const ou = this.getSource(original).ontologyUrl;
    if (ou != null && ou !== '') {
      return ns.expand(ou);
    }
    return ou;
  }

  setOntologyUrl(url) {
    const s = this.getSource(true);
    if (url == null || url === '') {
      delete s.ontologyUrl;
    } else {
      s.ontologyUrl = url;
    }
    this.refreshExtends();
  }


  getLabelProperties(original) {
    return this.getSource(original).labelProperties ||
      ['http://www.w3.org/2000/01/rdf-schema#label'];
  }

  getParentProperty(original) {
    const pp = this.getSource(original).parentProperty;
    if (pp != null && pp !== '') {
      return ns.expand(pp);
    }
    return pp;
  }

  setParentProperty(prop) {
    const s = this.getSource(true);
    if (prop == null || prop === '') {
      delete s.parentProperty;
    } else {
      s.parentProperty = prop;
    }
    this.refreshExtends();
  }

  getHierarchyProperty(original) {
    const hp = this.getSource(original).hierarchyProperty;
    if (hp != null && hp !== '') {
      return ns.expand(hp);
    }
    return hp;
  }

  setHierarchyProperty(prop) {
    const s = this.getSource(true);
    if (prop == null || prop === '') {
      delete s.hierarchyProperty;
    } else {
      s.hierarchyProperty = prop;
    }
    this.refreshExtends();
  }

  isParentPropertyInverted(original) {
    return this.getSource(original).isParentPropertyInverted === true;
  }

  setParentPropertyInverted(inverted) {
    const s = this.getSource(true);
    if (inverted === true) {
      s.isParentPropertyInverted = true;
    } else {
      delete s.isParentPropertyInverted;
    }
    this.refreshExtends();
  }

  isHierarchyPropertyInverted(original) {
    return this.getSource(original).isHierarchyPropertyInverted === true;
  }

  setHierarchyPropertyInverted(inverted) {
    const s = this.getSource(true);
    if (inverted) {
      s.isHierarchyPropertyInverted = true;
    } else {
      delete s.isHierarchyPropertyInverted;
    }
    this.refreshExtends();
  }
}
