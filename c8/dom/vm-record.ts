// @sublibrary(:dom-core-lib)
import type vm from 'vm'

// These ECMAScript concepts are implemented through node.js's vm module.
type ScriptRecord = vm.Script
type SourceTextModuleRecord = vm.SourceTextModule
type SyntheticModuleRecord = vm.SyntheticModule
type ModuleRecord = vm.Module

export {ScriptRecord, SourceTextModuleRecord, SyntheticModuleRecord, ModuleRecord}
