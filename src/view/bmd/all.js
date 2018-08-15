import renderingContext from '../renderingContext';
// bootstrap + rdforms components + bmd
import 'bootstrap';
import '../bootstrap/components';
import 'arrive/src/arrive';
import 'bootstrap-material-design/dist/js/material';
import 'bootstrap-material-design/dist/js/ripples';

import './DateTimeMD';
import './Selectize';

import 'bootstrap-material-design/dist/css/bootstrap-material-design.css';
import 'bootstrap-material-design/dist/css/ripples.css';
import 'bootstrap-material-datetimepicker/css/bootstrap-material-datetimepicker.css';
import 'font-awesome/css/font-awesome.css';
import './style.css';


// TODO revisit the below strategy. Perhaps use arrive.js as suggested by bmd
// https://github.com/FezVrasta/bootstrap-material-design/tree/v3#arrivejs-support
// updateMaterial called only by postEditorRender
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
