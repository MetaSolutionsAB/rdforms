import DurationEditor from './DurationEditor';
import DurationPresenter from './DurationPresenter';
import renderingContext from '../renderingContext';
import utils from '../../utils';
import system from '../../model/system';
import { i18n } from 'esi18n';
import { escape } from 'lodash-es';

/**
 * Try to guess the number of rows needed for a textarea element by looking at the value of the element
 * @param text
 * @param charsInLine
 * @return {Number}
 */
const countLines = (text, charsInLine = 70) => {
  let rows = text.split('\n').length; // for each explicit new line character add a row
  rows += Number.parseInt((text.length / charsInLine), 10);
  return rows;
};

// -------------- Presenters ----------------
const presenters = renderingContext.presenterRegistry;

// Presenter for URIs.
presenters.itemtype('text').nodetype('URI').register((fieldDiv, binding/* , context */) => {
  const vmap = utils.getLocalizedMap(binding);
  const $a = jquery('<a class="rdformsUrl">')
    .attr('title', binding.getValue())
    .attr('href', binding.getValue())
    .appendTo(fieldDiv);
  if (vmap) {
    $a.text(utils.getLocalizedValue(vmap).value);
  } else {
    $a.text(binding.getGist());
  }
  if (binding.getItem().hasStyle('externalLink')) {
    system.attachExternalLinkBehaviour($a[0], binding);
  } else {
    system.attachLinkBehaviour($a[0], binding);
  }
});

// Presenter for images.
presenters.itemtype('text').nodetype('URI').style('image')
  .register((fieldDiv, binding/* , context */) => {
    jquery('<img class="rdformsImage">').attr('src', binding.getGist()).appendTo(fieldDiv);
  });

// Presenter for text.
presenters.itemtype('text').register((fieldDiv, binding, context) => {
  if (context.view.showLanguage && binding.getLanguage()) {
    jquery('<div class="rdformsLanguage">').text(binding.getLanguage()).appendTo(fieldDiv);
  }
  const text = escape(binding.getGist());

  // The text is shown as a link to the parents bindings URI if:
  // 1) The current item is indicated to be a label.
  // 2) The presenter is not at topLevel.
  // 3) The current item is first in the parents list of children.
  // 4) The parent binding corresponds to a URI
  const parentBinding = binding.getParent();
  if (binding.getItem().hasStyle('label')
    && this.topLevel !== true
    && parentBinding != null && parentBinding.getItem().getChildren()[0] === binding.getItem()
    && parentBinding.getStatement() != null && parentBinding.getStatement().getType() === 'uri') {
    const $a = jquery('<a class="rdformsUrl">')
      .attr('href', parentBinding.getStatement().getValue())
      .html(text)
      .appendTo(fieldDiv);
    system.attachLinkBehaviour($a[0], parentBinding);
  } else {
    jquery('<div>').toggleClass('rdformsField', context.inEditor === true).html(text).appendTo(fieldDiv);
  }

  if (binding.getItem().hasStyle('multiline')) {
    jquery(fieldDiv).toggleClass('rdformsMultiline', true);
  } else {
    jquery(fieldDiv).toggleClass('rdformsSingleline', true);
  }
});

// Presenter for duration
presenters.itemtype('text').datatype('xsd:duration').register((fieldDiv, binding) => {
  // eslint-disable-next-line no-new
  new DurationPresenter({
    value: binding.getValue(),
  }, jquery('<div>').appendTo(fieldDiv)[0]);
});

const datePresenter = (fieldDiv, binding, context) => {
  const data = binding.getValue();
  if (data != null && data !== '') {
    try {
      const d = i18n.getDate(data)
      let str;
      if (data.indexOf('T') > 0) {
        str = i18n.getDate(d);
      } else if (data.length > 4) {
        str = i18n.getDate(d, {selector: 'date'});
      } else {
        str = i18n.getDate(d, {selector: 'date', datePattern: 'YYYY'});
      }
      jquery('<div>').html(str).toggleClass('rdformsField', context.inEditor).appendTo(fieldDiv);
    } catch (e) {
      console.warn(`Could not present date, expected ISO8601 format in the form 2001-01-01 (potentially with time given after a 'T' character as well) but found '${data}' instead.`);
    }
  }
};
presenters.itemtype('text').datatype('xsd:date').register(datePresenter);
presenters.itemtype('text').datatype('dcterms:W3CDTF').register(datePresenter);


// -------------- Editors ----------------
const editors = renderingContext.editorRegistry;

// Editor for duration
editors.itemtype('text').datatype('xsd:duration').register((fieldDiv, binding) => {
  const tb = new DurationEditor({
    disabled: !binding.getItem().isEnabled(),
    value: binding.getValue(),
    onChange(value) {
      binding.setValue(value);
    },
  }, jquery('<div>').appendTo(fieldDiv)[0]);
  context.clear = () => {
    tb.set('value', '');
  };
});

