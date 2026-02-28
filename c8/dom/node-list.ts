// @sublibrary(:dom-core-lib)
import type {Node} from './node'
import {throwIllegalConstructor} from './exception'

let inFactory = false

class NodeList<NodeT extends Node = Node> implements Iterable<NodeT> {
  /* eslint-disable no-undef */
  [index: number]: NodeT
  /* eslint-enable no-undef */

  _start: Iterable<NodeT>

  length: number

  constructor(iterator: Iterable<NodeT>) {
    if (!inFactory) {
      throwIllegalConstructor()
    }

    Object.defineProperty(this, '_start', {
      enumerable: false,
      writable: false,
      configurable: false,
      value: iterator,
    })

    Object.defineProperty(this, 'length', {
      enumerable: true,
      configurable: false,
      get: () => {
        let count = 0
        const iter = this._start[Symbol.iterator]()
        let result = iter.next()
        while (!result.done) {
          count++
          result = iter.next()
        }
        return count
      },
    })

    return new Proxy(this, {
      has: (target, prop) => {
        if (typeof prop === 'string' && !Number.isNaN(Number(prop))) {
          return true
        }
        return Reflect.has(target, prop)
      },
      get: (target, prop, receiver) => {
        if (typeof prop === 'string' && !Number.isNaN(Number(prop))) {
          return target.item(Number(prop)) || undefined
        } else {
          return Reflect.get(target, prop, receiver)
        }
      },
      set() {
        // Don't allow modification of the collection.
        return true
      },
    })
  }

  item: (index: number) => NodeT | null = (index: number) => {
    const iter = this._start[Symbol.iterator]()
    let i = 0
    while (i <= index) {
      const result = iter.next()
      if (result.done) {
        return null
      }
      if (i === index) {
        return result.value
      }
      i++
    }
    return null
  }

  entries(): IterableIterator<[number, NodeT]> {
    const iterator = this._start[Symbol.iterator]()
    let i = 0
    return {
      next: () => {
        const result = iterator.next()
        if (result.done) {
          return {done: true, value: undefined}
        }
        return {done: false, value: [i++, result.value]}
      },
      [Symbol.iterator]: () => this.entries(),
    }
  }

  keys(): IterableIterator<number> {
    const iterator = this._start[Symbol.iterator]()
    let i = 0
    return {
      next: () => {
        const result = iterator.next()
        if (result.done) {
          return {done: true, value: undefined}
        }
        return {done: false, value: i++}
      },
      [Symbol.iterator]: () => this.keys(),
    }
  }

  values(): IterableIterator<NodeT> {
    const iterator = this._start[Symbol.iterator]()
    return {
      next: () => iterator.next(),
      [Symbol.iterator]: () => this.values(),
    }
  }

  forEach(
    callback: (currentValue: NodeT, currentIndex: number, listObj: NodeT[]) => void,
    thisArg?: any
  ): void {
    const iterator = this._start[Symbol.iterator]()
    let i = 0
    let result = iterator.next()
    while (!result.done) {
      callback.call(thisArg, result.value, i++, this)
      result = iterator.next()
    }
  }

  [Symbol.iterator](): IterableIterator<NodeT> {
    const iterator = this._start[Symbol.iterator]()
    return {
      next: () => iterator.next(),
      [Symbol.iterator]: () => this[Symbol.iterator](),
    }
  }
}

const createNodeList = <NodeT extends Node = Node>(
  iterable: Iterable<NodeT>): NodeList<NodeT> => {
  inFactory = true
  try {
    return new NodeList<NodeT>(iterable)
  } finally {
    inFactory = false
  }
}

export {NodeList, createNodeList}
