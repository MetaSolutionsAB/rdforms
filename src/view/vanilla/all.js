// Vanilla presentation flavor entry: wire the native-DOM renderingContext hooks
// and register the semantic presenters, then expose VanillaPresenter. Importing
// renderingContext (via ./components) also registers the shared group presenter,
// so nested groups render as nested <dl>s.
import './vanilla.css';
import './components';
import './labels';
import './text';
import './choice';
import './table';

export { default as VanillaPresenter } from '../VanillaPresenter';
