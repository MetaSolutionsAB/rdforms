define([
  'dojo/_base/array',
  'rdforms/view/renderingContext',
  'rdforms/model/system',
  'rdforms/utils',
  'rdforms/view/bootstrap/RadioButtonsEditor',
  'jquery',
], (array, renderingContext, system, utils, RadioButtonsEditor, jquery) => {
    // -------------- Presenters ----------------
  const presenters = renderingContext.presenterRegistry;

  const choicify = func => (fieldDiv, binding) => {
    const choice = binding.getChoice();
    let desc;
    if (!choice) {
      return;
    }
    if (choice.description) {
      desc = utils.getLocalizedValue(choice.description).value;
    }
    func(fieldDiv, binding, choice, desc);
  };

    // Presenter for image.
  presenters.itemtype('choice').style('image').register(choicify(
        (fieldDiv, binding, choice, desc) => {
          jquery('<img class="rdformsImage">')
                .attr('src', choice.value)
                .attr('title', desc || choice.value)
                .appendTo(fieldDiv);
        }));

    // Presenter for stars
  presenters.itemtype('choice').style('stars').register(choicify(
        (fieldDiv, binding, choice) => {
          if (!isNaN(parseInt(choice.value, 10))) {
            jquery('<span class="rdformsStar">').appendTo(fieldDiv);
          }
        }));

    // Presenter for choices.
  presenters.itemtype('choice').register(choicify(
        (fieldDiv, binding, choice, desc) => {
          const item = binding.getItem();
          if (item.hasStaticChoices() && !item.hasStyle('externalLink')) {
            jquery('<div>')
                    .attr('title', desc || choice.seeAlso || choice.value)
                    .html(utils.getLocalizedValue(choice.label).value)
                    .appendTo(fieldDiv);
          } else {
            const $a = jquery('<a class="rdformsUrl">')
                    .attr('href', choice.seeAlso || choice.value)
                    .attr('title', desc || choice.seeAlso || choice.value)
                    .html(utils.getLocalizedValue(choice.label).value)
                    .appendTo(fieldDiv);
            if (item.hasStyle('externalLink')) {
              system.attachExternalLinkBehaviour($a[0], binding);
            } else {
              system.attachLinkBehaviour($a[0], binding);
            }
            if (choice.load != null) {
              choice.load(() => {
                $a.html(utils.getLocalizedValue(choice.label).value);
              });
            }
          }
        }));

    // -------------- Editors ----------------
  const editors = renderingContext.editorRegistry;

  const radioCheck = (item) => {
    const choices = item.getChoices();
    const hierarchy = item.getHierarchyProperty() || item.hasStyle('tree');
    return !hierarchy && item.getCardinality().max === 1
            && (!item.hasStyle('dropDown')
            && ((choices != null && choices.length < 5) || item.hasStyle('verticalRadioButtons')
            || item.hasStyle('horizontalRadioButtons')));
  };
  editors.itemtype('choice').choices().check(radioCheck).register((fieldDiv, binding, context) => {
// eslint-disable-next-line no-new
    new RadioButtonsEditor({ binding, context }, fieldDiv);
  });

  editors.itemtype('choice').choices().register((fieldDiv, binding, context) => {
    const item = binding.getItem();
    const choices = item.getChoices().map(c => ({
      choice: c,
      label: item._getLocalizedValue(c.label).value,
    }));
// eslint-disable-next-line arrow-body-style
    choices.sort((c1, c2) => {
      return c1.label < c2.label ? -1 : 1;
    });
    context.choices = choices;
    renderingContext.renderSelect(fieldDiv, binding, context);

    // TODO support for TreeOntologyChooser
    // Check if a tree-hierarchy should be created
    /*  var hierarchy = item.getHierarchyProperty() || item.hasStyle("tree");
        if (hierarchy) {
            var oc;
            var ddButton = domConstruct.create("span", {"class": "action editSearch",
            "title": this.messages.edit_browse}, divToUse);
            on(ddButton, "click", lang.hitch(this, function () {
                if (oc == null) {
                    oc = new TreeOntologyChooser({binding: binding,
                    done: lang.hitch(this, function () {
                        fSelect.set("value", binding.getValue());
                    })});
                }
                oc.show();
            }));
        }*/
  });

    // Depends on system.getChoice and system.openChoiceSelector methods being available
  editors.itemtype('choice').choices('none').register((fieldDiv, binding, context) => {
    const $divToUse = jquery('<div class="input-group systemChoice">').appendTo(fieldDiv);
    const $input = jquery('<input class="form-control" disabled="disabled">').appendTo($divToUse);
    const $wrap = jquery('<span class="input-group-btn">').appendTo($divToUse);
    const $search = jquery('<button class="btn btn-default" type="button">')
            .attr('title', context.view.messages.edit_browse)
            .appendTo($wrap);
    jquery('<span class="fa fa-search" aria-hidden="true">').appendTo($search);

    const setChoice = (choice) => {
      if (choice) {
        $input.val(utils.getLocalizedValue(choice.label).value || '')
                    .toggleClass('mismatch', choice.mismatch === true);
        if (choice.load != null) {
          choice.load(() => {
            $input.val(utils.getLocalizedValue(choice.label).value || '')
                            .toggleClass('mismatch', choice.mismatch === true);
          });
        }
      }
      if (binding.getChoice() !== choice) {
        binding.setChoice(choice);
      }
    };
    $search.click(() => {
      renderingContext.openChoiceSelector(binding, setChoice);
    });
    setChoice(binding.getChoice());
    if (system.hasDnDSupport(binding)) {
      system.addDnD(binding, cNode, setChoice);
    }
    context.clear = () => {
      $input.val('');
    };
  });
});
