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
 * Boolean editor for Bootstrap - radio buttons for true/false selection.
 *
 * Three-state model:
 * - null: No value (neither radio selected) - no triple in RDF graph
 * - true: True radio selected - 'true'^^xsd:boolean triple exists
 * - false: False radio selected - 'false'^^xsd:boolean triple exists
 */
const booleanEditor = (fieldDiv, binding, context) => {
  const bundle = context.view.messages;
  const item = binding.getItem();
  const isNonEditable = item.hasStyle('nonEditable');
  const ngId = getNamedGraphId(binding, context);
  const isDisabled = !!ngId || isNonEditable;
  const disabledAttr = isDisabled ? 'disabled' : '';

  let boolState = parseBoolean(binding.getValue());

  // Check for invalid boolean value
  const value = binding.getValue();
  const hasError = binding.getMatchingCode() === CODES.WRONG_DATATYPE ||
    (value !== '' && value !== null && !isValidBoolean(value));

  // Generate unique name for radio group
  const radioName = `rdformsBooleanRadio_${binding.getHash()}`;

  const wrapper = jquery('<div>').addClass('rdformsBooleanEditor rdformsFieldInput').appendTo(fieldDiv);

  // Create radio buttons
  const radioGroup = jquery('<div>').addClass('form-check form-check-inline').appendTo(wrapper);

  const trueLabel = jquery('<label>').addClass('form-check-label').appendTo(radioGroup);
  const trueRadio = jquery(`<input type="radio" name="${radioName}" value="true" class="form-check-input" ${disabledAttr}>`)
    .prependTo(trueLabel);
  trueLabel.append(bundle.boolean_true || 'Yes');

  const falseLabel = jquery('<label>').addClass('form-check-label ml-3').appendTo(radioGroup);
  const falseRadio = jquery(`<input type="radio" name="${radioName}" value="false" class="form-check-input" ${disabledAttr}>`)
    .prependTo(falseLabel);
  falseLabel.append(bundle.boolean_false || 'No');

  // Update radio state
  const updateRadios = () => {
    trueRadio.prop('checked', boolState === true);
    falseRadio.prop('checked', boolState === false);
  };

  // Set initial state
  updateRadios();

  // Handle change
  const handleChange = function () {
    if (isDisabled) return;

    const newState = jquery(this).val() === 'true';
    boolState = newState;
    binding.setValue(formatBoolean(newState));
    wrapper.removeClass('mismatchReport');
    wrapper.find('.rdformsWarning').remove();
  };

  trueRadio.on('change', handleChange);
  falseRadio.on('change', handleChange);

  // Error display
  if (hasError) {
    wrapper.addClass('mismatchReport');
    jquery(`<div class="rdformsWarning">${bundle.wrongDatatypeField}</div>`).appendTo(wrapper);
  }

  // Provide clear function for remove button
  context.clear = () => {
    boolState = null;
    updateRadios();
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
