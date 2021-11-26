/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo } from 'react';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import renderingContext from '../renderingContext';
import * as engine from '../../model/engine';

renderingContext.addExpandButton = (rowDiv, labelDiv, item, context) => {
  console.log('Expand button not yet supported');
};

const isClearButton = (binding, context) => {
  const item = binding.getItem();
  const notDeprecated = !item.hasStyle('deprecated');
  if (context.view.isMultiValued(item) && notDeprecated) {
    return true;
  }
  const cardTr = binding.getCardinalityTracker();
  const showOne = context.view.showNow(binding.getItem(), []);
  return notDeprecated &&
    (cardTr.isMin() || (cardTr.getCardinality() === 1 && showOne && cardTr.isDepsOk()));
};
renderingContext.addRemoveButton = (rowDiv, binding, context) => () => {
  const item = binding.getItem();
  const cardTr = binding.getCardinalityTracker();
  const [clear, setClear] = useState(() => isClearButton(binding, context));

  useEffect(() => {
    const listener = cardTr.addListener(() => {
      setClear(isClearButton(binding, context));
    });
    return () => cardTr.removeListener(listener);
  }, []);

  const onClick = useMemo(() => () => {
    if (isClearButton(binding, context) || (!cardTr.isDepsOk() && cardTr.getCardinality() === 1)) {
      if (context.clear) {
        context.clear();
      }
      const nodeType = binding.getItem().getNodetype();
      const itemType = binding.getItem().getType();
      if (itemType === 'group') {
        binding.remove();
        if (context.view.showNow(item, [])) {
          // If we are removing a single row, prepareBindings will only create a
          // maximum of one row.
          const nBindings = context.view.prepareBindings(item, []);
          // The bindings may be of length 0, e.g. if the view is currently showing
          // only mandatory fields and the row is optional.
          if (nBindings.length > 0) {
            context.view.addRow(rowDiv, nBindings[0]);
          }
        }
        rowDiv.destroy();
      } else {
        if (itemType === 'choice') {
          binding.setChoice(null);
        } else {
          binding.setValue('');
        }
        if (nodeType === 'LANGUAGE_LITERAL' || nodeType === 'PLAIN_LITERAL') {
          binding.setLanguage('');
        }
      }
    } else if (context.view.isMultiValued(item)) {
      // This case corresponds to multivalued and deprecated.
      // Slice so we have a copy of the array... since it will change behind the scenes otherwise
      binding.getParent().getChildBindingsFor(item).slice(0).forEach((b) => {
        b.remove();
      });
      rowDiv.parent.destroy();
    } else {
      binding.remove();
      rowDiv.destroy();
    }
  });

  const title = clear ? context.view.messages.edit_clear : context.view.messages.edit_remove;
  return <IconButton
    size="small"
    aria-label={title}
    title={title}
    onClick={onClick}
  >{clear ? (<CancelIcon fontSize="small"/>) : (<RemoveCircleIcon fontSize="small"/>)}</IconButton>;
};

renderingContext.addCreateChildButton = (rowDiv, labelDiv, binding, context) => () => {
  const item = binding.getItem();
  const cardTr = binding.getCardinalityTracker();
  const [disabled, setDisabled] = useState(cardTr.isMax() || !cardTr.isDepsOk() || item.hasStyle('deprecated'));
  useEffect(() => {
    context.rememberParent = binding.getParent(); // If the current binding is removed and the label is not redrawn
    const listener = cardTr.addListener(() => {
      setDisabled(cardTr.isMax() || !cardTr.isDepsOk());
    });
    return () => cardTr.removeListener(listener);
  }, []);
  const onClick = () => {
    if (!cardTr.isMax()) {
      const nBinding = engine.create(context.rememberParent, item);
      context.view.addRow(rowDiv, nBinding); // not the first binding...
    }
  };
  let label = item.getLabel();
  if (label != null && label !== '') {
    label = label.charAt(0).toUpperCase() + label.slice(1);
  } else {
    label = '';
  }
  const title = context.view.messages.edit_add;
  return <Button
    className="rdformsAddChild"
    onClick={onClick}
    aria-label={title}
    title={title}
    disabled={disabled}
    variant="text"
    color="primary"
    startIcon={<AddIcon/>}
  >{label}</Button>;
};
