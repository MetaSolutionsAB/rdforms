/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo } from 'react';
import TextField from '@mui/material/TextField';
import renderingContext from '../renderingContext';
import { toDuration, fromDuration } from './util';

const keys = ['years', 'months', 'days', 'hours', 'minutes'];
const editors = renderingContext.editorRegistry;
editors.itemtype('text').datatype('xsd:duration').register((fieldDiv, binding, context) => {
  const bundle = context.view.messages;
  const TextComp = () => {
    const [duration, setDuration] = useState(() => {
      const value = binding.getValue();
      if (value === '') {
        return {};
      }
      return fromDuration(value);
    });
    useEffect(() => {
      context.clear = () => {
        setDuration({});
      };
    }, []);

    const onChange = useMemo(() => keys.reduce((accum, key) => {
      accum[key] = (e) => {
        const newValue = e.target.value || '';
        setDuration((currentDuration) => {
          const newDuration = { ...currentDuration };
          if (newValue !== '') {
            newDuration[key] = Math.abs(parseInt(newValue, 10));
          } else {
            delete newDuration[key];
          }
          // Setting the new binding value may cause a setState call on another component, if so it causes warnings.
          // Although it is probably an overly sensitive check in react as it should be ok in a callback to a setState.
          setTimeout(() => {
            binding.setValue(toDuration(newDuration));
          }, 1);
          return newDuration;
        });
      };
      return accum;
    }, {}));

    const descBy = context.view.getLabelIndex(binding);

    return <>{keys.map(key => (<TextField
      key={key}
      className="rdformsDurationInput"
      value={`${duration[key] || ''}`}
      label={bundle[`duration_${key}`]}
      type="number"
      onChange={onChange[key]}
      inputProps={{ min: 0, 'aria-label': bundle[`duration_${key}`], 'aria-describedby': descBy }}
      variant={renderingContext.materialVariant}
    />))}</>;
  };

  fieldDiv.appendChild(<TextComp key={binding.getHash()} ></TextComp>);
});
