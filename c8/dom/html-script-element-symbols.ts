// @sublibrary(:dom-core-lib)
// See https://html.spec.whatwg.org/multipage/scripting.html#script-processing-model
const parserDocumentSym = Symbol('parserDocument')
const preparationDocumentSym = Symbol('preparationDocument')
const forceAsyncSym = Symbol('forceAsync')
const fromExternalFileSym = Symbol('fromExternalFile')
const readyToBeParserExecutedSym = Symbol('readyToBeParserExecuted')
const alreadyStartedSym = Symbol('alreadyStarted')
const delayingTheLoadEventSym = Symbol('delayingTheLoadEvent')
const typeSym = Symbol('type')
const resultSym = Symbol('result')
const stepsToRunWhenReadySym = Symbol('stepsToRunWhenReady')

export {
  parserDocumentSym,
  preparationDocumentSym,
  forceAsyncSym,
  fromExternalFileSym,
  readyToBeParserExecutedSym,
  alreadyStartedSym,
  delayingTheLoadEventSym,
  typeSym,
  resultSym,
  stepsToRunWhenReadySym,
}
