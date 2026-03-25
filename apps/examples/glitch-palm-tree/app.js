// app.js is the main entry point for your 8th Wall app.

import xrScene from './index.html'

// Load AFrame and then add our scene to html.
XRExtras.AFrame.loadAFrameForXr()
  .then(() => document.body.insertAdjacentHTML('beforeend', xrScene))
