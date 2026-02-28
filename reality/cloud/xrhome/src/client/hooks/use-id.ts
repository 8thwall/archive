import {useMemo} from 'react'

let id = 0

const useId = () => useMemo(() => id++, [])

export {
  useId,
}
