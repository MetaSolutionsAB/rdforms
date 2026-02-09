/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import Checkbox from '@mui/material/Checkbox';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import CODES from '../../model/CODES';
import renderingContext from '../renderingContext';
import utils from '../../utils';
import { parseBoolean, formatBoolean, isValidBoolean } from '../booleanUtils';
import { useName, useNamedGraphId } from './hooks';

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
    const name = useName();
    const item = binding.getItem();
    const labelMap = item.getEditLabelMap() || item.getLabelMap();
    const label = utils.getLocalizedValue(labelMap, context.view.getLocale()).value;
    const initialValue = binding.getValue();
    const [boolState, setBoolState] = useState(() => parseBoolean(initialValue));
    const [error, setError] = useState(() => {
      // Check for invalid boolean value (e.g., 'yes', 'no')
      const value = binding.getValue();
      return binding.getMatchingCode() === CODES.WRONG_DATATYPE ||
        (value !== '' && value !== null && !isValidBoolean(value));
    });
    const isDisabled = !!useNamedGraphId(binding, context);

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
      const newState = event.target.value === 'true';
      setBoolState(newState);
      binding.setValue(formatBoolean(newState));
      setError(false);
    };

    // Convert boolState to string value for RadioGroup ('' for null/unselected)
    const radioValue = boolState === null ? '' : String(boolState);

    return (
      <>
        <FormControl component="fieldset">
          <RadioGroup
            row
            value={radioValue}
            onChange={handleChange}
            aria-label={label}
            name={name}
          >
            <FormControlLabel
              value="true"
              control={<Radio disabled={isDisabled} />}
              label={bundle.boolean_true || 'Yes'}
            />
            <FormControlLabel
              value="false"
              control={<Radio disabled={isDisabled} />}
              label={bundle.boolean_false || 'No'}
            />
          </RadioGroup>
        </FormControl>
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
