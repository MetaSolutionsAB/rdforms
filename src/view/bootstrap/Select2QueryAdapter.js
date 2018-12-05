import utils from '../../utils';
import ArrayAdapter from 'select2/src/js/select2/data/array';
import Utils from 'select2/src/js/select2/utils';

const AjaxAdapter = function ($element, options) {
  ArrayAdapter.__super__.constructor.call(this, $element, options);
  this.rdformsItem = options.options.rdformsItem;
  this.chooser = options.options.chooser;
};

Utils.Extend(AjaxAdapter, ArrayAdapter);

AjaxAdapter.prototype.query = function (params, callback) {
  const request = () => {
    this.chooser.search(this.rdformsItem, params.term).then((choices) => {
      callback({ results: choices.map(c => ({
        id: c.value,
        text: utils.getLocalizedValue(c.label).value || '',
        choice: c,
      })) });
    });
  };

  if (params.term !== '') {
    if (this._queryTimeout) {
      window.clearTimeout(this._queryTimeout);
    }

    this._queryTimeout = window.setTimeout(request, 300);
  } else {
    request();
  }
};

export default AjaxAdapter;
