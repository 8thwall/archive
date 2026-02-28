import * as React from 'react'
import {Helmet} from 'react-helmet-async'
import {Redirect, useLocation} from 'react-router-dom'

import {PageHeader} from './page-header'
import {Footer} from './web8-footer'
import {useSelector} from '../hooks'
import Title from './title'
import useActions from '../common/use-actions'
import cmsActions from '../blog/cms-actions'
import {Loader} from '../ui/components/loader'
import {useIsActionLoading} from '../blog/cms-selectors'
import {GET_HUBSPOT_CMS_PAGE_TYPE} from '../blog/cms-constants'
import {CMS_IMAGE} from '../../shared/cms-constants'
import {COMMON_SUFFIX} from '../../shared/page-titles'

const CmsPage: React.FunctionComponent = () => {
  const {getHubspotCmsPage} = useActions(cmsActions)
  const {head, body} = useSelector(state => state.cms.hubspotPage)
  const {title = '', description = '', image = CMS_IMAGE, links = [], styles = []} = head || {}
  const [hasMounted, setHasMounted] = React.useState(false)
  const isLoading = useIsActionLoading(GET_HUBSPOT_CMS_PAGE_TYPE)
  const elRef = React.useRef<HTMLDivElement>(null)
  const location = useLocation()

  const pageTitle = `${title}${COMMON_SUFFIX}`
  const type = 'website'
  const twitterTypes = (t: string) => {
    const typesMap = {
      'website': 'summary_large_image',
      'article': 'summary_large_image',
    }
    return typesMap[t] || 'summary_large_image'
  }
  const url = typeof window !== 'undefined' ? window.location.href : null

  React.useEffect(() => {
    setHasMounted(true)
    getHubspotCmsPage(location.pathname)
  }, [])

  React.useEffect(() => {
    if (!elRef.current || !body) {
      return
    }

    const range = document.createRange()
    range.selectNode(elRef.current)
    const documentFragment = range.createContextualFragment(body)

    elRef.current.innerHTML = ''
    elRef.current.append(documentFragment)
  }, [body])

  const parseLink = (linkStr: string, i: number) => {
    const div = document.createElement('div')
    div.innerHTML = linkStr.trim()
    const link = div.querySelector('link')
    if (!link) return null
    const props: Record<string, string> = {}
    for (const attr of link.attributes) {
      props[attr.name] = attr.value
    }
    return <link key={i} {...props} />
  }
  const parseStyle = (styleStr: string, i: number) => {
    const div = document.createElement('div')
    div.innerHTML = styleStr.trim()
    const style = div.querySelector('style')
    if (!style) return null
    return <style key={i}>{style.innerHTML}</style>
  }

  if (!hasMounted || isLoading) {
    return <Loader />
  }

  if (!head || !body) {
    return <Redirect to='/404' />
  }

  return (
    <div className='page'>
      {title && <Title>{title}</Title>}
      {/* Head tags */}
      <Helmet>
        {title && [
          <meta key='0' property='title' content={pageTitle} />,
          <meta key='1' property='og:title' content={pageTitle} />,
          <meta key='2' name='twitter:title' content={pageTitle} />,
        ]}
        {description && [
          (<meta key='0' name='description' content={description} />),
          (<meta key='1' property='og:description' content={description} />),
          (<meta key='2' name='twitter:description' content={description} />),
        ]}
        <meta key='0' property='og:image' content={image} />,
        <meta key='1' property='twitter:image' content={image} />,
        <meta property='og:type' content={type} />
        <meta property='twitter:card' content={twitterTypes(type)} />
        <meta key='0' property='twitter:url' content={url} />,
        <meta key='1' property='og:url' content={url} />,
        {links.map(parseLink)}
        {styles.map(parseStyle)}
      </Helmet>
      {/* End head tags */}
      <PageHeader />
      {/* eslint-disable-next-line react/no-danger */}
      <main className='cmsContainer' ref={elRef} dangerouslySetInnerHTML={{__html: body}} />
      <Footer />
    </div>
  )
}

export default CmsPage
