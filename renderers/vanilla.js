import '../src/view/vanilla/all';

export { default as VanillaPresenter } from '../src/view/VanillaPresenter';
// The vanilla flavor's semantic structure lives in the VanillaPresenter
// subclass, not in renderingContext hooks, so it must be the flavor's
// Presenter — consumers loading this bundle and using `Presenter` get
// semantic <dl>/<dt>/<dd> output, mirroring the other flavors' contract.
export { default as Presenter } from '../src/view/VanillaPresenter';
export { default as ValidationPresenter } from '../src/view/vanilla/VanillaValidationPresenter';
export * from '../main';
