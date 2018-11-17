import declare from 'dojo/_base/declare';
import _WidgetBase from 'dijit/_WidgetBase';

let uniqueRadioButtonGroupNr = 0;
export default declare([_WidgetBase], {
  constructor(args) {
    this.binding = args.binding;
    this.item = this.binding.getItem();
    this.choices = this.item.getChoices();
    this.choice = this.binding.getChoice();
    this.context = args.context;
    this.context.clear = this.clear.bind(this);
  },

  clear() {
    jquery(this.domNode).find('input').prop('checked', false);
  },

  buildRendering() {
    this.domNode = this.srcNodeRef || jquery('<div>')[0];

    // Add mismatched choice to copy of choice list.
    if (this.choice != null && this.choice.mismatch) {
      this.choices = this.choices.slice(0);
      this.choices.push(this.choice);
    }

    const currentValue = this.binding.getValue();
    for (let ind = 0; ind < this.choices.length; ind++) {
      const c = this.choices[ind];
      let $label;
      if (this.item.hasStyle('verticalRadioButtons')) {
        const $divWrap = jquery('<div class="radio">').appendTo(this.domNode);
        $label = jquery('<label>').appendTo($divWrap);
      } else {
        $label = jquery('<label class="radio-inline">').appendTo(this.domNode);
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
  },
});
