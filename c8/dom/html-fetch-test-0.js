/* global expectScriptsToEqual */

globalThis.orderResult += '-9'

// This is a deferred script, so all script tags should be parsed by now.
expectScriptsToEqual(19)
