import ValueBinding from './ValueBinding';

/**
 * A binding corresponding to a text item with no property, allowing editing the
 * object in the statement of the group above.
 * The purpose it to allow editing URIs inside of a hierarchy, e.g. consider the following graph:
 *
 * http://example.com rdfs:seeAlso http://slashdot.org .
 * http://slashdot.org rdfs:label "Slashdot" .
 *
 * Allowing to edit both the URI (slashdot above) and it's label requires a construction like the following:
 *
 *  - GroupItem with property rdfs:seeAlso   (GroupBinding)
 *     - TextItem without property           (GroupURIBinding)
 *     - TextItem with property rdfs:label   (ValueBinding)
 *
 * @exports {rdforms/model/GroupURIBinding}
 * @class
 * @see rdforms/template/Text
 */
export default class GroupURIBinding extends ValueBinding {
  /**
   * @return {String} corresponding to the value, even if the nodetype is URI
   * or datatype says for example date.
   */
  getValue() {
    return this._parent.getValue();
  }

  setValue(value) {
    return this._parent.setValue(value);
  }
  getGist() {
    return this._parent.getGist();
  }

  setGist(value, silent) {
    return this._parent.setGist(value, silent);
  }

  setSubject(uri) {}

  /**
   * @return {String} corresponding to a uri.
   */
  getPredicate() {
    return this._parent.getPredicate();
  }

  remove() {
    this._parent.removeChildBinding(this);
    super.remove(arguments);
  }

  updateAssertions() {}

  isValid() {
    return true;
  }
}
