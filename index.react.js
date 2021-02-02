import 'core-js/stable';
import 'regenerator-runtime/runtime';
import bundleLoader from './src/template/bundleLoader';
import ItemStore from './src/template/ItemStore';
import './src/view/react/all';
import { Editor, Presenter, ValidationPresenter } from './src/view/react/Wrappers';
import renderingContext from './src/view/renderingContext';

export { bundleLoader, ItemStore, Presenter, Editor, ValidationPresenter, renderingContext };
