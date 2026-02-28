import React from 'react'
import {Placeholder} from 'semantic-ui-react'
import {useTranslation} from 'react-i18next'

import {combine} from '../../common/styles'
import {
  addLink,
  applyNewlineContinuation,
  toggleBold, toggleBulletedList, toggleHeading, toggleItalic, toggleNumberedList,
} from '../../apps/widgets/markdown-transformations'
import {ToolbarToggleButton} from './toolbar-toggle-button'
import {createThemedStyles} from '../../ui/theme'
import {StandardFieldContainer} from '../../ui/components/standard-field-container'
import {StandardCheckboxField} from '../../ui/components/standard-checkbox-field'
import FeaturedDescriptionRenderer from '../../apps/widgets/featured-description-renderer'
import {tinyViewOverride} from '../../static/styles/settings'
import {useSelector} from '../../hooks'

const useStyles = createThemedStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  panelContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: '1rem',
  },
  labelText: {
    display: 'block',
    color: theme.fgMain,
  },
  textPreview: {
    'flex': '1 0 0',
    'overflow': 'auto',
    'background': 'transparent',
    'paddingLeft': '0.75rem',
    'paddingTop': '0.6rem',
    '&::-webkit-scrollbar-corner': {
      backgroundColor: 'transparent',
    },
  },
  previewHeading: {
    color: theme.fgMuted,
    padding: '1rem 1rem 0.1rem 1rem',
    fontWeight: '600',
    fontSize: '1.25rem',
  },
  textarea: {
    'flex': '1 0 0',
    'fontFamily': 'inherit',
    'background': 'transparent',
    'border': 'none',
    'outline': 'none',
    'cursor': 'text',
    'color': theme.fgMain,
    'width': '100%',
    'resize': 'none',
    'paddingLeft': '0.75rem',
    'paddingTop': '0.75rem',
    '&::selection': {
      background: theme.sfcHighlight,
      color: theme.fgMain,
    },
    '&::placeholder': {
      color: theme.fgMuted,
    },
  },
  flexColumn: {
    display: 'flex',
    flex: '1 0 0',
    minWidth: '0',
    flexDirection: 'column',
  },
  charCount: {
    color: theme.fgMuted,
    position: 'absolute',
    right: '1em',
    bottom: '0.5em',
  },
  errorText: {
    color: theme.fgError,
  },
  previewToggle: {
    position: 'absolute',
    right: '0.7em',
    top: '0.7em',
    [tinyViewOverride]: {
      position: 'relative',
      display: 'flex',
      justifyContent: 'flex-end',
    },
  },
  small: {
    height: '12rem',
  },
  medium: {
    height: '22rem',
  },
  placeholder: {
    padding: '1rem',
  },
}))

interface IPlaceholderPanel {
  height: 'small' | 'medium'
}

const PlaceholderPanel: React.FC<IPlaceholderPanel> = ({height}) => {
  const classes = useStyles()
  return (
    <div className={combine(classes.flexColumn, classes[height])}>
      <StandardFieldContainer grow>
        <div className={combine(classes.flexColumn, classes.placeholder)}>
          <Placeholder>
            <Placeholder.Header image>
              <Placeholder.Line />
              <Placeholder.Line />
            </Placeholder.Header>
            <Placeholder.Paragraph>
              <Placeholder.Line />
              <Placeholder.Line />
              <Placeholder.Line />
              <Placeholder.Line />
            </Placeholder.Paragraph>
          </Placeholder>
        </div>
      </StandardFieldContainer>
    </div>
  )
}

interface IMarkdownTextarea extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string
  label?: React.ReactNode
  tooltip?: React.ReactNode
  errorMessage?: React.ReactNode
  showCharCount?: boolean
  value: string
  splitPreview?: boolean
  height?: 'small' | 'medium'
  loading?: boolean
  setValue: (s: string) => void
  isModuleOverview?: boolean
}

