// @sublibrary(:dom-core-lib)
// See: https://tc39.es/ecma262/#sec-completion-record-specification-type
interface CompletionRecord {
  type: 'normal' | 'break' | 'continue' | 'return' | 'throw'
  value: Exclude<any, CompletionRecord>
  target: string | null
}

export {CompletionRecord}
