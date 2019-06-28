import Registry from './Registry';
import system from '../model/system';

import {i18n, NLSMixin} from 'esi18n';
import nlsRdforms from './nls/rdforms.nls';

system.getChoice = function (item, value) {
  const chooser = renderingContext.chooserRegistry.getComponent(item);
  if (chooser == null) {
    throw new Error(`Error, no chooser available to retrieve a choice for item: ${item.getId()}`);
  }
  return chooser.getChoice(item, value);
};
let popoverContainer = 'body';
let messages;
let language;
let languages;
let primaryLanguageCodes;
let primaryLanguages;
let nonPrimaryLanguages;
const defaultLanguages = [
  {value: '', label: {en: ''}},
  {value: 'bg', label: {en: 'Bulgarian', bg: 'български'}},
  {value: 'es', label: {en: 'Spanish', es: 'Español'}},
  {value: 'cs', label: {en: 'Czech', cs: 'čeština'}},
  {value: 'da', label: {en: 'Danish', da: 'Dansk'}},
  {value: 'no', label: {en: 'Norwegian', no: 'Norsk', nb: 'Norsk', nn: 'Norsk nynorsk'}},
  {
    value: 'nb',
    label: {
      en: 'Norwegian (bokmål)',
      nb: 'Norsk bokmål',
      no: 'Norsk bokmål',
      nn: 'Norsk bokmål',
    },
  },
  {
    value: 'nn',
    label: {
      en: 'Norwegian (nynorsk)',
      nb: 'Norsk nynorsk',
      no: 'Norsk nynorsk',
      nn: 'Norsk nynorsk',
    },
  },
  {value: 'de', label: {en: 'German', de: 'Deutsch'}},
  {value: 'et', label: {en: 'Estonian', et: 'Eesti keel'}},
  {value: 'el', label: {en: 'Greek', el: 'ελληνικά'}},
  {value: 'en', label: {en: 'English'}},
  {value: 'fr', label: {en: 'French', fr: 'Français'}},
  {value: 'ga', label: {en: 'Irish', ga: 'Gaeilge'}},
  {value: 'hr', label: {en: 'Croatian', hr: 'Hrvatski'}},
  {value: 'it', label: {en: 'Italian', it: 'Italiano'}},
  {value: 'lv', label: {en: 'Latvian', lv: 'Latviešu valoda'}},
  {value: 'lt', label: {en: 'Lithuanian', lt: 'Lietuvių kalba'}},
  {value: 'hu', label: {en: 'Hungarian', hu: 'Magyar'}},
  {value: 'mt', label: {en: 'Maltese', mt: 'Malti'}},
  {value: 'nl', label: {en: 'Dutch', nl: 'Nederlands'}},
  {value: 'pl', label: {en: 'Polish', pl: 'Polski'}},
  {value: 'pt', label: {en: 'Portuguese', pt: 'Português'}},
  {value: 'ro', label: {en: 'Romanian', ro: 'Română'}},
  {value: 'sk', label: {en: 'Slovak', sk: 'Slovenčina'}},
  {value: 'sl', label: {en: 'Slovenian', sl: 'Slovenščina'}},
  {value: 'fi', label: {en: 'Finnish', fi: 'Suomi'}},
  {value: 'sv', label: {en: 'Swedish', sv: 'Svenska'}},
];

