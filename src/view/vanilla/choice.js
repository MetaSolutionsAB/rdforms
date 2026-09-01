import renderingContext from '../renderingContext';
import utils from '../../utils';

const presenters = renderingContext.presenterRegistry;

// Wrap a presenter so it receives the binding's resolved choice (+ its
// description), mirroring the jquery flavor's `choicify`.
const choicify = (render) => (valueNode, binding, context) => {
  const choice = binding.getChoice();
  if (!choice) {
    return;
  }
  const locale = context.view.getLocale();
  const description = choice.description
    ? utils.getLocalizedValue(choice.description, locale).value
    : undefined;
  render(valueNode, binding, choice, description, locale);
};

// Image choice → <img>.
presenters
  .itemtype('choice')
  .style('image')
  .register(
    choicify((valueNode, binding, choice, description) => {
      const image = renderingContext.domCreate('img', valueNode);
      renderingContext.domClassToggle(image, 'rdforms-image', true);
      renderingContext.domSetAttr(image, 'src', choice.value);
      renderingContext.domSetAttr(image, 'alt', description || choice.value);
    })
  );

// Default choice → the choice label; a static/no-link choice is plain text,
// otherwise an anchor to seeAlso/value.
presenters.itemtype('choice').register(
  choicify((valueNode, binding, choice, description, locale) => {
    const item = binding.getItem();
    const localized = utils.getLocalizedValue(choice.label, locale);
    const isPlain =
      (item.hasStaticChoices() && !item.hasStyle('externalLink')) ||
      item.hasStyle('noLink');

    let node;
    if (isPlain) {
      node = renderingContext.domCreate('span', valueNode);
      renderingContext.domClassToggle(node, 'rdforms-choice', true);
    } else {
      node = renderingContext.domCreate('a', valueNode);
      renderingContext.domClassToggle(node, 'rdforms-link', true);
      renderingContext.domSetAttr(node, 'href', choice.seeAlso || choice.value);
    }
    if (description || choice.seeAlso || choice.value) {
      renderingContext.domSetAttr(
        node,
        'title',
        description || choice.seeAlso || choice.value
      );
    }
    renderingContext.domText(node, localized.value);
    if (localized.lang) {
      renderingContext.domSetAttr(node, 'lang', localized.lang);
    }

    // Dynamic choices resolve their label asynchronously.
    if (choice.load != null) {
      choice.load(() => {
        const loaded = utils.getLocalizedValue(choice.label, locale);
        renderingContext.domText(node, loaded.value);
        renderingContext.domSetAttr(node, 'lang', loaded.lang || null);
      });
    }
  })
);
