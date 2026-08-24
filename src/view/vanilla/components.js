import renderingContext from '../renderingContext';

// Native-DOM renderingContext hooks for the vanilla flavor — no JS library and
// no CSS framework. Mirrors the shape of jquery/components.js but uses plain
// DOM APIs so a consumer can load the vanilla bundle without jQuery.

const createElement = (tagName, id) => {
  const element = document.createElement(tagName);
  if (id != null) {
    element.setAttribute('id', id);
  }
  return element;
};

renderingContext.domQuery = (selector, node) => node.querySelector(selector);

renderingContext.domCreate = (tagName, parent, id) => {
  const element = createElement(tagName, id);
  if (parent) {
    parent.appendChild(element);
  }
  return element;
};

renderingContext.domCreateAfter = (tagName, sibling, id) => {
  const element = createElement(tagName, id);
  sibling.parentNode.insertBefore(element, sibling.nextSibling);
  return element;
};

renderingContext.domSetAttr = (node, attr, value) => {
  if (value == null) {
    node.removeAttribute(attr);
  } else {
    node.setAttribute(attr, value);
  }
};

renderingContext.domText = (node, text) => {
  node.textContent = text == null ? '' : text;
};

renderingContext.domClassToggle = (node, classStr, addOrRemove) => {
  if (!classStr) {
    return;
  }
  classStr
    .split(' ')
    .filter((cls) => cls !== '')
    .forEach((cls) => {
      node.classList[addOrRemove ? 'add' : 'remove'](cls);
    });
};

// Validation report output for the vanilla flavor: a plain <p> in the
// rdforms-* namespace, no icon font or CSS framework. Errors are announced
// assertively (role="alert"); warnings and deprecations use role="status".
renderingContext.renderValidationMessage = (fieldNode, type, message) => {
  const paragraph = renderingContext.domCreate('p', fieldNode);
  renderingContext.domClassToggle(
    paragraph,
    `rdforms-validation rdforms-validation-${type}`,
    true
  );
  renderingContext.domSetAttr(
    paragraph,
    'role',
    type === 'error' ? 'alert' : 'status'
  );
  renderingContext.domText(paragraph, message);
};
