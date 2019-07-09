import renderingContext from '../renderingContext';
// bootstrap + rdforms components + bmd
import 'arrive';
import 'bootstrap-material-design';
import 'bootstrap-material-datetimepicker';

import './DateTimeMD';
import './Selectize';

import 'selectize-bootstrap4-theme/dist/css/selectize.bootstrap4.css';
import 'bootstrap-material-datetimepicker/css/bootstrap-material-datetimepicker.css';


// TODO revisit the below strategy. Perhaps use arrive.js as suggested by bmd
// https://github.com/FezVrasta/bootstrap-material-design/tree/v3#arrivejs-support
// updateMaterial called only by postEditorRender
const updateMaterial = (node) => {
  jquery('body').bootstrapMaterialDesign();
};

renderingContext.postEditorRenderer = function (fieldDiv, binding, context) {
  context.$controlDiv.appendTo(fieldDiv);
  updateMaterial(fieldDiv);
};
