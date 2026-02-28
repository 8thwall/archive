// @sublibrary(:dom-core-lib)
// An element is potentially render-blocking if its blocking tokens set contains "render", or if it
// is implicitly potentially render-blocking, which will be defined at the individual elements. By
// default, an element is not implicitly potentially render-blocking.
// See: /multipage/urls-and-fetching.html#implicitly-potentially-render-blocking
const implicitlyPotentiallyRenderBlockingSym = Symbol('implicitlyPotentiallyRenderBlocking')

export {implicitlyPotentiallyRenderBlockingSym}
