/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useMemo } from 'react';
import TextField from '@mui/material/TextField';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import renderingContext from '../renderingContext';
import utils from '../../utils';
import { useNamedGraphId } from './hooks';

const LanguageControl = (props) => {
  const [lang, setLang] = useState(props.binding.getLanguage() || '');
  const langs = useMemo(() => {
    const primaryLangs = utils.cloneArrayWithLabels(renderingContext.getPrimaryLanguageList());
    const langList = utils.cloneArrayWithLabels(renderingContext.getNonPrimaryLanguageList());
    return primaryLangs.length === 0 ? langList : primaryLangs.concat([null], langList);
  });
  useEffect(() => {
    if (!props.binding.isValid()) {
      const defLang = props.context.view.getDefaultTextLanguage();
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

  const ngId = useNamedGraphId(props.binding, props.context);
  return <FormControl className="rdformsLangControl" variant={renderingContext.materialVariant}>
    <Select
      inputProps={{ 'aria-labelledby': props.labelledby }}
      value={lang}
      disabled={!!ngId}
      onChange={onLangChange}>
      {langs.map(langOption => (langOption === null ?
        (<MenuItem key="_none" value="_none" disabled>─────</MenuItem>) :
        (<MenuItem key={langOption.value} value={langOption.value}>{langOption.label || '\u00A0'}</MenuItem>)
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
    const ngId = useNamedGraphId(binding, context);
    return <><TextField
      className={extLink || langlit ? 'rdformsTwoThirds' : ''}
      multiline={multiline}
      placeholder={item.getPlaceholder()}
      error={!valid}
      disabled={!!ngId}
      helperText={!valid ? item.getHelp() || '' : ''}
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
  const item = binding.getItem();

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
      placeholder={item.getPlaceholder()}
      helperText={!valid ? item.getHelp() || '' : ''}
      variant={renderingContext.materialVariant} inputProps={iprops}
    />;
  };

  fieldDiv.appendChild(<TextComp key={binding.getHash()}></TextComp>);
};

editors.itemtype('text').datatype('xsd:integer').register(bindToPattern('^-?\\d+$'));
editors.itemtype('text').datatype('xsd:decimal').register(bindToPattern('^-?(\\d+(\\.\\d+)?)$'));
