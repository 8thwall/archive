// @visibility(//visibility:public)

import {promises as fs} from 'fs'

import path from 'path'

import crypto from 'crypto'

import {AudioBuffer} from '../audio/audio-buffer'

const DECODE_CACHE_DIRECTORY = '_audio-decode-cache'

// Singleton for caching decoded AudioBuffers
const createAudioDecodeCache = (internalStoragePath: string,
  decodeAudioFunction: (data: ArrayBuffer) => Promise<AudioBuffer>) => {
  const storagePath = path.join(internalStoragePath, DECODE_CACHE_DIRECTORY)
  const cache = new Map<string, Promise<AudioBuffer>>()
  const writePromises: Promise<void>[] = []

  // Write a decoded AudioBuffer to disk
  const writeBuffer = async (key: string, buffer: AudioBuffer): Promise<void> => {
    await fs.mkdir(storagePath, {recursive: true})
    const hash = crypto.createHash('md5').update(key).digest('hex')
    const filePath = path.join(storagePath, `${hash}.bin`)

    try {
      await fs.access(filePath)
    } catch {
      // If the file doesn't exist, write to disk

      // Concatenate all channels into a single buffer
      const audioData = new Float32Array(buffer.length * buffer.numberOfChannels)
      for (let i = 0; i < buffer.numberOfChannels; i++) {
        audioData.set(buffer.getChannelData(i), i * buffer.length)
      }
      await fs.writeFile(filePath, Buffer.from(audioData.buffer))

      // Create metadata file
      await fs.writeFile(path.join(storagePath, `${hash}.json`), JSON.stringify({
        sampleRate: buffer._sampleRate,
        numberOfChannels: buffer.numberOfChannels,
        length: buffer.length,
      }))
    }
  }

  // Read AudioBuffer from disk
  const readBuffer = async (key: string): Promise<AudioBuffer | null> => {
    try {
      await fs.access(storagePath)
    } catch {
      return null
    }

    const hash = crypto.createHash('md5').update(key).digest('hex')

    // Read all files in the storage directory
    const files = await fs.readdir(storagePath)

    // Find the file that matches the key prefix
    const targetFile = files.find(file => file.startsWith(`${hash}`))
    if (!targetFile) {
      return null
    }

    // Construct file paths
    const filePath = path.join(storagePath, `${hash}.bin`)
    const metadataFilePath = path.join(storagePath, `${hash}.json`)
    const bufferData = await fs.readFile(filePath)
    const metadata = JSON.parse(await fs.readFile(metadataFilePath, 'utf8'))

    // Create a new AudioBuffer from the disk buffer
    const decodedBuffer = new AudioBuffer({
      numberOfChannels: metadata.numberOfChannels,
      length: metadata.length,
      sampleRate: metadata.sampleRate,
    })

    for (let i = 0; i < decodedBuffer.numberOfChannels; i++) {
      const startOffset = i * decodedBuffer.length * Float32Array.BYTES_PER_ELEMENT
      const channelData = bufferData.subarray(startOffset,
        startOffset + decodedBuffer.length * Float32Array.BYTES_PER_ELEMENT)
      decodedBuffer.setChannelData(i, channelData)
    }

    return decodedBuffer
  }

  const innerDecode = async (key: string, buffer: ArrayBuffer): Promise<AudioBuffer> => {
    const decodedBufferFromDisk = await readBuffer(key)
    if (decodedBufferFromDisk) {
      // If it exists, directly resolve with the loaded buffer
      cache.set(key, Promise.resolve(decodedBufferFromDisk))
      return decodedBufferFromDisk
    }

    // Otherwise, decode the buffer and write it to disk later
    const decodedBuffer = await decodeAudioFunction(buffer)
    cache.set(key, Promise.resolve(decodedBuffer))

    // After decoding, asynchronously write the buffer to disk
    const writePromise = writeBuffer(key, decodedBuffer)
    writePromises.push(writePromise)

    return decodedBuffer
  }

  const decode = async (key: string, buffer: ArrayBuffer): Promise<AudioBuffer> => {
    if (cache.has(key)) {
      const existingPromise = cache.get(key)
      if (existingPromise) {
        return existingPromise
      }
    }

    const decodePromise = innerDecode(key, buffer)
    cache.set(key, decodePromise)
    return decodePromise
  }

  const clearCache = async () => {
    // Resolve all promises in cache to ensure they complete
    const cachePromises = Array.from(cache.values())
    await Promise.allSettled(cachePromises)
    cache.clear()

    // resolve any ongoing write promises
    await Promise.allSettled(writePromises)

    try {
      // Delete all files in the cache directory and the directory itself
      await fs.rm(storagePath, {recursive: true})
    } catch {
      // if the directory doesn't exist, do nothing
    }
  }

  return {
    decode,
    clearCache,
  }
}

export {createAudioDecodeCache}
