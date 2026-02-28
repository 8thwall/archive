/* eslint-disable local-rules/hardcoded-copy */  // TODO (jeffha): refactor all hardcoded copy
import React from 'react'
import {Button, Modal, Input, Dropdown, Form, Message, Popup, Icon} from 'semantic-ui-react'
import {join} from 'path'

import {serialize, BundleAssetPointer} from '../../../shared/asset-pointer'
import {basename, fileExt} from '../editor-common'
import {
  FolderStructure, getStructure, enumerateFiles, combineStructures, reverseStructure,
} from '../folder-structure'
import {validateFileName} from '../../common/editor-files'
import {unzipFiles, ignoreSystemFiles, stripFirstFolder} from '../process-files'

import AssetBundleFilesPane from '../asset-bundle-modal-panes/asset-bundle-files-pane'
import AssetBundleUploadPane from '../asset-bundle-modal-panes/asset-bundle-upload-pane'
import AssetBundleLoadingPane from '../asset-bundle-modal-panes/asset-bundle-loading-pane'
import AssetBundlePreviewPane from '../asset-bundle-modal-panes/asset-bundle-preview-pane'
import {DeemphasizedButton} from '../../widgets/deemphasized-button'
import {
  getBundleSizeLimit, getHcapSizeLimit, getAssetSizeLimit,
} from '../../../shared/asset-size-limits'
import {MAX_BUNDLE_FILE_COUNT} from '../../../shared/app-constants'
import coreGitActions from '../../git/core-git-actions'
import gitUploadActions from '../../git/git-upload-actions'
import {useLegacyState} from '../../hooks/use-legacy-state'
import {useTheme} from '../../user/use-theme'
import useActions from '../../common/use-actions'
import {useScopedGit} from '../../git/hooks/use-current-git'
import {useDismissibleModal} from '../dismissible-modal-context'

const NO_MAIN = 'no-main-file'

const MAIN_TOOLTIP = [
  'If your asset type requires you reference a file, set this file as your ‘main file’. If your ',
  'asset type requires you reference a folder (cubemaps, etc), set ‘none’ as your ‘main file.’',
].join('')

const printSize = byteCount => `${(byteCount / (2 ** 20)).toPrecision(3)} MB`

const makeTotalSizeError = sizeLimit => `
  Selected files exceed bundle size limit of ${printSize(sizeLimit)}.
  Contact support@8thwall.com
`

interface IAssetBundleModal {
  repoId: string
  assetLimitOverrides?: string
  type: string  // 'hcap' for example
  files: File[]
  onClose: () => void
}

type BundleFile = {filePath: string, assetPath: string, fileSize: number}

const getHeading = (type: string) => {
  if (type === 'hcap') {
    return 'New HCAP Asset Bundle'
  } else if (type === 'gltf') {
    return 'New glTF Asset Bundle'
  } else {
    return 'New Asset Bundle'
  }
}

const getMainPath = (type: string, files: {filePath: string}[]) => {
  if (!type || type === 'hcap') {
    const hcap = files.find(({filePath}) => filePath.endsWith('.hcap'))
    if (hcap) {
      return hcap.filePath
    }
  }

  if (!type || type === 'gltf') {
    const gltf = files.find(({filePath}) => filePath.endsWith('.gltf'))
    if (gltf) {
      return gltf.filePath
    }
  }

  return null
}

const getBundleNameExtension = (type: string) => {
  if (type === 'hcap') {
    return '.hcap'
  } else if (type === 'gltf') {
    return '.gltf'
  } else {
    return undefined
  }
}

const NameInput = ({value, onChange, extension}) => (
  <Form.Field className='themed-field'>
    <label htmlFor='asset-bundle-name-input'>
      Bundle name
      <Input
        id='asset-bundle-name-input'
        value={value}
        onChange={onChange}
        label={extension && {basic: true, content: extension}}
        labelPosition={extension ? 'right' : undefined}
      />
    </label>
  </Form.Field>
)

interface AssetBundleModalState {
  uploadedFiles: FolderStructure<BundleFile>
  lockMain: boolean
  main?: string
  bundleName: string
  totalFileCount: number
  readyFileCount: number
  uploadedBytes: number
  totalBytes: number
  bundlePath?: string
  error?: string | null
  selectedFile: string | null
  loading: boolean
  submitting: boolean
}

