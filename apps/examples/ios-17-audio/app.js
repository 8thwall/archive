// Copyright (c) 2022 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall app. Code here will execute after head.html
// is loaded, and before body.html is loaded.
import './index.css'

let inDom = false
const observer = new MutationObserver(() => {
  if (document.querySelector('#showVideo')) {
    if (!inDom) {
      require('./js/main')
    }
    inDom = true
  } else if (inDom) {
    inDom = false
    observer.disconnect()
  }
})
observer.observe(document.body, {childList: true})
