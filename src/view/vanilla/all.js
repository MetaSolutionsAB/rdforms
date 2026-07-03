// Vanilla presentation flavor entry: wire the native-DOM renderingContext hooks
// and register the semantic presenters, then expose VanillaPresenter. Importing
// renderingContext (via ./components) also registers the shared group presenter,
// so nested groups render as nested <dl>s.
//
// Styling is opt-in: unlike the other flavors this entry injects NO CSS, so the
// bundle emits plain semantic HTML. Consumers who want the minimal look link the
// separately-shipped dist/rdforms.vanilla.css (source: ./vanilla.css).
import './components';
import './labels';
import './text';
import './choice';
import './table';

export { default as VanillaPresenter } from '../VanillaPresenter';
