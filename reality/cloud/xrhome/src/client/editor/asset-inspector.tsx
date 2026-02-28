import * as React from 'react'

import {parse, isBundle, getPath, getBundleId} from '../../shared/asset-pointer'
import AssetPreview from './asset-preview'
import {getStructure} from './folder-structure'
import AssetBundleFilesPane from './asset-bundle-modal-panes/asset-bundle-files-pane'
import './asset-inspector.scss'
import {Icon} from '../ui/components/icon'

interface IAssetInspector {
  assetPath: string
  assetContent: string
}

const AssetInspector: React.FunctionComponent<IAssetInspector> =
({assetPath, assetContent}) => {
  const [selectedPath, setSelectedPath] = React.useState<string>(null)
  const [inspecting, setInspecting] = React.useState(false)
  const parsedBundle = React.useMemo(() => {
    const pointer = parse(assetContent)
    return isBundle(pointer) ? pointer : null
  }, [assetContent])

  const bundleId = parsedBundle && getBundleId(parsedBundle)

  const structure = React.useMemo(() => {
    if (!parsedBundle) {
      return null
    }

    const {files} = parsedBundle

    return getStructure(Object.keys(files).map(filePath => ({filePath})))
  }, [parsedBundle])

  const currentSelectedPath = React.useMemo(() => {
    if (!inspecting || !selectedPath || !structure) {
      return null
    }

    if (!structure[selectedPath] || structure[selectedPath].children) {
      return null
    }

    return selectedPath
  }, [selectedPath, structure])

  const selectedAssetPath = React.useMemo(() => {
    if (!parsedBundle) {
      return null
    }

    if (currentSelectedPath) {
      return parsedBundle.path + currentSelectedPath
    }

    return getPath(parsedBundle)
  }, [currentSelectedPath, parsedBundle])

  if (!parsedBundle) {
    return (
      <AssetPreview
        assetPath={assetPath}
        assetContent={assetContent}
      />
    )
  }

  const handleSelect = (filePath: string) => {
    if (filePath === currentSelectedPath) {
      setSelectedPath(null)
    } else {
      setSelectedPath(filePath)
    }
  }
  return (
    <div className='asset-inspector expand-1 vertical'>
      <div className='controls'>
        <button
          type='button'
          className='style-reset toggle'
          onClick={() => setInspecting(!inspecting)}
        >
          {inspecting ? 'Hide contents' : 'Show contents'}
          <Icon stroke={inspecting ? 'caretUp' : 'caretDown'} />
        </button>
        {inspecting && (
          <AssetBundleFilesPane
            files={structure}
            onSelect={handleSelect}
            activePath={currentSelectedPath}
          />)}
      </div>
      <AssetPreview
        assetPath={selectedPath}
        assetContent={selectedAssetPath}
        bundleId={!currentSelectedPath && bundleId}
      />
    </div>
  )
}

export default AssetInspector
