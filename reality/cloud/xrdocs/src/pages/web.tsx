import React from 'react'
import {useLocation, Redirect, matchPath} from '@docusaurus/router'

import {URI_FRAGMENT_MAP} from '../route-constants'

export default function Home() {
  const {hash, pathname} = useLocation()
  const match = matchPath<{lang?: string}>(pathname, {path: '/docs/:lang?/web'})
  const lang = match?.params?.lang
  const newRoute = `/docs${lang ? `/${lang}` : ''}${URI_FRAGMENT_MAP?.[hash.substring(1)] || '/'}`
  return (
    <Redirect to={newRoute} />
  )
}
