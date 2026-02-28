import React, {useState} from 'react'
import {useDispatch} from 'react-redux'
import {useTranslation} from 'react-i18next'

import {extractUserEditorSettings} from '../../user/editor-settings'
import {rawActions as actions} from '../../user/user-actions'
import {UserEditorSettings, useUserEditorSettings} from '../../user/use-user-editor-settings'
import {StandardDropdownField} from '../../ui/components/standard-dropdown-field'
import {StandardToggleField} from '../../ui/components/standard-toggle-field'
import KeyboardShortcutsModal from '../widgets/keyboard-shortcuts-modal'
import {TertiaryButton} from '../../ui/components/tertiary-button'
import {useTextEditorContext} from '../../editor/texteditor/texteditor-context'
import {MONACO_THEME_LOADERS, MONACO_THEME_TO_DARK_MODE}
  from '../../editor/texteditor/monaco-themes'
import {Badge} from '../../ui/components/badge'
import {createThemedStyles} from '../../ui/theme'

const useStyles = createThemedStyles(() => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1em',
  },
  themeOption: {
    display: 'flex',
    alignItems: 'center',
  },
  themeOptionBadge: {
    paddingRight: '0.5em',
  },
}))

const keyboardOptions = ['Ace', 'Vim', 'Emacs', 'VSCode'].map(name => ({
  value: name.toLowerCase(),
  content: name,
}))

interface IThemeOption {
  textContent: string
  dark: boolean
}

const ThemeOption: React.FC<IThemeOption> = ({
  textContent, dark,
}) => {
  const classes = useStyles()
  return (
    <div className={classes.themeOption}>
      <div className={classes.themeOptionBadge}>
        {dark
          ? <Badge color='gray' variant='solid'>dark</Badge>
          : <Badge color='gray' variant='outlined'>light</Badge>}
      </div>
      {textContent}
    </div>
  )
}

const themeOptions = Object.keys(MONACO_THEME_LOADERS).map(name => ({
  value: name,
  content: (
    <ThemeOption
      textContent={name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
      dark={MONACO_THEME_TO_DARK_MODE[name]}
    />),
}))

const DeveloperPreferenceSettingsView: React.FC = () => {
  const {t} = useTranslation(['app-pages'])
  const classes = useStyles()

  const {editorToUse} = useTextEditorContext() ?? {editorToUse: null}

  const dispatch = useDispatch()
  const editorSettings = useUserEditorSettings()

  const [darkMode, setDarkMode] = useState(editorSettings.darkMode)
  const [autoFormat, setAutoformat] = useState(editorSettings.autoFormat)
  const [minimap, setMinimap] = useState(editorSettings.minimap)
  const [monacoTheme, setMonacoTheme] = useState(editorSettings.monacoTheme)
  const [keyboardHandler, setKeyboardHandler] = useState(editorSettings.keyboardHandler || 'ace')
  const [shortcutsModalOpen, setShortcutsModalOpen] = useState(false)
  const shortcutsModalTrigger = (
    <TertiaryButton onClick={() => { setShortcutsModalOpen(true) }}>
      {t('project_settings_page.dev_preference_settings_view.button.keyboard_shortcuts')}
    </TertiaryButton>
  )

  const updateSettings = async (updatedAttributes: Partial<UserEditorSettings>) => {
    const finalAttributes = extractUserEditorSettings({
      ...editorSettings,
      darkMode,
      monacoTheme,
      autoFormat,
      minimap,
      keyboardHandler,
      ...updatedAttributes,
    })
    await dispatch(actions.updateAttribute({
      'custom:themeSettings': JSON.stringify(finalAttributes),
    }))
  }

  const handleDarkModeChange = (checked) => {
    setDarkMode(checked)
    updateSettings({darkMode: checked})
  }

  const handleThemeChange = async (value) => {
    setMonacoTheme(value)
    setDarkMode(MONACO_THEME_TO_DARK_MODE[value])
    await updateSettings({monacoTheme: value, darkMode: MONACO_THEME_TO_DARK_MODE[value]})
  }

  const handleAutoFormatChange = (checked) => {
    setAutoformat(checked)
    updateSettings({autoFormat: checked})
  }

  const handleMinimapChange = (checked) => {
    setMinimap(checked)
    updateSettings({minimap: checked})
  }

  const handleKeybindingChange = async (value) => {
    setKeyboardHandler(value)
    await updateSettings({keyboardHandler: value})
  }

  return (
    <div className={classes.form}>
      {editorToUse === 'Ace' &&
        <StandardToggleField
          showStatus
          label={t('project_settings_page.dev_preference_settings_view.label.dark_mode')}
          id='darkMode'
          checked={darkMode}
          onChange={handleDarkModeChange}
        />
      }
      {editorToUse === 'Monaco' &&
        <StandardDropdownField
          label={t('project_settings_page.dev_preference_settings_view.label.theme')}
          id='monacoTheme'
          options={themeOptions}
          value={monacoTheme || '8th-wall-dark'}
          onChange={handleThemeChange}
        />
      }
      <StandardToggleField
        showStatus
        label={t('project_settings_page.dev_preference_settings_view.label.auto_format_on_save')}
        id='autoformat'
        checked={autoFormat}
        onChange={handleAutoFormatChange}
      />
      {editorToUse === 'Monaco' &&
        <StandardToggleField
          showStatus
          label={t('project_settings_page.dev_preference_settings_view.label.minimap')}
          id='minimap'
          checked={minimap}
          onChange={handleMinimapChange}
        />
      }
      <StandardDropdownField
        label={t('project_settings_page.dev_preference_settings_view.label.keybinding')}
        id='keyboardHandler'
        options={keyboardOptions}
        value={keyboardHandler || 'ace'}
        onChange={handleKeybindingChange}
      />
      {(keyboardHandler === 'ace' || keyboardHandler === 'vscode') &&
        <KeyboardShortcutsModal
          open={shortcutsModalOpen}
          keyboardHandler={keyboardHandler}
          trigger={shortcutsModalTrigger}
          onClose={() => { setShortcutsModalOpen(false) }}
        />
      }
    </div>
  )
}

export default DeveloperPreferenceSettingsView
