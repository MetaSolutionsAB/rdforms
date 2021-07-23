let uniqueRadioButtonGroupNr = 0;

export default class RadioButtonsEditor {
  constructor(args, node) {
    this.binding = args.binding;
    this.item = this.binding.getItem();
    this.choices = this.item.getChoices().map(c => ({
      label: c.label,
      description: c.description,
      value: c.value,
      text: this.item._getLocalizedValue(c.label).value,
      choice: c,
    }));

    if (!this.item.hasStyle('preserveOrderOfChoices')) {
      this.choices.sort((c1, c2) => (c1.text < c2.text ? -1 : 1));
    }
    this.choice = this.binding.getChoice();
    this.context = args.context;
    this.context.clear = this.clear.bind(this);
    this.domNode = node;
    this.buildRendering();
  }

  clear() {
    jquery(this.domNode).find('input').prop('checked', false);
  }

  buildRendering() {
    // Add mismatched choice to copy of choice list.
    if (this.choice != null && this.choice.mismatch) {
      this.choices.push(this.choice);
    }

    const currentValue = this.binding.getValue();
    for (let ind = 0; ind < this.choices.length; ind++) {
      const c = this.choices[ind];
      let $label;
      const $divWrap = jquery('<div class="radio form-check">').appendTo(this.domNode);

      if (this.item.hasStyle('verticalRadioButtons')) {
        $label = jquery('<label>').appendTo($divWrap);
      } else {
        $label = jquery('<label class="form-check-label">')
          .appendTo($divWrap);
      }
      if (c.description) {
        $label.attr('title', this.item._getLocalizedValue(c.description).value
          || c.seeAlso || c.value);
      }

      const $input = jquery('<input type="radio">')
        .val(c.value)
        .attr('checked', c.value === currentValue)
        .attr('name', `rdformsRadio_${uniqueRadioButtonGroupNr}`)
        .appendTo($label);
      $label.append(this.item._getLocalizedValue(c.label).value);

      if (c.mismatch) {
        $label.addClass('mismatch disabled');
        $input.attr('disabled', true);
      } else {
        $label.click((inp) => {
          this.binding.setValue($input.val());
        });
      }
    }
    uniqueRadioButtonGroupNr += 1;
  }
}
