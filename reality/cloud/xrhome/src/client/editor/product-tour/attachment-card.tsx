import React from 'react'

import {useTranslation} from 'react-i18next'

import {IconButton} from '../../ui/components/icon-button'
import {createThemedStyles} from '../../ui/theme'
import {hexColorWithAlpha} from '../../../shared/colors'
import {brandWhite, brandBlack, gray2, almostBlack} from '../../static/styles/settings'
import {formatBytesToText} from '../../../shared/asset-size-limits'

const useStyles = createThemedStyles(theme => ({
  attachmentCard: {
    position: 'relative',
    borderRadius: '0.5em',
    height: '4.5em',
    width: '7em',
    display: 'flex',
  },
  attachmentImg: {
    border: `1px solid ${theme.toggleBackgroundDisabled}`,
    objectFit: 'cover',
    position: 'absolute',
    width: 'inherit',
    height: 'inherit',
    borderRadius: 'inherit',
  },
  attachmentCardInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  cardFileInfo: {
    'border': 'none',
    'background': 'transparent',
    'fontSize': 0,
    'width': '100%',
    'height': 'inherit',
    'padding': '1em 2em 1em 1em',
    'lineHeight': '1.2em',
    'zIndex': 5,
    '&:hover': {
      border: `1px solid ${theme.toggleBackgroundDisabled}`,
      borderRadius: 'inherit',
      background: hexColorWithAlpha(brandBlack, 0.95),
      fontSize: '0.7em',
    },
  },
  cardFileName: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    color: brandWhite,
  },
  cardFileSize: {
    color: gray2,
  },
  cancelAttachmentBtn: {
    position: 'absolute',
    top: '0.5em',
    right: '0.25em',
    borderRadius: '1em',
    color: brandWhite,
    background: almostBlack,
    zIndex: 6,
  },
}))

interface IAttachmentCard {
  attachment: File
  onRemoveAttachmentClick: (fileName: string) => void
}

const AttachmentCard: React.FC<IAttachmentCard> = ({attachment, onRemoveAttachmentClick}) => {
  const classes = useStyles()
  const [filePreview, setFilePreview] = React.useState<string>(null)

  const {t} = useTranslation(['common'])

  React.useEffect(() => {
    const reader = new FileReader()
    reader.readAsDataURL(attachment)
    reader.onload = (event) => {
      setFilePreview(event.target.result as string)
    }
  }, [])

  return (
    <div
      className={classes.attachmentCard}
    ><img className={classes.attachmentImg} alt={attachment.name} src={filePreview} />
      <div className={classes.cancelAttachmentBtn}>
        <IconButton
          stroke='cancel'
          onClick={() => onRemoveAttachmentClick(attachment.name)}
          text={t('button.delete')}
        />
      </div>
      <div className={classes.cardFileInfo}>
        <div className={classes.cardFileName}>{attachment.name}</div>
        <div className={classes.cardFileSize}>{formatBytesToText(attachment.size)}</div>
      </div>
    </div>
  )
}

export {
  AttachmentCard,
}
