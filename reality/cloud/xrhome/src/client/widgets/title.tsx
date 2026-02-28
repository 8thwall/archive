import * as React from 'react'

import {COMMON_PREFIX, COMMON_SUFFIX} from '../../shared/page-titles'
import {debounce} from '../../shared/debounce'
import {SsrContext} from '../../shared/ssr-context'
import {shouldLoadLightship} from '../lightship/common/lightship-settings'

// TODO(christoph): Add precedence value to TitleListEntry
type TitleListEntry = {
  value: string
}

const titleList: TitleListEntry[] = []

const update = debounce(() => {
  if (titleList.length) {
    document.title = titleList[titleList.length - 1].value
  } else {
    document.title = shouldLoadLightship() ? 'Niantic Lightship' : '8th Wall'
  }
}, 200)

interface ITitle {
  children: string
  addCommon?: boolean
  commonPrefixed?: boolean
  isLightship?: boolean
}

const makeTitle = (
  addCommon, commonPrefixed, text, isLightship
) => {
  if (!addCommon || isLightship) {
    return text
  }
  return commonPrefixed ? `${COMMON_PREFIX}${text}` : `${text}${COMMON_SUFFIX}`
}

const Title: React.FunctionComponent<ITitle> = (
  {children, addCommon = true, commonPrefixed = false, isLightship = false}
) => {
  const ssrContext = React.useContext(SsrContext)
  if (ssrContext) {
    ssrContext.setTitle(
      makeTitle(addCommon, commonPrefixed, children, isLightship)
    )
  }

  React.useEffect(() => {
    const entry: TitleListEntry = {
      value: makeTitle(
        addCommon, commonPrefixed, children, isLightship
      ),
    }

    titleList.push(entry)
    update()

    return () => {
      titleList.splice(titleList.indexOf(entry), 1)
      update()
    }
  }, [children, addCommon, commonPrefixed, isLightship])

  return null
}

export default Title
