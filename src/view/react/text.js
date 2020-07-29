// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';
import TextField from '@material-ui/core/TextField';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import renderingContext from '../renderingContext';
import { fromDuration } from './util';
import utils from '../../utils';


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

const LanguageControl = (props) => {
  const [lang, setLang] = useState(props.binding.getLanguage() || '');
  const langs = useMemo(() => {
    const primaryLangs = utils.cloneArrayWithLabels(renderingContext.getPrimaryLanguageList());
    const langList = utils.cloneArrayWithLabels(renderingContext.getNonPrimaryLanguageList());
    return primaryLangs.length === 0 ? langList : primaryLangs.concat([null], langList);
  });
  const onLangChange = (event) => {
    props.binding.setLanguage(event.target.value);
    setLang(event.target.value);
  };

  useEffect(() => {
    props.context.clearLanguage = () => {
      setLang('');
    };
  }, []);

  return <FormControl className="rdformsLangControl" variant={renderingContext.materialVariant}>
    <Select
      value={lang}
      onChange={onLangChange}>
      {langs.map(langOption => (langOption === null ?
        (<MenuItem key="_none" value="_none" disabled>─────</MenuItem>) :
        (<MenuItem key={langOption.value} value={langOption.value}>{langOption.label}</MenuItem>)
      ))}
    </Select>
  </FormControl>;
};


// -------------- Editors ----------------
const editors = renderingContext.editorRegistry;

editors.itemtype('text').register((fieldDiv, binding, context) => {
  const item = binding.getItem();
  const nodeType = item.getNodetype();
  const multiline = item.hasStyle('multiline');
  const extLink = item.hasStyle('externalLink');
  const pattern = item.getPattern();
  const regex = pattern ? new RegExp(pattern) : null;
  const langlit = nodeType === 'LANGUAGE_LITERAL' || nodeType === 'PLAIN_LITERAL';

  const TextComp = () => {
    const [gist, setGist] = useState(binding.getGist());
    const value = binding.getValue();
    useEffect(() => {
      context.clear = () => {
        setGist('');
        if (context.clearLanguage) {
          context.clearLanguage();
        }
      };
    }, []);
    const valid = regex ? regex.test(gist) : true;

    const iprops = {
      value: gist,
      onChange: (e) => {
        const newValue = e.target.value;
        if (!regex || regex.test(newValue)) {
          binding.setGist(newValue);
        } else {
          binding.setGist('');
        }
        setGist(newValue);
      },
    };
    return <><TextField
      className={extLink || langlit ? 'rdformsTwoThirds' : ''}
      multiline={multiline}
      error={!valid}
      variant={renderingContext.materialVariant} inputProps={iprops}
    />{extLink && (value != null || value === '') &&
    (<IconButton disabled={!valid} target='_blank' href={value} title={value}><OpenInNewIcon/></IconButton>)
    }{ langlit ? (<LanguageControl binding={binding} context={context}></LanguageControl>) : '' }</>;
  };

  fieldDiv.appendChild(<TextComp></TextComp>);
});
