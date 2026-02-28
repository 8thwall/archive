import fs from 'fs'
import rimraf from 'rimraf'
import os from 'os'
import path from 'path'
import AdmZip from 'adm-zip'
import multer from 'multer'
import multerS3 from 'multer-s3-transform'
import type {Request, Response} from 'express'
import type {S3 as IS3} from 'aws-sdk'

import {S3} from './integration/s3/s3-api'
import {hash as getRandomHash} from './assets-hash'
import {getUnusedShortLink} from './shortlink-utils'
import {MAX_BUNDLE_FILE_COUNT} from './app-constants'
import {HOSTED_BUCKET, HOSTING_BUCKET} from './s3-buckets'
import type {Handler} from '../server/server-types'

const resetLocalTempDir = (tempDir: string) => {
  const dirs = ['', 'temp', 'raw', 'zips', ...['Staging', 'Review', 'Production']
    .map(d => [`raw/${d}`, `zips/${d}`])
    .reduce((a, b) => a.concat(b))]
  dirs.forEach((d) => {
    const dir = path.join(tempDir, d)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir)
    }
  })
}

const localTempDir = (() => {
  const tempDir = path.join(os.tmpdir(), 'hosted')
  resetLocalTempDir(tempDir)
  return tempDir
})()

const cleanupTempDir = () => {
  rimraf(localTempDir, () => {
    resetLocalTempDir(localTempDir)
  })
}

if (process.env.NODE_ENV !== 'test') {
  setTimeout(() => {
    const nextCleanup = new Date()
    nextCleanup.setHours(3)
    nextCleanup.setDate(nextCleanup.getDate() + 1)
    nextCleanup.setMinutes(0)
    nextCleanup.setSeconds(0)
    const timeToWait = Number(nextCleanup) - Date.now()
    // eslint-disable-next-line no-console
    console.log(`Will clean up temporary directory in ${timeToWait} at ${nextCleanup}`)
    setTimeout(() => {
      cleanupTempDir()
      setInterval(cleanupTempDir, 24 * 60 * 60 * 1000)
    }, timeToWait)
  }, 1000)
}

