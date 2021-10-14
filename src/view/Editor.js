import renderingContext from './renderingContext';
import Presenter from './Presenter';
import * as engine from '../model/engine';
import {bindingReport} from '../model/validate';

const showNow = (editor, item, bindings, includeLevel) => {
  // Invisible should be created as components and hidden using display: none
  // Otherwise certain extentions such as autoUUID does not work.
  /*if (item.hasStyle('invisible')) {
    return false;
  }*/
  if (item.hasStyle('presenterOnly')) {
    return false;
  }
  if (item.hasStyle('deprecated') && bindings.length === 0) {
    return false;
  }
  const prop = item.getProperty();
  if (bindings.length > 0) {
    if (prop) {
      return !editor.filterItem(item);
    }

    // Take care of layout grouping by checking recursively.
    if (item.getType() === 'group') {
      const groupedItemsArr = item.getChildren();
      if (groupedItemsArr.length === 0) {
        return true; // Corresponds to an extention or pure heading, since no children.
      }
      if (bindings[0].getItemGroupedChildBindings().find((childBindings, idx) =>
        showNow(editor, groupedItemsArr[idx], childBindings, includeLevel))) {
        return true;
      }
      if (!prop) {
        return false;
      }
    } else {
      return true;
    }
  }

  const card = item.getCardinality();
  switch (includeLevel) {
    case 'mandatory':
      return card && card.min >= 1;
    case 'recommended':
      return card && (card.min >= 1 || card.pref >= 1);
    default:
      return true;
  }
};

export default class Editor extends Presenter {

  _handleParams(params) {
    this._subEditors = this._subEditors || [];
    this.includeLevel = params.includeLevel || 'recommended';
    this.hideAddress = params.hideAddress !== false; // For instance when you expose address in surrounding application
    params.styleCls = params.styleCls || 'rdformsEditor';
    params.filterTranslations = params.filterTranslations !== undefined ? params.filterTranslations : false;
    super._handleParams(params);
  }

  report(report) {
    const _report = report || bindingReport(this.binding);

    Object.keys(this._binding2node).forEach((key) => {
      renderingContext.domClassToggle(this._binding2node[key], 'errorReport', false);
    });
    for (let j = 0; j < _report.errors.length; j++) {
      const err = _report.errors[j];
      if (err.parentBinding === this.binding) {
        if (err.code === engine.CODES.TOO_FEW_VALUES_MIN) {
          const item = err.item;
          let counter = item.getCardinality().min;

          this.binding.getChildBindingsFor(item).find((binding) => {
            counter -= 1;
            if (!binding.isValid()) {
              renderingContext.domClassToggle(this._binding2node[binding.getHash()],
                'errorReport', true);
            }
            return counter === 0;
          });
        } else if (err.code === engine.CODES.AT_MOST_ONE_CHILD) {
          this.binding.getChildBindings().forEach((binding) => {
            if (binding.getMatchingCode() !== engine.CODES.OK) {
              renderingContext.domClassToggle(this._binding2node[binding.getHash()],
                'errorReport', true);
            }
          });
        }
      }
    }

    for (let i = 0; i < this._subEditors.length; i++) {
      this._subEditors[i].report(_report);
    }
  }

  getIncludeLevel() {
    return this.includeLevel;
  }

  setIncludeLevel(includeLevel) {
    if (this.includeLevel === includeLevel) {
      return;
    }
    this.includeLevel = includeLevel;
    if (this.graph == null || this.resource == null || this.template == null) {
      return;
    }
    this.binding = engine.match(this.graph, this.resource, this.template);
    this._subEditors = [];
    this.render();
  }

  //= ==================================================
  // Inherited methods
  //= ==================================================

  show(params) {
    this._subEditors = [];
    super.show(params);
  }

  /**
   * Will only show something for the given item if there is anything to show, or if the
   * includeLevel indicates to show it anyhow (for example min cardinality > 0 or includeLevel
   * is optional or recommended at the same time the preferred cardinality is bigger than zero.
   * @param {Object} item
   * @param {Object} bindings
   */
  showNow(item, bindings) {
    return showNow(this, item, bindings, this.includeLevel);
  }

