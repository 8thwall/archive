import React from 'react'
import {useDispatch} from 'react-redux'
import {createUseStyles} from 'react-jss'
import {useTranslation} from 'react-i18next'

import {RowBooleanField, RowSelectField} from './row-fields'
import {rawActions as actions} from '../../user/user-actions'
import {UserEditorSettings, useUserEditorSettings} from '../../user/use-user-editor-settings'
import {extractUserEditorSettings} from '../../user/editor-settings'
import {
  MONACO_THEME_LOADERS, MONACO_THEME_TO_DARK_MODE, EditorThemeName,
} from '../../editor/texteditor/monaco-themes'
import {useTextEditorContext} from '../../editor/texteditor/texteditor-context'
import {FloatingPanelButton} from '../../ui/components/floating-panel-button'
import {StudioHotkeysModal} from '../ui/studio-hotkeys-modal'
import {FloatingTraySection} from '../../ui/components/floating-tray-section'

const useStyles = createUseStyles({
  buttonTray: {
    display: 'flex',
    justifyContent: 'center',
    padding: '1rem',
  },
  themeOption: {
    display: 'flex',
    gap: '0.5em',
    alignItems: 'center',
  },
  themeOptionText: {
    flex: 1,
    textOverflow: 'ellipsis',
  },
})

const keyboardOptions = ['Ace', 'Vim', 'Emacs', 'VSCode'].map(name => ({
  value: name.toLowerCase(),
  content: name,
}))

const themeOptions = Object.keys(MONACO_THEME_LOADERS).map((name: EditorThemeName) => ({
  value: name,
  content: name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
}))

const CodeEditorSettings: React.FC = () => {
  const {t} = useTranslation(['app-pages', 'cloud-studio-pages'])
  const {editorToUse} = useTextEditorContext() ?? {editorToUse: null}
  const dispatch = useDispatch()
  const editorSettings = useUserEditorSettings()
  const classes = useStyles()

  const [darkMode, setDarkMode] = React.useState(editorSettings.darkMode)
  const [autoFormat, setAutoformat] = React.useState(editorSettings.autoFormat)
  const [minimap, setMinimap] = React.useState(editorSettings.minimap)
  const [monacoTheme, setMonacoTheme] = React.useState<EditorThemeName>(editorSettings.monacoTheme)
  const [keyboardHandler, setKeyboardHandler] = React.useState(
    editorSettings.keyboardHandler || 'ace'
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

  const handleDarkModeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDarkMode(e.target.checked)
    updateSettings({darkMode: e.target.checked})
  }

  const handleThemeChange = async (value: EditorThemeName) => {
    setMonacoTheme(value)
    setDarkMode(MONACO_THEME_TO_DARK_MODE[value])
    await updateSettings(
      {monacoTheme: value, darkMode: MONACO_THEME_TO_DARK_MODE[value]}
    )
  }

  const handleAutoFormatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAutoformat(e.target.checked)
    updateSettings({autoFormat: e.target.checked})
  }

  const handleMinimapChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinimap(e.target.checked)
    updateSettings({minimap: e.target.checked})
  }

  const handleKeybindingChange = async (value: string) => {
    setKeyboardHandler(value)
    await updateSettings({keyboardHandler: value as typeof editorSettings.keyboardHandler})
  }

  const shortcutsModalTrigger = (
    <FloatingPanelButton a8='click;studio;show-keyboard-shortcuts-button'>
      {t('project_settings_page.dev_preference_settings_view.button.keyboard_shortcuts')}
    </FloatingPanelButton>
  )

  const renderedThemeOptions = themeOptions.map(option => ({
    value: option.value,
    content: `${MONACO_THEME_TO_DARK_MODE[option.value]
      ? t('code_editor_settings.option.dark', {ns: 'cloud-studio-pages'})
      : t('code_editor_settings.option.light', {ns: 'cloud-studio-pages'})} | ${option.content}`,
  }))

  return (
    <>
      <FloatingTraySection title={t('code_editor_settings.title', {ns: 'cloud-studio-pages'})}>
        <div>
          {editorToUse === 'Ace' &&
            <RowBooleanField
              label={t('project_settings_page.dev_preference_settings_view.label.dark_mode')}
              id='code-editor-settings-dark-mode'
              checked={darkMode}
              onChange={handleDarkModeChange}
            />
        }
          {editorToUse === 'Monaco' &&
            <RowSelectField
              id='code-editor-settings-theme-dropdown'
              label={t('project_settings_page.dev_preference_settings_view.label.theme')}
              value={monacoTheme || '8th-wall-dark'}
              options={renderedThemeOptions}
              onChange={handleThemeChange}
            />
        }
        </div>
        <div>
          <RowSelectField
            id='code-editor-settings-keybinding-dropdown'
            label={t('project_settings_page.dev_preference_settings_view.label.keybinding')}
            value={keyboardHandler || 'ace'}
            options={keyboardOptions}
            onChange={handleKeybindingChange}
          />
        </div>
        <div>
          <RowBooleanField
            label={
              t('project_settings_page.dev_preference_settings_view.label.auto_format_on_save')
            }
            id='code-editor-settings-format-on-save'
            checked={autoFormat}
            onChange={handleAutoFormatChange}
          />
        </div>
        <div>
          <RowBooleanField
            label={t('project_settings_page.dev_preference_settings_view.label.minimap')}
            id='code-editor-settings-minimap'
            checked={minimap}
            onChange={handleMinimapChange}
          />
        </div>
      </FloatingTraySection>
      <div className={classes.buttonTray}>
        <StudioHotkeysModal
          keyboardHandler={keyboardHandler}
          trigger={shortcutsModalTrigger}
        />
      </div>
    </>
  )
}

export {
  CodeEditorSettings,
}
