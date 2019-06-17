/// #if BLOCKS
  import './src/view/bootstrap/Select2'
  import './src/view/bootstrap/DateTimeFuelux';
  import 'fuelux/dist/css/fuelux.min.css';
  import 'select2/dist/css/select2.css';

/// #else
  import 'core-js/stable';
  import 'regenerator-runtime/runtime';
  import './src/view/bmd/all'; // hard coded bmd
/// #endif

import './src/view/bmd/style.css';

