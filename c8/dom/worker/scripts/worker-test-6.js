/* eslint-disable no-restricted-globals */
// Modify the event listener to call preventDefault
self.addEventListener('error', (event) => {
  event.preventDefault()  // Handle the event and prevent default action
})

throw new Error('Script Execution Failure')
