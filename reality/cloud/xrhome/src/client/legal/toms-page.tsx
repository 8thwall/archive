import React from 'react'

import {MarkdownFilePage} from './markdown-file-page'
import tomsMd from '../i18n/en-US/legal/toms.md'

const TomsPage = () => {
  // eslint-disable-next-line local-rules/hardcoded-copy
  const tomsPageHeader = 'Technical and Organizational Measures'

  return (
    <MarkdownFilePage
      markdownSource={tomsMd as unknown as string}
      header={tomsPageHeader}
      title={tomsPageHeader}
    />
  )
}

export default TomsPage
