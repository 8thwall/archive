import React from 'react'
import {useLocation, Redirect, matchPath} from '@docusaurus/router'

import {MODULE_URI_FRAGMENT_MAP} from '../../route-constants'

export default function Modules() {
  const {hash, pathname} = useLocation()
  const match = matchPath<{lang?: string}>(pathname, {path: '/docs/:lang?/guides/modules/'})
  const lang = match?.params?.lang

  // eslint-disable-next-line max-len
  const newRoute = `/docs${lang
    ? `/${lang}`
    : ''}/guides/modules${MODULE_URI_FRAGMENT_MAP?.[hash.substring(1)] || '/overview/'}`
  return (
    <Redirect to={newRoute} />
  )
}
