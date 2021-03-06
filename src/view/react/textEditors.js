/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useMemo } from 'react';
import TextField from '@material-ui/core/TextField';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import moment from 'moment';
import renderingContext from '../renderingContext';
import utils from '../../utils';

const LanguageControl = (props) => {
  const [lang, setLang] = useState(props.binding.getLanguage() || '');
  const langs = useMemo(() => {
    const primaryLangs = utils.cloneArrayWithLabels(renderingContext.getPrimaryLanguageList());
    const langList = utils.cloneArrayWithLabels(renderingContext.getNonPrimaryLanguageList());
    return primaryLangs.length === 0 ? langList : primaryLangs.concat([null], langList);
  });
  useEffect(() => {
    if (!props.binding.isValid()) {
      const defLang = moment.locale();
      if (typeof defLang === 'string' && defLang !== '') {
        setLang(defLang);
        props.binding.setLanguage(defLang, true);
      }
    }
  }, []);
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
      inputProps={{ 'aria-labelledby': props.labelledby }}

      value={lang}
      onChange={onLangChange}>
      {langs.map(langOption => (langOption === null ?
        (<MenuItem key="_none" value="_none" disabled>─────</MenuItem>) :
        (<MenuItem key={langOption.value} value={langOption.value}>{langOption.label}</MenuItem>)
      ))}
    </Select>
  </FormControl>;
};

const editors = renderingContext.editorRegistry;

editors.itemtype('text').register((fieldDiv, binding, context) => {
  const item = binding.getItem();
  const nodeType = item.getNodetype();
  const multiline = item.hasStyle('multiline');
  const extLink = item.hasStyle('externalLink');
  const langlit = nodeType === 'LANGUAGE_LITERAL' || nodeType === 'PLAIN_LITERAL';
  const pattern = item.getPattern();
  const regex = pattern ? new RegExp(pattern) : null;

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
    const valid = gist !== null && gist !== '' && regex ? regex.test(gist) : true;

    const labelledBy = context.view.getLabelIndex(binding);
    const iprops = {
      value: gist,
      'aria-labelledby': labelledBy,
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
    const bundle = context.view.messages;
    return <><TextField
      className={extLink || langlit ? 'rdformsTwoThirds' : ''}
      multiline={multiline}
      error={!valid}
      variant={renderingContext.materialVariant} inputProps={iprops}
    />{extLink && (value != null || value === '') &&
    (<IconButton aria-label={bundle.openLinkExternally} disabled={!valid} target='_blank' href={value}
                 title={value}><OpenInNewIcon/></IconButton>)
    }{ langlit ? (<LanguageControl binding={binding} context={context}
                                   labelledby={labelledBy}></LanguageControl>) : '' }</>;
  };

  fieldDiv.appendChild(<TextComp key={binding.getHash()}></TextComp>);
});

const bindToPattern = pattern => (fieldDiv, binding, context) => {
  const regex = pattern ? new RegExp(pattern) : null;

  const TextComp = () => {
    const [gist, setGist] = useState(binding.getGist());
    useEffect(() => {
      context.clear = () => setGist('');
    }, []);
    const valid = gist && regex ? regex.test(gist) : true;

    const labelledBy = context.view.getLabelIndex(binding);
    const iprops = {
      value: gist,
      'aria-labelledby': labelledBy,
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
    return <TextField
      error={!valid}
      variant={renderingContext.materialVariant} inputProps={iprops}
    />;
  };

  fieldDiv.appendChild(<TextComp key={binding.getHash()}></TextComp>);
};

editors.itemtype('text').datatype('xsd:integer').register(bindToPattern('^-?[0-9][0-9][0-9][0-9]$'));
editors.itemtype('text').datatype('xsd:decimal').register(bindToPattern('^(\\d+(\\.\\d+)?)$'));
