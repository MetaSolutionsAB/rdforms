/* eslint-disable class-methods-use-this,no-unused-vars */
import { namespaces } from '@entryscape/rdfjson';
import renderingContext from './renderingContext';
import GroupBinding from '../model/GroupBinding';
import * as engine from '../model/engine';
import { bindingReport } from '../model/validate';
import moment from 'moment';

let viewCounter = 0;
export default class View {
  constructor(params, srcNodeRef) {
    this._viewId = viewCounter;
    viewCounter += 1;
    this.renderingParams = params.renderingParams || {};
    this.locale = params.locale;
    this.defaultTextLanguage = params.defaultTextLanguage;
    this.messages = params.messages;
    this.parentView = params.parentView;
    this.srcNodeRef = srcNodeRef;
    this.binding = params.binding || null;
    this.template = params.template || null;
    this.graph = params.graph || null;
    this.resource = params.resource || '';
    this.topLevel = params.topLevel !== false;
    this.compact = params.compact !== false;
    this.showDescription = params.showDescription === true;
    this.popupOnLabel = params.popupOnLabel !== false;
    this.styleCls = params.styleCls || '';
    this.truncateLimit = params.truncateLimit !== undefined ? params.truncateLimit : 10;
    this.truncate = params.truncate !== undefined ? params.truncate : false;
    this.headingLevel = params.headingLevel || 2;
    if (Array.isArray(params.filterPredicates)) {
      this.filterPredicates =
        params.filterPredicates.reduce((prev, current) => { prev[current] = true; return prev; }, {});
    } else if (typeof params.filterPredicates === 'object') {
      this.filterPredicates = params.filterPredicates;
    } else if (typeof params.filterPredicates === 'string') {
      this.filterPredicates = params.filterPredicates.split(',')
        .reduce((prev, current) => { prev[current] = true; return prev; }, {});
    } else {
      this.filterPredicates = null;
    }

    this.restrictToItem = params.restrictToItem;
    this.fuzzy = params.fuzzy === true;
    this.markOrigin = params.markOrigin !== false;
    this._handleParams(params);
    this._labelIndex = {};
    this.domNode = renderingContext.createDomNode(srcNodeRef, this);
    renderingContext.domClassToggle(this.domNode, 'rdforms', true);
    renderingContext.domClassToggle(this.domNode, this.styleCls, true);
    this.render();
  }

  getParentView() {
    return this.parentView;
  }

  getNamedGraphId(namedGraph) {
    if (!this.markOrigin) {
      return undefined;
    }
    if (!this.namedGraphs) {
      this.namedGraphs = {};
      this.namedGraphCounter = 65; // 'A'
    }

    let id = this.namedGraphs[namedGraph];
    if (id === undefined) {
      id = String.fromCharCode(this.namedGraphCounter);
      this.namedGraphs[namedGraph] = id;
      this.namedGraphCounter += 1;
    }
    return id;
  }

  getNamedGraphFromId(id) {
    return this.namedGraphs ? Object.keys(this.namedGraphs).find(key => this.namedGraphs[key] === id) : undefined;
  }

  destroy() {
    renderingContext.destroyDomNode(this.domNode, this);
  }

