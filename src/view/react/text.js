/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo } from 'react';
import moment from 'moment';
import system from '../../model/system';
import renderingContext from '../renderingContext';
import { fromDuration } from './util';
import utils from '../../utils';


const presenters = renderingContext.presenterRegistry;

presenters.itemtype('text').datatype('xsd:duration').register((fieldDiv, binding, context) => {
  const data = fromDuration(binding.getValue());
  const keys = ['years', 'months', 'days', 'hours', 'minutes'];
  fieldDiv.appendChild(<div key={binding.getHash()}>{keys.map(key => (
    data[key] && <React.Fragment key={key}><span className="durationlabel">{
      context.view.messages[`duration_${key}`]}:</span><span className="durationValue">{data[key]}</span></React.Fragment>
  ))}</div>);
});

presenters.itemtype('text').nodetype('URI').register((fieldDiv, binding) => {
  const vmap = utils.getLocalizedMap(binding);
  const val = binding.getValue();
  const attrs = binding.getItem().hasStyle('externalLink') ?
    system.attachExternalLinkBehaviour(fieldDiv, binding) || {} :
    system.attachLinkBehaviour(fieldDiv, binding) || {};
  const component = attrs.component || null;
  delete attrs.component;
  // eslint-disable-next-line no-nested-ternary
  const lbl = binding.getItem().hasStyle('showValue') ? val :
    (vmap ? utils.getLocalizedValue(vmap).value || val : binding.getGist());
  fieldDiv.appendChild(<a {...attrs} key={binding.getHash()} title={val} href={val}><span>{lbl}</span>{component}</a>);
});

presenters.itemtype('group').nodetype('URI').style('linkWithLabel').register((fieldDiv, binding, context) => {
  const val = binding.getValue();
  const attrs = binding.getItem().hasStyle('externalLink') ?
    system.attachExternalLinkBehaviour(fieldDiv, binding) || {} :
    system.attachLinkBehaviour(fieldDiv, binding) || {};
  const component = attrs.component || null;
  delete attrs.component;
  const labelItem = binding.getItem().getChildren().find(i => i.hasStyle('label'));
  const labelBindings = labelItem ?
    renderingContext.filterTranslations(binding.getChildBindingsFor(labelItem), moment.locale(),
      context.view.defaultLanguage) : [];

  const tooltipItem = binding.getItem().getChildren().find(i => i.hasStyle('tooltip'));
  const tooltipBindings = tooltipItem ?
    renderingContext.filterTranslations(binding.getChildBindingsFor(tooltipItem), moment.locale(),
      context.view.defaultLanguage) : [];
  const tooltip = tooltipBindings.length > 0 ? tooltipBindings[0].getValue() : val;

  let lbl;
  if (labelBindings.length > 0) {
    lbl = labelBindings[0].getValue();
  } else {
    const vmap = utils.getLocalizedMap(binding);
    // eslint-disable-next-line no-nested-ternary
    lbl = binding.getItem().hasStyle('showValue') ? val :
      (vmap ? utils.getLocalizedValue(vmap).value || val : binding.getGist());
  }
  fieldDiv.appendChild(<a {...attrs} key={binding.getHash()} title={tooltip}
                          href={val}><span>{lbl}</span>{component}</a>);
});

presenters.itemtype('text').nodetype('URI').style('externalLink').register((fieldDiv, binding) => {
  const vmap = utils.getLocalizedMap(binding);
  const val = binding.getValue();
  const attrs = system.attachExternalLinkBehaviour(fieldDiv, binding) || {};
  attrs.target = attrs.target || '_blank';
  const component = attrs.component || null;
  delete attrs.component;
  // eslint-disable-next-line no-nested-ternary
  const lbl = binding.getItem().hasStyle('showValue') ? val :
    (vmap ? utils.getLocalizedValue(vmap).value || val : binding.getGist());
  fieldDiv.appendChild(<a {...attrs} key={binding.getHash()} title={val} href={val}><span>{lbl}</span>{component}</a>);
});

presenters.itemtype('text').nodetype('URI').style('image').register((fieldDiv, binding) => {
  fieldDiv.appendChild(<img key={binding.getHash()} className="rdformsImage" src={binding.getGixt()}/>);
});

// Presenter for text.
presenters.itemtype('text').register((fieldDiv, binding, context) => {
  if (binding.getItem().hasStyle('multiline')) {
    renderingContext.domClassToggle(fieldDiv, 'rdformsMultiline', true);
  } else {
    renderingContext.domClassToggle(fieldDiv, 'rdformsSingleline', true);
  }

  const language = binding.getLanguage();
  if (context.view.showLanguage && language) {
    fieldDiv.appendChild(<span className="rdformsLanguage" key={`lang_${binding.getHash()}`}>{language}</span>);
  }

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
    const attrs = system.attachLinkBehaviour(fieldDiv, binding, parentBinding);
    const component = attrs.component || null;
    delete attrs.component;
    if (language) {
      attrs.lang = language;
    }
    const vmap = utils.getLocalizedMap(binding);
    const val = parentBinding.getGist();
    fieldDiv.appendChild(<a {...attrs} key={binding.getHash()} className="rdformsUrl" href={
      parentBinding.getStatement().getValue()}><span>{vmap ?
      utils.getLocalizedValue(vmap).value || val : val}</span>{component}</a>);
  } else {
    const lbl = binding.getItem().hasStyle('showValue') ? binding.getValue() : binding.getGist();
    if (language) {
      fieldDiv.appendChild(<span lang={language} key={binding.getHash()}>{lbl}</span>);
    } else {
      fieldDiv.appendChild(<span key={binding.getHash()}>{lbl}</span>);
    }
  }
});
