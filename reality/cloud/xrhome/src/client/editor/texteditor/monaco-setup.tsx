import React from 'react'

import {useMonaco} from '../../../third_party/react-monaco/src'
import {
  injectStudioDefinitions, maybeConfigureMonaco, removeStudioDefinitions,
} from './maybe-configure-monaco'
import {useEcsDefinitions} from '../../studio/runtime-version/use-ecs-definitions'

const MonacoSetup: React.FunctionComponent = () => {
  const monaco = useMonaco()

  React.useLayoutEffect(() => {
    if (monaco) {
      maybeConfigureMonaco(monaco)
    }
  }, [monaco])

  return null
}

const StudioMonacoSetup: React.FC = () => {
  const monaco = useMonaco()

  const definitions = useEcsDefinitions()

  React.useLayoutEffect(() => {
    if (monaco) {
      injectStudioDefinitions(monaco, definitions)
      return () => {
        removeStudioDefinitions(monaco)
      }
    } else {
      return undefined
    }
  }, [monaco, definitions])

  return null
}

export {
  MonacoSetup,
  StudioMonacoSetup,
}
