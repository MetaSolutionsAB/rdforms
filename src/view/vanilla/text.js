import renderingContext from '../renderingContext';
import { getDatePresentation, fromDuration } from '../viewUtils';
import utils from '../../utils';

const presenters = renderingContext.presenterRegistry;

// Plain text value → text content of the <dd>, tagged with `lang` when the
// value carries a language. When `showLanguage` is on (the Presenter default),
// the language code is also surfaced as a real <span> — matching the other
// flavors (jquery/react), which render a visible `rdformsLanguage` element
// gated on the same option rather than relying on CSS.
presenters.itemtype('text').register((valueNode, binding, context) => {
  const language = binding.getLanguage && binding.getLanguage();
  if (language) {
    renderingContext.domSetAttr(valueNode, 'lang', language);
  }
  renderingContext.domText(valueNode, binding.getGist());
  if (context.view.showLanguage && language) {
    // A real space detaches the code from the value text so it stays readable
    // without the opt-in stylesheet (which adds no margin).
    valueNode.append(' ');
    const languageTag = renderingContext.domCreate('span', valueNode);
    renderingContext.domClassToggle(languageTag, 'rdforms-language', true);
    renderingContext.domText(languageTag, language);
  }
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

// URI value with the `image` style → an <img>. alt falls back to the field
// label (the only human-readable descriptor available for a text image), then
// the value — never left unset, which would leave the image unlabelled to
// assistive tech.
presenters
  .itemtype('text')
  .nodetype('URI')
  .style('image')
  .register((valueNode, binding, context) => {
    const image = renderingContext.domCreate('img', valueNode);
    renderingContext.domClassToggle(image, 'rdforms-image', true);
    renderingContext.domSetAttr(image, 'src', binding.getGist());
    const labelMap = binding.getItem().getLabelMap();
    const label =
      labelMap &&
      utils.getLocalizedValue(labelMap, context.view.getLocale()).value;
    renderingContext.domSetAttr(image, 'alt', label || binding.getValue());
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

// Duration → a <time> carrying the raw ISO 8601 duration (P…) in its datetime
// attribute (the <time> element accepts durations, not just dates — parity with
// the date presenter). The readable text is produced by Intl.DurationFormat,
// which is locale-aware and driven by the view locale (so it follows the same
// locale as dates/labels). Intl.DurationFormat is Baseline 2025, so where it's
// unavailable we fall back to one <span> per non-zero component labelled from
// the message bundle (space-separated so it reads without a stylesheet).
presenters
  .itemtype('text')
  .datatype('xsd:duration')
  .register((valueNode, binding, context) => {
    const parts = fromDuration(binding.getValue());
    const time = renderingContext.domCreate('time', valueNode);
    renderingContext.domSetAttr(time, 'datetime', binding.getValue());
    if (typeof Intl.DurationFormat === 'function') {
      // Intl.DurationFormat drops zero-valued units on its own.
      const durationFormat = new Intl.DurationFormat(context.view.getLocale(), {
        style: 'long',
      });
      renderingContext.domText(time, durationFormat.format(parts));
      return;
    }
    const bundle = context.view.messages || {};
    ['years', 'months', 'days', 'hours', 'minutes'].forEach((unit) => {
      if (parts[unit]) {
        // A real space separates the parts so they read correctly without any
        // stylesheet (there is no CSS gap on .rdforms-duration-part).
        if (time.hasChildNodes()) {
          time.append(' ');
        }
        const span = renderingContext.domCreate('span', time);
        renderingContext.domClassToggle(span, 'rdforms-duration-part', true);
        const label = bundle[`duration_${unit}`] || unit;
        renderingContext.domText(span, `${label}: ${parts[unit]}`);
      }
    });
  });
