/*global define*/
define(["dojo/_base/declare",
	"dojo/_base/lang", 
    "dijit/_WidgetBase",
    "jquery",
    "fuelux/radio",
], function(declare, lang, _WidgetBase, jquery) {

    var uniqueRadioButtonGroupNr = 0;
    return declare([_WidgetBase], {

        constructor: function(args, node) {
            this.binding = args.binding;
            this.item = this.binding.getItem();
            this.choices = this.item.getChoices();
            this.choice = this.binding.getChoice();
        },
        buildRendering: function () {
            this.domNode = this.srcNodeRef || jquery('<div>')[0];

            //Add mismatched choice to copy of choice list.
            if (this.choice != null && this.choice.mismatch) {
                this.choices = this.choices.slice(0);
                this.choices.push(this.choice);
            }

            var currentValue = this.binding.getValue();
            for (var ind = 0; ind < this.choices.length; ind++) {
                var c = this.choices[ind], $label;
                if (this.item.hasStyle("verticalRadioButtons")) {
                    var $divWrap = jquery('<div class="radio">').appendTo(this.domNode);
                    $label = jquery('<label class="radio-custom">').appendTo($divWrap);
                } else {
                    $label = jquery('<label class="radio-custom radio-inline">').appendTo(this.domNode);
                }
                var $input = jquery('<input class="sr-only" type="radio">')
                    .val(c.value)
                    .attr("checked", c.value === currentValue)
                    .attr("name", "rdformsRadio_"+uniqueRadioButtonGroupNr)
                    .appendTo($label);
                $label.append(this.item._getLocalizedValue(c.label).value);
                $label.radio();

                if (c.mismatch) {
                    $label.addClass("mismatch");
                    $label.radio('disable');
                } else {
                    $label.click(lang.hitch(this, function () {
                        this.binding.setValue($input.val());
                    }));
                }
            }
            uniqueRadioButtonGroupNr++;
        }
    });
});