import moment from 'moment';
import durationEditor from './durationEditor';
import renderingContext from '../renderingContext';
import utils from '../../utils';

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

// -------------- Editors ----------------
const editors = renderingContext.editorRegistry;

// Editor for duration

editors.itemtype('text').datatype('xsd:duration').register(durationEditor);
/* {
    disabled: !binding.getItem().isEnabled(),
    value: binding.getValue(),
    onChange(value) {
      binding.setValue(value);
    },
  }, jquery('<div>').appendTo(fieldDiv)[0]);
  context.clear = () => {
    tb.set('value', '');
  }; */

const addChangeListener = (inp, binding, regex, extLink) => {
  let to = null;
  const s = () => {
    to = null;
    const val = inp.val();
    let disableExtLink = true;
    if (!regex || regex.test(val)) {
      binding.setGist(val);
      if (extLink && val) {
        extLink.prop('href', binding.getValue());
        disableExtLink = false;
      }
    }
    if (extLink) {
      extLink.toggleClass('rdformsExtLinkDisabled', disableExtLink);
    }
    inp.toggleClass('rdformsEmpty', val === '');
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
        const $extLink = jquery(`<a class="fas fa-external-link-alt rdformsExtLink ${renderingContext.getExtLinkClass()}" target="_blank">`);
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
// registerPattern('^-?[0-9][0-9][0-9][0-9]$', 'xsd:gYear');
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
    const originalNrOfLines = countLines(binding.getGist());
    $input = jquery(`<textarea class="form-control rdformsFieldInput autoExpand" rows="${originalNrOfLines}">`);
    $input.on('input focus', function () {
      if (this.baseScrollHeight === undefined) {
        const originalHeight = $input.height();
        this.baseScrollHeight = $input.innerHeight() - originalHeight;
        this.baseLineHeight = originalHeight / originalNrOfLines;
      }
      this.rows = 1;
      const rows = 1 + Math.ceil((this.scrollHeight - this.baseScrollHeight) / this.baseLineHeight);
      this.rows = rows;
    });
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
    const $extLink = jquery(`<a class="fas fa-external-link-alt rdformsExtLink ${renderingContext.getExtLinkClass()}" target="_blank">`);
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
      const defLang = moment.locale();
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