const getAssetFilename = (rawFilename: string) => {
  // assets/<filename>-<hash>.<extension>
  // Excluding characters that are not recommended for use in S3 object keys
  // https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-keys.html
  const filename = rawFilename.replace(/[&$@=;/:+ ,?\\{}^%`[\]"'<>~#|]+/g, '_')
  const idx = filename.lastIndexOf('.')
  const Prefix = `assets/${idx >= 0 ? filename.slice(0, idx) : filename}-`
  const Postfix = idx >= 0 ? filename.slice(idx) : ''

  return getUnusedShortLink({
    Bucket: HOSTING_BUCKET,
    shortLinkGenerator: () => `${Prefix}${getRandomHash('public')}${Postfix}`,
  })
}

type HostedVersion = {
  timestamp: string
  size: number
  etag: string
  versionId: string
}

type HostedApp = {
  appName: string
  hostedFilename: string
  hostedVersions: HostedVersion[]
  Key: string
}

const getHostedApps = (Prefix: string) => new Promise<HostedApp[]>((resolve) => {
  if (!Prefix) {
    resolve([])
    return
  }

  const _getVersions = (
    KeyMarker?: string, VersionIdMarker?: string
  ): Promise<IS3.ListObjectVersionsOutput> => S3.use().listObjectVersions({
    Bucket: HOSTED_BUCKET,
    Prefix,
    KeyMarker,
    VersionIdMarker,
  }).promise()
    .then(data => (
      !data.IsTruncated
        ? data
        : _getVersions(data.NextKeyMarker, data.NextVersionIdMarker)
          .then(more => ({
            Versions: [...data.Versions, ...more.Versions],
            DeleteMarkers: [...data.DeleteMarkers, ...more.DeleteMarkers],
          }))))

  _getVersions().then(({Versions, DeleteMarkers}) => {
    const deletedVersions = DeleteMarkers.map(o => o.VersionId)
    return Object.entries(Versions
      .filter(o => !deletedVersions.includes(o.VersionId))
      .reduce((o: Record<string, HostedApp>, v) => {
        const hostedFilename = v.Key.split('/')[1]
        const appName = hostedFilename.replace('.zip', '')
        if (!o[appName]) {
          o[appName] = {appName, hostedFilename, hostedVersions: [], Key: v.Key}
        }
        o[appName].hostedVersions.push({
          timestamp: `${new Date(v.LastModified).getTime()}`,
          size: v.Size,
          etag: v.ETag,
          versionId: v.VersionId,
        })
        return o
      }, {}))
      .map(([, o]) => o)
  })
    .then(resolve)
    .catch((err) => {
    // eslint-disable-next-line no-console
      console.log(`Error in getHostedApps for ${Prefix}`, err)
      resolve([])
    })
})

const copyS3File = (
  oldKey: string, newKey: string, deleteOriginal: boolean
) => S3.use().copyObject({
  Bucket: HOSTED_BUCKET,
  CopySource: `${HOSTED_BUCKET}/${oldKey}`,
  Key: newKey,
}).promise().then(() => (deleteOriginal
  ? S3.use().deleteObject({
    Bucket: HOSTED_BUCKET,
    Key: oldKey,
  }).promise()
  : null))

const copyHostedApp = (
  oldKey: string, newKey: string, deleteOriginal: boolean
) => S3.use().listObjects({
  Bucket: HOSTED_BUCKET,
  Prefix: oldKey,
}).promise().then(({Contents}) => Promise.all(Contents.map(({Key}) => (
  copyS3File(Key, Key.replace(oldKey, newKey), deleteOriginal)
))))
  .then(() => getHostedApps(newKey))
  .catch((err) => {
    throw new Error(`S3 Error when copying Key=${oldKey} to Key=${newKey} err=${err.message}`)
  })

const getMostRecentVersion = (hosted: HostedApp) => (hosted &&
  hosted.hostedVersions && hosted.hostedVersions.length &&
  hosted.hostedVersions.sort((a, b) => (a.timestamp > b.timestamp ? -1 : 1))[0])

const rezipParts = (Prefix: string) => new Promise<IS3.PutObjectOutput>((resolve, reject) => {
  const Bucket = HOSTED_BUCKET
  const tempDirName = path.join(localTempDir, 'temp')

  const tempDirFull = path.join(tempDirName, Prefix)
  if (!fs.existsSync(tempDirFull)) {
    const parentDirFull = path.join(tempDirName, Prefix.split('/')[0])
    if (!fs.existsSync(parentDirFull)) {
      fs.mkdirSync(parentDirFull)
    }
    fs.mkdirSync(tempDirFull)
  }
  type Timestamps = Record<string, Date>

  const timestampsFile = path.join(tempDirFull, '.timestamps')
  // TODO(scott) asyncify this
  const timestamps: Timestamps = !fs.existsSync(timestampsFile)
    ? {}
    : Object.entries(JSON.parse(fs.readFileSync(timestampsFile, 'utf-8')) as Record<string, string>)
      .reduce((o, [k, v]) => { o[k] = new Date(v); return o }, {})

  S3.use().listObjects({Bucket, Prefix: `${Prefix}/`}, (err, data) => {
    if (err) {
      reject(new Error(`S3 ${err.message}`))
      return
    }
    Promise.all(data.Contents.map(({Key, LastModified}) => new Promise((subResolve, subReject) => {
      const localFile = path.join(tempDirName, Key)
      if (timestamps[Key] && timestamps[Key] >= LastModified) {
        subResolve(localFile)
        return
      }
      S3.use().getObject({Bucket, Key}, (getObjectErr, getObjectData) => {
        if (getObjectErr) {
          subReject(new Error(`S3 getObject ${Key} ${getObjectErr.message}`))
          return
        }
        if (!Buffer.isBuffer(getObjectData.Body)) {
          subReject(new Error(`S3 getObject not a buffer ${Key}`))
          return
        }
        fs.writeFile(localFile, getObjectData.Body, (writeFileErr) => {
          if (writeFileErr) {
            subReject(new Error(`S3 getObject writeToDisk ${Key} ${writeFileErr.message}`))
            return
          }
          timestamps[Key] = LastModified
          subResolve(localFile)
        })
      })
    })))
      .then((files) => {
        fs.writeFile(timestampsFile, JSON.stringify(timestamps), (writeFileErr) => {
          if (writeFileErr) {
            // eslint-disable-next-line no-console
            console.log(
              `Error when writing local timestamps file for ${Prefix}: ${writeFileErr.message}`
            )
          }
        })
        const zip = new AdmZip()
        files.map(file => zip.addLocalFile(file))
        S3.use().putObject({
          Body: zip.toBuffer(),
          Bucket,
          Key: `${Prefix}.zip`,
        }, (putObjectErr, putObjectData) => {
          if (putObjectErr) {
            reject(new Error(`S3 uploadNewZip ${Prefix}.zip ${err.message}`))
            return
          }
          resolve(putObjectData)
        })
      })
  })
})

const uploadHostedApp = (req: Request, res: Response) => new Promise<HostedApp>((resolve) => {
  const {Account, appName} = req.xrApp
  const Prefix = `${Account.shortName}/${appName}`
  const Key = `${Prefix}.zip`
  multer({
    storage: multerS3({
      s3: S3.use(),
      bucket: HOSTED_BUCKET,
      key: (innerReq, _, cb) => {
        if (innerReq.body.name) {
          // Upload file part and zip later
          cb(null, `${Prefix}/${innerReq.body.name}`)
        } else {
          cb(null, Key)
        }
      },
    }),
  }).single('zip')(req, res, () => {
    const finalize = () => getHostedApps(Key)
      .then(([hosted]) => {
        resolve(hosted)
      })
    if (req.body.name) {
      rezipParts(Prefix).then(({ETag}) => {
        req.file.etag = ETag
        finalize()
      })
    } else {
      finalize()
    }
  })
})

const deleteHostedApp = (Key: string, versions?: string[]) => new Promise((resolve, reject) => {
  if (versions) {
    S3.use().deleteObjects({
      Bucket: HOSTED_BUCKET,
      Delete: {
        Objects: versions.map(VersionId => ({Key, VersionId})),
        Quiet: false,
      },
    }, (err, data) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.log(`S3 Error when deleting Key=${Key}`, err)
      }
      resolve(err || {...data, Count: data.Deleted.length})
    })
  } else {
    S3.use().listObjects({
      Bucket: HOSTED_BUCKET,
      Prefix: Key,
    }).promise().then(({Contents}) => Promise.all(Contents.map(c => S3.use().deleteObject({
      Bucket: HOSTED_BUCKET,
      Key: c.Key,
    })
      .promise().then(d => ({...d, Key})))))
      .then(resolve)
      .catch(reject)
  }
})

//
// CodeCommit Hosting
//

const listFiles = (Prefix: string) => S3.use().listObjectsV2({
  Bucket: HOSTING_BUCKET,
  Prefix,
}).promise()
  .then(({Contents}) => Contents.map(({Key}) => Key))

// NOTE(dat): This has a default limit of 1000 objects
// @param Prefix e.g. code/src/8w.JsDev/production/
//               the ending / is important
const listFilesAndFolders = (Prefix: string) => S3.use().listObjectsV2({
  Bucket: HOSTING_BUCKET,
  Delimiter: '/',
  Prefix,
}).promise()
  .then(({Contents, CommonPrefixes}) => ({
    files: Contents.map(({Key}) => Key),
    folders: CommonPrefixes.map(p => p.Prefix),
  }
  ))

const getFile = (Key: string) => S3.use().getObject({Bucket: HOSTING_BUCKET, Key}).promise()
  .then(({Body}) => ({Key, Body}))

const isPrefixInUse = async (Bucket: string, Prefix: string) => {
  const list = await S3.use().listObjectsV2({Bucket, Prefix, MaxKeys: 1}).promise()
  return list.Contents.length !== 0
}

const MAX_RETRIES = 10
const getUnusedBundlePath = async () => {
  let i = 0
  while (i++ < MAX_RETRIES) {
    const bundlePath = `assets/bundles/bundle-${getRandomHash('bundle')}/`
    // eslint-disable-next-line no-await-in-loop
    if (!await isPrefixInUse(HOSTING_BUCKET, bundlePath)) {
      return bundlePath
    }
  }
  return null
}

type BundleFile = {
  filePath: string
  assetPath: string
}

const validateBundleFile = (file: any): file is BundleFile => {
  if (!file || typeof file !== 'object') {
    return false
  }

  if (!file.filePath || typeof file.filePath !== 'string' || file.filePath.startsWith('/')) {
    return false
  }

  if (!file.assetPath || typeof file.assetPath !== 'string' || !file.assetPath.startsWith('/')) {
    return false
  }

  return true
}

const validateBundleFiles = (files: any): files is BundleFile[] => {
  if (!Array.isArray(files)) {
    return false
  }

  if (files.length > MAX_BUNDLE_FILE_COUNT) {
    return false
  }

  return files.every(f => validateBundleFile(f))
}

const createAssetBundle: Handler = async (req, res) => {
  try {
    const {files} = req.body

    if (!validateBundleFiles(files)) {
      res.status(400).send('Invalid files received')
      return
    }

    const bundlePath = await getUnusedBundlePath()

    if (!bundlePath) {
      res.status(500).send('Unable to create bundle.')
      return
    }

    await Promise.all(files.map(({filePath, assetPath}) => S3.use().putObject({
      Bucket: HOSTING_BUCKET,
      Key: path.join(bundlePath, filePath),
      Body: '',
      WebsiteRedirectLocation: assetPath,
    }).promise()))

    res.json({
      bundlePath,
    })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('Create bundle error', err)
    res.status(500).send('An unexpected error occurred.')
  }
}

export {
  localTempDir,
  getHostedApps,
  copyHostedApp,
  getMostRecentVersion,
  uploadHostedApp,
  deleteHostedApp,
  listFiles,
  listFilesAndFolders,
  getFile,
  createAssetBundle,
  isPrefixInUse,
  getAssetFilename,
}
