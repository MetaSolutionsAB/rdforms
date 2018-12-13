import data from './data.js';

const renderingContext = window.rdforms.renderingContext;

/**
 * A chooser is a handler for a select input in RDForms choice items.
 * A chooser can manage the searching, presentation and selection of a select (choice) item.
 *  The user registration happens via the renderingContext. See the default exported funciton
 */

/**
 *
 * @type {{show(*, *): void, search(*, *): *}}
 */
const chooserConfiguration = {
  /**
   * Returns a choice object containing a value and a label.
   * Override this function to provide specific loading of a choice.
   * If you need to do this asynchonously provide a "load" method on the returned choice object.
   *
   * @param item
   * @param value
   * @returns {{value: *, load(*)}}
   */
  // getChoice(item, value) {
  //   return {
  //     value,
  //     load(onSuccess) {
  //     },
  //   };
  // },
  /**
   * You can hook here your own UI to select a choice. Once the selection has been made
   * onSelect should be called with the selected choice. This is triggered when the search icon is clicked
   *
   * @param binding
   * @param onSelect
   */
  show(binding, onSelect) {
    alert('Implement a UI for this chooser');
  },
  /**
   * Supports creation of choices on the fly
   * @param binding
   * @returns {boolean}
   */
  supportsInlineCreate(binding) {
    return false;
  },
  /**
   * Fetches the choice options.
   * Returns a promise which resolves to an array of objects. See './data' for the structure of the object.
   * Here one can hook to a 3rd party and resolve (after converting if necessary) the response into a chooser object.
   * @param item
   * @param term
   * @returns {Promise<Array>}
   */
  search(item, term) {
    return new Promise(resolve => resolve(data));
  },
}

export default () => {
  renderingContext.chooserRegistry.itemtype('choice').predicate('dcterms:publisher').register(chooserConfiguration);
};
