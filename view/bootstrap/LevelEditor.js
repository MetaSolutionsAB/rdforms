/*global define*/
define(["dojo/_base/declare",
  "dojo/_base/lang",
  "dojo/_base/event",
  "dijit/_WidgetBase",
  "dijit/_TemplatedMixin",
  "dijit/_WidgetsInTemplateMixin",
  "rdforms/view/renderingContext",
  "rdforms/view/Editor", //in template
  "dojo/text!./LevelEditorTemplate.html"
], function(declare, lang, event, _WidgetBase, _TemplatedMixin,
            _WidgetsInTemplateMixin, renderingContext, Editor, template) {

  return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {

    //===================================================
    // Public methods or attributes
    //===================================================
    template: null,
    resource: null,
    graph: null,
    compact: true,
    includeLevel: "mandatory",
    includeLevelControllsVisible: true,
    externalEditor: false,
    messages: null,

    show: function(resource, graph, template) {
      this.resource = resource || this.resource;
      this.graph = graph || this.graph;
      this.template = template || this.template;
      if (this._rdformsDijit) {
        this._rdformsDijit.show({
          resource: this.resource,
          graph: this.graph,
          template: this.template,
          includeLevel: this.includeLevel
        });
      }
      this.localize();
    },
    setIncludeLevel: function(includeLevel) {
      if (this._rdformsDijit != null && this._rdformsDijit.getIncludeLevel() === includeLevel) {
        return;
      }
      this.includeLevel = includeLevel;
      switch (includeLevel) {
        case "mandatory":
          this._mandatoryClick();
          break;
        case "recommended":
          this._recommendedClick();
          break;
        case "optional":
          this._optionalClick();
      }
    },
    localize: function() {
      renderingContext.getMessages(lang.hitch(this, function(messages) {
        renderingContext.domText(this._mandatoryLabelNode, messages.mandatoryLabel);
        renderingContext.domText(this._recommendedLabelNode, messages.recommendedLabel);
        renderingContext.domText(this._optionalLabelNode, messages.optionalLabel);
      }));
    },

    //===================================================
    // Inherited or private methods or attributes
    //===================================================
    templateString: template,

    postCreate: function () {
      this.inherited("postCreate", arguments);
      if (this.includeLevelControllsVisible) {
        this._cardinalityNode.style.display = "";
      }
      this.setIncludeLevel(this.includeLevel);
      if (!this.externalEditor) {
        this._rdformsDijit = new Editor({includeLevel: this.includeLevel, compact: this.compact}, this._rdformsNode);
        this.show();
      }
    },

    setExternalEditor: function(editor) {
      if (editor.getIncludeLevel() !== this.includeLevel) {
        editor.setIncludeLevel(this.includeLevel);
      }
      this._rdformsDijit = editor;
      this.show();
    },

    _mandatoryClick: function(ev) {
      renderingContext.domClassToggle(this._mandatoryLabel, "active", true);
      renderingContext.domClassToggle(this._recommendedLabel, "active", false);
      renderingContext.domClassToggle(this._recommendedLabel, "btn-default", true);
      renderingContext.domClassToggle(this._recommendedLabel, "btn-success", false);
      renderingContext.domClassToggle(this._optionalLabel, "active", false);
      renderingContext.domClassToggle(this._optionalLabel, "btn-default", true);
      renderingContext.domClassToggle(this._optionalLabel, "btn-success", false);
      this._updateEditor("mandatory");
      if (ev) {
        event.stop(ev);
      }
    },
    _recommendedClick: function(ev) {
      renderingContext.domClassToggle(this._mandatoryLabel, "active", true);
      renderingContext.domClassToggle(this._recommendedLabel, "active", true);
      renderingContext.domClassToggle(this._recommendedLabel, "btn-success", true);
      renderingContext.domClassToggle(this._recommendedLabel, "btn-default", false);
      renderingContext.domClassToggle(this._optionalLabel, "active", false);
      renderingContext.domClassToggle(this._optionalLabel, "btn-default", true);
      renderingContext.domClassToggle(this._optionalLabel, "btn-success", false);
      this._updateEditor("recommended");
      if (ev) {
        event.stop(ev);
      }
    },
    _optionalClick: function(ev) {
      renderingContext.domClassToggle(this._mandatoryLabel, "active", true);
      renderingContext.domClassToggle(this._recommendedLabel, "active", true);
      renderingContext.domClassToggle(this._recommendedLabel, "btn-success", true);
      renderingContext.domClassToggle(this._recommendedLabel, "btn-default", false);
      renderingContext.domClassToggle(this._optionalLabel, "active", true);
      renderingContext.domClassToggle(this._optionalLabel, "btn-success", true);
      renderingContext.domClassToggle(this._optionalLabel, "btn-default", false);
      this._updateEditor("optional");
      if (ev) {
        event.stop(ev);
      }
    },
    _updateEditor: function(includeLevel) {
      if (this._rdformsDijit) {
        this._rdformsDijit.setIncludeLevel(includeLevel);
      }
    }
  });
});