import React from 'react'
import {Button, Form, Modal} from 'semantic-ui-react'
import {useLocation} from 'react-router-dom'
import {useTranslation} from 'react-i18next'

import {createUseStyles} from 'react-jss'

import type {IApp} from '../../common/types/models'
import CopyableBlock from '../../widgets/copyable-block'
import {brandBlack, gray4} from '../../static/styles/settings'
import {combine} from '../../common/styles'
import AutoHeadingScope from '../../widgets/auto-heading-scope'
import AutoHeading from '../../widgets/auto-heading'
import Embed8 from '../../widgets/embed8'

const useStyles = createUseStyles({
  linkEmbedModal: {
    padding: '1rem',
  },
  mainHeading: {
    fontSize: '1.3em',
  },
  indentedBlock: {
    margin: '0 1.5rem',
  },
  inputFaded: {
    pointerEvents: 'none',
    opacity: '0.4',
  },
  groupLabel: {
    marginRight: '1em',
  },
  preview: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    textAlign: 'center',
    height: '280px',
    padding: '1rem',
    marginBottom: '1rem',
    border: '1px solid lightgray',
    fontSize: '1.2rem',
  },
  dark: {
    backgroundColor: brandBlack,
    border: 'none',
  },
  button: {
    margin: '0 !important',
    borderColor: `${gray4} !important`,
  },
})

interface IRadioGroup {
  label: string
  labelId: string
  value: string
  options: {label: string, value: string}[]
  onChange: (v: string) => void
  disabled?: boolean
}

const RadioGroup: React.FC<IRadioGroup> = ({
  label, labelId, value, options, onChange, disabled,
}) => {
  const classes = useStyles()
  return (
    <Form.Group
      inline
      role='group'
      aria-labelledby={labelId}
      className={disabled ? classes.inputFaded : ''}
    >
      <span className={classes.groupLabel} id={labelId}>{label}</span>
      {options.map(option => (
        <Form.Radio
          inline
          key={option.label}
          label={option.label}
          value={option.value}
          checked={!disabled && value === option.value}
          onChange={(e, data) => onChange(data.value as string)}
        />
      ))}
    </Form.Group>
  )
}

const OPEN_ON_HASH = '#embed'

interface ILinkEmbedModal {
  app: IApp
}

const LinkEmbedModal: React.FC<ILinkEmbedModal> = ({app}) => {
  const [textVisible, setTextVisible] = React.useState(true)
  const [textAlignment, setTextAlignment] = React.useState('horizontal')
  const [iconColor, setIconColor] = React.useState('purple')

  const location = useLocation()
  const [isOpen, setIsOpen] = React.useState(location.hash === OPEN_ON_HASH)

  const classes = useStyles()
  const {t} = useTranslation(['app-pages'])

  const textOptions = [
    {
      value: 'horizontal',
      label: t('project_dashboard_page.qr_code_8.modal.text_options.horizontal'),
    },
    {value: 'vertical', label: t('project_dashboard_page.qr_code_8.modal.text_options.vertical')},
  ]

  const colorOptions = [
    {value: 'purple', label: t('project_dashboard_page.qr_code_8.modal.color_options.purple')},
    {value: 'gray', label: t('project_dashboard_page.qr_code_8.modal.color_options.grayscale')},
    {value: 'dark', label: t('project_dashboard_page.qr_code_8.modal.color_options.dark_mode')},
  ]

  const attributes = React.useMemo(() => {
    const res = {}

    res['data-8code'] = app.shortLink

    if (!textVisible) {
      res['data-hide-text'] = ''
    }

    if (textVisible && textAlignment === 'vertical') {
      res['data-icon-vertical'] = ''
    }

    if (iconColor === 'dark') {
      res['data-dark-theme'] = ''
    } else if (iconColor !== 'purple') {
      res['data-icon-color'] = iconColor
    }
    return res
  }, [app.shortLink, textVisible, textAlignment, iconColor])

  const trigger = (
    <Button
      className={classes.button}
      basic={!isOpen}
      color='black'
      icon='code'
      content={t('project_dashboard_page.qr_code_8.modal.button_trigger')}
      onClick={() => setIsOpen(true)}
    />
  )

  if (!isOpen) {
    return trigger
  }

  const attributeString = Object.keys(attributes)
    .map(key => (attributes[key] === '' ? key : `${key}="${attributes[key]}"`))
    .join(' ')

  const source = `<a ${attributeString}></a>
<script src="//cdn.8thwall.com/web/share/embed8.js"></script>`

  const content = (
    <div className={classes.linkEmbedModal}>
      <AutoHeadingScope level={2}>
        <AutoHeading className={classes.mainHeading}>
          {t('project_dashboard_page.qr_code_8.modal.header')}
        </AutoHeading>
        <p>
          {app.isCamera
            ? t('project_dashboard_page.qr_code_8.modal.blurb.embed_ar_camera')
            : t('project_dashboard_page.qr_code_8.modal.blurb.embed_web_app')
          }
        </p>
        <AutoHeadingScope>
          <AutoHeading className='cam-section'>
            {t('project_dashboard_page.qr_code_8.modal.subheader.button_style')}
          </AutoHeading>
          <Form className={classes.indentedBlock}>
            <Form.Checkbox
              inline
              checked={textVisible}
              onClick={() => setTextVisible(!textVisible)}
              label={t('project_dashboard_page.qr_code_8.modal.label.text_visible')}
            />
            <RadioGroup
              label={t('project_dashboard_page.qr_code_8.modal.text_options.label')}
              labelId='embedIconOption'
              value={textAlignment}
              disabled={!textVisible}
              options={textOptions}
              onChange={v => setTextAlignment(v)}
            />
            <RadioGroup
              label={t('project_dashboard_page.qr_code_8.modal.color_options.label')}
              labelId='embedColorOption'
              value={iconColor}
              options={colorOptions}
              onChange={v => setIconColor(v)}
            />
          </Form>
        </AutoHeadingScope>
        <AutoHeadingScope>
          <AutoHeading className='cam-section'>
            {t('project_dashboard_page.qr_code_8.subheader.preview')}
          </AutoHeading>
          <div
            className={combine(
              classes.preview, classes.indentedBlock, iconColor === 'dark' && classes.dark
            )}
          >
            <Embed8
              key={attributeString}  // Remount on change so expandFirst forces it to stay open
              expandFirst
              shortLink={app.shortLink}
              iconColor={iconColor === 'dark' ? 'light' : iconColor}
              iconVertical={textAlignment === 'vertical'}
              darkTheme={iconColor === 'dark'}
            >
              {textVisible ? t('project_dashboard_page.qr_code_8.modal.embed_preview.ar_view') : ''}
            </Embed8>
          </div>
        </AutoHeadingScope>
        <div className={classes.indentedBlock}>
          <p>
            {t('project_dashboard_page.qr_code_8.modal.blurb.paste_this')}
          </p>
          <CopyableBlock
            description={t('project_dashboard_page.qr_code_8.modal.copy_block.html_embed_code')}
            text={source}
          />
        </div>
      </AutoHeadingScope>
    </div>
  )

  return (
    <>
      {trigger}
      <Modal
        closeIcon
        size='tiny'
        open
        content={content}
        onClose={() => setIsOpen(false)}
      />
    </>
  )
}

export default LinkEmbedModal
