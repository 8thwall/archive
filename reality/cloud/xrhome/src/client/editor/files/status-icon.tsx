import React from 'react'
import {useTranslation} from 'react-i18next'
import {Icon} from 'semantic-ui-react'

import {UiTheme, useUiTheme} from '../../ui/theme'
import {createCustomUseStyles} from '../../common/create-custom-use-styles'

const useStyles = createCustomUseStyles<{color: string}>()({
  icon: {
    color: ({color}) => color,
  },
})

interface IStatusIcon {
  status: number
  dirty: boolean
}

// Returns null for not-displayed
const statusCodeToColor = (
  code: number, dirty: boolean, theme?: UiTheme
): string | null => {
  switch (code) {
    case 0:
      return dirty ? theme?.modifiedColor : null  // Reverted but not yet saved.
    case 1:  // ADDED
      return theme?.fgSuccess
    case 3:  // MODIFIED
    case 4:  // TYPE_CHANGED
    case 5:  // COPIED
    case 6:  // RENAMED
      return theme?.modifiedColor
    case 8:  // CONFLICTED
    case 9:  // UNREADABLE
      return theme?.fgError
    default:  // 2: DELETED; 7: IGNORED
      return null
  }
}

const isStatusIconDisplayed = (
  status: number,
  dirty: boolean
): boolean => statusCodeToColor(status, dirty) !== null

const statusCodeToString = (t: (key: string) => string, code: number): string => {
  switch (code) {
    case 0:
      return t('file_list.status.unmodified')
    case 1:
      return t('file_list.status.created')
    case 2:
      return t('file_list.status.deleted')
    case 3:
      return t('file_list.status.modified')
    case 4:
      return t('file_list.status.type_changed')
    case 5:
      return t('file_list.status.renamed')
    case 6:
      return t('file_list.status.copied')
    case 7:
      return t('file_list.status.ignored')
    case 8:
      return t('file_list.status.conflicted')
    case 9:
      return t('file_list.status.unreadable')
    default:
      return t('file_list.status.unknown')
  }
}

const StatusIcon: React.FC<IStatusIcon> = ({status, dirty}) => {
  const {t} = useTranslation('cloud-editor-pages')
  const theme = useUiTheme()
  const color = statusCodeToColor(status, dirty, theme)
  const classes = useStyles({color})

  if (!color) {
    return null
  }

  const text =
    `${statusCodeToString(t, status)}${dirty ? '' : ` (${t('file_list.status.saved_to_cloud')})`}`

  return (
    <span className='status' title={text}>
      <Icon name={`circle${dirty ? '' : ' outline'}`} className={classes.icon} />
    </span>
  )
}

export {StatusIcon, isStatusIconDisplayed}

export type {IStatusIcon}
