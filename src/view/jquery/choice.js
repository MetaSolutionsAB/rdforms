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
    const locValue = utils.getLocalizedValue(choice.label);
    let $el;

    if (item.hasStaticChoices() && !item.hasStyle('externalLink') || item.hasStyle('noLink')) {
      $el = jquery('<div>')
        .attr('title', desc || choice.seeAlso || choice.value)
        .text(utils.getLocalizedValue(choice.label).value)
        .appendTo(fieldDiv);
    } else {
      $el = jquery('<a class="rdformsUrl">')
        .attr('href', choice.seeAlso || choice.value)
        .attr('title', desc || choice.seeAlso || choice.value)
        .text(locValue.value)
        .appendTo(fieldDiv);
      if (item.hasStyle('externalLink')) {
        system.attachExternalLinkBehaviour($el[0], binding);
      } else {
        system.attachLinkBehaviour($el[0], binding);
      }
    }
    if (choice.load != null) {
      choice.load(() => {
        const locValue2 = utils.getLocalizedValue(choice.label);
        $el.text(locValue2.value);
        if (locValue2.lang) {
          $el.attr('lang', locValue2.lang);
        } else {
          $el.attr('lang', undefined);
        }
      });
    }
    if (locValue.lang) {
      $el.attr('lang', locValue.lang);
    }
  }));
