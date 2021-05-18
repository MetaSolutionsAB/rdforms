/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import renderingContext from '../renderingContext';
import { CODES } from '../../model/engine';


const StyledTooltip = withStyles(theme => ({
  tooltip: {
    backgroundColor: theme.palette.background.default,
    fontSize: 12,
    color: 'black',
    boxShadow: theme.shadows[10],
  },
  tooltipPlacementBottom: {
    margin: '2px 0 24px 0',
  },
}))(Tooltip);

const ItemTooltip = (props) => {
  const [open, setOpen] = useState(false);
  const handleTooltipClose = () => {
    setOpen(false);
  };
  const handleTooltipOpen = () => {
    setOpen(true);
  };
  let propinfo = '';
  const property = props.item.getProperty();
  if (property) {
    propinfo = <div className="rdformsProperty"><a target="_blank" href={property}>{property}</a></div>;
  }
  const description = props.item.getDescription() || (property ? '' : props.context.view.messages.info_missing || '');

  return <ClickAwayListener onClickAway={handleTooltipClose}>
    <StyledTooltip title={(<><p className="rdformsLinebreaks rdformsDescription">{description}</p>{propinfo}</>)}
                   placement="bottom-start" disableHoverListener disableTouchListener
                   onClose={handleTooltipClose}
                   onOpen={handleTooltipOpen}
                   open={open}
    ><span onClick={handleTooltipOpen}>{
      props.children}</span></StyledTooltip></ClickAwayListener>;
};

renderingContext.renderPresenterLabel = (rowNode, binding, item, context) => {
  let label = item.getLabel();
  if (label != null && label !== '') {
    label = label.charAt(0).toUpperCase() + label.slice(1);
  } else {
    label = '';
  }
  label = item.hasStyle('heading') ?
    <h2 tabIndex="0" className="rdformsLabelRow"><span className="rdformsLabel">{label}</span></h2> :
    <span tabIndex="0" className="rdformsLabelRow"><span className="rdformsLabel">{label}</span></span>;
  rowNode.appendChild(<ItemTooltip key={`${binding ? binding.getHash() : item._internalId}_label` } context={context} item={item
  }>{label}</ItemTooltip>);
};

renderingContext.renderEditorLabel = (rowNode, binding, item, context) => {
  if (item.hasStyle('nonEditable') || item.hasStyle('heading')) {
    renderingContext.renderPresenterLabel(rowNode, binding, item, context, true);
  } else {
    let label = item.getLabel();
    if (label != null && label !== '') {
      label = label.charAt(0).toUpperCase() + label.slice(1);
    } else {
      label = '';
    }
    label = item.hasStyle('heading') ? <h2 tabIndex="0" className="rdformsLabel">{label}</h2> :
      <span tabIndex="0" className="rdformsLabel">{label}</span>;
    label = <ItemTooltip item={item} context={context}>{label}</ItemTooltip>;

    const card = item.getCardinality();
    const b = context.view.messages;
    let mark;

    if (card.min > 0) {
      mark = <span className="rdformsMark rdformsMandatoryMark">{b.mandatoryMark}</span>;
    } else if (card.pref > 0) {
      mark = <span className="rdformsMark rdformsRecommendedMark">{b.recommendedMark}</span>;
    } else {
      mark = <span className="rdformsMark rdformsOptionalMark">{b.optionalMark}</span>;
    }
    let Button;
    if (binding == null) {
      Button = renderingContext.addExpandButton(rowNode, null, item, context);
    } else if (item.getType() === 'group' && !context.view.showAsTable(item)) {
      Button = renderingContext.addRemoveButton(rowNode, binding, context);
    }
    const labelId = context.view.createLabelIndex(binding);
    rowNode.appendChild(<div key={`${binding.getHash()}_label`} id={labelId} className="rdformsLabelRow">{
      label}{mark}{Button && <Button></Button>}</div>);
  }
};

const ERR = (props) => {
  const { rowNode, binding, item, context } = props;
  const [code, setCode] = useState(binding.getCardinalityTracker().getCode());
  useEffect(() => {
    const cardTr = binding.getCardinalityTracker();
    const listener = cardTr.addListener(() => {
      const newCode = cardTr.getCode();
      renderingContext.domClassToggle(rowNode, 'rdformsError', newCode !== CODES.UNKNOWN);
      setCode(newCode);
    });
    return () => cardTr.removeListener(listener);
  }, []);
  if (code === CODES.UNKNOWN) {
    return '';
  }
  let message;
  switch (code) {
    case CODES.TOO_MANY_VALUES:
    case CODES.TOO_MANY_VALUES_DISJOINT:
      message = context.view.messages.validation_max_one;
      break;
    case CODES.TOO_FEW_VALUES_MIN:
    default:
      message = context.view.messages.missingValueField;
  }
  return <div className="rdformsWarning">{message}</div>;
};

renderingContext.renderEditorLabelScopeEnd = (rowNode, binding, item, context) => {
  if (!item.hasStyle('nonEditable') && !item.hasStyle('heading')) {
    let Button;
    const card = item.getCardinality();
    if (binding == null) {
      Button = renderingContext.addExpandButton(rowNode, null, item, context);
    } else if (binding.getPredicate() && !context.view.showAsTable(item) && card.max !== 1 &&
      (card.max == null || card.max !== card.min)) {
      Button = renderingContext.addCreateChildButton(rowNode, null, binding, context);
    }
    if (Button) {
      rowNode.appendChild(<Button key={`${binding.getHash()}_labelEnd`}></Button>);
    }
    // If the item is deprecated and there are at least one matching value (binding),
    // provide a message and make sure the entire row (including the label) is deleted when
    // the last faulty binding have been removed
    if (item.hasStyle('deprecated')) {
      const cardTr = binding.getCardinalityTracker();
      const listener = cardTr.addListener(() => {
        if (cardTr.getCardinality() === 0) {
          cardTr.removeListener(listener);
          rowNode.destroy();
        }
      });
      rowNode.appendChild(<div className="rdformsWarning">{context.view.messages.deprecatedField}</div>);
    }

    // If there are dependencies that are not fulfilled, notify.
    if (item.getDeps()) {
      rowNode.appendChild(<div className="rdformsWarning rdformsDependency">
        {context.view.messages.dependencyField}</div>);
    }

    rowNode.appendChild(<ERR rowNode={rowNode} binding={binding} item={item} context={context}></ERR>);
  }
};
