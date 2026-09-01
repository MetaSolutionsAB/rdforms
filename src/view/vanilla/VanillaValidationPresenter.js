import VanillaPresenter from '../VanillaPresenter';
import validationMixin from '../validationMixin';

/**
 * The vanilla flavor's validation presenter: the same validation behavior as
 * the legacy `ValidationPresenter`, layered on top of VanillaPresenter so
 * the report renders inside the semantic <dl>/<dt>/<dd> structure.
 */
export default validationMixin(VanillaPresenter);
