import Presenter from './Presenter';
import validationMixin from './validationMixin';

/**
 * The default (legacy div-based) validation presenter. The validation behavior
 * lives in {@link validationMixin} so it can be shared with the vanilla flavor's
 * semantic validation presenter without duplication.
 */
export default validationMixin(Presenter);
