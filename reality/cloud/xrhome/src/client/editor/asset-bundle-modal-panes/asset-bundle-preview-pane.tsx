import * as React from 'react'

import AssetPreview from '../asset-preview'

const getUploadPrompt = (hasFiles: boolean, type: string) => {
  if (hasFiles) {
    return 'Select a file to preview it'
  } else if (type === 'hcap') {
    return 'Add all HCAP assets to the bundle for preview'
  } else if (type === 'gltf') {
    return 'Add all glTF assets to the bundle for preview'
  } else {
    return 'Add assets to the bundle to preview'
  }
}

interface IAssetBundlePreviewPane {
  type: string
  filePath?: string
  assetPath?: string
  hasFiles: boolean
}

const AssetBundlePreviewPane: React.FunctionComponent<IAssetBundlePreviewPane> =
  ({type, filePath, assetPath, hasFiles}) => (
    <div className='pane preview vertical expand-1'>
      {(filePath && assetPath)
        ? <AssetPreview assetPath={filePath} assetContent={assetPath} />
        : (
          <div className='centered-parent'>
            <div className='centered'>
              {getUploadPrompt(hasFiles, type)}
            </div>
          </div>
        )
      }
    </div>
  )

export default AssetBundlePreviewPane
