// @sublibrary(:dom-core-lib)
class FocusOptions {
  preventScroll: boolean = false

  focus: boolean

  constructor(options: { focus: boolean, preventScroll?: boolean }) {
    this.focus = options.focus
    if (options.preventScroll !== undefined) {
      this.preventScroll = options.preventScroll
    }
  }
}

export {FocusOptions}
