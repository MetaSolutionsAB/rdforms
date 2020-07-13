import 'core-js/stable';
import 'regenerator-runtime/runtime';
import bundleLoader from './src/template/bundleLoader';
import ItemStore from './src/template/ItemStore';
import './src/view/react/all';
import { Editor, Presenter } from './src/view/react/Wrappers';
import ValidationPresenter from './src/view/ValidationPresenter';
import renderingContext from './src/view/renderingContext';

export { bundleLoader, ItemStore, Presenter, Editor, ValidationPresenter, renderingContext };
