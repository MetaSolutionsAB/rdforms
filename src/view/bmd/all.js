import renderingContext from 'rdforms/view/renderingContext';
import 'bootstrap';
import 'bmd/js/material';
import 'bmd/js/ripples';
import 'rdforms/view/bootstrap/components';

import "fuelux/dist/css/fuelux.min.css";

import 'rdforms/view/bmd/DateTimeMD';
import 'rdforms/view/bmd/Selectize';

import "rdforms/view/bootstrap/base.css";
// import 'bootstrap/dist/css/bootstrap.min.css';

import './style.css';
import "./base.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bmd/css/bootstrap-material-design.css";
import "bmd/css/ripples.css";
import "bootstrap-material-datetimepicker/css/bootstrap-material-datetimepicker.css";

define([
  'jquery',
], (jquery) => {

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
});