const MarkdownTextarea: React.FC<IMarkdownTextarea> = ({
  id, className, label, errorMessage, showCharCount = false,
  value, maxLength, splitPreview, height = 'small', loading, setValue, isModuleOverview, ...rest
}) => {
  const {t} = useTranslation('app-pages')
  const classes = useStyles()
  const textAreaRef = React.useRef<HTMLTextAreaElement>()
  const [showingPreview, setShowingPreview] = React.useState(false)
  const isSmallScreen = useSelector(s => s.common.isSmallScreen)

  const errorId = `${id}-errormessage`

  const transformations = [
    {
      transform: toggleBold,
      icon: 'bold',
      text: t('feature_project_page.showcase_project_details.overview.transformation.bold'),
    },
    {
      transform: toggleItalic,
      icon: 'italic',
      text: t('feature_project_page.showcase_project_details.overview.transformation.italic'),
    },
    {
      transform: toggleHeading,
      icon: 'heading',
      text: t('feature_project_page.showcase_project_details.overview.transformation.heading'),
    },
    {
      transform: toggleNumberedList,
      // eslint-disable-next-line local-rules/hardcoded-copy
      icon: 'ordered list',
      text:
        t('feature_project_page.showcase_project_details.overview.transformation.numbered_list'),
    },
    {
      transform: toggleBulletedList,
      icon: 'list',
      text:
        t('feature_project_page.showcase_project_details.overview.transformation.bulleted_list'),
    },
    isModuleOverview && {
      transform: addLink,
      icon: 'linkify',
      text: t('feature_project_page.showcase_project_details.overview.transformation.link'),
    } as const,
  ] as const

  const handleTransform = (transform: (el: HTMLTextAreaElement) => void) => {
    const {current: area} = textAreaRef
    if (!area) {
      return
    }
    area.focus()
    transform(area)
    setValue(area.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const {current: area} = textAreaRef
    if (area && e.key === 'Enter') {
      const didApply = applyNewlineContinuation(area)
      if (didApply) {
        e.preventDefault()
      }
    }
  }

  const preview = (
    <div className={classes.textPreview}>
      <FeaturedDescriptionRenderer source={value} isModuleOverview={isModuleOverview} />
    </div>
  )

  const isMainPanelPreview = showingPreview && ((isSmallScreen && splitPreview) || !splitPreview)
  const showSplitPreview = splitPreview && !isSmallScreen
  if (loading) {
    return (
      <div className={classes.container}>
        <span className={classes.labelText}>{label}</span>
        <div className={classes.panelContainer}>
          <PlaceholderPanel height={height} />
          {showSplitPreview &&
            <PlaceholderPanel height={height} />
          }
        </div>
      </div>
    )
  }

  const controls = (
    <div>
      {transformations.filter(Boolean).map(text => (
        <ToolbarToggleButton
          key={text.text}
          onClick={() => handleTransform(text.transform)}
          icon={text.icon}
          text={text.text}
          disabled={isMainPanelPreview}
        />
      ))}
      {!showSplitPreview &&
        <div className={classes.previewToggle}>
          <StandardCheckboxField
            id={`${id}-preview-toggle`}
            label={<>Preview&nbsp;</>}
            checked={showingPreview}
            onChange={() => setShowingPreview(!showingPreview)}
          />
        </div>
      }
    </div>
  )
  const textInput = (
    <>
      <textarea
        {...rest}
        id={id}
        value={value}
        className={combine(classes.textarea, className)}
        aria-invalid={!!errorMessage}
        maxLength={maxLength || undefined}
        aria-errormessage={errorMessage ? errorId : undefined}
        onChange={e => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        ref={textAreaRef}
      />
      {showCharCount && (
        <span className={combine(classes.charCount,
          (maxLength && (value.length >= maxLength)) && classes.errorText)}
        >
          {`${value.length}${maxLength ? `/${maxLength}` : ''}`}
        </span>
      )}
    </>
  )

  const Label = showingPreview ? 'div' : 'label'
  return (
    <div className={classes.container}>
      <Label tabIndex={-1} htmlFor={id}>
        <span className={classes.labelText}>{label}</span>
      </Label>
      <div className={classes.panelContainer}>
        <div className={combine(classes.flexColumn, classes[height])}>
          <StandardFieldContainer grow invalid={!!errorMessage}>
            <div className={classes.flexColumn}>
              {controls}
              {isMainPanelPreview ? preview : textInput}
              {errorMessage && <p id={errorId} className={classes.errorText}>{errorMessage}</p>}
            </div>
          </StandardFieldContainer>
        </div>
        {showSplitPreview &&
          <div className={combine(classes.flexColumn, classes[height])}>
            <StandardFieldContainer grow>
              <div className={classes.flexColumn}>
                <div className={classes.previewHeading}>
                  <span>{t('feature_project_page.showcase_project_details.label.preview')}</span>
                </div>
                {preview}
              </div>
            </StandardFieldContainer>
          </div>
        }
      </div>
    </div>
  )
}

export {
  MarkdownTextarea,
}

export type {IMarkdownTextarea}
