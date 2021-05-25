/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import BuildIcon from '@material-ui/icons/Build';
import IconButton from '@material-ui/core/IconButton';
import renderingContext from '../../renderingContext';
import { loadLocalizedChoice, localizedChoice } from '../hooks';
import ShowButton from './ShowButton';

let globalChoiceQueryThrottle;

export default (props) => {
  const binding = props.binding;
  const [options, setOptions] = useState([]);
  const [value, setValue] = loadLocalizedChoice(binding, options);
  const [inputValue, setInputValue] = useState('');
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(binding.getChoice()?.mismatch === true);

  useEffect(() => {
    props.field.toggleClass('mismatchReport', error);
  }, [error]);

  useEffect(() => {
    props.context.clear = () => {
      setValue(null);
      setError(false);
    };
  }, []);

  const onChange = (event, newChoice) => {
    if (newChoice === null) {
      binding.setChoice(null);
      setValue(null);
      setError(false);
    } else {
      binding.setChoice(newChoice.original);
      setValue(newChoice);
      setError(newChoice.original.mismatch === true);
    }
  };

  useEffect(() => {
    let active = true;
    if (open) {
      if (globalChoiceQueryThrottle) {
        clearTimeout(globalChoiceQueryThrottle);
      }
      globalChoiceQueryThrottle = setTimeout(() => {
        globalChoiceQueryThrottle = undefined;
        props.context.chooser.search(binding.getItem(), inputValue.trimStart()).then((results) => {
          if (active) {
            setOptions(results.map(localizedChoice));
          }
        });
      }, 200);
    }

    return () => {
      active = false;
    };
  }, [inputValue, open]);

  const labelledBy = props.context.view.getLabelIndex(binding);
  const renderInput = (params) => {
    params.inputProps = params.inputProps || {};
    params.inputProps['aria-labelledby'] = labelledBy;
    return (
      <TextField
        aria-labelledby={labelledBy}
        {...params}
        { ...(value && value.mismatch ? { error: true } : {}) }
        onKeyDown={({ key, keyCode }) => {
          const isEnterKey = key === 'Enter' || keyCode === 13;
          if (isEnterKey && !open) {
            setOpen(true);
          }
        }}
        variant={renderingContext.materialVariant} />
    );
  };

  const showHandler = () => {
    renderingContext.openChoiceSelector(props.binding, (selectedChoice) => {
      binding.setChoice(selectedChoice);
      setValue(localizedChoice(selectedChoice));
      setError(selectedChoice.mismatch === true);
    }, props.field);
  };

  const upgradeHandler = () => {
    value.original.upgrade(props.binding, (upgradedChoice) => {
      setValue(localizedChoice(upgradedChoice));
      setError(upgradedChoice.mismatch === true);
    });
  };

  return <><Autocomplete
    className="rdformsSearch"
    disableClearable={true}
    fullWidth={false}
    value={value}
    options={options}
    filterOptions={fopts => fopts}
    open={open}
    onOpen={() => setOpen(true)}
    onClose={() => setOpen(false)}
    onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
    onChange={onChange}
    getOptionSelected={ (option, choice) => option.value === choice.value }
    getOptionLabel={ choice => (choice === null ? '' : choice.label || choice.value) }
    getOptionDisabled={ option => option.mismatch === true}
    renderInput={renderInput}
  /><ShowButton {...props} onClick={showHandler}
  />{value && value.original.upgrade && (
    <IconButton
      aria-label={props.context.view.messages.edit_upgrade}
      title={props.context.view.messages.edit_upgrade}
      onClick={upgradeHandler}
    ><BuildIcon/></IconButton>
  )}{ error && (<div key="warning" className="rdformsWarning">{
    props.context.view.messages.wrongValueField}</div>)}</>;
};
