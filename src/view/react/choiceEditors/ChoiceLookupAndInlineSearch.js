/* eslint-disable no-unused-vars,quotes */
import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import BuildIcon from '@mui/icons-material/Build';
import IconButton from '@mui/material/IconButton';
import renderingContext from '../../renderingContext';
import { editLocalizedChoice, loadLocalizedChoice, useNamedGraphId } from '../hooks';
import ShowButton from './ShowButton';

let globalChoiceQueryThrottle;

export default (props) => {
  const binding = props.binding;
  const [options, setOptions] = useState([]);
  const [value, setValue] = loadLocalizedChoice(binding, true);
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
            setOptions(results.map(editLocalizedChoice));
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
        {...(value && value.mismatch ? { error: true } : {})}
        placeholder={binding.getItem().getPlaceholder()}
        onKeyDown={({ key, keyCode }) => {
          const isEnterKey = key === 'Enter' || keyCode === 13;
          if (isEnterKey && !open) {
            setOpen(true);
          }
        }}
        variant={renderingContext.materialVariant}
      />
    );
  };

  const showHandler = () => {
    renderingContext.openChoiceSelector(props.binding, (selectedChoice) => {
      binding.setChoice(selectedChoice);
      setValue(editLocalizedChoice(selectedChoice));
      setError(selectedChoice.mismatch === true);
    }, props.field);
  };

  const upgradeHandler = () => {
    value.original.upgrade(props.binding, (upgradedChoice) => {
      setValue(editLocalizedChoice(upgradedChoice));
      setError(upgradedChoice.mismatch === true);
    }, props.field);
  };

  const ngId = useNamedGraphId(binding, props.context);
  const UpgradeComponent = value && value.original.upgradeComponent;
  return (
    <>
      <Autocomplete
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
        disabled={!!ngId}
        isOptionEqualToValue={(option, choice) => option.value === choice.value}
        getOptionLabel={choice =>
          choice === null ? '' : choice.label || choice.value
        }
        getOptionDisabled={option => option.mismatch === true}
        renderInput={renderInput}
        disablePortal
      />
      <ShowButton {...props} onClick={showHandler} disabled={!!ngId}/>
      {value && value.original.upgrade && (
        <>
          <IconButton
            aria-label={props.context.view.messages.edit_upgrade}
            title={props.context.view.messages.edit_upgrade}
            disabled={!!ngId}
            onClick={upgradeHandler}
          >
            <BuildIcon />
          </IconButton>
          {UpgradeComponent}
        </>
        )}
      {error && (
        <div key="warning" className="rdformsWarning">
          {props.context.view.messages.wrongValueField}
        </div>
      )}
    </>
  );
};
