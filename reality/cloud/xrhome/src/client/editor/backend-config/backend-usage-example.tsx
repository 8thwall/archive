import React from 'react'
import type {RouteConfig} from '@nia/reality/shared/gateway/gateway-types'
import type {DeepReadonly} from 'ts-essentials'
import {useTranslation} from 'react-i18next'

import {getRouteNameError} from '@nia/reality/shared/gateway/validate-function-config'

import {editorMonospace, editorFontSize} from '../../static/styles/settings'
import {createThemedStyles} from '../../ui/theme'
import {Icon} from '../../ui/components/icon'
import {StandardFieldLabel} from '../../ui/components/standard-field-label'
import {TooltipIcon} from '../../widgets/tooltip-icon'

interface IBackendUsageExample {
  route: DeepReadonly<RouteConfig>
  importPath: string
}

const useStyles = createThemedStyles(theme => ({
  routeUsage: {
    flex: '1 1 280px',
    minWidth: '120px',
  },
  usageExample: {
    fontFamily: editorMonospace,
    fontSize: editorFontSize,
  },
  copyButton: {
    background: 'transparent',
    border: 0,
    position: 'absolute',
    cursor: 'pointer',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 4,
  },
  copySnippetPreview: {
    'display': 'inline-block',
    'overflow': 'hidden',
    'width': '100%',
    'whiteSpace': 'nowrap',
    'textOverflow': 'ellipsis',
  },
  copySnippet: {
    'position': 'relative',
    'width': '100%',
    '&:focus-within $copySnippetOverflowContainer, &:hover $copySnippetOverflowContainer': {
      display: 'block',
    },
  },
  copySnippetOverflowContainer: {
    display: 'none',
    position: 'absolute',
    top: '-0.25rem',
    left: '-0.25rem',
    width: 'calc(100% + 0.5rem)',
  },
  copyIndicator: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  copySnippetOverflowText: {
    position: 'relative',
    width: '100%',
    display: 'inline-block',
    backgroundColor: theme.mainEditorPane,
    padding: '0.25rem',
    borderRadius: '0.5rem',
    maxWidth: '100%',
    overflow: 'hidden',
    whiteSpace: 'normal',
    wordBreak: 'break-all',
    border: `1px solid ${theme.subtleBorder}`,
    zIndex: 3,
  },
  placeholder: {
    color: theme.fgMuted,
  },
  exampleKeyword: {
    color: theme.codeEditorKeyword,
  },
  exampleBracket: {
    color: theme.codeEditorBracket,
  },
  exampleConstant: {
    color: theme.codeEditorConstant,
  },
  exampleString: {
    color: theme.codeEditorString,
  },
  exampleFunction: {
    color: theme.codeEditorFunction,
  },
  exampleSecondaryBracket: {
    color: theme.codeEditorSecondaryBracket,
  },
  exampleObjectKey: {
    color: theme.codeEditorObjectKey,
  },
}))

const BackendUsageExample: React.FC<IBackendUsageExample> = ({route, importPath}) => {
  const classes = useStyles()
  const {t} = useTranslation(['cloud-editor-pages', 'common'])
  const [copiedUsageExample, setCopiedUsageExample] = React.useState(false)

  React.useEffect(() => {
    if (!copiedUsageExample) {
      return undefined
    }
    const timer = setTimeout(() => setCopiedUsageExample(false), 3000)
    return () => {
      clearTimeout(timer)
    }
  }, [copiedUsageExample])

  const {name, methods} = route
  const showMethodInUsage = methods?.[0] && methods[0] !== 'GET'
  const usageMethod = showMethodInUsage ? `{method: '${methods[0]}'}` : ''

  // TODO(Julie): Handle wildcard in route url and usage
  const routeUsage = `import {${name}} from '${importPath}'\n${name}(${usageMethod})`
  const exampleImport = `'${importPath}'`
  const exampleMethod = `'${methods?.[0]}'`
  const usageExample = (
    <>
      <span className={classes.exampleKeyword}>import </span>
      <span className={classes.exampleBracket}>{'{'}</span>
      <span className={classes.exampleConstant}>{name}</span>
      <span className={classes.exampleBracket}>{'}'}</span>
      <span className={classes.exampleKeyword}> from </span>
      <span className={classes.exampleString}>{exampleImport}</span>
      <br />
      <span className={classes.exampleFunction}>{name}</span>
      <span className={classes.exampleBracket}>(</span>
      {showMethodInUsage && (
        <>
          <span className={classes.exampleSecondaryBracket}>{'{'}</span>
          <span className={classes.exampleObjectKey}>method: </span>
          <span className={classes.exampleString}>{exampleMethod}</span>
          <span className={classes.exampleSecondaryBracket}>{'}'}</span>
        </>
      )}
      <span className={classes.exampleBracket}>)</span>
    </>
  )

  const copyUsageExample = () => {
    navigator.clipboard.writeText(routeUsage)
    setCopiedUsageExample(true)
  }

  return (
    <div className={classes.routeUsage}>
      <StandardFieldLabel
        label={(
          <>
            {t('editor_page.route_config_builder.usage')}
            <TooltipIcon
              content={t('editor_page.route_config_builder.usage_tooltip')}
            />
          </>
        )}
        bold
      />
      <div className={classes.usageExample}>
        {(!name || getRouteNameError(name))
          ? (
            <span className={classes.placeholder}>
              {t('editor_page.route_config_builder.usage_placeholder')}
            </span>
          )
          : (
            <div className={classes.copySnippet}>
              <div className={classes.copySnippetPreview}>{usageExample}</div>
              <span className={classes.copySnippetOverflowContainer}>
                <button
                  type='button'
                  onClick={copyUsageExample}
                  aria-label={t('button.copy', {ns: 'common'})}
                  className={classes.copyButton}
                />
                <span className={classes.copySnippetOverflowText} aria-hidden='true'>
                  {usageExample}
                  <div className={classes.copyIndicator}>
                    {copiedUsageExample ? <Icon stroke='checkmark' /> : <Icon stroke='copy' />}
                  </div>
                </span>
              </span>
            </div>
          )}
      </div>
    </div>
  )
}

export {
  BackendUsageExample,
}
