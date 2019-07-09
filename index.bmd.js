import 'whatwg-fetch';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import './src/view/bmd/all';
import './src/view/bootstrap/components';

import ItemStore from './src/template/ItemStore';
import Editor from './src/view/Editor';
import Presenter from './src/view/Presenter';
import ValidationPresenter from './src/view/ValidationPresenter';
import bundleLoader from './src/template/bundleLoader';
import renderingContext from './src/view/renderingContext';

export {bundleLoader, ItemStore, Editor, Presenter, ValidationPresenter, renderingContext};
