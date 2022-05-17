/* eslint-disable no-unused-vars,quotes */
import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import renderingContext from '../../renderingContext';
import { useLocalizedSortedChoices, useLocalizedChoice, useNamedGraphId } from '../hooks';

/**
 * Autocomplete with fixed choices.
 *
 * @param props Component props
 * @param {Binding} props.binding the binding for which to render an autocomplete
 * @example (<ChoiceSelector binding={binding}>)
 * @return {React.FunctionComponentElement}
 */
export default (props) => {
  const binding = props.binding;
  const choices = useLocalizedSortedChoices(binding, true);
  const [value, setValue] = useLocalizedChoice(binding, choices);
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

  const labelledBy = props.context.view.getLabelIndex(binding);

  const renderInput = (params) => {
    params.inputProps = params.inputProps || {};
    params.inputProps['aria-labelledby'] = labelledBy;
    return (
      <TextField
        placeholder={binding.getItem().getPlaceholder()}
        {...params}
        {...(value && value.mismatch ? { error: true } : {})}
        variant={renderingContext.materialVariant}
      />
    );
  };
  const handleChange = (event, newChoice) => {
    binding.setChoice(newChoice.original);
    setValue(newChoice);
    setError(newChoice.original.mismatch === true);
  };

  const ngId = useNamedGraphId(binding, props.context);
  return (
    <>
      <Autocomplete
        className="rdformsSearch"
        disableClearable={true}
        value={value}
        options={choices}
        onChange={handleChange}
        disabled={!!ngId}
        isOptionEqualToValue={(option, choice) => option.value === choice.value}
        getOptionLabel={choice => (choice === null ? '' : choice.label)}
        getOptionDisabled={option => option.mismatch === true}
        filterSelectedOptions
        renderInput={renderInput}
        disablePortal
      />
      {error && (
        <div key="warning" className="rdformsWarning">
          {props.context.view.messages.wrongValueField}
        </div>
      )}
    </>
  );
};
