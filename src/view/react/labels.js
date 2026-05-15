/* eslint-disable no-unused-vars */
import React, { Fragment, useState, useEffect, forwardRef } from 'react';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { styled } from '@mui/material/styles';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import renderingContext from '../renderingContext';
import utils from '../../utils';
import { Editor } from './Wrappers';
import CODES from '../../model/CODES';

const StyledTooltip = styled(
  forwardRef(({ className, ...props }, ref) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))
)(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.background.default,
    fontSize: 12,
    color: 'black',
    boxShadow: theme.shadows[10],
    pointerEvents: 'auto',
  },
  [`& .${tooltipClasses.tooltipPlacementBottom}`]: {
    margin: '2px 0 24px 0',
    marginTop: '0px !important',
  },
}));

const getDescription = (item, view) => {
  const descMap = view instanceof Editor
    ? item.getEditDescriptionMap() || item.getDescriptionMap()
    : item.getDescriptionMap();
  return utils.getLocalizedValue(descMap, view.getLocale()).value;
};

const DescriptionIcon = ({ item, context }) => {
  const { view } = context;
  const description = getDescription(item, view);
  const [pinned, setPinned] = useState(false);
  const [hovered, setHovered] = useState(false);

  if (!description) return null;

  const property = item.getProperty();
  const propinfo = property
    ? <div className="rdformsProperty"><a target="_blank" href={property}>{property}</a></div>
    : null;

  const tooltipContent = <><p className="rdformsLinebreaks rdformsDescription">{description}</p>{propinfo}</>;

  return (
    <ClickAwayListener onClickAway={() => setPinned(false)}>
      <span>
        <StyledTooltip
          title={tooltipContent}
          placement="top-start"
          open={pinned || hovered}
          onOpen={() => setHovered(true)}
          onClose={() => setHovered(false)}
        >
          <HelpOutlineIcon
            className="rdformsDescriptionIcon"
            onClick={() => setPinned(!pinned)}
          />
        </StyledTooltip>
      </span>
    </ClickAwayListener>
  );
};

renderingContext.renderPresenterLabel = (rowNode, binding, item, context) => {
  let labelMap = context.view instanceof Editor ?
    item.getEditLabelMap() || item.getLabelMap() : item.getLabelMap();
  let label = utils.getLocalizedValue(labelMap, context.view.getLocale()).value
  if (label != null && label !== '') {
    label = label.charAt(0).toUpperCase() + label.slice(1);
  } else {
    label = '';
  }

  const view = context.view;
  let description;
  if (item.hasStyle('showDescriptionInPresent') || view.showDescription) {
    // An item is compact if it is exclicitly set as compact or
    // the view is set as compact and the item is not explicitly set as not compact AND
    // we are at the top
    const compactField = item.hasStyle('compact') ||
      (view.compact && !item.hasStyle('nonCompact') && (
        (view.topLevel && item.getType() !== 'group') ||
        (view.parentView && view.parentView.topLevel && view.binding.getItem().hasStyle('heading'))));
    const descMap = view instanceof Editor ? item.getEditDescriptionMap() || item.getDescriptionMap() :
      item.getDescriptionMap();
    const desc = utils.getLocalizedValue(descMap, context.view.getLocale()).value;
    if (!compactField && desc) {
      description = <div className="rdformsDescription">{desc}</div>;
    }
  }

  const labelId = binding ? context.view.createLabelIndex(binding) : undefined;
  const HeadingElement = `h${context.view.headingLevel}`;
  const descriptionIcon = <DescriptionIcon item={item} context={context} />;
  label = item.hasStyle('heading') ?
    <HeadingElement tabIndex="0" id={labelId} className="rdformsLabelRow"><span className="rdformsLabel">{label}</span>{descriptionIcon}</HeadingElement> :
    <span tabIndex="0" id={labelId} className="rdformsLabelRow"><span className="rdformsLabel">{label}</span>{descriptionIcon}</span>;
  rowNode.appendChild(<Fragment key={`${binding ? binding.getHash() : item.getHash()}_label` }>{label}{description}</Fragment>);
};

