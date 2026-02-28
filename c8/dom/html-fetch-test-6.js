/* global expectScriptsToEqual */

// This is a module script.
const appendToOrderResult = (value) => {
  globalThis.orderResult += value

  // Modules are deferred, so all script tags should be parsed by now.
  expectScriptsToEqual(19)
}

export {appendToOrderResult}
