// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import renderingContext from '../renderingContext';
import { fromDuration } from './util';
import TextField from '@material-ui/core/TextField';

const presenters = renderingContext.presenterRegistry;

presenters.itemtype('text').datatype('xsd:duration').register((fieldDiv, binding, context) => {
  const data = fromDuration(binding.getValue());
  const keys = ['years', 'months', 'days', 'hours', 'minutes'];
  fieldDiv.appendChild(<div>{keys.map(key => (
    data[key] && <><span className="durationlabel">{context.view.messages[`duration_${key}`]}:</span><span className="durationValue">{data[key]}</span></>
  ))}</div>);
});

presenters.itemtype('text').nodetype('URI').style('externalLink').register((fieldDiv, binding) => {
  const vmap = utils.getLocalizedMap(binding);
  const val = binding.getValue();
  fieldDiv.appendChild(<a title={val} href={val} target="_blank">{vmap ?
    utils.getLocalizedValue(vmap).value : binding.getGist()}</a>);
});

// TODO Non-external links.

presenters.itemtype('text').nodetype('URI').style('image').register((fieldDiv, binding) => {
  fieldDiv.appendChild(<img className="rdformsImage" src={binding.getGixt()}/>);
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
    ReactDOM.render(<a className="rdformsUrl" href={parentBinding.getStatement().getValue()}>{text}</a>, fieldDiv);
    // TODO attachLinkBehaviour
    // system.attachLinkBehaviour($a[0], parentBinding);
  } else {
    fieldDiv.appendChild(<div>{binding.getGist()}</div>);
  }
});

const datePresenter = (fieldDiv, binding) => {
  const data = binding.getValue();
  if (data != null && data !== '') {
    try {
      let str;
      if (data.indexOf('T') > 0) {
        str = i18n.getDate(data);
      } else if (data.length > 4) {
        str = i18n.getDate(data, { selector: 'date' });
      } else {
        str = i18n.getDate(data, { selector: 'date', datePattern: 'YYYY' });
      }
      fieldDiv.appendChild(<div>{str}</div>);
    } catch (e) {
      console.warn(`Could not present date, expected ISO8601 format in the form 2001-01-01 (potentially with time given after a 'T' character as well) but found '${data}' instead.`);
    }
  }
};
presenters.itemtype('text').datatype('xsd:date').register(datePresenter);
presenters.itemtype('text').datatype('dcterms:W3CDTF').register(datePresenter);

// -------------- Editors ----------------
const editors = renderingContext.editorRegistry;

editors.itemtype('text').register((fieldDiv, binding, context) => {
  const TextComp = () => {
    const [value, setValue] = useState(binding.getGist());
    useEffect(() => {
      context.clear = () => {
        setValue('');
      };
    }, []);

    const iprops = {
      value,
      onChange: (e) => {
        setValue(e.target.value);
        binding.setGist(e.target.value);
      },
    };
    return <TextField variant={renderingContext.materialVariant} inputProps={iprops}/>;
  };

  fieldDiv.appendChild(<TextComp></TextComp>);
});
