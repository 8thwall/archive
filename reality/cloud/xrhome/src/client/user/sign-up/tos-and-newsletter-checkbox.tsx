import React from 'react'
import {createUseStyles} from 'react-jss'
import {useTranslation, Trans} from 'react-i18next'

import {StandardCheckboxField} from '../../ui/components/standard-checkbox-field'
import LinkOut from '../../uiWidgets/link-out'
import withTranslationLoaded from '../../i18n/with-translations-loaded'
import {cherry} from '../../static/styles/settings'
import {SpaceBetween} from '../../ui/layout/space-between'

const useStyles = createUseStyles({
  asterisk: {
    color: cherry,
  },
})

interface IToSAndNewsletterCheckbox {
  newsletterCheck?: boolean
  setNewsletterCheck?: () => void
  tosCheck?: boolean
  setToSCheck?: () => void
}

const ToSAndNewsletterCheckbox: React.FC<IToSAndNewsletterCheckbox> = ({
  newsletterCheck, setNewsletterCheck, tosCheck, setToSCheck,
}) => {
  const {t} = useTranslation(['sign-up-pages'])
  const classes = useStyles()

  const checkboxTOS = (
    <Trans
      ns='sign-up-pages'
      i18nKey='register_sign_up_page.register_form.tos'
      asterisk={classes.asterisk}
      components={{
        1: <LinkOut url='https://www.8thwall.com/terms' />,
        3: <LinkOut url='https://www.8thwall.com/privacy' />,
        5: <span className={classes.asterisk} />,
      }}
    />
  )

  return (
    <SpaceBetween extraNarrow direction='vertical'>
      <StandardCheckboxField
        id='checkbox-tos'
        checked={tosCheck}
        onChange={setToSCheck}
        label={checkboxTOS}
        nowrap
      />
      <StandardCheckboxField
        id='checkbox-newsletter'
        checked={newsletterCheck}
        onChange={setNewsletterCheck}
        label={t('register_sign_up_page.register_form.checkbox.label.newsletter')}
        nowrap
      />
    </SpaceBetween>

  )
}

const TranslatedToSAndNewsletterCheckbox = withTranslationLoaded(ToSAndNewsletterCheckbox)

export {
  TranslatedToSAndNewsletterCheckbox as ToSAndNewsletterCheckbox,
}
