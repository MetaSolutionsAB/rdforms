/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import { useLocalizedSortedChoices, useName } from './hooks';

const ChoiceOption = props => <FormControlLabel
  label={props.choice.label} value={props.choice.value} control={<Radio/>}
  {...(props.choice.mismatch ? { className: 'mismatch', disabled: true } : {})}
  title={props.choice.description || props.choice.seeAlso || props.choice.value}/>;

export default function RadioButtonsEditor(props) {
  const binding = props.binding;
  const item = binding.getItem();
  const name = useName();
  const choices = useLocalizedSortedChoices(binding);
  const [value, setValue] = useState(() => {
    const choice = binding.getChoice();
    return choice ? choice.value : '';
  });
  const row = item.hasStyle('verticalRadioButtons') ? {} : { row: true };

  const handleChange = (event) => {
    const v = event.target.value;
    const localizedChoice = choices.find(c => c.value === v);
    binding.setChoice(localizedChoice ? localizedChoice.original : null);
    setValue(v);
  };
  useEffect(() => {
    props.context.clear = () => {
      setValue('');
    };
  }, []);

  return (
    <FormControl component="fieldset">
      <RadioGroup {...row} aria-label={item.getLabel()} name={name} value={value} onChange={handleChange}>
        {(choices).map(choice =>
          <ChoiceOption key={choice.value} choice={choice} />,
        )}
      </RadioGroup>
    </FormControl>
  );
}
