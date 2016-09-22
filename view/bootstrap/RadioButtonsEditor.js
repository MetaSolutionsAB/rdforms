/*global define*/
define(["dojo/_base/declare",
	"dojo/_base/lang", 
    "dijit/_WidgetBase",
    "jquery"
], function(declare, lang, _WidgetBase, jquery) {

    var uniqueRadioButtonGroupNr = 0;
    return declare([_WidgetBase], {

        constructor: function(args, node) {
            this.binding = args.binding;
            this.item = this.binding.getItem();
            this.choices = this.item.getChoices();
            this.choice = this.binding.getChoice();
            this.context = args.context;
            this.context.clear = lang.hitch(this, this.clear);
        },

        clear: function() {
            jquery(this.domNode).find('input').prop("checked", false);
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
                    $label = jquery('<label>').appendTo($divWrap);
                } else {
                    $label = jquery('<label class="radio-inline">').appendTo(this.domNode);
                }
                if (c.description) {
                    $label.attr("title", this.item._getLocalizedValue(c.description).value
                        || c.seeAlso || c.value);
                }

                var $input = jquery('<input type="radio">')
                    .val(c.value)
                    .attr("checked", c.value === currentValue)
                    .attr("name", "rdformsRadio_"+uniqueRadioButtonGroupNr)
                    .appendTo($label);
                $label.append(this.item._getLocalizedValue(c.label).value);

                if (c.mismatch) {
                    $label.addClass("mismatch disabled");
                    $input.attr('disabled', true);
                } else {
                    $label.click(lang.hitch(this, function (inp) {
                        this.binding.setValue(inp.val());
                    }, $input));
                }
            }
            uniqueRadioButtonGroupNr++;
        }
    });
});