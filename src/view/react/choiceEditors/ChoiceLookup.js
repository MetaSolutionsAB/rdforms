/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import renderingContext from '../../renderingContext';
import { loadLocalizedChoice, useNamedGraphId } from '../hooks';
import utils from '../../../utils';
import ShowButton from './ShowButton';

export default (props) => {
  const binding = props.binding;
  const [choice, setChoice] = loadLocalizedChoice(binding, true);
  const [error, setError] = useState(binding.getChoice()?.mismatch === true);

  useEffect(() => {
    props.field.toggleClass('mismatchReport', error);
  }, [error]);

  useEffect(() => {
    props.context.clear = () => {
      setChoice(null);
      setError(false);
    };
  }, []);
  let title = '';
  let label = '';
  if (choice) {
    title = choice.description
      ? utils.getLocalizedValue(choice.description).value
      : choice.seeAlso || choice.value;
    label = choice.label
      ? utils.getLocalizedValue(choice.label).value
      : choice.value;
  }

  const labelledBy = props.context.view.getLabelIndex(props.binding);

  const choiceSelectorHandler = () => {
    renderingContext.openChoiceSelector(
      props.binding,
      (newChoice) => {
        props.binding.setChoice(newChoice);
        setChoice(newChoice);
        setError(newChoice.mismatch === true);
      },
      props.field
    );
  };

  const ngId = useNamedGraphId(binding, props.context);
  return (
    <>
      <TextField
        inputProps={{ 'aria-labelledby': labelledBy }}
        className="rdformsSearch"
        disabled
        {...(!!ngId || (choice && choice.mismatch) ? { mismatch: true } : {})}
        title={title}
        value={label}
        placeholder={binding.getItem().getPlaceholder()}
        error={error}
        variant={renderingContext.materialVariant}
      />
      <ShowButton
        {...props}
        disabled={!!ngId}
        onClick={choiceSelectorHandler}
      />
      {error && (
        <div key="warning" className="rdformsWarning">
          {props.context.view.messages.wrongValueField}
        </div>
      )}
    </>
  );
};
