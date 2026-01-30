import jquery from 'jquery';
import { parseBoolean, formatBoolean, isValidBoolean } from '../booleanUtils';
import { getNamedGraphId } from '../viewUtils';
import renderingContext from '../renderingContext';
import CODES from '../../model/CODES';

/**
 * Boolean presenter for Bootstrap - displays a disabled checkbox showing the current state.
 * Does not render anything for empty/no value (consistent with other items).
 */
const booleanPresenter = (fieldDiv, binding) => {
  const value = binding.getValue();
  const boolValue = parseBoolean(value);

  // Don't render anything for empty/no value
  if (boolValue === null) {
    return;
  }

  const checkbox = jquery('<input type="checkbox" class="form-check-input rdformsBooleanPresenter" disabled>');
  checkbox.prop('checked', boolValue);
  checkbox.appendTo(fieldDiv);
};

/**
 * Boolean editor for Bootstrap - checkbox with indeterminate state support.
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
  const item = binding.getItem();
  const isNonEditable = item.hasStyle('nonEditable');
  const ngId = getNamedGraphId(binding, context);
  const isDisabled = !!ngId || isNonEditable;

  let boolState = parseBoolean(binding.getValue());

  // Check for invalid boolean value
  const value = binding.getValue();
  const hasError = binding.getMatchingCode() === CODES.WRONG_DATATYPE ||
    (value !== '' && value !== null && !isValidBoolean(value));

  const wrapper = jquery('<div>').addClass('rdformsBooleanEditor rdformsFieldInput').appendTo(fieldDiv);

  const checkbox = jquery('<input type="checkbox" class="form-check-input rdformsBooleanCheckbox">')
    .prop('disabled', isDisabled)
    .appendTo(wrapper);

  // Update checkbox state (checked and indeterminate)
  const updateCheckbox = () => {
    if (boolState === null) {
      checkbox.prop('checked', false);
      checkbox.prop('indeterminate', true);
    } else {
      checkbox.prop('indeterminate', false);
      checkbox.prop('checked', boolState);
    }
  };

  // Set initial state
  updateCheckbox();

  // Handle click
  checkbox.on('click', function () {
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

    boolState = newState;
    updateCheckbox();
    binding.setValue(formatBoolean(newState));
    wrapper.removeClass('mismatchReport');
    wrapper.find('.rdformsWarning').remove();
  });

  // Error display
  if (hasError) {
    wrapper.addClass('mismatchReport');
    jquery(`<div class="rdformsWarning">${context.view.messages.wrongDatatypeField}</div>`).appendTo(wrapper);
  }

  // Provide clear function for remove button
  context.clear = () => {
    boolState = null;
    updateCheckbox();
    wrapper.removeClass('mismatchReport');
    wrapper.find('.rdformsWarning').remove();
  };
};

// Register presenter
const presenters = renderingContext.presenterRegistry;
presenters.itemtype('text').datatype('xsd:boolean').register(booleanPresenter);

// Register editor
const editors = renderingContext.editorRegistry;
editors.itemtype('text').datatype('http://www.w3.org/2001/XMLSchema#boolean').register(booleanEditor);
