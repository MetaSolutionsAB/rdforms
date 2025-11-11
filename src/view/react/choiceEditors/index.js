/* eslint-disable no-unused-vars */
import React from 'react';
import renderingContext from '../../renderingContext';
import RadioButtonsEditor from './RadioButtonsEditor';
import CheckBoxesEditor from './CheckBoxesEditor';
import ChoiceSelector from './ChoiceSelector';
import ChoiceLookup from './ChoiceLookup';
import ChoiceLookupAndInlineSearch from './ChoiceLookupAndInlineSearch';

/**
 * Checks if the current item can be rendered as radiobuttons.
 * @param {rdforms/item}
 * @returns {boolean}
 */
const radioCheck = (item) => {
  const choices = item.getChoices();
  const hierarchy = item.getHierarchyProperty() || item.hasStyle('tree');
  return (
    !hierarchy &&
    item.getCardinality().max === 1 &&
    !item.hasStyle('dropDown') &&
    ((choices != null && choices.length < 5) ||
      item.hasStyle('verticalRadioButtons') ||
      item.hasStyle('horizontalRadioButtons'))
  );
};

const editors = renderingContext.editorRegistry;
editors
  .itemtype('choice')
  .choices()
  .check(radioCheck)
  .register((fieldDiv, binding, context) => {
    // eslint-disable-next-line no-new
    fieldDiv.appendChild(
      <RadioButtonsEditor
        key={binding.getHash()}
        binding={binding}
        context={context}
        field={fieldDiv}
      />
    );
  });

const checkBoxComponent = (fieldDiv, binding, context) => {
  // eslint-disable-next-line no-new
  fieldDiv.appendChild(
    <CheckBoxesEditor
      key={binding.getHash()}
      binding={binding}
      context={context}
      field={fieldDiv}
    />
  );
};
editors
  .itemtype('choice')
  .choices()
  .style('verticalCheckBoxes')
  .register(checkBoxComponent);
editors
  .itemtype('choice')
  .choices()
  .style('horizontalCheckBoxes')
  .register(checkBoxComponent);

editors
  .itemtype('choice')
  .choices()
  .register((fieldDiv, binding, context) => {
    fieldDiv.appendChild(
      <ChoiceSelector
        key={binding.getHash()}
        binding={binding}
        context={context}
        field={fieldDiv}
      />
    );
  });

editors
  .itemtype('choice')
  .choices('none')
  .register((fieldDiv, binding, context) => {
    context.chooser = renderingContext.chooserRegistry.getComponent(
      binding.getItem()
    );
    if (typeof context.chooser.search === 'function') {
      fieldDiv.appendChild(
        <ChoiceLookupAndInlineSearch
          key={binding.getHash()}
          binding={binding}
          context={context}
          field={fieldDiv}
        />
      );
    } else {
      fieldDiv.appendChild(
        <ChoiceLookup
          key={binding.getHash()}
          binding={binding}
          context={context}
          field={fieldDiv}
        />
      );
    }
  });
