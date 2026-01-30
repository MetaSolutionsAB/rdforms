/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import Checkbox from '@mui/material/Checkbox';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import CODES from '../../model/CODES';
import renderingContext from '../renderingContext';
import { parseBoolean, formatBoolean, isValidBoolean } from '../booleanUtils';
import { useNamedGraphId } from './hooks';

/**
 * Boolean presenter - displays a disabled checkbox showing the current state.
 * Does not render anything for empty/no value (consistent with other items).
 */
const booleanPresenter = (fieldDiv, binding, context) => {
  const BooleanPresenter = () => {
    const value = binding.getValue();
    const boolValue = parseBoolean(value);

    // Don't render anything for empty/no value
    if (boolValue === null) {
      return null;
    }

    return (
      <Checkbox
        checked={boolValue}
        disabled={true}
        inputProps={{ 'aria-labelledby': context.view.getLabelIndex(binding) }}
        size="small"
      />
    );
  };

  fieldDiv.appendChild(<BooleanPresenter key={binding.getHash()} />);
};

/**
 * Boolean editor - radio buttons for true/false selection.
 *
 * Three-state model:
 * - null: No value (neither radio selected) - no triple in RDF graph
 * - true: True radio selected - 'true'^^xsd:boolean triple exists
 * - false: False radio selected - 'false'^^xsd:boolean triple exists
 */
const booleanEditor = (fieldDiv, binding, context) => {
  const BooleanEditor = () => {
    const bundle = context.view.messages;
    const initialValue = binding.getValue();
    const [boolState, setBoolState] = useState(() => parseBoolean(initialValue));
    const [error, setError] = useState(() => {
      // Check for invalid boolean value (e.g., 'yes', 'no')
      const value = binding.getValue();
      return binding.getMatchingCode() === CODES.WRONG_DATATYPE ||
        (value !== '' && value !== null && !isValidBoolean(value));
    });
    const ngId = useNamedGraphId(binding, context);
    const item = binding.getItem();
    const isNonEditable = item.hasStyle('nonEditable');
    const isDisabled = !!ngId || isNonEditable;

    // Toggle error class on field
    useEffect(() => {
      fieldDiv.toggleClass('mismatchReport', error);
    }, [error]);

    // Provide clear function for remove button
    useEffect(() => {
      context.clear = () => {
        setBoolState(null);
        setError(false);
      };
    }, []);

    const handleChange = (event) => {
      if (isDisabled) return;

      const newState = event.target.value === 'true';
      setBoolState(newState);
      binding.setValue(formatBoolean(newState));
      setError(false);
    };

    // Convert boolState to string value for RadioGroup ('' for null/unselected)
    const radioValue = boolState === null ? '' : String(boolState);

    return (
      <>
        <RadioGroup
          row
          value={radioValue}
          onChange={handleChange}
          aria-labelledby={context.view.getLabelIndex(binding)}
        >
          <FormControlLabel
            value="true"
            control={<Radio size="small" disabled={isDisabled} />}
            label={bundle.boolean_true || 'Yes'}
          />
          <FormControlLabel
            value="false"
            control={<Radio size="small" disabled={isDisabled} />}
            label={bundle.boolean_false || 'No'}
          />
        </RadioGroup>
        {error && (
          <div key="warning" className="rdformsWarning">
            {context.view.messages.wrongDatatypeField}
          </div>
        )}
      </>
    );
  };

  fieldDiv.appendChild(<BooleanEditor key={binding.getHash()} />);
};

// Register presenter
const presenters = renderingContext.presenterRegistry;
presenters.itemtype('text').datatype('xsd:boolean').register(booleanPresenter);

// Register editor
const editors = renderingContext.editorRegistry;
editors.itemtype('text').datatype('http://www.w3.org/2001/XMLSchema#boolean').register(booleanEditor);
