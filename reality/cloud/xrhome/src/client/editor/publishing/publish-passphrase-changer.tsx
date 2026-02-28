import * as React from 'react'
import {useState} from 'react'
import {useTranslation} from 'react-i18next'

import {STAGING_PASSPHRASE_REGEX_PATTERN, isValidPassphrase} from '../../../shared/staging-password'
import {createThemedStyles} from '../../ui/theme'
import {StandardTextInput} from '../../ui/components/standard-text-input'
import {combine} from '../../common/styles'
import {PublishingPrimaryButton} from './publish-primary-button'
import {TextButton} from '../../ui/components/text-button'

const useStyles = createThemedStyles(theme => ({
  passphraseChanger: {
    color: theme.publishModalText,
    gap: '0.5rem',
    display: 'flex',
    flexDirection: 'column',
  },
  passphraseChangerBox: {
    color: theme.fgMuted,
    fontSize: '12px',
    border: `1px solid ${theme.modalContainerBg}`,
    borderRadius: '0.5rem',
    padding: '1rem',
    lineHeight: '1.25rem',
  },
  passphraseChangerTextInput: {
    maxWidth: '240px',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  passphraseChangerBoxList: {
    '& ul': {
      paddingInlineStart: '1rem',
      marginTop: '0.5rem',
    },
  },
  buttonRow: {
    display: 'flex',
    gap: '0.5rem',
  },
}))

interface IPassphraseChanger {
  loading: boolean
  handleSubmit: Function
  onClose: () => void
}

const PassphraseChanger = ({
  loading, handleSubmit, onClose,
}: IPassphraseChanger) => {
  const className = useStyles()
  const {t} = useTranslation(['cloud-editor-pages', 'common'])

  const [passphrase, setPassphrase] = useState('')

  return (
    <div className={className.passphraseChanger}>
      <div>{t('editor_page.set_passphrase_modal.header')}</div>
      <div className={combine(className.passphraseChangerBox, className.passphraseChangerBoxList)}>
        <p>
          {t('editor_page.passphrase_changer.blurb', {ns: 'cloud-editor-pages'})}
        </p>
        <ul>
          <li>
            {t('editor_page.passphrase_changer.requirements.length', {ns: 'cloud-editor-pages'})}
          </li>
          <li>
            {t('editor_page.passphrase_changer.requirements.types', {ns: 'cloud-editor-pages'})}
          </li>
        </ul>
        <form
          className={className.passphraseChangerTextInput}
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit(passphrase)
          }}
        >
          <StandardTextInput
            id='staging-passphrase'
            pattern={STAGING_PASSPHRASE_REGEX_PATTERN}
            height='tiny'
            value={passphrase}
            onChange={e => setPassphrase(e.target.value)}
            autoFocus
          />
          <div className={className.buttonRow}>
            <PublishingPrimaryButton
              type='submit'
              spacing='normal'
              height='small'
              disabled={loading || !isValidPassphrase(passphrase)}
              loading={loading}
            >
              {t('editor_page.set_passphrase_modal.button.set_passcode')}
            </PublishingPrimaryButton>

            <TextButton
              type='button'
              onClick={onClose}
              spacing='normal'
              height='small'
              disabled={loading}
              loading={loading}
            >
              {t('button.cancel', {ns: 'common'})}
            </TextButton>
          </div>
        </form>
      </div>
    </div>
  )
}

export {
  PassphraseChanger,
}
