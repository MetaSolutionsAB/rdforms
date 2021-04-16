/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo } from 'react';
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
  const attrs = system.attachLinkBehaviour(fieldDiv, binding) || {};
  const component = attrs.component || null;
  delete attrs.component;
  // eslint-disable-next-line no-nested-ternary
  const lbl = binding.getItem().hasStyle('showValue') ? val :
    (vmap ? utils.getLocalizedValue(vmap).value || val : binding.getGist());
  fieldDiv.appendChild(<a {...attrs} key={binding.getHash()} title={val} href={val}><span>{lbl}</span>{component}</a>);
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
    const attrs = system.attachLinkBehaviour(fieldDiv, binding, parentBinding)
    const component = attrs.component || null;
    delete attrs.component;
    const vmap = utils.getLocalizedMap(binding);
    const val = parentBinding.getGist();
    fieldDiv.appendChild(<a {...attrs} key={binding.getHash()} className="rdformsUrl" href={
      parentBinding.getStatement().getValue()}><span>{vmap ?
      utils.getLocalizedValue(vmap).value || val : val}</span>{component}</a>);
  } else {
    const lbl = binding.getItem().hasStyle('showValue') ? binding.getValue() : binding.getGist();
    fieldDiv.appendChild(<span key={binding.getHash()}>{lbl}</span>);
  }
  if (context.view.showLanguage && binding.getLanguage()) {
    fieldDiv.appendChild(<span className="rdformsLanguage" key={`lang_${binding.getHash()}`}>{binding.getLanguage()}</span>);
  }
});
