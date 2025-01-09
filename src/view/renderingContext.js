/* eslint-disable no-unused-vars */
import Registry from './Registry';
import system from '../model/system';
import nls from './resources/nls';

let popoverContainer = 'body';
let messages;
let languages;
let primaryLanguageCodes;
let primaryLanguages;
let nonPrimaryLanguages;
const defaultLanguages = [
  { value: '', label: { en: '' } },
  { value: 'bg', label: { en: 'Bulgarian', bg: 'български' } },
  { value: 'es', label: { en: 'Spanish', es: 'Español' } },
  { value: 'cs', label: { en: 'Czech', cs: 'čeština' } },
  { value: 'da', label: { en: 'Danish', da: 'Dansk' } },
  { value: 'no', label: { en: 'Norwegian', no: 'Norsk', nb: 'Norsk', nn: 'Norsk nynorsk' } },
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
  { value: 'de', label: { en: 'German', de: 'Deutsch' } },
  { value: 'et', label: { en: 'Estonian', et: 'Eesti keel' } },
  { value: 'el', label: { en: 'Greek', el: 'ελληνικά' } },
  { value: 'en', label: { en: 'English' } },
  { value: 'fr', label: { en: 'French', fr: 'Français' } },
  { value: 'ga', label: { en: 'Irish', ga: 'Gaeilge' } },
  { value: 'hr', label: { en: 'Croatian', hr: 'Hrvatski' } },
  { value: 'it', label: { en: 'Italian', it: 'Italiano' } },
  { value: 'lv', label: { en: 'Latvian', lv: 'Latviešu valoda' } },
  { value: 'lt', label: { en: 'Lithuanian', lt: 'Lietuvių kalba' } },
  { value: 'hu', label: { en: 'Hungarian', hu: 'Magyar' } },
  { value: 'mt', label: { en: 'Maltese', mt: 'Malti' } },
  { value: 'nl', label: { en: 'Dutch', nl: 'Nederlands' } },
  { value: 'pl', label: { en: 'Polish', pl: 'Polski' } },
  { value: 'pt', label: { en: 'Portuguese', pt: 'Português' } },
  { value: 'ro', label: { en: 'Romanian', ro: 'Română' } },
  { value: 'sk', label: { en: 'Slovak', sk: 'Slovenčina' } },
  { value: 'sl', label: { en: 'Slovenian', sl: 'Slovenščina' } },
  { value: 'fi', label: { en: 'Finnish', fi: 'Suomi' } },
  { value: 'sv', label: { en: 'Swedish', sv: 'Svenska' } },
];

