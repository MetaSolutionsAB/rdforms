import renderingContext from '../renderingContext';
import './labels';
import './text';
import './choice';
import './table';

renderingContext.domQuery = (selector, node) => node.querySelector(selector);

renderingContext.domCreate = (nodeStr, parent) => parent.appendChild(document.createElement(nodeStr));

renderingContext.domCreateAfter = (nodeStr, sibling) =>
  sibling.parentNode.insertBefore(document.createElement(nodeStr), sibling.nextSibling);

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