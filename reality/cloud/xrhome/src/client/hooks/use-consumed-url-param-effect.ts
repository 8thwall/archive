import React from 'react'
import {useHistory, useLocation} from 'react-router-dom'

import {setValue} from './url-state'

const createConsumedUrlParamEffect = <T>(
  deserialize: (value: string) => T
) => (key: string, onChange: (value: T) => void) => {
    const {search} = useLocation()
    const history = useHistory()

    React.useEffect(() => {
      const params = new URLSearchParams(search)
      if (params.has(key)) {
        const deserialized = deserialize(params.get(key)!)
        if (deserialized) {
          onChange(deserialized)
        }
        setValue(history, key, undefined)
      }
    }, [search, key])
  }

const useStringConsumedUrlParamEffect = createConsumedUrlParamEffect<string>(
  value => value
)

export {
  useStringConsumedUrlParamEffect,
}
