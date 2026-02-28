import React from 'react'
import {Redirect, useParams} from 'react-router-dom'

import {HOME_PATH, type StudioPathParams} from './desktop-paths'
import {DesktopAppContainer} from './desktop-app-container'
import {useCurrentUser, useUserHasSession} from '../user/use-current-user'
import {Loader} from '../ui/components/loader'

// NOTE(cindyhu): This has to be lazy because automerge uses wasm which can't be in the main bundle
const ScenePage = React.lazy(() => import('../apps/scene-page'))

interface StudioPageProps {
  setWindowTitle: (name: string | undefined) => void
}

const StudioPage: React.FC<StudioPageProps> = ({setWindowTitle}) => {
  const {appKey} = useParams<StudioPathParams>()
  const isLoggedIn = useUserHasSession()
  const user = useCurrentUser()

  if (user.loading && !user.email) {
    return <Loader />
  }

  if (!isLoggedIn) {
    return <Redirect to={HOME_PATH} />
  }

  return (
    <DesktopAppContainer appKey={appKey} setWindowTitle={setWindowTitle}>
      <ScenePage />
    </DesktopAppContainer>
  )
}

export {
  StudioPage,
}
