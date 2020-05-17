import renderingContext from '../renderingContext';
import './labels';
import './text';
import './choice';
import './table';
import jquery from 'jquery';

renderingContext.domQuery = (selector, node) => jquery(selector, node)[0];

renderingContext.domCreate = (nodeStr, parent) => jquery(`<${nodeStr}>`).appendTo(parent)[0];

renderingContext.domCreateAfter = (nodeStr, sibling) => {
  const node = jquery(`<${nodeStr}>`);
  jquery(sibling).after(node);
  return node;
};
renderingContext.domSetAttr = (node, attr, value) => {
  jquery(node).attr(attr, value);
};

renderingContext.domText = (node, text) => {
  jquery(node).text(text);
};

renderingContext.domClassToggle = (node, classStr, addOrRemove) => {
  jquery(node).toggleClass(classStr, addOrRemove);
};

renderingContext.prePresenterViewRenderer = renderingContext.preEditorViewRenderer;