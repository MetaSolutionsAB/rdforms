import Editor from '../Editor';
import renderingContext from '../renderingContext';
import jquery from 'jquery';

export default class LevelEditor {

  constructor(params, srcNodeRef) {
    if (srcNodeRef instanceof Node) {
      this.domNode = srcNodeRef;
    } else if (typeof srcNodeRef === 'string') {
      this.domNode = document.getElementById(srcNodeRef);
    } else {
      this.domNode = document.createElement('div');
    }
    this.template = params.template;
    this.resource = params.resource;
    this.graph = params.graph;
    this.compact = params.compact === undefined ? true : params.compact;
    this.includeLevel = params.inclideLevel || 'mandatory';
    this.includeLevelControllsVisible = params.includeLevelControllsVisible === undefined ?
      true : params.includeLevelControllsVisible;
    this.externalEditor = params.externalEditor === undefined ? false : params.externalEditor;
    this.messages = params.messages;
    this.render();
  }
  //= ==================================================
  // Public methods or attributes
  //= ==================================================
  render() {
    this.domNode.innerHTML = `<div class="cardinality" style="display: none;">
     <div class="btn-group" role="group">
            <button type="button" class="btn btn-secondary btn-lg active mandatory">Mandatory</button>
            <button type="button" class="btn btn-secondary btn-lg active recommended">Recommended</button>
            <button type="button" class="btn btn-secondary btn-lg optional">Optional</button>
     </div>
     <div class="rdformsLevelNode"></div>`;
    this._cardinalityNode = jquery(this.domNode).find('.cardinality')[0];
    this._mandatoryButton = jquery(this.domNode).find('.mandatory').click(this._mandatoryClick.bind(this))[0];
    this._recommendedButton = jquery(this.domNode).find('.recommended').click(this._recommendedClick.bind(this))[0];
    this._optionalButton = jquery(this.domNode).find('.optional').click(this._optionalClick.bind(this))[0];
    this._rdformsNode = jquery(this.domNode).find('.rdformsLevelNode')[0];
    if (this.includeLevelControllsVisible) {
      this._cardinalityNode.style.display = '';
    }
    this.setIncludeLevel(this.includeLevel);
    if (!this.externalEditor) {
      this._editor = new Editor({
        includeLevel: this.includeLevel,
        compact: this.compact
      }, this._rdformsNode);
      this.show();
    }
  }

  show(resource, graph, rtemplate) {
    this.resource = resource || this.resource;
    this.graph = graph || this.graph;
    this.template = rtemplate || this.template;
    if (this._editor) {
      this._editor.show({
        resource: this.resource,
        graph: this.graph,
        template: this.template,
        includeLevel: this.includeLevel,
      });
    }
    this.localize();
  }

  setIncludeLevel(includeLevel) {
    if (this._editor != null && this._editor.getIncludeLevel() === includeLevel) {
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
  }

  disableLevel(levelName) {
    switch (levelName) {
      case 'mandatory':
        this._mandatoryLabel.setAttribute('disabled', true);
        break;
      case 'recommended':
        this._recommendedLabel.setAttribute('disabled', true);
        break;
      case 'optional':
        this._optionalLabel.setAttribute('disabled', true);
    }
  }

  localize() {
    renderingContext.getMessages((messages) => {
      renderingContext.domText(this._mandatoryButton, messages.mandatoryLabel);
      renderingContext.domText(this._recommendedButton, messages.recommendedLabel);
      renderingContext.domText(this._optionalButton, messages.optionalLabel);
    });
  }

  setExternalEditor(editor) {
    if (editor.getIncludeLevel() !== this.includeLevel) {
      editor.setIncludeLevel(this.includeLevel);
    }
    this._editor = editor;
    this.show();
  }

  _mandatoryClick(ev) {
    if (!this._mandatoryButton.getAttribute('disabled')) {
      renderingContext.domClassToggle(this._mandatoryButton, 'active', true);
      renderingContext.domClassToggle(this._recommendedButton, 'active', false);
      renderingContext.domClassToggle(this._optionalButton, 'active', false);
      this._updateEditor('mandatory');
    }
    if (ev) {
      // event.stop(ev);
      ev.preventDefault();
      ev.stopPropagation();
    }
  }

  _recommendedClick(ev) {
    if (!this._recommendedButton.getAttribute('disabled')) {
      renderingContext.domClassToggle(this._mandatoryButton, 'active', true);
      renderingContext.domClassToggle(this._recommendedButton, 'active', true);
      renderingContext.domClassToggle(this._optionalButton, 'active', false);
      this._updateEditor('recommended');
    }
    if (ev) {
      // event.stop(ev);
      ev.preventDefault();
      ev.stopPropagation();
    }
  }

  _optionalClick(ev) {
    if (!this._optionalButton.getAttribute('disabled')) {
      renderingContext.domClassToggle(this._mandatoryButton, 'active', true);
      renderingContext.domClassToggle(this._recommendedButton, 'active', true);
      renderingContext.domClassToggle(this._optionalButton, 'active', true);
      this._updateEditor('optional');
    }
    if (ev) {
      ev.preventDefault();
      ev.stopPropagation();
      // event.stop(ev);
    }
  }

  _updateEditor(includeLevel) {
    if (this._editor) {
      this._editor.setIncludeLevel(includeLevel);
    }
  }
}
