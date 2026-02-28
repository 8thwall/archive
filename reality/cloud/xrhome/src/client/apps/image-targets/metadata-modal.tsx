import React from 'react'
import {useTranslation} from 'react-i18next'
import {createUseStyles} from 'react-jss'
import {Modal, Form, Header, Button} from 'semantic-ui-react'

import {InlineMessage} from '../../uiWidgets/messages'
import {Icon} from '../../ui/components/icon'

const useStyles = createUseStyles({
  metadataModal: {
    display: 'flex',
    flexDirection: 'row',
    padding: '1em',
  },
  metadataForm: {
    display: 'flex',
    justifyContent: 'flex-start',
    gap: '1.5em',
    padding: '1.5em 0 1em 0',
  },
  metadataInput: {
    '& textarea': {
      // necessary to include "!important" otherwise the user can grab the text area handle and
      // extend it off the modal.
      width: '100% !important',
      height: '10em',
    },
  },
  metadataHelpText: {
    marginBottom: '0.3em',
  },
  metadataModalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '0.5em',
  },
})

interface IMetadataModal {
  open: boolean
  value: string
  onChange(e, target): void
  isJson: boolean
  setUserMetadataIsJson(val: boolean): void
  hasMetadataJsonError: boolean
  metadataError: string
  onDone(): void
}

const MetadataModal: React.FunctionComponent<IMetadataModal> = ({
  open, value, onChange, isJson, setUserMetadataIsJson, hasMetadataJsonError, metadataError,
  onDone,
}) => {
  const {t} = useTranslation(['app-pages', 'common'])
  const classes = useStyles()
  const metadataJsonLabel = (
    <>
      {t('image_target_page.metadata_modal.radio.label.json')}&nbsp;
      {hasMetadataJsonError && <Icon stroke='warning' color='danger' inline />}
    </>
  )
  const metadataPlaceholder = isJson
    ? '{ "value": "https://example.com", "color": "blue" }'
    : '/model/my-model.glb'
  return (
    <Modal
      open={open}
      size='small'
      className={classes.metadataModal}
    >
      <Form.TextArea
        placeholder={metadataPlaceholder}
        name='userMetadata'
        value={value}
        onChange={onChange}
        className={classes.metadataInput}
        label={(
          <Form.Group inline>
            <Header as='h3'>{t('image_target_page.metadata_modal.heading')}</Header>
            <p className={classes.metadataHelpText}>
              {t('image_target_page.metadata_modal.description')}
            </p>
            <a
              href='https://www.8thwall.com/8thwall/artgallery-aframe'
              target='_blank'
              rel='noopener noreferrer'
            >
              {t('image_target_page.metadata_modal.sample_link')}&nbsp;
              <Icon stroke='chevronRight8' inline />
            </a>
            <div className={classes.metadataForm}>
              <p>{t('image_target_page.metadata_modal.radio.label.format')}</p>
              <Form.Radio
                label={t('image_target_page.metadata_modal.radio.label.text')}
                checked={!isJson}
                onChange={() => setUserMetadataIsJson(false)}
              />
              <Form.Radio
                label={{children: metadataJsonLabel}}
                checked={isJson}
                onChange={() => setUserMetadataIsJson(true)}
              />
            </div>
            {metadataError && <InlineMessage error>{metadataError}</InlineMessage>}
          </Form.Group>
        )}
      />
      <div className={classes.metadataModalFooter}>
        <Button
          color='grey'
          size='tiny'
          content={t('button.close', {ns: 'common'})}
          onClick={onDone}
        />
      </div>
    </Modal>
  )
}

export default MetadataModal
