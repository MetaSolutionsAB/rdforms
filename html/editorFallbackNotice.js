// Shown when an example runs under a presentation-only flavor (e.g. vanilla)
// that exports no editor (or validation presenter): the example falls back to
// the plain presenter, and this banner explains why the form is read-only.
// Inserted as a sibling before the render node so the presenter (which owns the
// node's children) never clears it. An optional `message` overrides the default
// (e.g. for the validation-presenter example).
const DEFAULT_MESSAGE =
  'Read-only preview — this flavor provides no editor, so the data is shown with the presenter instead.';

export default (nodeIdOrElement, message) => {
  const node =
    typeof nodeIdOrElement === 'string'
      ? document.getElementById(nodeIdOrElement)
      : nodeIdOrElement;
  if (!node || !node.parentNode) {
    return;
  }
  const notice = document.createElement('p');
  notice.className = 'rdforms-editor-missing-notice';
  notice.setAttribute('role', 'note');
  notice.style.margin = '0 0 1em';
  notice.style.padding = '0.5em 0.75em';
  notice.style.border = '1px solid #d0d0d0';
  notice.style.borderRadius = '4px';
  notice.style.background = '#f4f4f4';
  notice.style.color = '#444';
  notice.textContent = message || DEFAULT_MESSAGE;
  node.parentNode.insertBefore(notice, node);
};
