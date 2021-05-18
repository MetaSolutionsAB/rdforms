import { useState, useEffect, useMemo } from 'react';
import utils from '../../utils';

/**
 * Wraps a choice in an object where the current label, and description is localized.
 * @param {Object} choice an original choice object with label and descriptions being maps with language strings
 * @return {Object}
 */
export const localizedChoice = choice => ({
  value: choice.value,
  label: utils.getLocalizedValue(choice.label).value,
  description: choice.description ? utils.getLocalizedValue(choice.description).value : undefined,
  seeAlso: choice.seeAlso,
  mismatch: choice.mismatch,
  original: choice,
});

/**
 * Use choices from a binding with localized labels and sorted.
 * A copy is returned with precalculated labels to allow sorting, use the original property on each choice
 * to access the original choice with full information.
 * If the current choice is a mismatch, it is added to the list of choices.
 *
 * @param {Binding} binding
 * @return {Array}
 */
export const useLocalizedSortedChoices = binding => useMemo(() => {
  const choices = binding.getItem().getChoices().map(localizedChoice);
  choices.sort((c1, c2) => (c1.label < c2.label ? -1 : 1));
  const currentChoice = binding.getChoice();
  if (currentChoice != null && currentChoice.mismatch) {
    choices.unshift({
      value: currentChoice.value,
      label: currentChoice.value,
      mismatch: true,
      original: currentChoice,
    });
  }
  return choices;
}, []);

/**
 * Returns a localized choice from the array of localized choices based on the current selected choice in the binding.
 * @param {Binding} binding
 * @param {Array} choices an array of choices returned from the useLocalizedSortedChoices hook.
 */
export const useLocalizedChoice = (binding, choices) => useState(() => {
  const choice = binding.getChoice() || null;
  return choice === null ? null : choices.find(c => c.original === choice);
});

/**
 * Returns a localized choice, may trigger a load step to get a more fleshed out version of the choice,
 * i.e. with label, description and seeAlso.
 * @param {Binding} binding
 */
export const loadLocalizedChoice = (binding) => {
  const [choice, setChoice] = useState(() => {
    const originalChoice = binding.getChoice() || null;
    return originalChoice ? localizedChoice(originalChoice) : null;
  });
  useEffect(() => {
    if (choice && choice.original.load) {
      choice.original.load(() => {
        setChoice(localizedChoice(choice.original));
      }, () => {
        setChoice(localizedChoice(choice.original));
      });
    }
  }, []);
  return [choice, setChoice];
};


let nameCounter = 0;
/**
 * Gives a unique name to be used in forms.
 */
export const useName = () => useMemo(() => {
  nameCounter += 1;
  return `_rdforms_${nameCounter}`;
}, []);
