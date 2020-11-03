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
  if (!system.attachLinkBehaviour(fieldDiv, binding)) {
    fieldDiv.appendChild(<a key={binding.getHash()} title={val} href={val}>{vmap ?
      utils.getLocalizedValue(vmap).value || val : binding.getGist()}</a>);
  }
});

presenters.itemtype('text').nodetype('URI').style('externalLink').register((fieldDiv, binding) => {
  const vmap = utils.getLocalizedMap(binding);
  const val = binding.getValue();
  if (!system.attachExternalLinkBehaviour(fieldDiv, binding)) {
    fieldDiv.appendChild(<a key={binding.getHash()} title={val} href={val} target="_blank">{vmap ?
      utils.getLocalizedValue(vmap).value || val : binding.getGist()}</a>);
  }
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
  if (context.view.showLanguage && binding.getLanguage()) {
    // TODO language
   // jquery('<div className="rdformsLanguage">').text(binding.getLanguage()).appendTo(fieldDiv);
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
    if (!system.attachLinkBehaviour(fieldDiv, binding, parentBinding)) {
      const vmap = utils.getLocalizedMap(binding);
      const val = parentBinding.getGist();
      fieldDiv.appendChild(<a key={binding.getHash()} className="rdformsUrl" href={
        parentBinding.getStatement().getValue()}>{vmap ?
        utils.getLocalizedValue(vmap).value || val : val}</a>);
    }
  } else {
    fieldDiv.appendChild(<div key={binding.getHash()}>{binding.getGist()}</div>);
  }
});
