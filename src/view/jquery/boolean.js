import { parseBoolean } from '../booleanUtils';
import renderingContext from '../renderingContext';

/**
 * Boolean presenter for jQuery (lightweight) - displays a disabled checkbox showing the current state.
 * Does not render anything for empty/no value (consistent with other items).
 */
const booleanPresenter = (fieldDiv, binding) => {
  const value = binding.getValue();
  const boolValue = parseBoolean(value);

  // Don't render anything for empty/no value
  if (boolValue === null) {
    return;
  }

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = boolValue;
  checkbox.disabled = true;
  checkbox.className = 'rdformsBooleanPresenter';
  fieldDiv.appendChild(checkbox);
};

// Register presenter
const presenters = renderingContext.presenterRegistry;
presenters.itemtype('text').datatype('xsd:boolean').register(booleanPresenter);
