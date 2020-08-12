// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
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
      fieldDiv.appendChild(<div key={binding.getHash()} title={title} src={choice.value
      }>{utils.getLocalizedValue(choice.label).value}</div>);
    } else {
/*      if (item.hasStyle('externalLink')) {
        system.attachExternalLinkBehaviour($a[0], binding);
      } else {
        system.attachLinkBehaviour($a[0], binding);
      }*/
      fieldDiv.appendChild(React.createElement(() => {
        const [label, setLabel] = useState(utils.getLocalizedValue(choice.label).value);
        useEffect(() => {
          if (choice.load != null) {
            choice.load(() => {
              setLabel(utils.getLocalizedValue(choice.label).value);
            });
          }
        }, []);
        return <a title={title} href={choice.seeAlso || choice.value}>{label}</a>;
      }, { key: binding.getHash() }));
    }
  }));
