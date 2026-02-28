// @dep(//reality/shared:run-queue)

import {promises as fs} from 'fs'
import path from 'path'

import {makeRunQueue} from '@nia/reality/shared/run-queue'

/**
 * When writing a response to disk cache, we will follow the following file structure:
 *
 * path/to/app-storage/
 * ├── _http-cache/
 * │   ├── {base64-encoded-url-1}/
 * │   │   ├── body
 * │   │   └── metadata.json
 * │   ├── {base64-encoded-url-1}/
 * │   │   ├── body
 * │   │   └── metadata.json
 * │   └──
 * └──
 *
 * - The `body` file contains the response body as a binary buffer.
 * - The `metadata.json` file contains the metadata for the response, including the status, headers,
 *   expirationMillis, etc. This is in JSON format.
 */
const HTTP_CACHE_DIRECTORY = '_http-cache'
const HTTP_CACHE_ENTRY_BODY_FILE = 'body'
const HTTP_CACHE_ENTRY_METADATA_FILE = 'metadata.json'

interface ResponseData {
  status: number
  headers: Record<string, string>
  body: ArrayBufferLike
}

interface CacheEntry {
  response: ResponseData
  expirationMillis: number
  // TODO(alvinp): Add etags for validation requests.
}

interface ResponseMetadata extends Omit<CacheEntry, 'response'> {
  response: Omit<ResponseData, 'body'>
}

interface HttpCacheStorage {
  cleanCache: () => Promise<void>
  writeResponse: (cacheKey: string, cacheEntry: CacheEntry) => Promise<void>
  readResponse: (cacheKey: string) => Promise<CacheEntry | null>
  deleteResponse: (cacheKey: string) => Promise<void>
}

const createHttpCacheMemoryStorage = (): HttpCacheStorage => {
  let cache: Record<string, CacheEntry> = {}

  return {
    cleanCache: async () => {
      cache = {}
    },
    writeResponse: async (cacheKey, cacheEntry) => {
      cache[cacheKey] = cacheEntry
    },
    readResponse: async cacheKey => cache[cacheKey] ?? null,
    deleteResponse: async (cacheKey) => {
      delete cache[cacheKey]
    },
  }
}

const createHttpCacheDiskStorage = (internalStoragePath: string): HttpCacheStorage => {
  const RUN_QUEUE_MAP: Record<string, ReturnType<typeof makeRunQueue>> = {}
  const enqueueDiskOperation = <T>(cacheKey: string, work: () => Promise<T>) => {
    const runQueue = RUN_QUEUE_MAP[cacheKey] ?? makeRunQueue(1)
    RUN_QUEUE_MAP[cacheKey] = runQueue
    return runQueue.next(work)
  }

  const storageDirectoryPath = path.join(internalStoragePath, HTTP_CACHE_DIRECTORY)

  const writeResponse = async (
    cacheKey: string,
    cacheEntry: CacheEntry
  ) => enqueueDiskOperation(cacheKey, async () => {
    const requestCacheDirectory = path.join(storageDirectoryPath, cacheKey)
    await fs.mkdir(requestCacheDirectory, {recursive: true})

    const bodyFilePath = path.join(requestCacheDirectory, HTTP_CACHE_ENTRY_BODY_FILE)
    const metadataFilePath = path.join(requestCacheDirectory, HTTP_CACHE_ENTRY_METADATA_FILE)

    const metadataContent: ResponseMetadata = {
      ...cacheEntry,
      response: {
        status: cacheEntry.response.status,
        headers: cacheEntry.response.headers,
      },
    }

    // Write the response body to a file.
    const array = new Uint8Array(cacheEntry.response.body)
    await fs.writeFile(bodyFilePath, array)

    // Write the cache entry metadata to a file.
    await fs.writeFile(metadataFilePath, JSON.stringify(metadataContent))
  })

  const readResponse = async (
    cacheKey: string
  ): Promise<CacheEntry | null> => enqueueDiskOperation(cacheKey, async () => {
    const requestCacheDirectory = path.join(storageDirectoryPath, cacheKey)

    const bodyFilePath = path.join(requestCacheDirectory, HTTP_CACHE_ENTRY_BODY_FILE)
    const metadataFilePath = path.join(requestCacheDirectory, HTTP_CACHE_ENTRY_METADATA_FILE)

    let metadataFileContent: string
    let bodyFileContent: Buffer

    try {
      metadataFileContent = await fs.readFile(metadataFilePath, 'utf8')
      bodyFileContent = await fs.readFile(bodyFilePath)
    } catch (e) {
      if (e.code === 'ENOENT') {
        return null
      }

      throw e
    }

    let metadata: ResponseMetadata

    try {
      metadata = JSON.parse(metadataFileContent)
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(`Error parsing cache entry metadata: ${metadataFilePath}`)
      await fs.rm(requestCacheDirectory, {recursive: true, force: true})
      return null
    }

    return {
      response: {
        status: metadata.response.status,
        headers: metadata.response.headers,
        body: bodyFileContent.buffer,
      },
      expirationMillis: metadata.expirationMillis,
    }
  })

  const deleteResponse = async (cacheKey: string) => enqueueDiskOperation(cacheKey, async () => {
    const requestCacheDirectory = path.join(storageDirectoryPath, cacheKey)
    try {
      await fs.rm(requestCacheDirectory, {
        recursive: true,
        force: true,
      })
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`[http-cache-storage] Error deleting cache entry: ${requestCacheDirectory}`)
    }
  })

  const cleanCache = async () => {
    try {
      await fs.rm(storageDirectoryPath, {recursive: true, force: true})
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`[http-cache-storage] Error cleaning cache: ${storageDirectoryPath}`)
    }
  }
  return {
    cleanCache,
    writeResponse,
    readResponse,
    deleteResponse,
  }
}

export type {
  ResponseData,
  CacheEntry,
  HttpCacheStorage,
}

export {
  HTTP_CACHE_DIRECTORY,
  createHttpCacheDiskStorage,
  createHttpCacheMemoryStorage,
}
