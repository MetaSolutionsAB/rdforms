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
    // legacy camelCase 'rdformsPresenter').
    this.styleCls = 'rdforms-presenter';
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

  addRow(lastRow, binding, includeLabel) {
    const item = binding.getItem();
    if (this.skipBinding(binding)) {
      return lastRow;
    }
    const withLabel =
      includeLabel == null ? binding instanceof GroupBinding : includeLabel;
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
