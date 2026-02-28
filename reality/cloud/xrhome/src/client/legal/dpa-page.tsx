import React from 'react'

import {MarkdownFilePage} from './markdown-file-page'
import dpaMd from '../i18n/en-US/legal/dpa.md'

const DpaPage = () => {
  // eslint-disable-next-line local-rules/hardcoded-copy
  const dpaPageHeader = 'Data Processing Addendum'

  return (
    <MarkdownFilePage
      markdownSource={dpaMd as unknown as string}
      header={dpaPageHeader}
      title={dpaPageHeader}
    />
  )
}

export default DpaPage
