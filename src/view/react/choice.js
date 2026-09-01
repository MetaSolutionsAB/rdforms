import { createElement, useState, useEffect } from 'react';
import renderingContext from '../renderingContext';
import system from '../../model/system';
import utils from '../../utils';
import { Editor } from './Wrappers';

// -------------- Presenters ----------------
const presenters = renderingContext.presenterRegistry;

const choicify = (func) => (fieldDiv, binding, context) => {
  const choice = binding.getChoice();
  const isEditor = context.view instanceof Editor;
  let desc;
  if (!choice) {
    return;
  }

  const locale = context.view.getLocale();

  if (isEditor && choice.editdescription) {
    desc = utils.getLocalizedValue(choice.editdescription, locale).value;
  } else if (choice.description) {
    desc = utils.getLocalizedValue(choice.description, locale).value;
  }

  func(fieldDiv, binding, choice, desc, isEditor, locale);
};

const getLocalizedLabel = (choice, isEditor, locale) =>
  utils.getLocalizedValue(
    isEditor ? choice.editlabel || choice.label : choice.label,
    locale
  );

// Presenter for image.
presenters
  .itemtype('choice')
  .style('image')
  .register(
    choicify((fieldDiv, binding, choice, desc) => {
      fieldDiv.appendChild(
        <img
          key={binding.getHash()}
          className="rdformsImage"
          title={desc || choice.value}
          alt={desc || choice.value}
          src={utils.sanitizeUrl(choice.value)}
        />
      );
    })
  );

// Presenter for stars
presenters
  .itemtype('choice')
  .style('stars')
  .register(
    choicify((fieldDiv, binding, choice) => {
      if (!isNaN(parseInt(choice.value, 10))) {
        fieldDiv.appendChild(
          <span key={binding.getHash()} className="rdformsStar"></span>
        );
      }
    })
  );

// Presenter for choices.
presenters.itemtype('choice').register(
  choicify((fieldDiv, binding, choice, desc, isEditor, locale) => {
    const item = binding.getItem();
    const title = desc || choice.seeAlso || choice.value;
    if (
      (item.hasStaticChoices() && !item.hasStyle('externalLink')) ||
      item.hasStyle('noLink')
    ) {
      fieldDiv.appendChild(
        createElement(
          () => {
            const [locValue, setLocValue] = useState(
              getLocalizedLabel(choice, isEditor, locale)
            );
            useEffect(() => {
              if (choice.load != null) {
                choice.load(() => {
                  setLocValue(getLocalizedLabel(choice, isEditor, locale));
                });
              }
            }, []);
            return (
              <div
                key={binding.getHash()}
                // Tag lang only when the label resolved to a language other
                // than the page locale (WCAG 3.1.2); undefined → omitted.
                lang={utils.foreignLang(locValue.lang, locale)}
                title={title}
              >
                {locValue.value}
              </div>
            );
          },
          { key: binding.getHash() }
        )
      );
    } else {
      let attrs;
      if (item.hasStyle('externalLink')) {
        attrs = system.attachExternalLinkBehaviour(fieldDiv, binding) || {};
      } else {
        attrs = system.attachLinkBehaviour(fieldDiv, binding) || {};
      }
      const component = attrs.component || null;
      delete attrs.component;

      fieldDiv.appendChild(
        createElement(
          () => {
            const [locValue, setLocValue] = useState(
              getLocalizedLabel(choice, isEditor, locale)
            );
            useEffect(() => {
              if (choice.load != null) {
                choice.load(() => {
                  setLocValue(getLocalizedLabel(choice, isEditor, locale));
                });
              }
            }, []);
            // Tag lang only when the label resolved to a language other than
            // the page locale (WCAG 3.1.2). Set on the element (not mutating the
            // closure-shared attrs) so an async choice.load() that flips the
            // label back to the page locale clears a previously-set lang.
            const labelLang = utils.foreignLang(locValue.lang, locale);
            return (
              <a
                {...attrs}
                lang={labelLang}
                title={title}
                href={utils.sanitizeUrl(choice.seeAlso || choice.value)}
              >
                <span>{locValue.value}</span>
                {component}
              </a>
            );
          },
          { key: binding.getHash() }
        )
      );
    }
  })
);