const renderingContext = {
  domQuery(/* selector, node */) {
  },
  domCreate(/* domStr, node */) {
  },
  domCreateAfter(/* domStr, node */) {
  },
  domClassToggle(/* node, classStr, addOrRemove */) {
  },
  domSetAttr(/* node, attr, value */) {
  },
  domText(/* node, text */) {
  },
  presenterRegistry: new Registry(),
  editorRegistry: new Registry(),
  /**
   * Provides a registry of choosers. Each chooser have with the following attributes:
   * getChoice - function(item, value) -> choice
   *  (i.e. a function that takes the arguments item and value and returns a choice.
   *   If the choice cannot be provided in full directly it is possible to include a
   *   load method in the object with a onSuccess and onError methods as parameters.)
   * show - function(binding, onSelect)
   *   (I.e. a function that given a binding launches the chooser dialog, when the user is
   *   finished and has made his selection the onSelect method will be called with the
   *   selected choice.)
   */
  chooserRegistry: new Registry(),
  renderPresenter(node, binding, context) {
    const renderer = renderingContext.presenterRegistry.getComponent(binding.getItem());
    if (renderer) {
      renderingContext.prePresenterRenderer(node, binding, context);
      renderer(node, binding, context);
      renderingContext.postPresenterRenderer(node, binding, context);
    }
  },
  renderEditor(node, binding, context) {
    const renderer = renderingContext.editorRegistry.getComponent(binding.getItem());
    if (renderer) {
      renderingContext.preEditorRenderer(node, binding, context);
      renderer(node, binding, context);
      renderingContext.postEditorRenderer(node, binding, context);
    }
  },
  renderSelect(/* fieldDiv, binding, context */) {
  },
  getChoice: system.getChoice,
  openChoiceSelector(binding, callback) {
    const chooser = renderingContext.chooserRegistry.getComponent(binding.getItem());
    if (chooser == null) {
      const item = binding.getItem();
      alert(`Error, no chooser available to open a choice selector for: ${item}`);
      return;
    }
    chooser.show(binding, callback);
  },
  getExtLinkClass() {
    return '';
  },
  setMessages(msgs) {
    messages = msgs;
  },
  getMessages(callback) {
    if (messages) {
      callback(messages);
    } else {
      const newMessages = i18n.getLocalization(nlsRdforms);
      callback(newMessages);
    }
  },
  /**
   * This method returns a list of language-codes and their labels (in several translations)
   * An example for English looks like this:
   * {
   *   "value": "en",
   *   "label": {"en": "English", "sv": "Engelska"}
   * }
   *
   * @return {Array} of languages.
   */
  getLanguageList() { // TODO: Take this list from some kind of configuration
    return languages || defaultLanguages;
  },

  /**
   * @return {Array} of languages, subset of getLanguageList.
   */
  getPrimaryLanguageList() {
    if (!primaryLanguages) {
      const langs = renderingContext.getLanguageList();
      const pLangs = primaryLanguageCodes || [];
      const filteredPrimaryLangs = [];
      let empty;
      for (let i = 0; i < langs.length; i++) {
        const val = langs[i].value;
        const idx = pLangs.indexOf(val);
        if (val === '') {
          empty = langs[i];
        }
        if (idx !== -1) {
          // Sets in position to preserve order of primary languages
          filteredPrimaryLangs[idx] = langs[i];
        }
      }
      primaryLanguages = [];
      for (let j = 0; j < filteredPrimaryLangs.length; j++) {
        if (typeof filteredPrimaryLangs[j] === 'object') {
          primaryLanguages.push(filteredPrimaryLangs[j]);
        }
      }
      if (primaryLanguages.length > 0 && empty) {
        primaryLanguages.splice(0, 0, empty);
      }
    }
    return primaryLanguages;
  },

  /**
   * @return {Array} of languages, subset of getLanguageList.
   */
  getNonPrimaryLanguageList() {
    if (!nonPrimaryLanguages) {
      const pl = renderingContext.getPrimaryLanguageList();
      const excludeEmpty = pl.length > 0;
      const langs = renderingContext.getLanguageList();
      const pLangs = primaryLanguageCodes || [];
      nonPrimaryLanguages = [];
      for (let i = 0; i < langs.length; i++) {
        const val = langs[i].value;
        if (pLangs.indexOf(val) === -1) {
          if (!excludeEmpty || val !== '') {
            nonPrimaryLanguages.push(langs[i]);
          }
        }
      }
    }
    return nonPrimaryLanguages;
  },

  /**
   * Set a subset of languages that are going to be treated as primary languages,
   * typically displayed at the top of dropdowns.
   *
   * @param {string[]} primaryLangs is an array of language codes,
   * any languages not being a subset of the full language list is discardeed.
   */
  setPrimaryLanguageCodes(primaryLangCodes) {
    nonPrimaryLanguages = null;
    primaryLanguages = null;
    primaryLanguageCodes = primaryLangCodes;
  },

  setLanguageList(langs) {
    languages = langs;
  },

  setDefaultLanguage(newLanguage) {
    language = newLanguage;
  },

  getDefaultLanguage() {
    return i18n.getLocale();
  },

  setPopoverContainer(container) {
    popoverContainer = container;
  },

  getPopoverContainer() {
    return popoverContainer;
  },

  // Override the following methods
  preEditorViewRenderer(viewNode, binding) {
  },
  prePresenterViewRenderer(viewNode, binding) {
  },
  preEditorRenderer() {
  },
  postEditorRenderer() {
  },
  prePresenterRenderer() {
  },
  postPresenterRenderer() {
  },
  renderEditorLabel(/* rowNode, binding, item, context */) {
  },
  renderPresenterLabel(/* rowNode, binding, item, context */) {
  },
  attachItemInfo(/* item, aroundNode, context */) {
  },
  addCreateChildButton(/* rowDiv, labelDiv, binding, context */) {
  },
  addGroupButtons(/* rowDiv, labelDiv, binding, context */) {
  },
  addExpandButton(/* rowDiv, labelDiv, item, context */) {
  },
  addRemoveButton(/* fieldDiv, binding, context, onReset */) {
  },
  addPresenterTable(/* lastRow, firstBinding, context */) {
  },
  fillPresenterTable(/* table, bindings, context */) {
  },
  addEditorTable(/* lastRow, firstBinding, context */) {
  },
  fillEditorTable(/* table, bindings, context */) {
  },
};

