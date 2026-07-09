import renderingContext from './renderingContext';
import Presenter from './Presenter';
import GroupBinding from '../model/GroupBinding';

/**
 * A presentation view that emits semantic HTML instead of the base View's
 * nested-div structure. Each group renders as a <dl class="rdforms-group">;
 * every property is a <dt> (label) followed by one or more <dd> (values).
 * Nested groups recurse into a <dd> automatically — the global group presenter
 * (renderingContext.js) reuses `context.view.constructor`, so a VanillaPresenter
 * root produces VanillaPresenter sub-views and therefore nested <dl>s.
 *
 * Overriding createRowNode/addRow (both dispatched via `this.` in View) lets the
 * flavor swap the markup shape without touching View.js/Presenter.js.
 */
export default class VanillaPresenter extends Presenter {
  _handleParams(params) {
    super._handleParams(params);
    // Keep the flavor inside the rdforms-* namespace (the base defaults to the
    // legacy camelCase 'rdformsPresenter'), but honor a consumer-supplied
    // styleCls and the 'rdformsValidator' marker the validation mixin injects
    // into params.styleCls — overwriting unconditionally would drop both.
    this.styleCls = params.styleCls || 'rdforms-presenter';
    // Deepen the heading level for nested groups so the document outline
    // reflects nesting (h2 → h3 → …, capped at h6).
    if (this.parentView && typeof this.headingLevel === 'number') {
      this.headingLevel = Math.min(this.headingLevel + 1, 6);
    }
  }

  preRenderView() {
    // render() clears this.domNode before calling preRenderView(); drop the
    // stale <dl> reference so a re-render starts a fresh list.
    this._definitionList = null;
    super.preRenderView();
  }

  _list() {
    if (!this._definitionList) {
      this._definitionList = renderingContext.domCreate('dl', this.domNode);
      renderingContext.domClassToggle(
        this._definitionList,
        'rdforms-group',
        true
      );
    }
    return this._definitionList;
  }

  createRowNode(lastRowNode, binding, item) {
    const list = this._list();
    const term = renderingContext.domCreate('dt', list);
    renderingContext.domClassToggle(term, 'rdforms-label', true);
    this.addLabel(term, binding, item);
    return list;
  }

  // A heading-styled group renders as a <section> with an <h{level}> title
  // (headings are not valid inside a <dt>), followed by its nested content.
  _addHeadingSection(binding, item) {
    const section = renderingContext.domCreate('section', this.domNode);
    renderingContext.domClassToggle(section, 'rdforms-section', true);
    const heading = renderingContext.domCreate(
      `h${this.headingLevel || 2}`,
      section
    );
    renderingContext.domClassToggle(heading, 'rdforms-heading', true);
    this.addLabel(heading, binding, item);
    const body = renderingContext.domCreate('div', section);
    renderingContext.domClassToggle(body, 'rdforms-section-body', true);
    this._binding2node[binding.getHash()] = body;
    this.addComponent(body, binding);
    // Subsequent items start a fresh list after the section.
    this._definitionList = null;
    return this.domNode;
  }

  addTable(lastRow, firstBinding) {
    const description = renderingContext.domCreate('dd', this._list());
    renderingContext.domClassToggle(description, 'rdforms-group-value', true);
    return renderingContext.addPresenterTable(description, firstBinding, {
      view: this,
    });
  }

  addRow(lastRow, binding, includeLabel) {
    const item = binding.getItem();
    if (this.skipBinding(binding)) {
      return lastRow;
    }
    const withLabel =
      includeLabel == null ? binding instanceof GroupBinding : includeLabel;
    if (withLabel === true && item.hasStyle('heading')) {
      return this._addHeadingSection(binding, item);
    }
    const list = this._list();
    if (withLabel === true) {
      this.createRowNode(lastRow, binding, item);
    }
    const description = renderingContext.domCreate('dd', list);
    const itemType = item.getType();
    const isGroupLike = itemType === 'group' || itemType === 'propertygroup';
    renderingContext.domClassToggle(
      description,
      isGroupLike ? 'rdforms-group-value' : 'rdforms-value',
      true
    );
    this._binding2node[binding.getHash()] = description;
    this.addComponent(description, binding);
    return list;
  }

  createEndOfRowNode() {}
}