renderingContext.renderEditorLabel = (rowNode, binding, item, context) => {
  if (item.hasStyle('nonEditable') || item.hasStyle('heading')) {
    renderingContext.renderPresenterLabel(rowNode, binding, item, context, true);
  } else {
    let labelMap = item.getEditLabelMap() || item.getLabelMap();
    let label = utils.getLocalizedValue(labelMap, context.view.getLocale()).value
    if (label != null && label !== '') {
      label = label.charAt(0).toUpperCase() + label.slice(1);
    } else {
      label = '';
    }
    label = item.hasStyle('heading') ? <h2 tabIndex="0" className="rdformsLabel">{label}</h2> :
      <span tabIndex="0" className="rdformsLabel">{label}</span>;

    const card = item.getCardinality();
    const b = context.view.messages;
    let mark;

    // Only show mark if there is a property that allows the item to have an expression on its own
    if (item.getProperty()) {
      if (card.min > 0) {
        mark = <span className="rdformsMark rdformsMandatoryMark">{b.mandatoryMark}</span>;
      } else if (card.pref > 0) {
        mark = <span className="rdformsMark rdformsRecommendedMark">{b.recommendedMark}</span>;
      } else {
        mark = <span className="rdformsMark rdformsOptionalMark">{b.optionalMark}</span>;
      }
    }
    let Button;
    if (binding == null) {
      Button = renderingContext.addExpandButton(rowNode, null, item, context);
    } else if (item.getType() === 'group' && !context.view.showAsTable(item)) {
      if (item.getProperty()) {
        Button = renderingContext.addRemoveButton(rowNode, binding, context);
      }
    }

    const view = context.view;
    let description;
    if (item.hasStyle('showDescriptionInEdit') || view.showDescription) {
      // An item is compact if it is exclicitly set as compact or
      // the view is set as compact and the item is not explicitly set as not compact AND
      // we are at the top
      const compactField = item.hasStyle('compact') ||
        (view.compact && !item.hasStyle('nonCompact') && (
          (view.topLevel && item.getType() !== 'group') ||
          (view.parentView && view.parentView.topLevel && view.binding.getItem().hasStyle('heading'))));
      const descMap = view instanceof Editor ? item.getEditDescriptionMap() || item.getDescriptionMap() :
        item.getDescriptionMap();
      const desc = utils.getLocalizedValue(descMap, context.view.getLocale()).value

      if (!compactField && desc) {
        description = <div className="rdformsDescription" tabIndex="0">{desc}</div>;
      }
    }

    const labelId = context.view.createLabelIndex(binding);
    const descriptionIcon = <DescriptionIcon item={item} context={context} />;
    rowNode.appendChild(<Fragment key={`${binding.getHash()}_label`}><div id={labelId} className="rdformsLabelRow">{
      label}{mark}{descriptionIcon}{Button && <Button></Button>}</div>{description}</Fragment>);
  }
};

const ERR = (props) => {
  const { rowNode, binding, item, context } = props;
  const [code, setCode] = useState(binding.getCardinalityTracker().getCode());
  useEffect(() => {
    const cardTr = binding.getCardinalityTracker();
    const checkAndSetCode = () => {
      const newCode = cardTr.getCode();
      renderingContext.domClassToggle(rowNode, 'rdformsError', newCode !== CODES.UNKNOWN);
      setCode(newCode);
    };
    checkAndSetCode();  // We call it here to be sure, not depending on a potential callback from cardTr
    const listener = cardTr.addListener(checkAndSetCode);
    return () => cardTr.removeListener(listener);
  }, []);
  if (code === CODES.UNKNOWN) {
    return '';
  }
  let message;
  switch (code) {
    case CODES.TOO_MANY_VALUES:
    case CODES.AT_MOST_ONE_CHILD:
      message = context.view.messages.validation_at_most_one_child;
      break;
    case CODES.AT_LEAST_ONE_CHILD:
      message = context.view.messages.validation_at_least_one_child;
      break;
    case CODES.EXACTLY_ONE_CHILD:
      message = context.view.messages.validation_exactly_one_child;
      break;
    case CODES.TOO_FEW_VALUES_MIN:
    default:
      message = context.view.messages.missingValueField;
  }
  return <div className="rdformsWarning">{message}</div>;
};

renderingContext.renderEditorLabelScopeEnd = (rowNode, binding, item, context) => {
  if (!item.hasStyle('nonEditable') && !item.hasStyle('heading')) {
    if (!context.view.isMultiValued(item)) {
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
      rowNode.appendChild(<div key="deprecatedWarning"
                               className="rdformsWarning">{context.view.messages.deprecatedField}</div>);
    }

    // If there are dependencies that are not fulfilled, notify.
    if (item.getDeps()) {
      rowNode.appendChild(<div key="dependencyWarning" className="rdformsWarning rdformsDependency">
        {context.view.messages.dependencyField}</div>);
    }

    rowNode.appendChild(<ERR key="errMessage" rowNode={rowNode} binding={binding} item={item} context={context}></ERR>);
  }
};