  skipBinding(/* binding */) {
    return false;
  }

  /**
   * Will add bindings until the min cardinality is reached.
   * @param {Object} item
   * @param {Object} bindings
   */
  prepareBindings(item, bindings) {
    let _bindings = bindings;
    const card = item.getCardinality();
    let target;
    if (card.pref > 0) {
      target = card.pref;
    } else if (card.min > 0) {
      target = card.min;
    } else if (item.getType() === 'propertygroup') {
      // Was 0 before, old way. Now regulated via includeLevel and expand style instead.
      target = 1;
    } else if (item.getType() === 'group') {
      if (item.getProperty() == null) {
        target = 1;
      } else {
        // Was 0 before, old way. Now regulated via includeLevel and expand style instead.
        target = 1;
      }
    } else {
      target = 1;
    }
    if (target > _bindings.length) {
      _bindings = _bindings.concat([]);
      while (target > _bindings.length) {
        _bindings.push(engine.create(this.binding, item));
      }
    }
    return _bindings;
  }

  addLabel(rowDiv, binding, item) {
    renderingContext.renderEditorLabel(rowDiv, binding, item, this.context);
  }
  createEndOfRowNode(rowNode, binding, item) {
    renderingContext.renderEditorLabelScopeEnd(rowNode, binding, item, this.context);
  }

  addTable(newRow, firstBinding) {
    if (firstBinding.getItem().hasStyle('nonEditable')) {
      return this.addComponent(newRow, firstBinding);
    }
    return renderingContext.addEditorTable(newRow, firstBinding, {view: this});
  }

  fillTable(table, bindings) {
    renderingContext.fillEditorTable(table, bindings, {view: this});
  }

  preRenderView() {
    renderingContext.preEditorViewRenderer(this.domNode, this.binding, {
      view: this, inEditor: true, topLevel: this.topLevel, hideAddress: this.hideAddress
    });
  }

  addComponent(fieldDiv, binding) {
    this.context.inEditor = true;
    if (binding.getItem().hasStyle('nonEditable')) {
      renderingContext.renderPresenter(fieldDiv, binding, this.context);
    } else {
      renderingContext.renderEditor(fieldDiv, binding, this.context);
    }
  }

  createRowNode(lastRowNode, binding, item) {
    if (binding == null && item.hasStyle('nonEditable')) {
      return;
    }
    const newNode = super.createRowNode(lastRowNode, binding, item);
    if (item.getType() === 'choice' && typeof item.getProperty() === 'undefined') {
      const popular = engine.findPopularChoice(item, binding.getParent());
      if (popular) {
        binding.setChoice(popular);
      }
    }
    const path = item.getDeps();
    if (path) {
      const f = (match) => {
        if (!match) {
          if (binding.isValid()) {
            renderingContext.domClassToggle(newNode, 'missingDepsWithValue', true);
            binding.getCardinalityTracker().setDepsOk(false);
          } else {
            renderingContext.domClassToggle(newNode, 'missingDeps', true);
          }
        } else {
          renderingContext.domClassToggle(newNode, 'missingDepsWithValue', false);
          binding.getCardinalityTracker().setDepsOk(true);
          renderingContext.domClassToggle(newNode, 'missingDeps', false);
        }
      };
      const fromBinding = engine.findBindingRelativeToParentBinding(binding.getParent(), path);
      if (!engine.matchPathBelowBinding(fromBinding, path)) {
        f(false);
      }
      const listener = (/* changedBinding */) => {
        if (!binding.getParent()) { // Current binding has been removed, remove the listener
          fromBinding.removeListener(listener);
        } else {
          f(engine.matchPathBelowBinding(fromBinding, path));
        }
      };
      fromBinding.addListener(listener);
    }
    if (this.filterBinding(binding)) {
      renderingContext.domClassToggle(newNode, 'hiddenProperty', true);
    }
    if (item.hasStyle('deprecated')) {
      renderingContext.domClassToggle(newNode, 'rdformsDeprecated', true);
    }
    return newNode;
  }
};
