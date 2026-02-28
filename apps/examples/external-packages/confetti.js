// Copyright (c) 2023 8th Wall, Inc.

const confettiComponent = {
  init() {
    // pull in variables/functions loaded to the window
    const {Flickity} = window
    const {confetti} = window
    const {CoreWebIO, KHRONOS_EXTENSIONS, textureResize} = window

    window.addEventListener('click', () => {
      confetti()
    })
  },
}

export {confettiComponent}
