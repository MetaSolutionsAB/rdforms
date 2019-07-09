import renderingContext from '../renderingContext';
import utils from '../../utils';
import stamp from 'dojo/date/stamp';
import engine from '../../model/engine';

const pr = renderingContext.presenterRegistry;
const er = renderingContext.editorRegistry;

const uuidFactory = (reg) => {
  const uuid = (fieldDiv, binding, context) => {
    const data = binding.getValue();
    if (context.inEditor) {
      if (data == null || data === '') {
        binding.setValue(utils.generateUUID(), true);
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

const autoValueFactory = (reg) => {
  const autof = (fieldDiv, binding, context) => {
    if (context.inEditor) {
      const data = binding.getValue();
      const path = binding.getItem().getDeps();
      if ((data == null || data === '') && path) {
        const fromBinding = engine.findBindingRelativeToParentBinding(binding.getParent(), path);
        const update = (silent) => {
          const depBinding = engine.matchPathBelowBinding(fromBinding, path);
          const prevValue = binding.getGist();
          const newValue = depBinding ? depBinding.getValue() : '';
          if (prevValue != newValue) {
            binding.setGist(newValue, silent);
          }
        };
        update(true);
        fromBinding.addListener((changedBinding) => {
          if (changedBinding != binding) {
            update();
          }
        });

      }
    }
    reg.getComponentBefore(binding.getItem(), autof)(fieldDiv, binding, context);
  };
  return autof;
};

pr.itemtype('text').style('autoValue').register(autoValueFactory(pr));
er.itemtype('text').style('autoValue').register(autoValueFactory(er));