const addChangeListener = (inp, binding, regex, extLink) => {
  let to = null;
  const s = () => {
    to = null;
    const val = inp.val();
    let disableExtLink = true;
    if (!regex || regex.test(val)) {
      binding.setGist(val);
      if (extLink && val) {
        extLink.prop("href", binding.getValue());
        disableExtLink = false;
      }
    }
    if (extLink) {
      extLink.toggleClass("rdformsExtLinkDisabled", disableExtLink);
    }
  };
  const c = () => {
    if (to != null) {
      clearTimeout(to);
    }
    to = setTimeout(s, 200);
  };
  inp.on('keyup paste', c);
};

const registerPattern = (pattern, datatype) => {
  const regex = new RegExp(pattern);
  editors.itemtype('text').datatype(datatype)
    .register((fieldDiv, binding, context) => {
      const $input = jquery('<input type="text" class="form-control rdformsFieldInput">');
      $input.val(binding.getGist())
        .attr('pattern', pattern)
        .appendTo(fieldDiv);

      if (binding.getItem().hasStyle('externalLink')) {
        const $extLink = jquery(`<a class="fa fa-external-link rdformsExtLink ${renderingContext.getExtLinkClass()}" target="_blank">`);
        $extLink.appendTo(context.controlDiv);
        jquery(fieldDiv).addClass('rdformsExtLinkControl');
        addChangeListener($input, binding, regex, $extLink);
        $input.keyup();
      } else {
        addChangeListener($input, binding, regex);
      }


      if (!binding.getItem().isEnabled()) {
        $input.prop('disabled', true);
      }
    });
};
// Editor for gYear
registerPattern('^-?[0-9][0-9][0-9][0-9]$', 'xsd:gYear');
// Editor for integers
registerPattern('^\\d+$', 'xsd:integer');
// Editor for decimals
registerPattern('^(\\d+(\\.\\d+)?)$', 'xsd:decimal');

// Editor for text, possibly multiline, possibly with a pattern
// (supports non-specific datatypes as well).
editors.itemtype('text').register((fieldDiv, binding, context) => {
  const item = binding.getItem();
  let $input;
  if (item.hasStyle('multiline')) {
    $input = jquery(`<textarea class="form-control rdformsFieldInput" rows="${countLines(binding.getGist())}">`);
  } else if (item.hasStyle('email')) {
    $input = jquery('<input type="email" class="form-control rdformsFieldInput">');
  } else {
    $input = jquery('<input type="text" class="form-control rdformsFieldInput">');
  }
  $input.val(binding.getGist())
    .appendTo(fieldDiv);

  const pattern = item.getPattern();
  let regex = null;
  if (pattern != null) {
    $input.attr('pattern', pattern);
    regex = new RegExp(pattern);
  }
  if (item.hasStyle('externalLink')) {
    const $extLink = jquery(`<a class="fa fa-external-link rdformsExtLink ${renderingContext.getExtLinkClass()}" target="_blank">`);
    $extLink.appendTo(context.controlDiv);
    jquery(fieldDiv).addClass('rdformsExtLinkControl');
    addChangeListener($input, binding, regex, $extLink);
    $input.keyup();
  } else {
    addChangeListener($input, binding, regex);
  }

  // If language control should be present
  const nodeType = item.getNodetype();
  if (nodeType === 'LANGUAGE_LITERAL' || nodeType === 'PLAIN_LITERAL') {
    jquery(fieldDiv).addClass('rdformsLangcontrolledfield');
    jquery(context.controlDiv).addClass('rdformsLangFieldControl');
    const $lselect = jquery('<select class="form-control rdformsLanguage">')
      .appendTo(context.controlDiv);
    let primaryLangs = renderingContext.getPrimaryLanguageList();
    let langList = renderingContext.getNonPrimaryLanguageList();
    langList = utils.cloneArrayWithLabels(langList);
    if (primaryLangs.length === 0) {
      langList.forEach((lang) => {
        jquery('<option>').html(lang.label).val(lang.value).appendTo($lselect);
      });
    } else {
      primaryLangs = utils.cloneArrayWithLabels(primaryLangs, true);
      primaryLangs.forEach((lang) => {
        jquery('<option>').html(lang.label).val(lang.value).appendTo($lselect);
      });
      jquery('<option>').html('─────').attr('disabled', 'disabled').appendTo($lselect);

      langList.forEach((lang) => {
        jquery('<option>').html(lang.label).val(lang.value).appendTo($lselect);
      });
    }
    if (binding.isValid()) {
      $lselect.val(binding.getLanguage());
    } else {
      const defLang = renderingContext.getDefaultLanguage();
      if (typeof defLang === 'string' && defLang !== '') {
        $lselect.val(defLang);
        binding.setLanguage(defLang);
      }
    }
    $lselect.val(binding.getLanguage()).change(() => {
      binding.setLanguage($lselect.val());
    });
    context.clear = () => {
      $lselect.val('');
      $input.val('');
    };
  } else {
    context.clear = () => {
      $input.val('');
    };
  }
});
