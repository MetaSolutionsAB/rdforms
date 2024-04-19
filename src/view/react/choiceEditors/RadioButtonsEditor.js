/* eslint-disable no-unused-vars,quotes */
import React, { useState, useEffect } from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { useLocalizedSortedChoices, useName, useNamedGraphId } from '../hooks';
import utils from '../../../utils';

const ChoiceOption = props => <FormControlLabel
  disabled={props.disabled}
  label={props.choice.label} value={props.choice.value} control={<Radio/>}
  {...(props.choice.mismatch ? { className: 'mismatch' } : {})}
  title={props.choice.description || props.choice.seeAlso || props.choice.value}/>;

export default function RadioButtonsEditor(props) {
  const binding = props.binding;
  const item = binding.getItem();
  const name = useName();
  const choices = useLocalizedSortedChoices(binding, true);
  const [error, setError] = useState(binding.getChoice()?.mismatch === true);
  const [value, setValue] = useState(() => {
    const choice = binding.getChoice();
    return choice ? choice.value : '';
  });
  const row = item.hasStyle('verticalRadioButtons') ? {} : { row: true };

  useEffect(() => {
    props.field.toggleClass('mismatchReport', error);
  }, [error]);

  const handleChange = (event) => {
    const v = event.target.value;
    const localizedChoice = choices.find(c => c.value === v);
    if (localizedChoice) {
      binding.setChoice(localizedChoice.original);
      setError(localizedChoice.original.mismatch === true);
    } else {
      binding.setChoice(null);
      setError(false);
    }
    setValue(v);
  };
  useEffect(() => {
    props.context.clear = () => {
      setValue('');
      setError(false);
    };
  }, []);

  const ngId = useNamedGraphId(binding, props.context);
  let labelMap = item.getEditLabelMap() || item.getLabelMap();
  let label = utils.getLocalizedValue(labelMap, props.context.view.getLocale()).value
  return (
    <>
      <FormControl component="fieldset">
        <RadioGroup
          {...row}
          key="radio"
          aria-label={label}
          name={name}
          value={value}
          onChange={handleChange}
        >
          {choices.map(choice => (
            <ChoiceOption key={choice.value}
                          disabled={!!ngId}
                          choice={choice} />
          ))}
        </RadioGroup>
      </FormControl>
      {error && (
        <div key="warning" className="rdformsWarning">
          {props.context.view.messages.wrongValueField}
        </div>
      )}
    </>
  );
}
