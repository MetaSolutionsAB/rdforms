import renderingContext from '../renderingContext';
import './labels';
import './text';
import './choice';
import './table';

const createElement = (nodeStr, id) => {
  const el = document.createElement(nodeStr);
  if (id) {
    el.id = id;
  }
  return el;
};

renderingContext.domQuery = (selector, node) => node.querySelector(selector);

renderingContext.domCreate = (nodeStr, parent, id) => parent.appendChild(createElement(nodeStr, id));

renderingContext.domCreateAfter = (nodeStr, sibling, id) =>
  sibling.parentNode.insertBefore(createElement(nodeStr, id), sibling.nextSibling);

renderingContext.domSetAttr = (node, attr, value) => {
  if (value === '' || value === null) {
    node.removeAttribute(attr);
  } else {
    node.setAttribute(attr, value);
  }
};

renderingContext.domText = (node, text) => {
  node.innerText = text;
};

renderingContext.domClassToggle = (node, classStr, addOrRemove) => {
  classStr.split(' ').forEach((cls) => {
    if (addOrRemove) {
      node.classList.add(cls);
    } else {
      node.classList.remove(cls);
    }
  });
};

renderingContext.prePresenterViewRenderer = renderingContext.preEditorViewRenderer;