  getBinding() {
    return this.binding;
  }

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
      if (this.fuzzy) {
        this.binding = engine.fuzzyMatch(this.graph, this.resource, this.template);
        bindingReport(this.binding); // Just to make all extra errors and warnings to be materialized, don't care about the report
      } else {
        this.binding = engine.match(this.graph, this.resource, this.template);
      }
    }
  }

  /**
   * Tells wether something should be shown for the provided bindings and belonging item.
   * @param {Object} item
   * @param {Object} bindings
   * @return {Boolean} true if something should be shown.
   */
  showNow(/* item,  bindings */) {
    return true;
  }

  skipBinding(/* binding */) {
    return false;
  }

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
  }

  /**
   * Adds a table with headers for the given firstBinding.
   * @param {Node} lastRow if provided it is the last row as a DOM element.
   * @param {Object} firstBinding the first binding to show in this table.
   */
  addTable(/* lastRow, firstBinding */) {
  }

  /**
   * Fills the table with one row for each binding in bindings.
   *
   * @param {Object} table a table DOM element
   * @param {Array} bindings an array of bindings
   */
  fillTable(/* table, bindings */) {
  }

  addLabel(/* rowDiv, labelDiv, binding */) {
  }

  addComponent(/* fieldDiv, binding, noCardinalityButtons */) {
  }

  showAsTable(item) {
    return item.getType() === 'group' && (item.hasStyle('table') || item.hasClass('rdformsTable'));
  }

  show(params) {
    this._handleParams(params);
    this.render();
  }

  /**
   * Builds the user interface by iterating over the child bindings of the current binding
   * and recursively creates new views for all groupbindings.
   */
  render() {
    renderingContext.domText(this.domNode, '');
    if (this.binding == null) {
      return;
    }

    if (!this.messages) {
      this.messages = renderingContext.getMessages();
    }
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

      if (this.restrictToItem && this.restrictToItem !== item) {
// eslint-disable-next-line no-continue
        continue;
      }

      if (!this.showNow(item, bindings)) {
        // Invisible not not part of showNow check due to things like autoUUID
        /* if (item.hasStyle('invisible')) { // In this case, create some bindings anyway
          this.prepareBindings(item, bindings);
        } */
// eslint-disable-next-line no-continue
        continue;
      }
      bindings = this.prepareBindings(item, bindings);

      // Table case
      if (this.showAsTable(item)) {
        this.context = { view: this };
        lastRow = this.createRowNode(lastRow, bindings[0], item);
        if (bindings.length > 0) {
          table = this.addTable(lastRow, bindings[0], item);
          this.fillTable(table, bindings);
        }

        // Non table case
      } else if (bindings.length > 0) {
        if (this.isMultiValued(item)) {
          this.context = { view: this };
          lastRow = this.addRow(lastRow, bindings[0], true);
        } else {
          const truncateLimit = this.truncateAt(item, bindings);
          for (let i = 0; i < bindings.length; i++) {
            // Add row with label if first row of same item or the binding is a group.
            this.context = { view: this };
            lastRow = this.addRow(lastRow, bindings[i], i === 0 ||
              bindings[i] instanceof GroupBinding, i, truncateLimit);
          }
          if (truncateLimit !== -1) {
            const rdformsFields = renderingContext.domQuery('.rdformsFields', lastRow);
            if (rdformsFields) renderingContext.addTruncateControl(rdformsFields, this.context);
          }
        }
      } else {
        this.context = { view: this };
        lastRow = this.createRowNode(lastRow, null, item);
      }

      // Activates/deactivates buttons at startup if needed
      if (bindings.length > 0) {
        bindings[0].getCardinalityTracker().checkCardinality();
      }
    }
  }

  /**
   * Adds a single row corresponding to a binding.
   *
   * @param {Object} lastRow last row that was added
   * @param {Object} binding the binding to add a row for
   * @param {Boolean} includeLabel, tells if a label should be added, if undefined a label is
   * added only when the binding is a GroupBinding.
   */
  addRow(lastRow, binding, includeLabel, index, truncateLimit) {
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
      if (truncateLimit !== -1) {
        renderingContext.domClassToggle(n, 'rdformsTruncated', true);
      }
      if (item.hasStyle('inline')) {
        renderingContext.domClassToggle(n, 'rdformsInline', true);
      }
      fieldDiv = renderingContext.domCreate('div', n);
      this.createEndOfRowNode(newRow, binding, item);
    } else {
      // No new rowDiv since we have a repeated value under the same label.
      const rdformsFields = renderingContext.domQuery('.rdformsFields', lastRow);
      if (rdformsFields != null) {
        fieldDiv = renderingContext.domCreate('div', rdformsFields);
        renderingContext.domClassToggle(fieldDiv, 'rdformsRepeatedValue', true);
        if (truncateLimit !== -1 && index >= truncateLimit) {
          renderingContext.domClassToggle(fieldDiv, 'rdformsMaybeTruncated', true);
        }
      } else { // Unless we have an non-expanded row.
        const n = renderingContext.domCreate('div', lastRow);
        renderingContext.domClassToggle(n, 'rdformsFields', true);
        if (item.hasStyle('inline')) {
          renderingContext.domClassToggle(n, 'rdformsInline', true);
        }
        fieldDiv = renderingContext.domCreate('div', n);
        this.createEndOfRowNode(newRow, binding, item);
      }
    }
    if (this.markOrigin) {
      const ngId = this.getNamedGraphId(binding);
      if (ngId) {
        renderingContext.domClassToggle(fieldDiv, 'rdformsOrigin', true);
        renderingContext.domClassToggle(fieldDiv, `rdformsOrigin_${ngId}`, true);
      } else {
        renderingContext.domClassToggle(fieldDiv, 'rdformsOrigin', true);
        renderingContext.domClassToggle(fieldDiv, 'rdformsOrigin_default', true);
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
  }

  createRowNode(lastRowNode, binding, item) {
    let rowNode;

    // New rowDiv since we have a label
    if (lastRowNode == null) {
      rowNode = renderingContext.domCreate('div', this.domNode, binding ? this.getRowIndex(binding) : undefined);
    } else {
      rowNode = renderingContext.domCreateAfter('div', lastRowNode, binding ? this.getRowIndex(binding) : undefined);
    }

    item.getClasses().forEach((cls) => {
      renderingContext.domClassToggle(rowNode, cls, true);
    });
    renderingContext.domClassToggle(rowNode, 'rdformsRow', true);
    renderingContext.domClassToggle(rowNode, 'rdformsTopLevel', this.topLevel);
    renderingContext.domClassToggle(rowNode, 'rdformsInvisibleGroup', item.hasStyle('invisibleGroup'));
    renderingContext.domClassToggle(rowNode, 'rdformsHeading', item.hasStyle('heading'));
    renderingContext.domClassToggle(rowNode, 'notCompact', item.getType() === 'group' || item.hasStyle('nonCompact'));
    renderingContext.domClassToggle(rowNode, 'rdformsCompactItem', item.hasStyle('compact'));

    this.addLabel(rowNode, binding, item);
    if (binding && this.filterBinding(binding)) {
      renderingContext.domClassToggle(rowNode, 'hiddenProperty', true);
    }

    const isEditor = this._subEditors !== undefined;
    if (item.hasStyle('card') ||
      (item.hasStyle('cardInEdit') && isEditor) ||
      (item.hasStyle('cardInPresent') && !isEditor)
    ) {
      renderingContext.domClassToggle(rowNode, 'rdformsCard', true);
    }
    return rowNode;
  }

  createEndOfRowNode(newRow, binding, item) {
  }

  _getFilterPredicates() {
    return this.parentView ? this.parentView._getFilterPredicates() : this.filterPredicates;
  }

  filterBinding(binding) {
    return this.filterItem(binding.getItem());
  }

  filterItem(itemToCheck) {
    const filterPredicates = this._getFilterPredicates();

    const filter = (item, fp) => {
      // Exclude based on item id.
      const id = item.getId();
      if (id && Object.keys(fp).includes(id)) {
        return true;
      }
      const prop = item.getProperty();
      // Exclude if property matches.
      if (prop) {
        // Check if we are in a root-like position,
        // i.e. either directly at the root or further down below groups without property set.
        let rootLike = true;
        let view = this;
        while (view.parentView) {
          if (view.getBinding().getItem().getProperty()) {
            rootLike = false;
          }
          view = view.parentView;
        }
        const shortedProp = namespaces.shortenKnown(prop);
        if (rootLike) {
          return fp[prop] === true || fp[shortedProp] === true ||
            fp[`*${prop}`] === true || fp[`${shortedProp}`] === true;
        } else {
          return fp[`*${prop}`] === true || fp[`*${shortedProp}`] === true;
        }
      } else if (item.getType() === 'group') {
        // Exclude group headers if all children hidden
        const childBindings = item.getChildren() || [];
        let hasNonFilteredChild = false;
        childBindings.forEach((child) => {
          if (!filter(child, fp)) {
            hasNonFilteredChild = true;
          }
        });
        return !hasNonFilteredChild;
      }
      return false;
    };
    return filterPredicates ? filter(itemToCheck, filterPredicates) : false;
  }

  filterProperty(property) {
    const fp = this._getFilterPredicates() || {};
    return fp[property] === true;
  }

  getLabelIndex(binding) {
    let idx;
    binding.getParent().getChildBindingsFor(binding.getItem()).reverse().find((b) => {
      idx = this._labelIndex[b.getHash()];
      return idx !== undefined;
    });
    if (idx !== undefined) {
      return idx;
    }
    if (this.parentView) {
      return this.parentView.getLabelIndex(binding.getParent());
    }
    return '';
  }

  createLabelIndex(binding) {
    const idx = `${binding.getHash()}_${this._viewId}_label`;
    this._labelIndex[binding.getHash()] = idx;
    return idx;
  }

  getRowIndex(binding) {
    return `${binding.getHash()}_${this._viewId}_row`;
  }

  isMultiValued(item) {
    return false;
  }

  truncateAt(item, bindings) {
    return -1;
  }

  getLocale() {
    return this.locale || (this.parentView ? this.parentView.getLocale() : moment.locale());
  }

  getDefaultTextLanguage() {
    return this.defaultTextLanguage || (this.parentView ? this.parentView.getDefaultTextLanguage() : this.getLocale());
  }
}
