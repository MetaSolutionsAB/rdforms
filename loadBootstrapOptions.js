/// #if BLOCKS
  import 'bootstrap';
  import './src/view/bootstrap/Select2'
  import './src/view/bootstrap/DateTimeFuelux';
  import 'fuelux/dist/css/fuelux.min.css';
  import 'select2/dist/css/select2.css';
  import './src/view/bootstrap/style.css';
/// #else
  import 'core-js/stable';
  import 'regenerator-runtime/runtime';
  import './src/view/bmd/all'; // hard coded bmd
  import './src/view/bmd/style.css';
/// #endif

