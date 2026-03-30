import stream from 'stream'
import Archiver from 'archiver'

type AppendParameters = Parameters<Archiver.Archiver['append']>

const createZipStream = (
  params: AppendParameters[],
  opts: Archiver.ArchiverOptions = {zlib: {level: 2}},
  eventListeners: Record<string, (...args: any[]) => void> = {}
): stream.PassThrough => {
  const passthrough = new stream.PassThrough()

  // create the archiver
  const archive = Archiver('zip', opts)

  archive.on('warning', (err) => {
    if (err.code === 'ENOENT') {
      console.log(err)
    } else {
      // throw error
      throw err
    }
  })

  archive.on('error', (error) => {
    throw new Error(`${error.name} ${error.code} ${error.message} ${error.path} ${error.stack}`)
  })

  Object.entries(eventListeners).forEach(([event, listener]) => {
    passthrough.on(event, listener)
  })

  archive.pipe(passthrough)
  params.forEach((param) => {
    archive.append(...param)
  })
  archive.finalize()

  return passthrough
}

export {createZipStream}
