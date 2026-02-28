// @sublibrary(:dom-core-lib)
import type {Element} from './element'
import type {DOMString} from './strings'
import {throwIllegalConstructor} from './exception'

let inFactory = false

class HTMLCollection<ElementT extends Element = Element> implements Iterable<ElementT> {
  /* eslint-disable no-undef */
  [index: number]: ElementT
  /* eslint-enable no-undef */

  _start: Iterable<ElementT>

  length: number

  constructor(iterator: Iterable<ElementT>) {
    if (!inFactory) {
      throwIllegalConstructor()
    }

    Object.defineProperty(this, '_start', {
      enumerable: false,
      writable: false,
      value: iterator,
    })

    Object.defineProperty(this, 'length', {
      enumerable: false,
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
      ownKeys: (target) => {
        const {length} = target
        return Array.from(Array(length).keys(), x => x.toString())
      },
      getOwnPropertyDescriptor: (target, prop) => {
        if (typeof prop === 'string' && !Number.isNaN(Number(prop))) {
          return {
            value: target.item(Number(prop)),
            writable: false,
            enumerable: true,
            configurable: true,
          }
        }
        return Reflect.getOwnPropertyDescriptor(target, prop)
      },
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

  item: (index: number) => ElementT | null = (index: number) => {
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

  namedItem: (name: DOMString) => ElementT | null = (name) => {
    const iter = this._start[Symbol.iterator]()
    let result = iter.next()
    while (!result.done) {
      const {value} = result
      if (value.getAttribute('id') === name || value.getAttribute('name') === name) {
        return value
      }
      result = iter.next()
    }
    return null
  }

  [Symbol.iterator](): IterableIterator<ElementT> {
    const iterator = this._start[Symbol.iterator]()
    return {
      next: () => iterator.next(),
      [Symbol.iterator]: () => this[Symbol.iterator](),
    }
  }
}

const createHTMLCollection = <ElementT extends Element = Element>(
  iterable: Iterable<ElementT>): HTMLCollection => {
  inFactory = true
  try {
    return new HTMLCollection<ElementT>(iterable)
  } finally {
    inFactory = false
  }
}

export {HTMLCollection, createHTMLCollection}
