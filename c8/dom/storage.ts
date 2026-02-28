// @sublibrary(:dom-core-lib)
import {existsSync, mkdirSync, readFileSync, writeFileSync, unlinkSync} from 'fs'
import {join} from 'path'

import {DOMException} from './dom-exception'
import {StorageEvent} from './dom-events'
import {throwIllegalConstructor} from './exception'
import type {Window} from './window'

type StorageType = 'local' | 'session'

const STORAGE_FILE_NAME = 'localStorage.json'
const DEFAULT_STORAGE_ORIGIN = 'default'

let inFactory = false

class Storage {
  private _storage: Record<string, string> = {}

  private readonly _type: StorageType

  private readonly _storageFilePath: string

  constructor(type: StorageType, origin: string, path: string | undefined) {
    if (!inFactory) {
      throwIllegalConstructor()
    }

    let originToUse = DEFAULT_STORAGE_ORIGIN
    if (origin) {
      const sanitizeUrlOrigin = (urlOrigin: string): string => urlOrigin
        .replace(/[^a-zA-Z0-9]/g, '_')  // Replace non-alphanumeric characters with underscores

      originToUse = sanitizeUrlOrigin(origin)
    }

    this._type = type
    // If path is not provided, fallback to sessionStorage
    if (!path) {
      this._type = 'session'
    }

    if (this._type === 'local') {
      const directoryPath = join(path, originToUse)
      this._storageFilePath = join(directoryPath, STORAGE_FILE_NAME)

      this.initFileSystemForLocalStorage(directoryPath)
    }

    // Create a proxy handler for get, set, and delete operations
    const handler: ProxyHandler<Storage> = {
      get: (target, prop, receiver) => {
        if (typeof prop === 'string' && prop in target._storage) {
          return target.getItem(prop)
        }
        return Reflect.get(target, prop, receiver)
      },
      set: (target, prop, value) => {
        if (typeof prop === 'string') {
          target.setItem(prop, value)
          return true
        }
        return false
      },
      deleteProperty: (target, prop) => {
        if (typeof prop === 'string' && prop in target._storage) {
          target.removeItem(prop)
          return true
        }
        return false
      },
    }

    // Return a proxy instance of the Storage class
    return new Proxy(this, handler)
  }

  initFileSystemForLocalStorage(directoryPath: string) {
    if (this._type === 'session') return
    try {
      // Create the directory if it doesn't exist
      mkdirSync(directoryPath, {recursive: true})

      // Check if the storage file exists, create it if it doesn't
      if (existsSync(this._storageFilePath)) {
        const data = readFileSync(this._storageFilePath, 'utf8')

        // Validate and parse JSON data
        try {
          this._storage = JSON.parse(data)
        } catch (parseError) {
          this._storage = {}  // Reinitialize if invalid JSON is found
        }
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Failed to initialize storage:', e)
    }
  }

  save() {
    // Save the storage to file if it's localStorage
    if (this._type === 'local') {
      try {
        if (Object.keys(this._storage).length === 0 && existsSync(this._storageFilePath)) {
          // Remove the file
          unlinkSync(this._storageFilePath)
        } else {
          writeFileSync(this._storageFilePath, JSON.stringify(this._storage), 'utf8')
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Failed to save local storage:', e)
      }
    }
  }

  get length(): number {
    return Object.keys(this._storage).length
  }

  // Returns the name of the nth key, or null if n is greater than or
  // equal to the number of key/value pairs.
  key(index: number): string | null {
    return Object.keys(this._storage)[index] || null
  }

  // Returns the current value associated with the given key,
  // or null if the given key does not exist.
  getItem(key: string): string | null {
    return this._storage[key] || null
  }

  // Sets the value of the pair identified by key to value,
  // creating a new key/value pair if none existed for key previously.
  // Throws a "QuotaExceededError" DOMException exception if the new value couldn't be set.
  // (Setting could fail if, e.g., the user has disabled storage for the site,
  // or if the quota has been exceeded.)
  // Dispatches a storage event on Window objects holding an equivalent Storage object.
  setItem(key: string, value: string): void {
    try {
      const oldValue = this._storage[key]
      this._storage[key] = value
      this.save()

      if (globalThis instanceof EventTarget) {
        (globalThis as unknown as Window).dispatchEvent(new StorageEvent('storage', {
          key,
          oldValue,
          newValue: value,
        }))
      }
    } catch (e) {
      throw new DOMException('QuotaExceededError')
    }
  }

  // Removes the key/value pair with the given key, if a key/value pair with the given key exists.
  // Dispatches a storage event on Window objects holding an equivalent Storage object.
  removeItem(key: string): void {
    const oldValue = this._storage[key]
    delete this._storage[key]
    this.save()

    if (globalThis instanceof EventTarget) {
      (globalThis as unknown as Window).dispatchEvent(new StorageEvent('storage', {
        key,
        oldValue,
      }))
    }
  }

  clear(): void {
    this._storage = {}
    this.save()
  }
}

const createLocalStorage = (origin: string, path: string | undefined): Storage => {
  inFactory = true
  try {
    return new Storage('local', origin, path)
  } finally {
    inFactory = false
  }
}

const createSessionStorage = (origin: string): Storage => {
  inFactory = true
  try {
    return new Storage('session', origin, undefined)
  } finally {
    inFactory = false
  }
}

export {Storage, createLocalStorage, createSessionStorage}
