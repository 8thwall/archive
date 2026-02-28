import React from 'react'

import {MarkdownFilePage} from './markdown-file-page'
import contentDisputePolicyPageMd from '../i18n/en-US/legal/copyright-dispute-policy.md'

const CopyrightDisputePolicyPage = () => {
  // eslint-disable-next-line local-rules/hardcoded-copy
  const copyRightDisputePageHeader = 'Copyright Dispute Policy'

  return (
    <MarkdownFilePage
      markdownSource={contentDisputePolicyPageMd as unknown as string}
      header={copyRightDisputePageHeader}
      title={copyRightDisputePageHeader}
    />
  )
}

export default CopyrightDisputePolicyPage
