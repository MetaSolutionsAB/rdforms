import ChoiceBinding from './ChoiceBinding';

export default class PropertyChoiceBinding extends ChoiceBinding {
  /**
   * Are only used as the first child of a PropertyGroupBinding to capture
   * a variable predicate.
   */
  constructor({objectBinding}) {
    super({objectBinding});
    this._objectBinding = objectBinding;
  }

  /**
   * Remove shold not be doubled, hence it is handled by the objectBinding
   * delegated from the parent PropertyGroupBinding.
   */
  remove() {
  }

  /**
   * The object binding handles the RDF statement, hence go through it to set
   * the predicate, note not the setValue function because that sets the object
   * rather than the predicate.
   * @param {Object} value
   */
  setValue(value) {
    this._objectBinding.setPredicate(value);
  }

  getValue() {
    return this._objectBinding.getPredicate();
  }

  /**
   * Validity is controlled via the objectBinding, when it is valid the
   * parent PropertyGroupBinding will be valid since only one child is
   * enough to enable validity. Hence, this PropertyChoiceBinding can
   * be false all the time since it has no children and does not affect
   * the above hierarchy (and does not control assertment of statements).
   */
  isValid() {
    return false;
  }

  /**
   * Does nothing, similar reason as for isValid.
   */
  updateAssertions() {
  }
};