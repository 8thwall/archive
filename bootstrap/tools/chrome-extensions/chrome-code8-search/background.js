/* global chrome */

chrome.omnibox.onInputEntered.addListener((text) => {
  const url = `https://github.com/search?q=org:8thwall+${encodeURIComponent(text)}&type=Code`
  chrome.tabs.update({url})
})
