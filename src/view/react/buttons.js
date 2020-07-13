import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import renderingContext from '../renderingContext';
import * as engine from '../../model/engine';

renderingContext.addRemoveButton = (fieldDiv, binding, context) => {
  return () => {
    const cardTr = binding.getCardinalityTracker();
    const onClick = () => {
      if (!cardTr.isMin() || !cardTr.isDepsOk() || cardTr.getCardinality() === 1) {
        if (cardTr.getCardinality() === 1) {
          if (binding.getItem().getType() === 'choice') {
            binding.setChoice(null);
          } else {
            binding.setValue('');
          }
          const nodeType = binding.getItem().getNodetype();
          if (nodeType === 'LANGUAGE_LITERAL' || nodeType === 'PLAIN_LITERAL') {
            binding.setLanguage('');
          }
          if (context.clear) {
            context.clear();
          }
        } else {
          binding.remove();
          fieldDiv.destroy();
        }
      }
    };
    return <span className="action fas fa-times" title={context.view.messages.edit_remove} onClick={onClick}></span>;
  };
};

renderingContext.addExpandButton = (rowDiv, labelDiv, item, context) => {
  console.log('Expand button not yet supported');
};

renderingContext.addGroupButtons = (rowDiv, labelDiv, binding, context) => {
  return () => {
    const item = binding.getItem();
    const cardTr = binding.getCardinalityTracker();
    const [addDisabled, setAddDisabled] = useState(cardTr.isMax() || !cardTr.isDepsOk());
    const card = item.getCardinality();
    useEffect(() => {
      context.rememberParent = binding.getParent(); // If the current binding is removed and the label is not redrawn
      const listener = cardTr.addListener(() => {
        setAddDisabled(cardTr.isMax() || !cardTr.isDepsOk());
      });
      return () => cardTr.removeListener(listener);
    }, []);

    const addCls = `action fas fa-plus${addDisabled ? ' disabled' : ''}`;
    const removeCls = `action fas fa-times${card.max === 1 ? ' indentRemove' : ''}`;
    const addOnClick = () => {
      if (!cardTr.isMax()) {
        const nBinding = engine.create(context.rememberParent, binding.getItem());
        context.view.addRow(rowDiv, nBinding); // not the first binding...
      }
    };
    const removeOnClick = () => {
      if (!cardTr.isMin() || !cardTr.isDepsOk()) {
        if (context.clear) {
          context.clear();
        }
        if (cardTr.getCardinality() === 1) {
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
          binding.remove();
          rowDiv.destroy();
        }
      }
    };
    return <React.Fragment>
      {card.max !== 1 && (<span className={addCls} title={context.view.messages.edit_add} onClick={addOnClick}></span>)}
      <span className={removeCls} title={context.view.messages.edit_remove} onClick={removeOnClick}></span>
      </React.Fragment>;
  };
/* if (card.max === 1) {
    $remove.addClass('indentRemove');
  } */
};

renderingContext.addCreateChildButton = (rowDiv, labelDiv, binding, context) => {
  return () => {
    const cardTr = binding.getCardinalityTracker();
    const [disabled, setDisabled] = useState(cardTr.isMax());
    useEffect(() => {
      context.rememberParent = binding.getParent(); // If the current binding is removed and the label is not redrawn
      const listener = cardTr.addListener(() => {
        setDisabled(cardTr.isMax());
      });
      return () => cardTr.removeListener(listener);
    }, []);
    const cls = `action fas fa-plus${disabled ? ' disabled' : ''}`;
    const onClick = () => {
      if (!cardTr.isMax()) {
        const nBinding = engine.create(context.rememberParent, binding.getItem());
        context.view.addRow(rowDiv, nBinding); // not the first binding...
      }
    };
    return <span className={cls} title={context.view.messages.edit_add} onClick={onClick}></span>;
  };
};