const defaultState: AssetBundleModalState = {
  uploadedFiles: {},
  lockMain: false,
  main: undefined,
  bundleName: '',
  totalFileCount: 0,
  readyFileCount: 0,
  uploadedBytes: 0,
  totalBytes: 0,
  bundlePath: undefined,
  error: undefined,
  selectedFile: null,
  loading: false,
  submitting: false,
}

const AssetBundleModal: React.FC<IAssetBundleModal> = ({
  repoId, assetLimitOverrides, type, files: initialFiles, onClose,
}) => {
  useDismissibleModal(onClose)
  const [state, setState] = useLegacyState(defaultState)
  const {repo} = useScopedGit(repoId)
  const {createFile} = useActions(coreGitActions)
  const {createAssetBundle, uploadAsset} = useActions(gitUploadActions)

  const setStateAsync = (data: Parameters<typeof setState>[0]) => (
    new Promise<void>(resolve => setState(data, resolve))
  )

  const handleNewFiles = async (filesPromise: Promise<{filePath: string, data: Blob}[]>) => {
    try {
      await setStateAsync({
        loading: true,
        error: null,
      })

      const rawFiles = await filesPromise
      const files = await unzipFiles(rawFiles).then(ignoreSystemFiles).then(stripFirstFolder)

      if ((files.length + state.totalFileCount) > MAX_BUNDLE_FILE_COUNT) {
        setState({
          error: `
            Bundle exceeds limit of ${MAX_BUNDLE_FILE_COUNT} files.
            Contact support@8thwall.com
          `,
          loading: false,
        })
        return
      }

      // We do not count any re-uploads towards the new total file count
      const oldFiles = reverseStructure(state.uploadedFiles)
        .filter(file => !files.some(f => f.filePath === file.filePath))

      await setStateAsync({
        totalFileCount: oldFiles.length + files.length,
      })

      const mainPath = state.main ?? getMainPath(type, files)

      const containsHcap = mainPath?.endsWith?.('.hcap')
      const containsGltf = mainPath?.endsWith?.('.gltf')

      const hcapHasConflict = type === 'hcap' &&
                              state.lockMain &&
                              files.some(({filePath}) => filePath.endsWith('.hcap'))
      const gltfHasConflict = type === 'gltf' &&
                              state.lockMain &&
                              files.some(({filePath}) => filePath.endsWith('.gltf'))

      if (type === 'hcap' && !containsHcap) {
        setState({
          error: 'Missing file: HCAP asset bundles must include a ' +
                 'file that has the .hcap extension.',
          loading: false,
        })
        return
      }

      if (hcapHasConflict) {
        setState({
          error: 'There is already an existing HCAP file in the asset bundle.',
          loading: false,
        })
        return
      }

      if (type === 'gltf' && !containsGltf) {
        setState({
          error: 'Missing file: glTF asset bundles must include a ' +
                 'file that has the .gltf extension.',
          loading: false,
        })
        return
      }

      if (gltfHasConflict) {
        setState({
          error: 'There is already an existing glTF file in the asset bundle.',
          loading: false,
        })
        return
      }

      const sizeLimit = containsHcap
        ? getHcapSizeLimit(assetLimitOverrides)
        : getBundleSizeLimit(assetLimitOverrides)

      // Need to recalculate the total bytes to avoid re-uploads from double-counting
      // towards the total size, but also in case the new files that are re-uploading have
      // a different size (bigger / smaller) than the old files.
      const existingBytes = oldFiles.reduce((total, file) => (total + file.fileSize), 0)

      const newRawBytes = rawFiles.reduce((total, file) => (total + file.data.size), 0)
      const rawTotalBytes = existingBytes + newRawBytes
      if (rawTotalBytes > sizeLimit) {
        setState({
          error: makeTotalSizeError(sizeLimit),
          loading: false,
        })
        return
      }

      // Get files ready
      const filesToUpload = await Promise.all(files.map(async ({filePath, data, getData}) => {
        const fileData = data || await getData()

        await setStateAsync(s => ({readyFileCount: s.readyFileCount + 1}))

        return {filePath, data: fileData}
      }))

      const newBytes = filesToUpload.reduce((total, {data: {size}}) => total + size, 0)
      const totalSizeBytes = existingBytes + newBytes
      if (totalSizeBytes > sizeLimit) {
        setState({
          error: makeTotalSizeError(sizeLimit),
          loading: false,
        })
        return
      }

      const individualLimit = getAssetSizeLimit(assetLimitOverrides)

      if (filesToUpload.some(f => f.data.size > individualLimit)) {
        setState({
          error: `
          At least one file exceeds the file size limit of ${printSize(individualLimit)}.
          Contact support@8thwall.com
        `,
          loading: false,
        })
        return
      }

      await setStateAsync({
        totalBytes: totalSizeBytes,
      })

      // Upload files as assets
      const newFiles = await Promise.all(filesToUpload.map(async ({filePath, data}) => {
        let currentPercentage = 0
        const onProgress = async (percentage) => {
          await setStateAsync(s => ({
            uploadedBytes:
              s.uploadedBytes + Math.floor(data.size * ((percentage - currentPercentage) / 100)),
          }))
          currentPercentage = percentage
        }
        const {file: assetPath} = await uploadAsset(
          repoId, repo, data, basename(filePath), onProgress
        )

        return {filePath, assetPath: join('/', assetPath), fileSize: data.size}
      }))

      // Bundle the assets into an asset bundle
      // NOTE (jeffha): If there are any subsequent additions to the initial bundle, we create an
      //                entirely new asset bundle as we will never allow user to modify asset
      //                bundles after creation.
      const {bundlePath} = await createAssetBundle(
        repo,
        repoId,
        [
          ...oldFiles,
          ...newFiles,
        ]
      )

      const fileStructure = combineStructures(state.uploadedFiles, getStructure(newFiles))

      let bundleName
      if (mainPath) {
        const base = basename(mainPath)
        // eslint-disable-next-line prefer-destructuring
        bundleName = base.split('.')[0]
      } else {
        bundleName = ''
      }

      setState({
        bundlePath: join('/', bundlePath),
        loading: false,
        bundleName,
        uploadedFiles: fileStructure,
        lockMain: !!mainPath,
        main: mainPath,
      })
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
      setState({
        error: 'There was an error while uploading.',
        loading: false,
      })
    }
  }
  const currentType = type || (state.lockMain && fileExt(state.main)) || undefined
  const currentMain = state.main === NO_MAIN ? undefined : state.main
  const bundleNameExtension = getBundleNameExtension(currentType)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault()

      const bundleName = `${state.bundleName}${bundleNameExtension || ''}`

      if (!bundleName || !validateFileName(bundleName)) {
        let error
        if (bundleName.includes('.')) {
          error = 'Bundle name must be a valid file name.'
        } else {
          error = 'Bundle name must include a file extension.'
        }
        setState({error})
        return
      }

      const allFiles = enumerateFiles(state.uploadedFiles)

      const fileMap: Record<string, string> = {}

      allFiles.forEach((filePath) => {
        fileMap[filePath] = (state.uploadedFiles[filePath] as BundleFile).assetPath
      })

      const pointer: BundleAssetPointer = {
        type: 'bundle',
        path: state.bundlePath,
        main: currentMain,
        files: fileMap,
      }

      const pointerString = serialize(pointer)

      const filePath = `assets/${bundleName}`

      await setStateAsync({
        error: null,
        submitting: true,
      })

      await createFile(repo, filePath, pointerString, {skipValidate: true})

      onClose()
    } catch (err) {
      setState({
        error: 'There was an error while saving.',
        submitting: false,
      })
    }
  }

  const handleSelect = (filePath: string) => {
    setState((s) => {
      if (s.selectedFile === filePath) {
        return {selectedFile: null}
      } else {
        return {selectedFile: filePath}
      }
    })
  }

  const didFirstRenderRef = React.useRef(false)
  React.useEffect(() => {
    if (!didFirstRenderRef.current) {
      didFirstRenderRef.current = true
      if (initialFiles?.length) {
        const fileData = initialFiles.map(f => ({filePath: f.name, data: f}))
        handleNewFiles(Promise.resolve(fileData))
      }
    }
  }, [])

  const {
    uploadedFiles, main, bundleName, error, selectedFile, loading, bundlePath, submitting, lockMain,
    uploadedBytes, totalFileCount, totalBytes, readyFileCount,
  } = state

  const themeName = useTheme()

  const allFiles = enumerateFiles(uploadedFiles)

  const hasFiles = allFiles.length > 0
  const filesReady = !loading && hasFiles

  const currentSelectedFile = selectedFile || currentMain
  const currentAssetPath = currentSelectedFile &&
                             bundlePath &&
                            join(bundlePath, currentSelectedFile)

  let leftPane: React.ReactNode
  if (loading) {
    leftPane = (
      <AssetBundleLoadingPane
        uploadedBytes={uploadedBytes}
        totalFileCount={totalFileCount}
        totalBytes={totalBytes}
        readyFileCount={readyFileCount}
      />
    )
  } else if (hasFiles) {
    leftPane = (
      <AssetBundleFilesPane
        files={uploadedFiles}
        onSelect={handleSelect}
        activePath={currentSelectedFile}
        onUpload={handleNewFiles}
      />
    )
  } else {
    leftPane = (
      <AssetBundleUploadPane
        type={currentType}
        onUpload={handleNewFiles}
      />
    )
  }

  const showMainSelect = filesReady && !lockMain
  const showNameInput = filesReady

  const canSubmit = hasFiles && (main || !showMainSelect) && !loading

  return (
    <Modal
      open
      onClose={onClose}
      closeOnDimmerClick
      className={`asset-bundle-modal studio-editor form-modal ${themeName}`}
    >
      <Modal.Header as='h2' content={getHeading(currentType)} />
      <Modal.Content>
        {error &&
          <Message error onDismiss={() => setState({error: null})}>
            {error.toString()}
          </Message>
        }
        <Form onSubmit={handleSubmit}>
          <div className='horizontal-flex' style={{marginBottom: '1rem'}}>
            <div className='expand-1'>
              <h3 className='split-header'>Files</h3>
              {leftPane}
            </div>
            <div className='expand-1' style={{marginLeft: '1em'}}>
              <div className='split-header'>
                <h3 className='inline'>Preview</h3>
                {currentType === 'hcap' &&
                  <a
                    className='inline-link learn-more'
                    href='https://8th.io/9acs4'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    Learn More
                  </a>
                }
              </div>
              <AssetBundlePreviewPane
                hasFiles={filesReady}
                type={currentType}
                filePath={currentSelectedFile}
                assetPath={currentAssetPath}
              />
            </div>
          </div>

          <div className='form-controls'>
            {showMainSelect &&
              <label htmlFor='asset-bundle-file-select'>
                <Form.Field
                  className='themed-field'
                  label={(
                    <Popup
                      trigger={(<>Main File <Icon name='question circle' /></>)}
                      content={MAIN_TOOLTIP}
                      position='top left'
                    />
                  )}
                  placeholder='Select main file'
                  control={Dropdown}
                  id='asset-bundle-file-select'
                  fluid
                  selection
                  options={[
                    {key: NO_MAIN, text: 'None', value: NO_MAIN},
                    ...allFiles.map(path => ({
                      key: path,
                      text: path,
                      value: path,
                    })),
                  ]}
                  value={main}
                  onChange={(_, {value}) => {
                    setState({
                      main: value as string,
                      bundleName: value === NO_MAIN ? '' : basename(value),
                    })
                  }}
                />
              </label>
            }
            {showNameInput &&
              <NameInput
                value={bundleName}
                onChange={e => setState({bundleName: e.target.value})}
                extension={bundleNameExtension}
              />
            }
            <div className='buttons'>
              <DeemphasizedButton type='button' onClick={onClose} content='Cancel' />
              <Button
                type='submit'
                loading={submitting}
                primary
                content='Create Bundle'
                disabled={!canSubmit}
              />
            </div>
          </div>
        </Form>
      </Modal.Content>
    </Modal>
  )
}

export default AssetBundleModal
