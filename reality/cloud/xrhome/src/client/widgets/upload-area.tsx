import * as React from 'react'

import {DropTarget} from '../editor/drop-target'
import {readDataTransferToFiles} from '../editor/file-system'

interface IUploadArea {
  id?: string
  className?: string
  onUpload(filesPromise: Promise<{filePath: string, data: Blob}[]>): void
  children?: React.ReactNode
}

class UploadArea extends React.Component<IUploadArea> {
  inputRef = React.createRef()

  handleDrop = (e: React.DragEvent) => {
    const {dataTransfer} = e
    this.props.onUpload(readDataTransferToFiles(dataTransfer))
  }

  handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files).map(file => ({filePath: file.name, data: file}))
    this.props.onUpload(Promise.resolve(files))
  }

  render() {
    const {children, id, className} = this.props
    const idToUse = id || 'upload-area'

    return (
      <DropTarget onDrop={this.handleDrop} className={className}>
        <label htmlFor={idToUse}>
          {children}
          <input
            id={idToUse}
            type='file'
            className='hidden-input'
            onChange={this.handleFileSelect}
            value=''
            multiple
            accept='*/*'
          />
        </label>
      </DropTarget>
    )
  }
}

export default UploadArea
