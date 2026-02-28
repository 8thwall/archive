// @sublibrary(:dom-core-lib)
import {prepareScript} from './prepare-script'
import {executeScript} from './execute-script'
import {
  pendingParsingBlockingScriptSym,
  scriptsToExecuteAfterParsingSym,
  scriptsToExecuteAsapSym,
  scriptsToExecuteInOrderAsapSym,
  environmentSettingsSym,
} from './document-symbols'

import {
  readyToBeParserExecutedSym,
  delayingTheLoadEventSym,
  parserDocumentSym,
  forceAsyncSym,
} from './html-script-element-symbols'

interface NiaWindowObject {
  prepareScript: typeof prepareScript,
  executeScript: typeof executeScript,
  pendingParsingBlockingScriptSym: typeof pendingParsingBlockingScriptSym,
  scriptsToExecuteAsapSym: typeof scriptsToExecuteAsapSym,
  scriptsToExecuteInOrderAsapSym: typeof scriptsToExecuteInOrderAsapSym,
  scriptsToExecuteAfterParsingSym: typeof scriptsToExecuteAfterParsingSym,
  readyToBeParserExecutedSym: typeof readyToBeParserExecutedSym,
  delayingTheLoadEventSym: typeof delayingTheLoadEventSym,
  parserDocumentSym: typeof parserDocumentSym,
  forceAsyncSym: typeof forceAsyncSym,
  environmentSettingsSym: typeof environmentSettingsSym,
}

interface NiaWindow {
  __nia: NiaWindowObject
}

const mixinNiaWindow = <T extends NiaWindow>(proto: T) => {
  const niaWindowObj = {} as NiaWindowObject
  Object.defineProperties(niaWindowObj, {
    prepareScript: {value: prepareScript},
    executeScript: {value: executeScript},
    pendingParsingBlockingScriptSym: {value: pendingParsingBlockingScriptSym},
    scriptsToExecuteAsapSym: {value: scriptsToExecuteAsapSym},
    scriptsToExecuteInOrderAsapSym: {value: scriptsToExecuteInOrderAsapSym},
    scriptsToExecuteAfterParsingSym: {value: scriptsToExecuteAfterParsingSym},
    readyToBeParserExecutedSym: {value: readyToBeParserExecutedSym},
    delayingTheLoadEventSym: {value: delayingTheLoadEventSym},
    parserDocumentSym: {value: parserDocumentSym},
    forceAsyncSym: {value: forceAsyncSym},
    environmentSettingsSym: {value: environmentSettingsSym},
  })
  Object.defineProperty(proto, '__nia', {value: niaWindowObj})
}

export {mixinNiaWindow, NiaWindow}
