define([
  'rdforms/view/renderingContext',
  'dojo/date/stamp',
], (renderingContext, stamp) => {
  const pr = renderingContext.presenterRegistry;
  const er = renderingContext.editorRegistry;
  const generateUUID = () => { // Public Domain/MIT
    let d = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
      d += performance.now(); //use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      let r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  };

  const uuidFactory = (reg) => {
    const uuid = (fieldDiv, binding, context) => {
      const data = binding.getValue();
      if (context.inEditor) {
        if (data == null || data === '') {
          binding.setValue(generateUUID());
        }
      }
      reg.getComponentBefore(binding.getItem(), uuid)(fieldDiv, binding, context);
    };
    return uuid;
  };

  pr.itemtype('text').style('autoUUID').register(uuidFactory(pr));
  er.itemtype('text').style('autoUUID').register(uuidFactory(er));

  const autoDateFactory = (reg) => {
    const autoDate = (fieldDiv, binding, context) => {
      const data = binding.getValue();
      const item = binding.getItem();
      if (context.inEditor) {
        if (data == null || data === '') {
          if (item.hasStyle('autoInitDate') || item.hasStyle('autoUpdateDate')) {
            binding.setValue(stamp.toISOString(new Date()), true);
          }
        } else if (item.hasStyle('autoUpdateDate')) {
          binding.setValue(stamp.toISOString(new Date()), true);
        }
      }
      reg.getComponentBefore(binding.getItem(), autoDate)(fieldDiv, binding, context);
    };
    return autoDate;
  };

  // Add autoUpdateDate and autoInitDate componenets as a layer above the default component
  const autoDateP = autoDateFactory(pr);
  pr.itemtype('text').datatype('xsd:date').style('autoUpdateDate').register(autoDateP);
  pr.itemtype('text').datatype('xsd:date').style('autoInitDate').register(autoDateP);
  pr.itemtype('text').datatype('dcterms:W3CDTF').style('autoUpdateDate').register(autoDateP);
  pr.itemtype('text').datatype('dcterms:W3CDTF').style('autoInitDate').register(autoDateP);
  const autoDateE = autoDateFactory(er);
  er.itemtype('text').datatype('xsd:date').style('autoUpdateDate').register(autoDateE);
  er.itemtype('text').datatype('xsd:date').style('autoInitDate').register(autoDateE);
  er.itemtype('text').datatype('dcterms:W3CDTF').style('autoUpdateDate').register(autoDateE);
  er.itemtype('text').datatype('dcterms:W3CDTF').style('autoInitDate').register(autoDateE);
});

