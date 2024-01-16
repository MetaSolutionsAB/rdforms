// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import renderingContext from '../renderingContext';
import system from '../../model/system';
import utils from '../../utils';
import { Editor } from './Wrappers';

// -------------- Presenters ----------------
const presenters = renderingContext.presenterRegistry;

const choicify = func => (fieldDiv, binding, context) => {
  const choice = binding.getChoice();
  const isEditor = context.view instanceof Editor;
  let desc;
  if (!choice) {
    return;
  }

  if (isEditor && choice.editdescription) {
    desc = utils.getLocalizedValue(choice.editdescription).value;
  } else if (choice.description) {
    desc = utils.getLocalizedValue(choice.description).value;
  }

  func(fieldDiv, binding, choice, desc, isEditor);
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

const getLocalizedLabel = (choice, isEditor) =>
  utils.getLocalizedValue(isEditor ? choice.editlabel || choice.label : choice.label);

// Presenter for choices.
presenters.itemtype('choice').register(choicify(
  (fieldDiv, binding, choice, desc, isEditor) => {
    const item = binding.getItem();
    const title = desc || choice.seeAlso || choice.value;
    if ((item.hasStaticChoices() && !item.hasStyle('externalLink')) || item.hasStyle('noLink')) {
      fieldDiv.appendChild(React.createElement(() => {
        const [locValue, setLocValue] = useState(getLocalizedLabel(choice, isEditor));
        useEffect(() => {
          if (choice.load != null) {
            choice.load(() => {
              setLocValue(getLocalizedLabel(choice, isEditor));
            });
          }
        }, []);
        const langAttr = locValue.lang ? {lang: locValue.lang} : {};
        return <div key={binding.getHash()} {...langAttr} title={title}>{locValue.value}</div>
      }));
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
        const [locValue, setLocValue] = useState(getLocalizedLabel(choice, isEditor));
        useEffect(() => {
          if (choice.load != null) {
            choice.load(() => {
              setLocValue(getLocalizedLabel(choice, isEditor));
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
