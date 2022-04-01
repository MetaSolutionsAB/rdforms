import ValueBinding from './ValueBinding';
import CODES from './CODES';

const label = 'http://www.w3.org/2000/01/rdf-schema#label';
const seeAlso = 'http://www.w3.org/2000/01/rdf-schema#seeAlso';

/**
 * A ValueBinding that only accepts uris from a controlled vocabulary encoded as choices.
 * @see rforms.template.Choice#getChoices
 */
export default class ChoiceBinding extends ValueBinding {
  constructor({ choice, item, statement, matchingCode }) {
    super({ choice, item, statement, matchingCode });
    this._choice = choice;
    this._validPredicate = item.getProperty() != null;
  }

  // Static property on class ChoiceBinding via static getter,
  static get seeAlso() { return seeAlso; }

  setChoice(choice, silent) {
    this._choice = choice;
    if (choice == null) {
      this.setValue(null, null, silent);
    } else if (this.getValue() !== choice.value) {
      this.setValue(choice.value, choice, silent);
    }
    if (choice && choice.mismatch) {
      this.setMatchingCode(CODES.WRONG_VALUE);
    } else if ((!choice || !choice.mismatch) && this.getMatchingCode() === CODES.WRONG_VALUE) {
      this.setMatchingCode(CODES.OK);
    }
  }

  getChoice() {
    return this._choice;
  }

  setValue(value, choice, silent) {
    const oldval = this.getValue();
    super.setValue(value, choice, silent);
    const graph = this._statement.getGraph();
    graph.findAndRemove(oldval, label, undefined, silent);
    graph.findAndRemove(oldval, seeAlso, undefined, silent);

    if (value != null && choice != null) {
      if (choice.seeAlso && choice.inlineSeeAlso) {
        graph.create(value, seeAlso, choice.seeAlso, true, silent);
      }

      if (choice.inlineLabel === true) {
        const labelMap = choice.label || {};
        Object.keys(labelMap).forEach(lang => graph.create(value, label,
            { value: labelMap[lang], lang, type: 'literal' }, true, silent));
      }
    }
  }
}
