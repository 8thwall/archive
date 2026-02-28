import {join} from 'path'

// Typescript doesn't have types for these yet because this isn't fully standardized.
// Reference: https://developer.mozilla.org/en-US/docs/Web/API/FileSystemEntry
interface FileSystemEntry {
  name: string
  isDirectory: boolean
}

type ReaderSuccessCallback = (entries: FileSystemEntry[]) => void
type ErrorCallback = (error: Error) => void

interface FileSystemDirectoryReader {
  isDirectory: true
  readEntries(success: ReaderSuccessCallback, error: ErrorCallback): void
}

interface FileSystemDirectoryEntry extends FileSystemEntry {
  createReader(): FileSystemDirectoryReader
}

type FileSuccessCallback = (file: File) => void

interface FileSystemFileEntry extends FileSystemEntry {
  file(success: FileSuccessCallback, error: ErrorCallback): void
}

type FileData = {
  filePath: string
  data: Blob
}

const readMoreEntries = (reader: FileSystemDirectoryReader): Promise<FileSystemEntry[]> => (
  new Promise((resolve, reject) => {
    reader.readEntries(resolve, reject)
  })
)

const getFileForEntry = (fileEntry: FileSystemFileEntry): Promise<File> => (
  new Promise((resolve, reject) => {
    fileEntry.file(resolve, reject)
  })
)

const getDirectoryChildren = async (directory: FileSystemDirectoryEntry) => {
  const results: FileSystemEntry[] = []

  const reader = directory.createReader()

  let hasRemaining = true
  while (hasRemaining) {
    // eslint-disable-next-line no-await-in-loop
    const moreEntries = await readMoreEntries(reader)
    results.push(...moreEntries)
    hasRemaining = moreEntries.length > 0
  }
  return results
}

const readEntry = async (entry: FileSystemEntry, resultsList: FileData[], prefix: string = '') => {
  if (entry.isDirectory) {
    const children = await getDirectoryChildren(entry as FileSystemDirectoryEntry)

    const newPrefix = join(prefix, entry.name)

    await Promise.all(
      children.map(childEntry => readEntry(childEntry, resultsList, newPrefix))
    )
  } else {
    const file = await getFileForEntry(entry as FileSystemFileEntry)
    resultsList.push({filePath: join(prefix, entry.name), data: file})
  }
}

const readItem = async (item: DataTransferItem, resultsList: FileData[]) => {
  if (item.webkitGetAsEntry) {
    const entry = item.webkitGetAsEntry()
    if (entry) {
      await readEntry(entry, resultsList)
      return
    }
  }
  const file = item.getAsFile()
  resultsList.push({filePath: file.name, data: file})
}

export const readEntriesToFiles = async (entries: FileSystemEntry[]) => {
  const resultsList: FileData[] = []
  await Promise.all(entries.map(entry => readEntry(entry, resultsList)))
  return resultsList
}

export const readDataTransferToFiles = async (transfer: DataTransfer) => {
  const resultsList: FileData[] = []
  await Promise.all(Array.from(transfer.items).map(item => readItem(item, resultsList)))
  return resultsList
}
