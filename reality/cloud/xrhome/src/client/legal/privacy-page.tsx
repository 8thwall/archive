import React from 'react'

import {MarkdownFilePage} from './markdown-file-page'
import privacyMd from '../i18n/en-US/legal/privacy.md'

const DpaPage = () => {
  // eslint-disable-next-line local-rules/hardcoded-copy
  const privacyPageHeader = 'Privacy Policy'

  return (
    <MarkdownFilePage
      markdownSource={privacyMd as unknown as string}
      header={privacyPageHeader}
      title={privacyPageHeader}
    />
  )
}

export default DpaPage
