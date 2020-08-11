/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';
import renderingContext from '../renderingContext';


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
  const description = props.item.getDescription() || '';
  let propinfo = '';
  const property = props.item.getProperty();
  if (property) {
    propinfo = <div className="rdformsProperty"><a target="_blank" href={property}>{property}</a></div>;
  }

  let label = props.item.getLabel();
  if (label != null && label !== '') {
    label = label.charAt(0).toUpperCase() + label.slice(1);
  } else {
    label = '';
  }
  return <StyledTooltip placement="bottom-start" interactive enterTouchDelay={0} leaveTouchDelay={50000} title={
    (<><p className="rdformsLinebreaks rdformsDescription">{description}</p>{propinfo}</>)}>{
    props.children}</StyledTooltip>;
};

renderingContext.renderPresenterLabel = (rowNode, binding, item, context, labelRow) => {
  let label = item.getLabel();
  if (label != null && label !== '') {
    label = label.charAt(0).toUpperCase() + label.slice(1);
  } else {
    label = '';
  }
  rowNode.appendChild(<ItemTooltip key={`${binding.getHash()}_label`} item={item}><span tabIndex="0" className={
    labelRow ? 'rdformsLabel rdformsLabelRow' : 'rdformsLabel'}><span className="rdformsLabel">{
    label}</span></span></ItemTooltip>);
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
    label = <ItemTooltip item={item}><span tabIndex="0" className="rdformsLabel">{label}</span></ItemTooltip>;

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
    rowNode.appendChild(<div key={`${binding.getHash()}_label`} className="rdformsLabelRow">{
      label}{mark}{Button && <Button></Button>}</div>);
  }
};

renderingContext.renderEditorLabelScopeEnd = (rowNode, binding, item, context) => {
  let Button;
  const card = item.getCardinality();
  if (binding == null) {
    Button = renderingContext.addExpandButton(rowNode, null, item, context);
  } else if (!context.view.showAsTable(item) && card.max !== 1 && (card.max == null || card.max !== card.min)) {
    Button = renderingContext.addCreateChildButton(rowNode, null, binding, context);
  }
  if (Button) {
    rowNode.appendChild(<Button key={`${binding.getHash()}_labelEnd`}></Button>);
  }
};
