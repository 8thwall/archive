import React, {useEffect, useRef} from 'react'
import type {Editor} from 'ace-builds/src-min-noconflict/ace'

import {NEW_TAB_PATH, aceSessionKey} from '../../client/editor/editor-utils'
import {applyOptions} from '../../client/editor/ace-options'
import {fileNameToEditorMode} from '../../client/editor/editor-common'
import {useTextEditorContext} from '../../client/editor/texteditor/texteditor-context'

/**
 * This is an improvement over the previous.
 * On every render we get updated path and content.
 * When the path changes we know there's a new session.
 * When the content changes we know to update the session?
 * \--> There is a race condition between saving and the
 * user making additional changes. When save completes the
 * content will change, but we don't want to obliterate additional
 * edits.
 *
 * The way this hook is used is a curious case because the ace
 * editor itself may come and go depending on whether the parent
 * component wishes to render it or not. We therefore have to anticipate
 * a few case.
 *
 * 1. the parent component just got mounted and there is no ace editor yet
 * -- the active file may be an editor file
 * -- the active file may not be an editor file (e.g. asset file)
 *
 * 2. active file changed
 * -- editor file -> non-editor file
 * -- editor file -> editor file
 * -- non-editor file -> editor file
 * -- non-editor file -> non-editor file
 *
 * ++ in the first two cases ace editor is already mounted
 * ++ in the last two it is not yet mounted
 *
 * 3. is manual content updates something we ever have to worry about?
 * -- The parent component directly controls the input to the AceEditor,
 *    so it is responsible for updating session contents on things like
 *    client change.
 *
 * content param is only necessary when creating a new session.
 */

interface UseAceSessionRetention {
  aceRef: React.MutableRefObject<Editor>  // Ref to the ace editor.
  activePath: string  // The current path that is being edited.
  content: string  // Content to set the session to on changing the active path.
}

const useAceSessionRetention = ({
  aceRef, activePath, content,
}: UseAceSessionRetention) => {
  // There is one ace editor inside the TabbedEditor component.
  // We can swap edit sessions and these correlate to tabs.
  // A Document is the underlying thing a session edits.
  // Multiple sessions can point to the same document.
  // When we implement multi-pane views and editing the same file,
  // we'll need to figure out how to share these documents across aces.

  // This ref stores the latest session that we've applied to the editor
  const sessionPathRef = useRef<string>(null)
  // Edit sessions keyed by aceSessionKey(filepath).
  const {aceEditSessions: editSessions} = useTextEditorContext()

  const needsAceFocus = useRef(false)

  const setEditSession = (path: string) => {
    const {editor} = aceRef.current
    const newSessionKey = aceSessionKey(path)
    if (!editSessions[newSessionKey]) {
      // NOTE(christoph): EditSession takes either SyntaxMode or string but this isn't reflected
      // in the types.
      // https://github.com/ajaxorg/ace/blob/master/src/edit_session.js#L798
      const editMode: any = `ace/mode/${fileNameToEditorMode(path)}`
      const contentToUse = path === NEW_TAB_PATH ? '' : content
      editor.setSession(window.ace.createEditSession(contentToUse, editMode))
      editSessions[newSessionKey] = editor.getSession()
    }
    editor.setSession(editSessions[newSessionKey])
  }

  useEffect(() => () => {
    // When unmounting, we need to set a dummy state.
    if (!aceRef.current) {
      return
    }
    setEditSession(NEW_TAB_PATH)
  }, [])

  const changeEditSession = (isLateUpdate: boolean) => {
    if (!aceRef.current) {
      return
    }

    if (activePath === sessionPathRef.current) {
      return
    }
    sessionPathRef.current = activePath

    // NOTE(pawel) When ace is unmounted, onDestroy will corrupt this edit session
    // by deleting its bgTokenizer. We set the session to something we don't care
    // about so ace is free to corrupt it without breaking our real edit sessions.
    // This assumes that ace editor is unmounted only after the activePath is changed
    // and this hook is run. If the parent is unmounted and remounted then we get
    // a new "instance" of this hook and that is okay since we get fresh edit sessions.
    setEditSession(activePath)
    applyOptions(aceRef.current.editor, activePath)
    if (isLateUpdate) {
      aceRef.current?.editor.resize()
      aceRef.current?.editor.focus()
    } else {
      needsAceFocus.current = true
    }
  }

  changeEditSession(false)

  // We can't request ace focus in a render, so we do it in an effect.
  useEffect(() => {
    if (needsAceFocus.current) {
      aceRef.current?.editor.resize()
      aceRef.current?.editor.focus()
    }
    needsAceFocus.current = false
  })

  // Use this ref function instead of the aceRef passed into this hook so that
  // late updates can be handled.
  const updateAceRef = (ref) => {
    aceRef.current = ref
    changeEditSession(true)
  }

  return {
    updateAceRef,
  }
}

export {
  useAceSessionRetention,
}
