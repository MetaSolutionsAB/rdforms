/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo } from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { FormGroup } from '@mui/material';
import { useLocalizedSortedChoices, useName } from '../hooks';
import * as engine from '../../../model/engine';

const CheckOption = (props) => {
  const { choice, binding, onChoiceChange } = props;
  const [checked, setChecked] = React.useState(choice.value === binding.getValue());

  const handleChange = (evt) => {
    binding.setChoice(evt.target.checked ? choice.original : null);
    setChecked(evt.target.checked);
    onChoiceChange();
  };
  return <FormControlLabel
    label={choice.label} control={<Checkbox checked={checked} onChange={handleChange}/>}
    {...(choice.mismatch ? { className: 'mismatch' } : {})}
    title={choice.description || choice.seeAlso || choice.value}/>;
};

export default function CheckBoxesEditor(props) {
  const [resetCount, setResetCount] = React.useState(0);
  const binding = props.binding;
  const item = binding.getItem();
  const choices = useLocalizedSortedChoices(binding, true);
  const choiceBindingPairs = useMemo(() => {
    const parentBinding = binding.getParent();
    const val2binding = {};
    // eslint-disable-next-line no-return-assign
    parentBinding.getChildBindingsFor(item).forEach(b => (val2binding[b.getValue()] = b));
    const pairs = choices.map((c) => {
      const existingbinding = val2binding[c.value];
      if (existingbinding) {
        delete val2binding[c.value];
        return [c, existingbinding];
      }
      return [c, engine.create(parentBinding, item)];
    });
    // Add checks for values that are non-conforming (should have mismatch on their choices).
    Object.values(val2binding).forEach((b) => {
      const choice = b.getChoice();
      if (choice) {
        pairs.push([choice, b]);
      }
    });
    return pairs;
  });

  const [error, setError] = useState(binding.getChoice()?.mismatch === true);
  const row = item.hasStyle('verticalCheckboxes') ? {} : { row: true };

  const onChoiceChange = () => {
    const newError = choiceBindingPairs.find(pair => pair[1].getChoice()
      && pair[1].getChoice().mismatch) !== undefined;
    if (newError !== error) {
      setError(newError);
    }
  };

  useEffect(() => {
    props.field.toggleClass('mismatchReport', error);
  }, [error]);

  props.context.clear = () => {
    choiceBindingPairs.forEach(pair => pair[1].setChoice(null));
    setError(false);
    setResetCount(resetCount + 1);
  };

  return (
    <><FormGroup {...row}>
      {choiceBindingPairs.map(pair => (
        <CheckOption key={`${resetCount}-${pair[1].getHash()}`}
                     choice={pair[0]}
                     binding={pair[1]}
                     onChoiceChange={onChoiceChange} />
      ))}
    </FormGroup>{error && (
      <div key="warning" className="rdformsWarning">
        {props.context.view.messages.wrongValueField}
      </div>
    )}</>
  );
}
