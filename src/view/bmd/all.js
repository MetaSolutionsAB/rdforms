import 'bmd';
import '../bootstrap/components';
import 'bmd/dist/css/bootstrap-material-design.css';
import './DateTimeMD';
import './Selectize';
import './style.css';
import renderingContext from '../renderingContext';

// initializeMaterial is not called more than once per X ms
const updateMaterial = (node) => {
  if (jquery.material) {
    jquery(node).find(jquery.material.options.withRipples).each((idx, el) => {
      jquery.material.ripples(el);
    });
    jquery(node).find(jquery.material.options.inputElements).each((idx, el) => {
      jquery.material.input(el);
    });
    jquery(node).find(jquery.material.options.checkboxElements).each((idx, el) => {
      jquery.material.checkbox(el);
    });
    jquery(node).find(jquery.material.options.radioElements).each((idx, el) => {
      jquery.material.radio(el);
    });
    jquery(node).find(jquery.material.options.togglebuttonElements).each((idx, el) => {
      jquery.material.togglebutton(el);
    });
  }
};

renderingContext.postEditorRenderer = function (fieldDiv, binding, context) {
  context.$controlDiv.appendTo(fieldDiv);
  updateMaterial(fieldDiv);
};

