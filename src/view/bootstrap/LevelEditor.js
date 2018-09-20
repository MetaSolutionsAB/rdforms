import Editor from '../Editor';
import renderingContext from '../renderingContext';
import template from './LevelEditorTemplate.html';
import declare from 'dojo/_base/declare';
import _WidgetBase from 'dijit/_WidgetBase';
import _TemplatedMixin from 'dijit/_TemplatedMixin';
import _WidgetsInTemplateMixin from 'dijit/_WidgetsInTemplateMixin';

export default declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {

  //= ==================================================
  // Public methods or attributes
  //= ==================================================
  template: null,
  resource: null,
  graph: null,
  compact: true,
  includeLevel: 'mandatory',
  includeLevelControllsVisible: true,
  externalEditor: false,
  messages: null,

  show(resource, graph, rtemplate) {
    this.resource = resource || this.resource;
    this.graph = graph || this.graph;
    this.template = rtemplate || this.template;
    if (this._rdformsDijit) {
      this._rdformsDijit.show({
        resource: this.resource,
        graph: this.graph,
        template: this.template,
        includeLevel: this.includeLevel,
      });
    }
    this.localize();
  },
  setIncludeLevel(includeLevel) {
    if (this._rdformsDijit != null && this._rdformsDijit.getIncludeLevel() === includeLevel) {
      return;
    }
    this.includeLevel = includeLevel;
// eslint-disable-next-line default-case
    switch (includeLevel) {
      case 'mandatory':
        this._mandatoryClick();
        break;
      case 'recommended':
        this._recommendedClick();
        break;
      case 'optional':
        this._optionalClick();
    }
  },
  localize() {
    renderingContext.getMessages((messages) => {
      renderingContext.domText(this._mandatoryLabelNode, messages.mandatoryLabel);
      renderingContext.domText(this._recommendedLabelNode, messages.recommendedLabel);
      renderingContext.domText(this._optionalLabelNode, messages.optionalLabel);
    });
  },

  //= ==================================================
  // Inherited or private methods or attributes
  //= ==================================================
  templateString: template,

  postCreate() {
    this.inherited('postCreate', arguments);
    if (this.includeLevelControllsVisible) {
      this._cardinalityNode.style.display = '';
    }
    this.setIncludeLevel(this.includeLevel);
    if (!this.externalEditor) {
      this._rdformsDijit = new Editor({
        includeLevel: this.includeLevel,
        compact: this.compact
      }, this._rdformsNode);
      this.show();
    }
  },

  setExternalEditor(editor) {
    if (editor.getIncludeLevel() !== this.includeLevel) {
      editor.setIncludeLevel(this.includeLevel);
    }
    this._rdformsDijit = editor;
    this.show();
  },

  _mandatoryClick(ev) {
    renderingContext.domClassToggle(this._mandatoryLabel, 'active', true);
    renderingContext.domClassToggle(this._recommendedLabel, 'active', false);
    renderingContext.domClassToggle(this._recommendedLabel, 'btn-default', true);
    renderingContext.domClassToggle(this._recommendedLabel, 'btn-success', false);
    renderingContext.domClassToggle(this._optionalLabel, 'active', false);
    renderingContext.domClassToggle(this._optionalLabel, 'btn-default', true);
    renderingContext.domClassToggle(this._optionalLabel, 'btn-success', false);
    this._updateEditor('mandatory');
    if (ev) {
      // event.stop(ev);
      ev.preventDefault();
      ev.stopPropagation();
    }
  },
  _recommendedClick(ev) {
    renderingContext.domClassToggle(this._mandatoryLabel, 'active', true);
    renderingContext.domClassToggle(this._recommendedLabel, 'active', true);
    renderingContext.domClassToggle(this._recommendedLabel, 'btn-success', true);
    renderingContext.domClassToggle(this._recommendedLabel, 'btn-default', false);
    renderingContext.domClassToggle(this._optionalLabel, 'active', false);
    renderingContext.domClassToggle(this._optionalLabel, 'btn-default', true);
    renderingContext.domClassToggle(this._optionalLabel, 'btn-success', false);
    this._updateEditor('recommended');
    if (ev) {
      // event.stop(ev);
      ev.preventDefault();
      ev.stopPropagation();
    }
  },
  _optionalClick(ev) {
    renderingContext.domClassToggle(this._mandatoryLabel, 'active', true);
    renderingContext.domClassToggle(this._recommendedLabel, 'active', true);
    renderingContext.domClassToggle(this._recommendedLabel, 'btn-success', true);
    renderingContext.domClassToggle(this._recommendedLabel, 'btn-default', false);
    renderingContext.domClassToggle(this._optionalLabel, 'active', true);
    renderingContext.domClassToggle(this._optionalLabel, 'btn-success', true);
    renderingContext.domClassToggle(this._optionalLabel, 'btn-default', false);
    this._updateEditor('optional');
    if (ev) {
      ev.preventDefault();
      ev.stopPropagation();
      // event.stop(ev);
    }
  },
  _updateEditor(includeLevel) {
    if (this._rdformsDijit) {
      this._rdformsDijit.setIncludeLevel(includeLevel);
    }
  },
});
