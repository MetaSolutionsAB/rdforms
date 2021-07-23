// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import renderingContext from '../renderingContext';
import system from '../../model/system';
import utils from '../../utils';

// -------------- Presenters ----------------
const presenters = renderingContext.presenterRegistry;

const choicify = func => (fieldDiv, binding) => {
  const choice = binding.getChoice();
  let desc;
  if (!choice) {
    return;
  }
  if (choice.description) {
    desc = utils.getLocalizedValue(choice.description).value;
  }
  func(fieldDiv, binding, choice, desc);
};

// Presenter for image.
presenters.itemtype('choice').style('image').register(choicify(
  (fieldDiv, binding, choice, desc) => {
    fieldDiv.appendChild(<img key={binding.getHash()} className="rdformsImage" title={
      desc || choice.value} src={choice.value}/>);
  }));

// Presenter for stars
presenters.itemtype('choice').style('stars').register(choicify(
  (fieldDiv, binding, choice) => {
    if (!isNaN(parseInt(choice.value, 10))) {
      fieldDiv.appendChild(<span key={binding.getHash()} className="rdformsStar"></span>);
    }
  }));

// Presenter for choices.
presenters.itemtype('choice').register(choicify(
  (fieldDiv, binding, choice, desc) => {
    const item = binding.getItem();
    const title = desc || choice.seeAlso || choice.value;
    if ((item.hasStaticChoices() && !item.hasStyle('externalLink')) || item.hasStyle('noLink')) {
      const locValue = utils.getLocalizedValue(choice.label);
      const langAttr = locValue.lang ? { lang: locValue.lang } : {};
      fieldDiv.appendChild(<div key={binding.getHash()} {...langAttr} title={title} src={choice.value
      }>{locValue.value}</div>);
    } else {
      let attrs;
      if (item.hasStyle('externalLink')) {
        attrs = system.attachExternalLinkBehaviour(fieldDiv, binding) || {};
      } else {
        attrs = system.attachLinkBehaviour(fieldDiv, binding) || {};
      }
      const component = attrs.component || null;
      delete attrs.component;

      fieldDiv.appendChild(React.createElement(() => {
        const [locValue, setLocValue] = useState(utils.getLocalizedValue(choice.label));
        useEffect(() => {
          if (choice.load != null) {
            choice.load(() => {
              setLocValue(utils.getLocalizedValue(choice.label));
            });
          }
        }, []);
        if (locValue.lang) {
          attrs.lang = locValue.lang;
        }
        return <a {...attrs} title={title} href={choice.seeAlso
        || choice.value}><span>{locValue.value}</span>{component}</a>;
      }, { key: binding.getHash() }));
    }
  }));
