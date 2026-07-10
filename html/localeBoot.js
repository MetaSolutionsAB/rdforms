// Dev/example helper (NOT shipped). Compiled into the dev bundle so it shares
// the library's moment instance (webpack aliases `moment` to one copy). The
// example init.js files are raw ES modules and can't import moment locale data
// themselves, and webpack.common.js strips moment's built-in `./locale` context
// — so this module loads the locales explicitly (an explicit `moment/locale/xx`
// sub-path import is not matched by that IgnorePlugin) and sets the active
// locale from the `?lang` query param. It runs at bundle eval, before the
// deferred `type="module"` init.js, so presenters pick up the locale on first
// render (View.getLocale() falls back to moment.locale()).
import moment from 'moment';
import 'moment/locale/sv';
import 'moment/locale/de';
import 'moment/locale/fr';

const supported = ['en', 'sv', 'de', 'fr'];
const requested = new URLSearchParams(location.search).get('lang');
moment.locale(supported.includes(requested) ? requested : 'en');
