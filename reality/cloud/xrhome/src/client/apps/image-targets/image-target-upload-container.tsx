import * as React from 'react'
import {join} from 'path'
import {Switch, Route, useHistory, useRouteMatch} from 'react-router-dom'

import {AppPathEnum} from '../../common/paths'
import ImageTargetFlatModalUpload from './flat/image-target-flat-modal-upload'
import ImageTargetCylinderModalUpload from './cylinder/image-target-cylinder-modal-upload'
import ImageTargetConicalModalUpload from './conical/image-target-conical-modal-upload'
import {useAppPathsContext} from '../../common/app-container-context'

const ImageTargetUploadContainer: React.FC = () => {
  const {getPathForApp} = useAppPathsContext()
  const history = useHistory()
  const match = useRouteMatch()
  const targetsPath = getPathForApp(AppPathEnum.targets)
  const redirectToMain = () => history.push(targetsPath)
  const redirectToEdit = it => history.push(join(targetsPath, it.uuid))

  const renderImageTargetFlatModalUpload = () => (
    <ImageTargetFlatModalUpload
      modalOpen
      onClose={redirectToMain}
      onUploadComplete={redirectToEdit}
    />
  )
  const renderImageTargetCylinderModalUpload = () => (
    <ImageTargetCylinderModalUpload
      modalOpen
      onClose={redirectToMain}
      onUploadComplete={redirectToEdit}
    />
  )
  const renderImageTargetConicalModalUpload = () => (
    <ImageTargetConicalModalUpload
      modalOpen
      onClose={redirectToMain}
      onUploadComplete={redirectToEdit}
    />
  )
  const flatPath = join(match.path, 'new-flat')
  const cylinderPath = join(match.path, 'new-cylinder')
  const conicalPath = join(match.path, 'new-conical')
  return (
    <Switch>
      <Route exact path={flatPath} render={renderImageTargetFlatModalUpload} />
      <Route exact path={cylinderPath} render={renderImageTargetCylinderModalUpload} />
      <Route exact path={conicalPath} render={renderImageTargetConicalModalUpload} />
    </Switch>
  )
}

export default ImageTargetUploadContainer
