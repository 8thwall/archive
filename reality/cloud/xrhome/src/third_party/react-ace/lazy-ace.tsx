import * as React from 'react'

import type {IAceEditorProps} from './ace'
import type ReactAce from './ace'
import {Loader} from '../../client/ui/components/loader'

const Ace = React.lazy(() => import('./ace'))
const lazyAce = React.forwardRef<ReactAce, IAceEditorProps>((props, ref) => (
  <React.Suspense fallback={<Loader />}>
    <Ace ref={ref} {...props} />
  </React.Suspense>
))
export default lazyAce