const groupPresenter = (fieldDiv, binding, context) => {
  const Cls = context.view.constructor;
  // eslint-disable-next-line no-new
  new Cls({
    parentView: context.view,
    messages: context.view.messages,
    binding,
    topLevel: false,
    includeLevel: context.view.includeLevel, // Copied from groupEditor, was this.includeLevel but that 'this' does not make sense here
  }, fieldDiv);
};

renderingContext.presenterRegistry.itemtype('group').register(groupPresenter);
renderingContext.presenterRegistry.itemtype('propertygroup').register(groupPresenter);

const groupEditor = (fieldDiv, binding, context) => {
  const Cls = context.view.constructor;
  const subView = new Cls({
    parentView: context.view,
    messages: context.view.messages,
    languages: context.view.languages,
    binding,
    topLevel: false,
    includeLevel: context.view.includeLevel,
  }, fieldDiv);
  context.view._subEditors.push(subView);
};
renderingContext.editorRegistry.itemtype('group').register(groupEditor);
renderingContext.editorRegistry.itemtype('propertygroup').register(groupEditor);
const bundle = {

  edit_add: "Add",
  edit_remove: "Remove",
  edit_browse: "Browse and select",
  edit_expand: "Expand",
  edit_upgrade: "Provide additional information for this web address",
  info_label: "Label",
  info_property: "Property",
  info_description: "Description",
  address_label: "Address",
  validation_min_required: "{{PLURAL:$1|at least one value is|a minimum of $1 values is}} required",
  validation_min_recommended: "{{PLURAL:$1|at least one value is|a minimum of $1 values is}} recommended",
  validation_max: "{{PLURAL:$1|at most one value is|a maximum of $1 values are}} allowed",
  validation_disjoint: "A maximum of one value is allowed",
  validation_deprecated: "This field is deprecated",
  date_date: "Date",
  date_year: "Year",
  date_date_and_time: "Date and time",
  mandatoryLabel: "Mandatory",
  recommendedLabel: "Recommended",
  optionalLabel: "Optional",
  today: "Today",
  mandatoryMark: "*",
  recommendedMark: "(Recommended)",
  optionalMark: "(Optional)"

};
renderingContext.setMessages(bundle);

export default renderingContext;
