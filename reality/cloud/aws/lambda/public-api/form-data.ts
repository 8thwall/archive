import Busboy, {FileInfo} from 'busboy'
import type {Readable} from 'stream'

import {standardizeHeaders} from './headers'
import type {Headers} from './api-types'

type ParsedFile = {
  filename: string
  encoding: string
  mimetype: string
  data: Buffer
}

type ParsedForm = {
  fields: Record<string, string>
  files: Record<string, ParsedFile>
}

const parseFormData = (headers: Headers, body: string, bodyEncoding: 'utf8' | 'base64') => {
  const fields: ParsedForm['fields'] = {}
  const files: ParsedForm['files'] = {}

  const busboy = Busboy({headers: standardizeHeaders(headers)})
  return new Promise<ParsedForm>((resolve, reject) => {
    busboy.on('file', (fieldname: string, file: Readable, info: FileInfo) => {
      const {filename, encoding, mimeType} = info
      const fileData = {
        filename,
        encoding,
        mimetype: mimeType,
        data: [] as Buffer[],
      }

      file.on('data', (data: Buffer) => {
        fileData.data.push(data)
      })
      file.on('close', () => {
        files[fieldname] = {...fileData, data: Buffer.concat(fileData.data)}
      })
    })
    busboy.on('field', (fieldname: string, val: string) => {
      fields[fieldname] = val
    })
    busboy.on('finish', () => {
      resolve({fields, files})
    })
    busboy.on('error', (err) => {
      reject(err)
    })
    busboy.write(body, bodyEncoding)
    busboy.end()
  })
}

export {
  parseFormData,
}
