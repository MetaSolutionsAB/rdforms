import renderingContext from '../renderingContext';
import system from '../../model/system';
import utils from '../../utils';

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
    if (item.hasStaticChoices() && !item.hasStyle('externalLink') || item.hasStyle('noLink')) {
      jquery('<div>')
        .attr('title', desc || choice.seeAlso || choice.value)
        .text(utils.getLocalizedValue(choice.label).value)
        .appendTo(fieldDiv);
    } else {
      const $a = jquery('<a class="rdformsUrl">')
        .attr('href', choice.seeAlso || choice.value)
        .attr('title', desc || choice.seeAlso || choice.value)
        .text(utils.getLocalizedValue(choice.label).value)
        .appendTo(fieldDiv);
      if (item.hasStyle('externalLink')) {
        system.attachExternalLinkBehaviour($a[0], binding);
      } else {
        system.attachLinkBehaviour($a[0], binding);
      }
      if (choice.load != null) {
        choice.load(() => {
          $a.text(utils.getLocalizedValue(choice.label).value);
        });
      }
    }
  }));