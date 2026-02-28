// @package(npm-rendering)

// On iOS in jitless mode, WebAssembly is not defined. This is a polyfill for WebAssembly using a
// WebAssembly interpreter.

/* eslint-disable import/no-unresolved */
// eslint-disable-next-line max-classes-per-file
import type {Response} from 'undici-types'
import {WebAssembly as WebAssemblyInterpreter} from 'polywasm'
import {decode} from '@webassemblyjs/wasm-parser/lib/index'

type ExportValue = Function | WebAssemblyInterpreter.Global | WebAssemblyInterpreter.Memory
  | WebAssemblyInterpreter.Table;
type ImportValue = ExportValue | number;
type Imports = Record<string, ModuleImports>;
type ModuleImports = Record<string, ImportValue>;
type BufferSource = ArrayBufferView | ArrayBuffer;

// NOTE(lreyna): The splat model manager uses wasm with simd instructions, and thus does not work
// with this polyfill. We'll have to consider compiling and hosting a non-simd version.
const containsSIMD = (wasmBuffer: BufferSource): boolean => {
  let ast
  try {
    ast = decode(wasmBuffer)
  } catch (e) {
    if (e.message?.includes('Unexpected instruction')) {
      return true
    }
    return false
  }

  for (const section of ast.body) {
    if (section.type === 'CodeSection') {
      for (const func of section.code) {
        for (const instr of func.body) {
          if (instr.opcode === 0xFD) {
            return true
          }
        }
      }
    }
  }
  return false
}

interface Result {
  instance: WebAssemblyInterpreter.Instance
  module: WebAssemblyInterpreter.Module
}

class RuntimeError extends Error {
  constructor(message?: string) {
    super(message)
    this.name = 'RuntimeError'
  }
}

class LinkError extends Error {
  constructor(message?: string) {
    super(message)
    this.name = 'LinkError'
  }
}

const WebAssembly = {
  CompileError: WebAssemblyInterpreter.CompileError,

  Global: WebAssemblyInterpreter.Global,

  Instance: WebAssemblyInterpreter.Instance,

  LinkError,

  Memory: WebAssemblyInterpreter.Memory,

  Module: WebAssemblyInterpreter.Module,

  RuntimeError,

  Table: WebAssemblyInterpreter.Table,

  async compile(bytes: BufferSource): Promise<WebAssemblyInterpreter.Module> {
    // This check is required because undici will first try to load a SIMD version of llhttp, and
    // then load the generic version if that call throws an error. See:
    // eslint-disable-next-line max-len
    // - https://github.com/nodejs/undici/blob/6211fac8e56ddcb3b1d397e9076cef36689f76e7/lib/dispatcher/client-h1.js#L68
    if (containsSIMD(bytes)) {
      throw new Error('[web-assembly@compile] SIMD is not supported.')
    }

    return WebAssemblyInterpreter.compile(bytes)
  },

  compileStreaming(
    source: Response | PromiseLike<Response>
  ): Promise<WebAssemblyInterpreter.Module> {
    return WebAssemblyInterpreter.compileStreaming(source)
  },

  instantiate(
    input: WebAssemblyInterpreter.Module | BufferSource, importObject?: Imports
  ): Promise<WebAssemblyInterpreter.Instance | Result> {
    return WebAssemblyInterpreter.instantiate(input, importObject)
  },

  instantiateStreaming(
    input: BufferSource | WebAssemblyInterpreter.Module, importObject?: Imports
  ): Promise<Result> {
    return WebAssemblyInterpreter.instantiateStreaming(input, importObject)
  },

  validate(bytes: BufferSource): boolean {
    return WebAssemblyInterpreter.validate(bytes)
  },
}

export {WebAssembly}
