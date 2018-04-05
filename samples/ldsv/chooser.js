require([
  'rdforms/view/renderingContext',
], renderingContext => {
  renderingContext.chooserRegistry.itemtype('choice').register({
    show(binding, onSelect) {
      onSelect({ value: 'http://example.com/3', label: { en: 'Example 3' } });
    },
    getChoice(item, value) {
      return { value, label: { en: "Image of Leo" } }
    },
    search(item, term) {
      return new Promise(resolve => resolve([
        {
          value: 'http://dbpedia.org/page/Andrea_del_Verrocchio',
          label: { en: 'Andrea del Verrocchio', },
          description: { en: 'hoppla' }
        },
        {
          value: 'http://dbpedia.org/page/Niccol%C3%B2_Machiavelli',
          label: { en: 'Niccolò Machiavelli' }
        },
      ]));
    },
  });

  renderingContext.chooserRegistry.itemtype('choice').predicate('http://dbpedia.org/property/works').register({
    show(binding, onSelect) {
      // when search icon is clicked.. you can bring up a dialog
      //onSelect({ value: 'http://example.com/3', label: { en: 'Example 3' } });
    },
    getChoice(item, value) {
      return { value, label: value };
    },
    search(item, term) {
      return new Promise(resolve => resolve([
        {
          value: 'http://dbpedia.org/page/Andrea_del_Verrocchio',
          label: { en: 'Andrea del Verrocchio', },
          description: { en: 'hoppla' }
        },
        {
          value: 'http://dbpedia.org/page/Niccol%C3%B2_Machiavelli',
          label: { en: 'Niccolò Machiavelli' }
        },
      ]));
    },
  });
});
