/* global chrome */

chrome.omnibox.onInputEntered.addListener((text) => {
  const url = `https://<REMOVED_BEFORE_OPEN_SOURCING>.8thwall.com/${encodeURIComponent(text)}`
  chrome.tabs.update({url})
})
