import * as React from 'react'

import UploadArea from '../../widgets/upload-area'

const Prompt = ({type}) => {
  let content
  if (type === 'hcap') {
    content = (
      <>
        Drag + Drop HCAP assets<br />
        (.hcap,.mp4,.bin, .m3u8, .ts, .mpd, .m4s)
      </>
    )
  } else if (type === 'gltf') {
    content = (
      <>
        Drag + Drop glTF assets<br />
        (.gltf, .bin, .png, .jpg)
      </>
    )
  } else {
    content = 'Drag + Drop asset files to bundle'
  }

  return <div className='centered-parent'><div className='centered'>{content}</div></div>
}

interface IAssetBundleUploadPane {
  type: string
  onUpload: (filesPromise: Promise<{filePath: string, data: Blob}[]>) => void
}

const AssetBundleUploadPane: React.FunctionComponent<IAssetBundleUploadPane> =
  ({type, onUpload}) => (
    <UploadArea id='asset-bundle-modal-upload' className='upload pane' onUpload={onUpload}>
      <Prompt type={type} />
    </UploadArea>
  )

export default AssetBundleUploadPane
