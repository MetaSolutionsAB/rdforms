import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import renderingContext from '../../renderingContext';
import {
  editLocalizedChoice,
  loadLocalizedChoice,
  useNamedGraphId,
} from '../hooks';
import utils from '../../../utils';
import ShowButton from './ShowButton';
import ChoiceActions from './ChoiceActions';

const ChoiceLookup = (props) => {
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
        setChoice(editLocalizedChoice(newChoice));
        setError(newChoice.mismatch === true);
      },
      props.field
    );
  };

  const ngId = useNamedGraphId(binding, props.context);
  return (
    <>
      <TextField
        slotProps={{ htmlInput: { 'aria-labelledby': labelledBy } }}
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
      <ChoiceActions
        actions={choice?.original.actions}
        binding={binding}
        field={props.field}
        readOnly={!!ngId}
      />
      {error && (
        <div key="warning" className="rdformsWarning">
          {props.context.view.messages.wrongValueField}
        </div>
      )}
    </>
  );
};

export default ChoiceLookup;
