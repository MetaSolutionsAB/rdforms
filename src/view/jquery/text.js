import { fromDuration } from './util';
import moment from 'moment';
import renderingContext from '../renderingContext';
import utils from '../../utils';
import system from '../../model/system';
import { escape } from 'lodash-es';

const presenters = renderingContext.presenterRegistry;

// Presenter for URIs.
presenters.itemtype('text').nodetype('URI').register((fieldDiv, binding/* , context */) => {
  const vmap = utils.getLocalizedMap(binding);
  const $a = jquery('<a class="rdformsUrl">')
    .attr('title', binding.getValue())
    .attr('href', binding.getValue())
    .appendTo(fieldDiv);
  if (vmap) {
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

// Presenter for images.
presenters.itemtype('text').nodetype('URI').style('image')
  .register((fieldDiv, binding/* , context */) => {
    jquery('<img class="rdformsImage">').attr('src', binding.getGist()).appendTo(fieldDiv);
  });

// Presenter for text.
presenters.itemtype('text').register((fieldDiv, binding, context) => {
  if (context.view.showLanguage && binding.getLanguage()) {
    jquery('<div class="rdformsLanguage">').text(binding.getLanguage()).appendTo(fieldDiv);
  }
  const text = escape(binding.getGist());

  // The text is shown as a link to the parents bindings URI if:
  // 1) The current item is indicated to be a label.
  // 2) The presenter is not at topLevel.
  // 3) The current item is first in the parents list of children.
  // 4) The parent binding corresponds to a URI
  const parentBinding = binding.getParent();
  if (binding.getItem().hasStyle('label')
    && this.topLevel !== true
    && parentBinding != null && parentBinding.getItem().getChildren()[0] === binding.getItem()
    && parentBinding.getStatement() != null && parentBinding.getStatement().getType() === 'uri') {
    const $a = jquery('<a class="rdformsUrl">')
      .attr('href', parentBinding.getStatement().getValue())
      .html(text)
      .appendTo(fieldDiv);
    system.attachLinkBehaviour($a[0], parentBinding);
  } else {
    jquery('<div>').html(text).appendTo(fieldDiv);
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
  const bundle = context.view.messages
  const node = jquery('<div>').appendTo(fieldDiv)[0];
  ['years', 'months', 'days', 'hours', 'minutes'].forEach((key) => {
    if (data.hasOwnProperty(key)) {
      jquery(`<span class="durationlabel">${bundle['duration_'+key]}:</span><span class="durationValue">${data[key]}</span>`)
        .appendTo(node);
    }
  });
});

const datePresenter = (fieldDiv, binding, context) => {
  const data = binding.getValue();
  if (data != null && data !== '') {
    try {
      let str;
      if (data.indexOf('T') > 0) {
        str = moment(data).format('lll');
      } else if (data.length > 4) {
        str = moment(data).format('LL');
      } else {
        str = moment(data).format('YYYY');
      }
      jquery('<div>').html(str).appendTo(fieldDiv);
    } catch (e) {
      console.warn(`Could not present date, expected ISO8601 format in the form 2001-01-01 (potentially with time given after a 'T' character as well) but found '${data}' instead.`);
    }
  }
};
presenters.itemtype('text').datatype('xsd:date').register(datePresenter);
presenters.itemtype('text').datatype('dcterms:W3CDTF').register(datePresenter);
