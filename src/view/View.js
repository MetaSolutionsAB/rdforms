import renderingContext from './renderingContext';
import GroupBinding from '../model/GroupBinding';
import * as engine from '../model/engine';
import declare from 'dojo/_base/declare';
import _Widget from 'dijit/_Widget';

export default declare(_Widget, {
  // ===================================================
  // Public attributes
  // ===================================================
  binding: null,
  template: null,
  graph: null,
  resource: '',
  topLevel: true,
  compact: false,
  styleCls: '',
  filterPredicates: null,

  // ===================================================
  // Public API
  // ===================================================

  /**
   * Tells wether something should be shown for the provided bindings and belonging item.
   * @param {Object} item
   * @param {Object} bindings
   * @return {Boolean} true if something should be shown.
   */
  showNow(/* item,  bindings */) {
    return true;
  },

  skipBinding(/* binding */) {
    return false;
  },

  /**
   * This function may change the array of bindings, for instance remove all but
   * the best language or complement the existing bindings
   * until the min cardinality is reached.
   *
   * @param {Object} item
   * @param {Array} bindings
   * @return {Array} of bindings
   */
  prepareBindings(/* item, bindings */) {
  },

  /**
   * Adds a table with headers for the given firstBinding.
   * @param {Node} lastRow if provided it is the last row as a DOM element.
   * @param {Object} firstBinding the first binding to show in this table.
   */
  addTable(/* lastRow, firstBinding */) {
  },

  /**
   * Fills the table with one row for each binding in bindings.
   *
   * @param {Object} table a table DOM element
   * @param {Array} bindings an array of bindings
   */
  fillTable(/* table, bindings */) {
  },

  addLabel(/* rowDiv, labelDiv, binding */) {
  },

  addComponent(/* fieldDiv, binding, noCardinalityButtons */) {
  },

  showAsTable(item) {
    return item.getType() === 'group' && (item.hasStyle('table') || item.hasClass('rdformsTable'));
  },
  // ===================================================
  // Inherited methods
  // ===================================================
  constructor(params) {
    this._handleParams(params);
  },

  _handleParams(params) {
    if (params.binding) {
      this.binding = params.binding;
    } else {
      this.template = params.template || this.template;
      this.graph = params.graph || this.graph;
      this.resource = params.resource || this.resource;
      if (this.graph == null || this.resource == null || this.template == null) {
        return;
      }
      this.binding = engine.match(this.graph, this.resource, this.template);
    }
  },

  /**
   * Builds the user interface by iterating over the child bindings of the current binding
   * and recursively creates new views for all groupbindings.
   */
  buildRendering() {
    this.domNode = this.srcNodeRef;
    renderingContext.domClassToggle(this.domNode, 'rdforms', true);
    renderingContext.domClassToggle(this.domNode, this.styleCls, true);
    this.render();
  },

  show(params) {
    this._handleParams(params);
    this.render();
  },

  render() {
    renderingContext.domText(this.domNode, '');
    if (this.binding == null) {
      return;
    }

    renderingContext.getMessages((messages) => {
      renderingContext.domText(this.domNode, '');
      this.messages = messages;
      if (this.binding == null) {
        // Just in case loading messages takes time
        // and someone does a reset of the view meanwhile.
        return;
      }
      let groupIndex;
      let table;
      let lastRow;
      const groupedItemsArr = this.binding.getItem().getChildren();
      const groupedBindingsArr = this.binding.getItemGroupedChildBindings();
      let bindings;
      let item;
      this._binding2node = {};

      if ((this.compact || this.binding.getItem().hasStyle('compact')) &&
        !this.binding.getItem().hasStyle('nonCompact')) {
        renderingContext.domClassToggle(this.domNode, 'compact', true);
      } else {
        renderingContext.domClassToggle(this.domNode, 'compact', false);
      }

      this.preRenderView();

      for (groupIndex = 0; groupIndex < groupedBindingsArr.length; groupIndex++) {
        bindings = groupedBindingsArr[groupIndex];
        item = groupedItemsArr[groupIndex];

        if (!this.showNow(item, bindings)) {
          // Invisible not not part of showNow check due to things like autoUUID
          /*if (item.hasStyle('invisible')) { // In this case, create some bindings anyway
            this.prepareBindings(item, bindings);
          }*/
// eslint-disable-next-line no-continue
          continue;
        }
        bindings = this.prepareBindings(item, bindings);

        // Table case
        if (this.showAsTable(item)) {
          lastRow = this.createRowNode(lastRow, bindings[0], item);
          if (bindings.length > 0) {
            table = this.addTable(lastRow, bindings[0], item);
            this.fillTable(table, bindings);
          }

          // Non table case
        } else if (bindings.length > 0) {
          for (let i = 0; i < bindings.length; i++) {
            // Add row with label if first row of same item or the binding is a group.
            this.context = {view: this};
            lastRow = this.addRow(lastRow, bindings[i], i === 0 ||
              bindings[i] instanceof GroupBinding);
          }
        } else {
          lastRow = this.createRowNode(lastRow, null, item);
        }

        // Activates/deactivates buttons at startup if needed
        if (bindings.length > 0) {
          bindings[0].getCardinalityTracker().checkCardinality();
        }
      }
    });
  },

  /**
   * Adds a single row corresponding to a binding.
   *
   * @param {Object} lastRow last row that was added
   * @param {Object} binding the binding to add a row for
   * @param {Boolean} includeLabel, tells if a label should be added, if undefined a label is
   * added only when the binding is a GroupBinding.
   */
  addRow(lastRow, binding, includeLabel) {
    let _includeLabel = includeLabel;
    let fieldDiv;
    let newRow;
    const item = binding.getItem();

    if (this.skipBinding(binding)) {
      return undefined;
    }

    if (_includeLabel == null) {
      _includeLabel = binding instanceof GroupBinding;
    }

    // Taking care of dom node structure plus label.
    if (_includeLabel === true) {
      newRow = this.createRowNode(lastRow, binding, item);
      const n = renderingContext.domCreate('div', newRow);
      renderingContext.domClassToggle(n, 'rdformsFields', true);
      fieldDiv = renderingContext.domCreate('div', n);
    } else {
      // No new rowDiv since we have a repeated value under the same label.
      const rdformsFields = renderingContext.domQuery('.rdformsFields', lastRow);
      if (rdformsFields != null) {
        fieldDiv = renderingContext.domCreate('div', rdformsFields);
        renderingContext.domClassToggle(fieldDiv, 'rdformsRepeatedValue', true);
      } else { // Unless we have an non-expanded row.
        const n = renderingContext.domCreate('div', lastRow);
        renderingContext.domClassToggle(n, 'rdformsFields', true);
        fieldDiv = renderingContext.domCreate('div', n);
      }
    }
    if (item.getType() === 'group') {
      renderingContext.domClassToggle(fieldDiv, 'rdformsGroup', true);
    } else {
      renderingContext.domClassToggle(fieldDiv, 'rdformsField', true);
    }

    this._binding2node[binding.getHash()] = fieldDiv;
    this.addComponent(fieldDiv, binding);
    if (item.hasStyle('invisible')) {
      renderingContext.domClassToggle(newRow || lastRow, 'rdformsInvisible', true);
    }
    return newRow || lastRow;
  },
  createRowNode(lastRowNode, binding, item) {
    let rowNode;

    // New rowDiv since we have a label
    if (lastRowNode == null) {
      rowNode = renderingContext.domCreate('div', this.domNode);
    } else {
      rowNode = renderingContext.domCreateAfter('div', lastRowNode);
    }

    item.getClasses().forEach((cls) => {
      renderingContext.domClassToggle(rowNode, cls, true);
    });
    renderingContext.domClassToggle(rowNode, 'rdformsRow', true);
    renderingContext.domClassToggle(rowNode, 'rdformsTopLevel', this.topLevel);
    renderingContext.domClassToggle(rowNode, 'rdformsInvisibleGroup', item.hasStyle('invisibleGroup'));
    renderingContext.domClassToggle(rowNode, 'rdformsHeading', item.hasStyle('heading'));
    renderingContext.domClassToggle(rowNode, 'notCompact', item.getType() === 'group');

    this.addLabel(rowNode, binding, item);
    if (binding && this.filterBinding(binding)) {
      renderingContext.domClassToggle(rowNode, 'hiddenProperty', true);
    }
    return rowNode;
  },

  _getFilterPredicates() {
    return this.parentView ? this.parentView._getFilterPredicates() : this.filterPredicates;
  },
  filterBinding(binding) {
    const fp = this._getFilterPredicates();
    const stmt = binding.getStatement();
    const item = binding.getItem();
    if (fp && stmt) {
      return fp[stmt.getPredicate()] === true;
    }
    if (fp && item.getType() === 'group' && !item.getProperty()) {
      // Checks one level below if there is a child that is visible
      const childBindings = item.getChildren() || [];
      let hasNonFilteredChild = false;
      childBindings.forEach((child) => {
        if (fp[child.getProperty()] !== true) {
          hasNonFilteredChild = true;
        }
      });
      return !hasNonFilteredChild;
    }
    return false;
  },
  filterProperty(property) {
    const fp = this._getFilterPredicates() || {};
    return fp[property] === true;
  },
});
