import 'core-js/stable';
import 'regenerator-runtime/runtime';
import bundleLoader from '../src/template/bundleLoader';
import ItemStore from '../src/template/ItemStore';
import '../src/view/jquery/all';
import Presenter from '../src/view/Presenter';
import renderingContext from '../src/view/renderingContext';

export { bundleLoader, ItemStore, Presenter, renderingContext };
