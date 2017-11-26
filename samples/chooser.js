require([
  'rdforms/view/renderingContext',
], renderingContext => renderingContext.chooserRegistry.itemtype('choice').register({
  show(binding, onSelect) {
    onSelect({ value: 'http://example.com/3', label: { en: 'Example 3' } });
  },
  seearch(item, term) {
    return new Promise(success => success([
      { value: 'http://example.com/1', label: { en: 'Example 1' }, description: { en: 'hoppla' } },
      { value: 'http://example.com/2', label: { en: 'Example 2' } },
    ]));
  },
}));
