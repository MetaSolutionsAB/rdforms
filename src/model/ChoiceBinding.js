import ValueBinding from "./ValueBinding";

const label = "http://www.w3.org/2000/01/rdf-schema#label";
const seeAlso = "http://www.w3.org/2000/01/rdf-schema#seeAlso";

/**
 * A ValueBinding that only accepts uris from a controlled vocabulary encoded as choices.
 * @see rforms.template.Choice#getChoices
 */
export default class ChoiceBinding extends ValueBinding {
  constructor({choice, item, statement}) {
    super({choice, item, statement});
    this._choice = choice;
    this._validPredicate = item.getProperty() != null;
  }

  setChoice(choice, silent) {
    this._choice = choice;
    if (choice == null) {
      this.setValue(null, null, silent);
    } else if (this.getValue() != choice.value) {
      this.setValue(choice.value, choice, silent);
    }
  }

  getChoice() {
    return this._choice;
  }

  get label() {
    return label;
  }

  get seeAlso() {
    return seeAlso;
  }

  remove() {
    this.setValue(null);
    //Removed line below as it is also done in superclass
    //and therefore causes an error
    //this._parent.removeChildBinding(this);
    super.remove();
  }

  setValue(value, choice, silent) {
    super.setValue(value, choice, silent);
    var oldval = this.getValue();
    var graph = this._statement.getGraph();
    graph.findAndRemove(oldval, label, undefined, silent);
    graph.findAndRemove(oldval, seeAlso, undefined, silent);

    if (value != null && choice != null) {
      if (choice.seeAlso && choice.inlineSeeAlso) {
        graph.create(value, ChoiceBinding.seeAlso, choice.seeAlso, true, silent);
      }

      if (choice.inlineLabel === true) {
        var labelMap = choice.label || {};
        for (var lang in labelMap) if (labelMap.hasOwnProperty(lang)) {
          graph.create(value, ChoiceBinding.label,
            {value: labelMap[lang], lang: lang, type: "literal"}, true, silent);
        }
      }
    }
  }
};