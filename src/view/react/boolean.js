/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import Checkbox from '@mui/material/Checkbox';
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
 * Boolean editor - checkbox with indeterminate state support.
 *
 * Three-state model:
 * - null (indeterminate): No value - no triple in RDF graph
 * - true: Checked - 'true'^^xsd:boolean triple exists
 * - false: Unchecked - 'false'^^xsd:boolean triple exists
 *
 * Click behavior:
 * - Indeterminate -> true
 * - true -> false
 * - false -> true
 */
const booleanEditor = (fieldDiv, binding, context) => {
  const BooleanEditor = () => {
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

    const handleChange = () => {
      if (isDisabled) return;

      let newState;
      if (boolState === null) {
        // Indeterminate -> true
        newState = true;
      } else if (boolState === true) {
        // true -> false (explicit false triple)
        newState = false;
      } else {
        // false -> true
        newState = true;
      }

      setBoolState(newState);
      binding.setValue(formatBoolean(newState));
      setError(false);
    };

    return (
      <>
        <Checkbox
          checked={boolState === true}
          indeterminate={boolState === null}
          onChange={handleChange}
          disabled={isDisabled}
          inputProps={{
            'aria-labelledby': context.view.getLabelIndex(binding),
          }}
          size="small"
        />
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