const renderingContext = {
  domQuery(/* selector, node */) {
  },
  domCreate(/* domStr, node, id */) {
  },
  domCreateAfter(/* domStr, node, id */) {
  },
  domClassToggle(/* node, classStr, addOrRemove */) {
  },
  domSetAttr(/* node, attr, value */) {
  },
  domText(/* node, text */) {
  },
  createDomNode(srcNodeRef /* , view */) {
    if (srcNodeRef instanceof Node) {
      return srcNodeRef;
    } else if (typeof srcNodeRef === 'string') {
      return document.getElementById(srcNodeRef);
    }
    return document.createElement('div');
  },
  destroyDomNode(/* domNode, view */) {
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
   * query - function(item, term) -> promise with choices
   *   (I.e. a function that given an item and a searchterm gives back a promise with
   *   matching choices.)
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
  renderValidationMessage(node, type, message) {
  },
  renderSelect(/* fieldDiv, binding, context */) {
  },
  getChoice(item, value) {
    const chooser = renderingContext.chooserRegistry.getComponent(item);
    if (chooser == null) {
      throw new Error(`Error, no chooser available to retrieve a choice for item: ${item.getId()}`);
    }
    return chooser.getChoice(item, value);
  },
  hasOpenChoiceSelector(binding) {
    return renderingContext.chooserRegistry.getComponent(binding.getItem()) != null;
  },
  openChoiceSelector(binding, callback, field) {
    const chooser = renderingContext.chooserRegistry.getComponent(binding.getItem());
    if (chooser == null || !(chooser && chooser.getChoice)) {
      const item = binding.getItem();
      alert(`Error, no chooser available to open a choice selector for: ${item}`);
      return;
    }
    chooser.show(binding, callback, field);
  },
  getExtLinkClass() {
    return '';
  },
  setMessages(msgs) {
    messages = msgs;
  },
  getMessages() {
    return messages || nls; // i18n.getLocalization(nlsRdforms);
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

  filterTranslations(bindings, currentLanguage, defaultLanguage) {
    const alts = {};

    // Detect the various available languages
    // noLanguage - a binding exists with no lanugage set
    // best - a binding exists with the current locale
    // close - a binding exists with a language close to the current locale,
    //        e.g. en_US when the locale is en or the opposite
    // defaultLanguage - a binding exists with a language corresponding to the defaultLanguage
    for (let index = 0; index < bindings.length; index++) {
      const lang = bindings[index].getLanguage();
      if (lang === '' || lang == null) {
        alts.noLanguage = true;
      } else if (lang === currentLanguage) {
        alts.best = true;
      } else if (lang.indexOf(currentLanguage) !== -1 || currentLanguage.indexOf(lang) !== -1) {
        alts.close = true;
      } else if (lang.indexOf(defaultLanguage) === 0) {
        alts.defaultLanguage = true;
      }
    }
    // Filter to bindings that are best, close and defaultLanguage in that order
    if (alts.best) {
      return bindings.filter(b => b.getLanguage() === currentLanguage);
    } else if (alts.close) {
      return bindings.filter((b) => {
        const lang = b.getLanguage();
        return lang && (lang.indexOf(currentLanguage) !== -1 || currentLanguage.indexOf(lang) !== -1);
      });
    } else if (alts.defaultLanguage) {
      return bindings.filter((b) => {
        const lang = b.getLanguage();
        return lang && lang.indexOf(defaultLanguage) === 0;
      });
    }

    // If there are no best, close or defaultLanguage bindings, don't do any filtering
    return bindings;
  },

  setPopoverContainer(container) {
    popoverContainer = container;
  },

  getPopoverContainer() {
    return popoverContainer;
  },

  // Override the following methods
  // eslint-disable-next-line no-unused-vars
  preEditorViewRenderer(viewNode, binding) {
  },
  // eslint-disable-next-line no-unused-vars
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
  renderEditorLabelScopeEnd(/* rowNode, binding, item, context */) {
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
  addTruncateControl(/* fieldsDiv */) {
  }
};

system.getChoice = renderingContext.getChoice;

const groupPresenter = (fieldDiv, binding, context) => {
  const Cls = context.view.constructor;
  // eslint-disable-next-line no-new
  new Cls({
    parentView: context.view,
    renderingParams: context.view.renderingParams,
    messages: context.view.messages,
    binding,
    topLevel: false,
    compact: context.view.compact,
    showLanguage: context.view.showLanguage,
    showDescription: context.view.showDescription,
    defaultLanguage: context.view.defaultLanguage,
    filterTranslations: context.view.filterTranslations,
    popupOnLabel: context.view.popupOnLabel,
    truncate: context.view.truncate,
    truncateLimit: context.view.truncateLimit,
    includeLevel: context.view.includeLevel, // Copied from groupEditor, was this.includeLevel but that 'this' does not make sense here
  }, fieldDiv);
};

renderingContext.presenterRegistry.itemtype('group').register(groupPresenter);
renderingContext.presenterRegistry.itemtype('propertygroup').register(groupPresenter);

const groupEditor = (fieldDiv, binding, context) => {
  const Cls = context.view.constructor;
  const subView = new Cls({
    parentView: context.view,
    renderingParams: context.view.renderingParams,
    messages: context.view.messages,
    languages: context.view.languages,
    binding,
    topLevel: false,
    compact: context.view.compact,
    popupOnLabel: context.view.popupOnLabel,
    showDescription: context.view.showDescription,
    truncate: context.view.truncate,
    truncateLimit: context.view.truncateLimit,
    includeLevel: context.view.includeLevel,
  }, fieldDiv);
  context.view._subEditors.push(subView);
};
renderingContext.editorRegistry.itemtype('group').register(groupEditor);
renderingContext.editorRegistry.itemtype('propertygroup').register(groupEditor);

export default renderingContext;
