import renderingContext from '../renderingContext';
import { getDatePresentation, fromDuration } from '../viewUtils';

const presenters = renderingContext.presenterRegistry;

// Plain text value → text content of the <dd>, tagged with `lang` when the
// value carries a language.
presenters.itemtype('text').register((valueNode, binding) => {
  const language = binding.getLanguage && binding.getLanguage();
  if (language) {
    renderingContext.domSetAttr(valueNode, 'lang', language);
  }
  renderingContext.domText(valueNode, binding.getGist());
});

// URI value → an anchor inside the <dd>.
presenters
  .itemtype('text')
  .nodetype('URI')
  .register((valueNode, binding) => {
    const anchor = renderingContext.domCreate('a', valueNode);
    renderingContext.domClassToggle(anchor, 'rdforms-link', true);
    renderingContext.domSetAttr(anchor, 'href', binding.getValue());
    renderingContext.domText(anchor, binding.getGist() || binding.getValue());
  });

// URI value with the `image` style → an <img>.
presenters
  .itemtype('text')
  .nodetype('URI')
  .style('image')
  .register((valueNode, binding) => {
    const image = renderingContext.domCreate('img', valueNode);
    renderingContext.domClassToggle(image, 'rdforms-image', true);
    renderingContext.domSetAttr(image, 'src', binding.getGist());
  });

// Date/time datatypes → <time datetime="{raw}">{formatted}</time>.
const datePresenter = (valueNode, binding, context) => {
  const time = renderingContext.domCreate('time', valueNode);
  renderingContext.domSetAttr(time, 'datetime', binding.getValue());
  const formatted = getDatePresentation(binding, context.view.getLocale());
  renderingContext.domText(time, formatted || binding.getValue());
};
[
  'xsd:dateTime',
  'xsd:date',
  'xsd:time',
  'xsd:gYear',
  'xsd:gYearMonth',
  'xsd:gMonthDay',
  'dcterms:W3CDTF',
].forEach((datatype) => {
  presenters.itemtype('text').datatype(datatype).register(datePresenter);
});

// Duration → one <span> per non-zero component, labelled from the message bundle.
presenters
  .itemtype('text')
  .datatype('xsd:duration')
  .register((valueNode, binding, context) => {
    const parts = fromDuration(binding.getValue());
    const bundle = context.view.messages || {};
    ['years', 'months', 'days', 'hours', 'minutes'].forEach((unit) => {
      if (parts[unit]) {
        const span = renderingContext.domCreate('span', valueNode);
        renderingContext.domClassToggle(span, 'rdforms-duration-part', true);
        const label = bundle[`duration_${unit}`] || unit;
        renderingContext.domText(span, `${label}: ${parts[unit]}`);
      }
    });
  });
