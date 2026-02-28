import * as React from 'react'
import {Progress} from 'semantic-ui-react'

interface IAssetBundleLoadingPane {
  readyFileCount: number
  totalFileCount: number
  uploadedBytes: number
  totalBytes: number
}

// TODO(christoph): Maybe add more transparency into upload progress
const AssetBundleLoadingPane: React.FunctionComponent<IAssetBundleLoadingPane> =
  ({uploadedBytes, totalFileCount, totalBytes, readyFileCount}) => {
    const scanProgress = totalFileCount ? 1 : 0
    const readyProgress = totalFileCount ? (readyFileCount / totalFileCount) : 0
    const uploadProgress = totalBytes ? (uploadedBytes / totalBytes) : 0

    const progress = scanProgress * 0.05 + readyProgress * 0.30 + uploadProgress * 0.60

    return (
      <div className='loading pane'>
        <div className='centered-parent'>
          <div className='centered'>
            <p>Uploading...</p>
            <Progress
              percent={Math.floor(100 * progress)}
              size='small'
              progress
              color='purple'
            />
          </div>
        </div>
      </div>
    )
  }

export default AssetBundleLoadingPane
