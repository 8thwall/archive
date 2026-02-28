import React from 'react'
import type {StudioComponentMetadata} from '@ecs/shared/studio-component'
import {getAttribute, listAttributes} from '@ecs/runtime'

import {StudioComponentsContext} from './studio-components-context'
import {getBuiltinComponentMetadata} from './built-in-schema'

const ExampleComponentsContextProvider: React.FC<React.PropsWithChildren> = ({children}) => {
  const studioComponents: Record<string, StudioComponentMetadata> = {}

  listAttributes().forEach((name) => {
    const attribute = getAttribute(name)
    studioComponents[name] = {
      schema: attribute.schema,
      schemaDefaults: attribute.defaults,
    }
  })

  const value = {
    listComponents: listAttributes,
    getComponentSchema: (name: string) => (
      getBuiltinComponentMetadata(name) || studioComponents[name]
    ),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getComponentLocation: (_: string) => null,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getComponentsFromLocation: () => [],
    errors: {},
  }

  return (
    <StudioComponentsContext.Provider value={value}>
      {children}
    </StudioComponentsContext.Provider>
  )
}

export {
  ExampleComponentsContextProvider,
}
