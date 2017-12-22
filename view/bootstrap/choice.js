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
      id: c.value,
      text: item._getLocalizedValue(c.label).value,
      choice: c,
    }));
// eslint-disable-next-line arrow-body-style
    choices.sort((c1, c2) => {
      return c1.text < c2.text ? -1 : 1;
    });
    context.choices = choices;
    renderingContext.renderSelect(fieldDiv, binding, context);
  });

    // Depends on system.getChoice and system.openChoiceSelector methods being available
  editors.itemtype('choice').choices('none').register((fieldDiv, binding, context) => {
    context.chooser = renderingContext.chooserRegistry.getComponent(binding.getItem());
    renderingContext.renderSelect(fieldDiv, binding, context);
    const $search = jquery('<button class="btn btn-default btn-fab btn-fab-mini browseChoices" type="button">')
            .attr('title', context.view.messages.edit_browse)
            .appendTo(fieldDiv);
    jquery('<span class="fa fa-search" aria-hidden="true">').appendTo($search);

    const setChoice = (choice) => {
      if (choice) {
        binding.setChoice(choice);
        if (choice.load != null) {
          choice.load(() => {
            context.setValue(choice);
          });
        } else {
          context.setValue(choice);
        }
      } else {
        binding.setChoice(null);
      }
    };
    if (context.chooser && typeof context.chooser.show === 'function') {
      $search.click(() => {
        renderingContext.openChoiceSelector(binding, setChoice);
      });
    } else {
      $search.addClass('disabled');
    }
    if (system.hasDnDSupport(binding)) {
      system.addDnD(binding, cNode, setChoice);
    }
  });
});
