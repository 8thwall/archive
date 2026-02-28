// @sublibrary(:dom-core-lib)

// A no-op polyfill for the History API. See:
// - https://developer.mozilla.org/en-US/docs/Web/API/History
class History {
  readonly length: number = 1;

  scrollRestoration: 'auto' | 'manual' = 'auto';

  readonly state: any = null;

  // eslint-disable-next-line class-methods-use-this
  back(): void {}

  // eslint-disable-next-line class-methods-use-this
  forward(): void {}

  // eslint-disable-next-line class-methods-use-this
  go(): void {}

  // eslint-disable-next-line class-methods-use-this
  pushState(): void {}

  // eslint-disable-next-line class-methods-use-this
  replaceState(): void {}
}

const history = new History()

export {
  history as History,
}
