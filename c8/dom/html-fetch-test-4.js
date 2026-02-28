/* global expectScriptsToEqual */

globalThis.orderResult += '-11'

// This is a deferred script, so all script tags should be parsed by now.
expectScriptsToEqual(19)
