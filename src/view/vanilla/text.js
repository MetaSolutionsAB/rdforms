import renderingContext from '../renderingContext';

const presenters = renderingContext.presenterRegistry;

// Plain text value → text content of the <dd>.
presenters.itemtype('text').register((valueNode, binding) => {
  renderingContext.domText(valueNode, binding.getGist());
});

// URI value → an anchor inside the <dd>.
presenters
  .itemtype('text')
  .nodetype('URI')
  .register((valueNode, binding) => {
    const anchor = renderingContext.domCreate('a', valueNode);
    renderingContext.domClassToggle(anchor, 'rdforms-link', true);
    renderingContext.domSetAttr(anchor, 'href', binding.getValue());
    renderingContext.domText(anchor, binding.getGist() || binding.getValue());
  });
