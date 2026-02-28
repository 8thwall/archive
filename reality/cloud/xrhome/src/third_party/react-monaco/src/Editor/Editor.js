import React, {useState, useEffect, useRef, useCallback} from 'react'
import PropTypes from 'prop-types'
import loader from '@monaco-editor/loader'

import MonacoContainer from '../MonacoContainer'
import useMount from '../hooks/useMount'
import useUpdate from '../hooks/useUpdate'
import usePrevious from '../hooks/usePrevious'
import {noop, getOrCreateModel, isUndefined} from '../utils'
import {maybeWireGrammars} from '../../../../client/editor/texteditor/maybe-wire-grammars'

const viewStates = new Map()

function Editor({
  defaultValue,
  defaultLanguage,
  defaultPath,
  value,
  language,
  path,
  /* === */
  theme,
  position,
  loading,
  options,
  overrideServices,
  saveViewState,
  keepCurrentModel,
  /* === */
  width,
  height,
  className,
  wrapperProps,
  /* === */
  beforeMount,
  onMount,
  onChange,
  onValidate,
  onFilePathChange,
}) {
  const [isEditorReady, setIsEditorReady] = useState(false)
  const [isMonacoMounting, setIsMonacoMounting] = useState(true)
  const monacoRef = useRef(null)
  const editorRef = useRef(null)
  const containerRef = useRef(null)
  const onMountRef = useRef(onMount)
  const beforeMountRef = useRef(beforeMount)
  const subscriptionRef = useRef(null)
  const valueRef = useRef(value)
  const previousPath = usePrevious(path)
  const preventCreation = useRef(false)
  const onFilePathChangeRef = React.useRef(null)

  React.useEffect(() => {
    onFilePathChangeRef.current = onFilePathChange
  }, [onFilePathChange])

  useMount(() => {
    const cancelable = loader.init()

    cancelable
      .then(monaco => ((monacoRef.current = monaco) && setIsMonacoMounting(false)))
      .catch((error) => {
        if (error?.type !== 'cancelation') {
          // eslint-disable-next-line no-console
          console.error(`Monaco initialization: error: ${error.message}`)
          // eslint-disable-next-line no-console
          console.error(error)
        }
      })

    return () => (editorRef.current ? disposeEditor() : cancelable.cancel())
  })

  useUpdate(() => {
    const model = getOrCreateModel(
      monacoRef.current,
      defaultValue || value,
      defaultLanguage || language,
      path
    )

    if (model !== editorRef.current.getModel()) {
      saveViewState && viewStates.set(previousPath, editorRef.current.saveViewState())
      editorRef.current.setModel(model)
      saveViewState && editorRef.current.restoreViewState(viewStates.get(path))
    }
  }, [path], isEditorReady)

  useUpdate(() => {
    editorRef.current.updateOptions(options)
  }, [options], isEditorReady)

  useUpdate(() => {
    if (editorRef.current.getOption(monacoRef.current.editor.EditorOption.readOnly)) {
      editorRef.current.setValue(value)
    } else if (value !== editorRef.current.getValue()) {
      editorRef.current.executeEdits('', [{
        range: editorRef.current.getModel().getFullModelRange(),
        text: value,
        forceMoveMarkers: true,
      }])

      editorRef.current.pushUndoStop()
    }
  }, [value], isEditorReady)

  useUpdate(() => {
    monacoRef.current.editor.setModelLanguage(editorRef.current.getModel(), language)
  }, [language], isEditorReady)

  useEffect(() => {
    // reason for undefined check: https://github.com/suren-atoyan/monaco-react/pull/188
    if (isEditorReady) {
      if (!isUndefined(position?.line)) {
        const {line, column} = position
        const pos = {lineNumber: line, column: column || 0}
        editorRef.current.revealPosition(pos)
        editorRef.current.setPosition(pos)
      }
    }
  }, [position, isEditorReady])

  useUpdate(() => {
    monacoRef.current.editor.setTheme(theme)
  }, [theme], isEditorReady)

  const createEditor = useCallback(async () => {
    if (!preventCreation.current) {
      preventCreation.current = true
      beforeMountRef.current(monacoRef.current)
      const autoCreatedModelPath = path || defaultPath

      const defaultModel = getOrCreateModel(
        monacoRef.current,
        value || defaultValue,
        defaultLanguage || language,
        autoCreatedModelPath
      )

      editorRef.current = monacoRef.current.editor.create(containerRef.current, {
        model: defaultModel,
        automaticLayout: true,
        ...options,
      }, overrideServices)

      await maybeWireGrammars(monacoRef.current, editorRef.current)

      const editorService = editorRef.current._codeEditorService
      editorService.openCodeEditor = async (input, sourceEditor) => {
        if (onFilePathChangeRef.current) {
          onFilePathChangeRef.current(input.resource.path.slice(1), {
            line: input.options?.selection?.startLineNumber,
            column: input.options?.selection?.startColumn,
          })
          sourceEditor.focus()
        }
      }

      saveViewState && editorRef.current.restoreViewState(viewStates.get(autoCreatedModelPath))

      monacoRef.current.editor.setTheme(theme)

      setIsEditorReady(true)
    }
  }, [
    defaultValue,
    defaultLanguage,
    defaultPath,
    value,
    language,
    path,
    options,
    overrideServices,
    saveViewState,
    theme,
  ])

  useEffect(() => {
    if (isEditorReady) {
      onMountRef.current(
        editorRef.current,
        monacoRef.current
      )
    }
  }, [isEditorReady])

  useEffect(() => {
    !isMonacoMounting && !isEditorReady && createEditor()
  }, [isMonacoMounting, isEditorReady, createEditor])

  // subscription
  // to avoid unnecessary updates (attach - dispose listener) in subscription
  valueRef.current = value

  // onChange
  useEffect(() => {
    if (isEditorReady && onChange) {
      subscriptionRef.current?.dispose()
      subscriptionRef.current = editorRef.current?.onDidChangeModelContent((event) => {
        onChange(editorRef.current.getValue(), event)
      })
    }
  }, [isEditorReady, onChange])

  // onValidate
  useEffect(() => {
    if (isEditorReady) {
      const changeMarkersListener = monacoRef.current.editor.onDidChangeMarkers((uris) => {
        const editorUri = editorRef.current.getModel()?.uri

        if (editorUri) {
          const currentEditorHasMarkerChanges = uris.find(uri => uri.path === editorUri.path)
          if (currentEditorHasMarkerChanges) {
            const markers = monacoRef.current.editor.getModelMarkers({resource: editorUri})
            onValidate?.(markers)
          }
        }
      })

      return () => {
        changeMarkersListener?.dispose()
      }
    }
  }, [isEditorReady, onValidate])

  function disposeEditor() {
    subscriptionRef.current?.dispose()

    if (keepCurrentModel) {
      saveViewState && viewStates.set(path, editorRef.current.saveViewState())
    } else {
      editorRef.current.getModel()?.dispose()
    }

    editorRef.current.dispose()
  }

  return (
    <MonacoContainer
      width={width}
      height={height}
      isEditorReady={isEditorReady}
      loading={loading}
      _ref={containerRef}
      className={className}
      wrapperProps={wrapperProps}
    />
  )
}

Editor.propTypes = {
  defaultValue: PropTypes.string,
  defaultPath: PropTypes.string,
  defaultLanguage: PropTypes.string,
  value: PropTypes.string,
  language: PropTypes.string,
  path: PropTypes.string,
  /* === */
  theme: PropTypes.string,
  position: PropTypes.object,
  loading: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  options: PropTypes.object,
  overrideServices: PropTypes.object,
  saveViewState: PropTypes.bool,
  keepCurrentModel: PropTypes.bool,
  /* === */
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  className: PropTypes.string,
  wrapperProps: PropTypes.object,
  /* === */
  beforeMount: PropTypes.func,
  onMount: PropTypes.func,
  onChange: PropTypes.func,
  onValidate: PropTypes.func,
  onFilePathChange: PropTypes.func,
}

Editor.defaultProps = {
  theme: 'light',
  loading: 'Loading...',
  options: {},
  overrideServices: {},
  saveViewState: true,
  keepCurrentModel: false,
  /* === */
  width: '100%',
  height: '100%',
  wrapperProps: {},
  /* === */
  beforeMount: noop,
  onMount: noop,
  onValidate: noop,
}

export default Editor
