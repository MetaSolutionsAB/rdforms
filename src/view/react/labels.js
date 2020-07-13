// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import renderingContext from '../renderingContext';

renderingContext.renderPresenterLabel = (rowNode, binding, item, context, labelRow) => {
  let label = item.getLabel();
  if (label != null && label !== '') {
    label = label.charAt(0).toUpperCase() + label.slice(1);
  } else {
    label = '';
  }
  rowNode.appendChild(<div className={labelRow ? 'rdformsLabel rdformsLabelRow' : 'rdformsLabel'}>{label}</div>);
//  renderingContext.attachItemInfo(item, $labelDiv[0], context);
};

renderingContext.attachItemInfo = (item, aroundNode) => {
  if (item == null || item.getDescription() == null) {
    return;
  }
  const desc = item.getDescription();
  aroundNode.setAttribute('title', desc);
};


renderingContext.renderEditorLabel = (rowNode, binding, item, context) => {
  if (item.hasStyle('nonEditable') || item.hasStyle('heading')) {
    return renderingContext.renderPresenterLabel(rowNode, binding, item, context, true);
  }

  let label = item.getLabel();
  if (label != null && label !== '') {
    label = label.charAt(0).toUpperCase() + label.slice(1);
  } else {
    label = '';
  }
  label = <span className="rdformsLabel">{label}</span>;

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
  } else if (!context.view.showAsTable(item) && (card.max == null || card.max !== card.min)) {
    Button = item.getType() === 'group' ?
      renderingContext.addGroupButtons(rowNode, null, binding, context) :
      renderingContext.addCreateChildButton(rowNode, null, binding, context);
  }
  rowNode.appendChild(<div className="rdformsLabelRow">{label}{mark}{Button && <Button></Button>}</div>);

  // renderingContext.attachItemInfo(item, $label[0], context);

  return undefined;
};
