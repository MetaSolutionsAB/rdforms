import { escape } from 'lodash-es';
import { getDatePresentation, fromDuration } from '../viewUtils';
import renderingContext from '../renderingContext';
import utils from '../../utils';
import system from '../../model/system';


const presenters = renderingContext.presenterRegistry;

// Presenter for URIs.
presenters.itemtype('text').nodetype('URI').register((fieldDiv, binding/* , context */) => {
  const vmap = utils.getLocalizedMap(binding);
  const $a = jquery('<a class="rdformsUrl">')
    .attr('title', binding.getValue())
    .attr('href', binding.getValue())
    .appendTo(fieldDiv);
  if (binding.getItem().hasStyle('showValue')) {
    $a.text(binding.getValue());
  } else if (vmap) {
    $a.text(utils.getLocalizedValue(vmap).value);
  } else {
    $a.text(binding.getGist());
  }
  if (binding.getItem().hasStyle('externalLink')) {
    system.attachExternalLinkBehaviour($a[0], binding);
  } else {
    system.attachLinkBehaviour($a[0], binding);
  }
});


// Presenter for URIs.
presenters.itemtype('group').nodetype('URI').style('linkWithLabel').register((fieldDiv, binding, context) => {
  const val = binding.getValue();
  const labelItem = binding.getItem().getChildren().find(i => i.hasStyle('label'));
  const labelBindings = labelItem ?
    renderingContext.filterTranslations(binding.getChildBindingsFor(labelItem), context.view.getLocale(),
      context.view.defaultLanguage) : [];

  const tooltipItem = binding.getItem().getChildren().find(i => i.hasStyle('tooltip'));
  const tooltipBindings = tooltipItem ?
    renderingContext.filterTranslations(binding.getChildBindingsFor(tooltipItem), context.view.getLocale(),
      context.view.defaultLanguage) : [];
  const tooltip = tooltipBindings.length > 0 ? tooltipBindings[0].getValue() : val;

  const $a = jquery('<a class="rdformsUrl">')
    .attr('title', tooltip)
    .attr('href', val)
    .appendTo(fieldDiv);

  let lbl;
  if (labelBindings.length > 0) {
    lbl = labelBindings[0].getValue();
  } else {
    const vmap = utils.getLocalizedMap(binding);
    // eslint-disable-next-line no-nested-ternary
    lbl = binding.getItem().hasStyle('showValue') ? val :
      (vmap ? utils.getLocalizedValue(vmap).value || val : binding.getGist());
  }

  $a.text(lbl);
  if (binding.getItem().hasStyle('externalLink')) {
    system.attachExternalLinkBehaviour($a[0], binding);
  } else {
    system.attachLinkBehaviour($a[0], binding);
  }
});


// Presenter for images.
presenters.itemtype('text').nodetype('URI').style('image')
  .register((fieldDiv, binding/* , context */) => {
    jquery('<img class="rdformsImage">').attr('src', binding.getGist()).appendTo(fieldDiv);
  });

// Presenter for text.
presenters.itemtype('text').register((fieldDiv, binding, context) => {
  const language = binding.getLanguage();
  if (context.view.showLanguage && language) {
    jquery('<div class="rdformsLanguage">').text(language).appendTo(fieldDiv);
  }
  const text = escape(binding.getItem().hasStyle('showValue') ? binding.getValue() : binding.getGist())
    .replace(/(\r\n|\r|\n)/g, '\n');

  // The text is shown as a link to the parents bindings URI if:
  // 1) The current item is indicated to be a label.
  // 2) The presenter is not at topLevel.
  // 3) The current item is first in the parents list of children.
  // 4) The parent binding corresponds to a URI
  const parentBinding = binding.getParent();
  if (binding.getItem().hasStyle('label')
    && context.view.topLevel !== true
    && parentBinding != null && parentBinding.getItem().getChildren()[0] === binding.getItem()
    && parentBinding.getStatement() != null && parentBinding.getStatement().getType() === 'uri') {
    const $a = jquery('<a class="rdformsUrl">')
      .attr('href', parentBinding.getStatement().getValue())
      .html(text)
      .appendTo(fieldDiv);
    if (language) {
      $a.attr('lang', language);
    }
    system.attachLinkBehaviour($a[0], parentBinding);
  } else {
    const $t = jquery('<div>').html(text).appendTo(fieldDiv);
    if (language) {
      $t.attr('lang', language);
    }
  }

  if (binding.getItem().hasStyle('multiline')) {
    jquery(fieldDiv).toggleClass('rdformsMultiline', true);
  } else {
    jquery(fieldDiv).toggleClass('rdformsSingleline', true);
  }
});

// Presenter for duration
presenters.itemtype('text').datatype('xsd:duration').register((fieldDiv, binding, context) => {
  const data = fromDuration(binding.getValue());
  const bundle = context.view.messages;
  const node = jquery('<div>').appendTo(fieldDiv)[0];
  ['years', 'months', 'days', 'hours', 'minutes'].forEach((key) => {
    if (data.hasOwnProperty(key) && data[key] !== 0) {
      jquery(`<span class="durationLabel">${bundle[`duration_${key}`]}:</span><span class="durationValue">${data[key]}</span>`)
        .appendTo(node);
    }
  });
});

const datePresenter = (fieldDiv, binding, context) => {
  try {
    const pres = getDatePresentation(binding, context.view.getLocale());
    jquery('<div>').html(pres).appendTo(fieldDiv);
  } catch (e) {
    console.warn(`Could not present date, expected ISO8601 format in the form 2001-01-01 
    (potentially with time given after a 'T' character as well) but found '${binding.getValue()}' instead.`);
  }
};
presenters.itemtype('text').datatype('xsd:dateTime').register(datePresenter);
presenters.itemtype('text').datatype('xsd:date').register(datePresenter);
presenters.itemtype('text').datatype('xsd:time').register(datePresenter);
presenters.itemtype('text').datatype('xsd:gYear').register(datePresenter);
presenters.itemtype('text').datatype('xsd:gYearMonth').register(datePresenter);
presenters.itemtype('text').datatype('xsd:gMonthDay').register(datePresenter);
presenters.itemtype('text').datatype('dcterms:W3CDTF').register(datePresenter);
