import {Annotation, Range} from 'ace-builds/src-min-noconflict/ace'
import * as PropTypes from 'prop-types'
import * as React from 'react'

import ace from 'ace-builds/src-min-noconflict/ace'
// NOTE: these ace-builds urls are hard-coded to use the RawPlugin in fuse.js. To change this to
// webpack-style, this should be
// import jsWorkerUrl from 'file-loader!../../build/src/worker-javascript';

import jsWorker from 'ace-builds/src-min-noconflict/worker-javascript.js'

import htmlWorker from 'ace-builds/src-min-noconflict/worker-html.js'

import cssWorker from 'ace-builds/src-min-noconflict/worker-css.js'

import jsonWorker from 'ace-builds/src-min-noconflict/worker-json.js'

import xmlWorker from 'ace-builds/src-min-noconflict/worker-xml.js'
import isEqual from 'lodash/isEqual'

import expandUpSvg from '../../client/static/expandUp.svg'
import expandMiddleSvg from '../../client/static/expandMiddle.svg'
import expandDownSvg from '../../client/static/expandDown.svg'

import {
  debounce,
  editorEvents,
  editorOptions,
} from './editorOptions'

// NOTE(pawel) not all ace modules are included in this list; if you find that ace is trying to load
// a module from a URL (and xrhome server responds with the homepage) that means te module was never
// included in our bundle. included it below so that it will become part of the bundle
import 'ace-builds/src-min-noconflict/ace'
import 'ace-builds/src-min-noconflict/mode-css'
import 'ace-builds/src-min-noconflict/mode-html'
import 'ace-builds/src-min-noconflict/mode-javascript'
import 'ace-builds/src-min-noconflict/mode-json'
import 'ace-builds/src-min-noconflict/mode-jsx'
import 'ace-builds/src-min-noconflict/mode-scss'
import 'ace-builds/src-min-noconflict/mode-text'
import 'ace-builds/src-min-noconflict/mode-tsx'
import 'ace-builds/src-min-noconflict/mode-markdown'
import 'ace-builds/src-min-noconflict/mode-typescript'
import 'ace-builds/src-min-noconflict/ext-language_tools'
import 'ace-builds/src-min-noconflict/ext-searchbox'
import 'ace-builds/src-min-noconflict/ext-whitespace'
import './theme-dark8'
import './theme-light8'
import './mode-merge8'
import './mode-js8'
import 'ace-builds/src-min-noconflict/keybinding-vim'
import 'ace-builds/src-min-noconflict/keybinding-emacs'
import 'ace-builds/src-min-noconflict/keybinding-vscode'

import type {AceEditorClass} from './AceEditorClass'
import type {IAceOptions, ICommand, IEditorProps, IGutterDecoration, IMarker} from './types'

ace.config.setModuleUrl('ace/mode/javascript_worker',
  URL.createObjectURL(new Blob([jsWorker], {type: 'application/javascript'})))
ace.config.setModuleUrl('ace/mode/html_worker',
  URL.createObjectURL(new Blob([htmlWorker], {type: 'application/javascript'})))
ace.config.setModuleUrl('ace/mode/css_worker',
  URL.createObjectURL(new Blob([cssWorker], {type: 'application/javascript'})))
ace.config.setModuleUrl('ace/mode/json_worker',
  URL.createObjectURL(new Blob([jsonWorker], {type: 'application/javascript'})))
ace.config.setModuleUrl('ace/mode/xml_worker',
  URL.createObjectURL(new Blob([xmlWorker], {type: 'application/javascript'})))

/**
 * See https://github.com/ajaxorg/ace/wiki/Configuring-Ace
 */

export const fixTrailingNewLine = val => val.replace(/(\r?\n?)$/, '')

export interface IAceEditorProps {
  name?: string;
  style?: React.CSSProperties;
  mode?: string;
  theme?: string;
  height?: string;
  width?: string;
  className?: string;
  fontSize?: number | string;
  showGutter?: boolean;
  showPrintMargin?: boolean;
  highlightActiveLine?: boolean;
  focus?: boolean;
  cursorStart?: number;
  wrapEnabled?: boolean;
  readOnly?: boolean;
  minLines?: number;
  maxLines?: number;
  navigateToFileEnd?: boolean;
  debounceChangePeriod?: number;
  enableBasicAutocompletion?: boolean | string[];
  enableLiveAutocompletion?: boolean | string[];
  tabSize?: number;
  value?: string;
  placeholder?: string;
  defaultValue?: string;
  scrollMargin?: number[];
  enableSnippets?: boolean;
  onSelectionChange?: (value: any, event?: any) => void;
  onCursorChange?: (value: any, event?: any) => void;
  onInput?: (event?: any) => void;
  onLoad?: (editor: IEditorProps) => void;
  onValidate?: (annotations: Annotation[]) => void;
  onBeforeLoad?: (ace: any) => void;
  onChange?: (value: string, event?: any) => void;
  onSelection?: (selectedText: string, event?: any) => void;
  onCopy?: (value: string) => void;
  onPaste?: (value: string) => void;
  onFocus?: (event: any, editor?: AceEditorClass) => void;
  onBlur?: (event: any, editor?: AceEditorClass) => void;
  onScroll?: (editor: IEditorProps) => void;
  saveDirtyAndBuild?: (evt) => void;
  editorProps?: IEditorProps;
  setOptions?: IAceOptions;
  keyboardHandler?: string;
  commands?: ICommand[];
  annotations?: Annotation[];
  markers?: IMarker[];
  lintFile?: () => void;
  lineNumbers?: (number | string) [];       // overrides the line numbers in the gutter
  gutterDecorations?: IGutterDecoration[];  // set class for gutter row
  unfurl?: (number) => void;
}

export default class ReactAce extends React.Component<IAceEditorProps> {
  public static propTypes: PropTypes.ValidationMap<IAceEditorProps> = {
    mode: PropTypes.string,
    focus: PropTypes.bool,
    theme: PropTypes.string,
    name: PropTypes.string,
    className: PropTypes.string,
    height: PropTypes.string,
    width: PropTypes.string,
    fontSize: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    showGutter: PropTypes.bool,
    onChange: PropTypes.func,
    onCopy: PropTypes.func,
    onPaste: PropTypes.func,
    onFocus: PropTypes.func,
    onInput: PropTypes.func,
    onBlur: PropTypes.func,
    onScroll: PropTypes.func,
    saveDirtyAndBuild: PropTypes.func,
    value: PropTypes.string,
    defaultValue: PropTypes.string,
    onLoad: PropTypes.func,
    onSelectionChange: PropTypes.func,
    onCursorChange: PropTypes.func,
    onBeforeLoad: PropTypes.func,
    onValidate: PropTypes.func,
    minLines: PropTypes.number,
    maxLines: PropTypes.number,
    readOnly: PropTypes.bool,
    highlightActiveLine: PropTypes.bool,
    tabSize: PropTypes.number,
    showPrintMargin: PropTypes.bool,
    cursorStart: PropTypes.number,
    debounceChangePeriod: PropTypes.number,
    editorProps: PropTypes.object,
    setOptions: PropTypes.object,
    style: PropTypes.object,
    scrollMargin: PropTypes.array,
    annotations: PropTypes.array,
    markers: PropTypes.array,
    keyboardHandler: PropTypes.string,
    wrapEnabled: PropTypes.bool,
    enableSnippets: PropTypes.bool,
    enableBasicAutocompletion: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.array,
    ]),
    enableLiveAutocompletion: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.array,
    ]),
    navigateToFileEnd: PropTypes.bool,
    commands: PropTypes.array,
    placeholder: PropTypes.string,
  };

  public static defaultProps: Partial<IAceEditorProps> = {
    name: 'ace-editor',
    focus: false,
    mode: '',
    theme: '',
    height: '500px',
    width: '500px',
    value: '',
    fontSize: 12,
    enableSnippets: false,
    showGutter: true,
    onChange: null,
    onPaste: null,
    onLoad: null,
    onScroll: null,
    minLines: null,
    maxLines: null,
    readOnly: false,
    highlightActiveLine: true,
    showPrintMargin: true,
    tabSize: 4,
    cursorStart: 1,
    editorProps: {},
    style: {},
    scrollMargin: [0, 0, 0, 0],
    setOptions: {},
    wrapEnabled: false,
    enableBasicAutocompletion: false,
    enableLiveAutocompletion: false,
    placeholder: null,
    lintFile: null,
    navigateToFileEnd: true,
    lineNumbers: null,
  };

  public editor: AceEditorClass;

  public refEditor: HTMLElement;

  public debounce: (fn: any, delay: number) => (...args: any) => void;

  // [index: string]: any;
  public silent: boolean;

  constructor(props: IAceEditorProps) {
    super(props)
    editorEvents.forEach((method) => {
      this[method] = this[method].bind(this)
    })
    this.debounce = debounce
  }

  public componentDidMount() {
    const {
      className,
      onBeforeLoad,
      onValidate,
      mode,
      focus,
      theme,
      fontSize,
      value,
      defaultValue,
      cursorStart,
      showGutter,
      wrapEnabled,
      showPrintMargin,
      scrollMargin = [0, 0, 0, 0],
      keyboardHandler,
      saveDirtyAndBuild,
      onLoad,
      commands,
      annotations,
      markers,
      placeholder,
      lintFile,
      lineNumbers,
      gutterDecorations,
    } = this.props

    this.editor = ace.edit(this.refEditor)

    if (onBeforeLoad) {
      onBeforeLoad(ace)
    }

    const workerUrl = Build8.PLATFORM_TARGET === 'desktop'
      ? 'desktop-dist:worker/client/eslint-worker.js'
      : `/${Build8.DEPLOYMENT_PATH}/client/eslint-worker.js`
    ace.config.setModuleUrl('ace/mode/javascript_worker', workerUrl)

    const editorProps = Object.keys(this.props.editorProps)
    for (let i = 0; i < editorProps.length; i++) {
      this.editor[editorProps[i]] = this.props.editorProps[editorProps[i]]
    }
    if (this.props.debounceChangePeriod) {
      this.onChange = this.debounce(
        this.onChange,
        this.props.debounceChangePeriod
      )
    }
    this.editor.renderer.setScrollMargin(
      scrollMargin[0],
      scrollMargin[1],
      scrollMargin[2],
      scrollMargin[3]
    )
    this.editor.getSession().setMode(`ace/mode/${mode}`)
    this.editor.setTheme(`ace/theme/${theme}`)
    this.editor.setFontSize(fontSize)
    this.editor
      .getSession()
      .setValue(!defaultValue ? fixTrailingNewLine(value) : defaultValue, cursorStart)
    if (this.props.navigateToFileEnd) {
      this.editor.navigateFileEnd()
    }
    this.editor.setOption('fixedWidthGutter', true)
    this.editor.renderer.setShowGutter(showGutter)
    this.editor.getSession().setUseWrapMode(wrapEnabled)
    this.editor.setShowPrintMargin(showPrintMargin)
    this.editor.on('focus', this.onFocus)
    this.editor.on('blur', this.onBlur)
    this.editor.on('copy', this.onCopy)
    this.editor.on('paste', this.onPaste)
    this.editor.on('change', this.onChange)
    this.editor.on('input', this.onInput)
    if (placeholder) {
      this.updatePlaceholder()
    }
    this.editor
      .getSession()
      .selection.on('changeSelection', this.onSelectionChange)
    this.editor.getSession().selection.on('changeCursor', this.onCursorChange)
    if (onValidate) {
      this.editor.getSession().on('changeAnnotation', () => {
        // tslint:disable-next-line:no-shadowed-variable
        const annotations = this.editor.getSession().getAnnotations()
        this.props.onValidate(annotations)
      })
    }
    this.editor.session.on('changeScrollTop', this.onScroll)
    this.editor.session.on('changeScrollLeft', this.onScroll)
    this.editor.getSession().setAnnotations(annotations || [])
    if (markers && markers.length > 0) {
      this.handleMarkers(markers)
    }

    if (gutterDecorations && gutterDecorations.length > 0) {
      this.handleGutterDecorations(null)
    }
    this.editor.renderer.on('afterRender', this.refreshLineNumbers)

    // get a list of possible options to avoid 'misspelled option errors'
    const availableOptions = this.editor.$options
    editorOptions.forEach((option) => {
      if (availableOptions.hasOwnProperty(option)) {
        this.editor.setOption(option, this.props[option])
      } else if (this.props[option]) {
        console.warn(
          `ReactAce: editor option ${option} was activated but not found. Did you need to import a related tool or did you possibly mispell the option?`
        )
      }
    })

    this.handleOptions(this.props)

    if (Array.isArray(commands)) {
      commands.forEach((command) => {
        if (typeof command.exec === 'string') {
          this.editor.commands.bindKey(command.bindKey, command.exec)
        } else {
          this.editor.commands.addCommand(command)
        }
      })
    }

    this.editor.commands.addCommand({
      name: 'linting',
      bindKey: {
        win: 'Alt-Shift-F',
        mac: 'Option-Shift-F',
      },
      exec: () => {
        lintFile()
      },
    })

    this.editor.getSession().getDocument().setNewLineMode('unix')

    if (keyboardHandler) {
      this.editor.setKeyboardHandler(`ace/keyboard/${keyboardHandler}`)
      ace.config.loadModule('ace/keyboard/vim', (module) => {
        const VimApi = module.CodeMirror.Vim
        VimApi.defineEx('write', 'w', (cm, input) => {
          saveDirtyAndBuild()
        })
      })
    }

    if (className) {
      this.refEditor.className += ` ${className}`
    }

    if (onLoad) {
      onLoad(this.editor)
    }

    this.editor.resize()

    if (focus) {
      this.editor.focus()
    }

    // Load svg icons HTML texts
    const expandUpImg = document.createElement('img')
    expandUpImg.src = expandUpSvg
    const expandUpImgTmp = document.createElement('div')
    expandUpImgTmp.appendChild(expandUpImg)
    this.editor.expandUpImgHTML = expandUpImgTmp.innerHTML

    const expandMiddleImg = document.createElement('img')
    expandMiddleImg.src = expandMiddleSvg
    const expandMiddleImgTmp = document.createElement('div')
    expandMiddleImgTmp.appendChild(expandMiddleImg)
    this.editor.expandMiddleImgHTML = expandMiddleImgTmp.innerHTML

    const expandDownImg = document.createElement('img')
    expandDownImg.src = expandDownSvg
    const expandDownImgTmp = document.createElement('div')
    expandDownImgTmp.appendChild(expandDownImg)
    this.editor.expandDownImgHTML = expandDownImgTmp.innerHTML
  }

  public componentDidUpdate(prevProps: IAceEditorProps) {
    const oldProps = prevProps
    const nextProps = this.props

    for (let i = 0; i < editorOptions.length; i++) {
      const option = editorOptions[i]
      if (nextProps[option] !== oldProps[option]) {
        this.editor.setOption(option, nextProps[option])
      }
    }

    if (nextProps.className !== oldProps.className) {
      const appliedClasses = this.refEditor.className
      const appliedClassesArray = appliedClasses.trim().split(' ')
      const oldClassesArray = oldProps.className.trim().split(' ')
      oldClassesArray.forEach((oldClass) => {
        const index = appliedClassesArray.indexOf(oldClass)
        appliedClassesArray.splice(index, 1)
      })
      this.refEditor.className =
        ` ${nextProps.className} ${appliedClassesArray.join(' ')}`
    }
    const nextValue = fixTrailingNewLine(nextProps.value)
    // First process editor value, as it may create a new session (see issue #300)
    if (this.editor && this.editor.getValue() !== nextValue) {
      // editor.setValue is a synchronous function call, change event is emitted before setValue return.
      this.silent = true
      const pos = this.editor.session.selection.toJSON()
      this.editor.setValue(nextValue, nextProps.cursorStart)
      this.editor.session.selection.fromJSON(pos)
      this.silent = false
    }

    if (nextProps.placeholder !== oldProps.placeholder) {
      this.updatePlaceholder()
    }
    if (nextProps.mode !== oldProps.mode) {
      this.editor.getSession().setMode(`ace/mode/${nextProps.mode}`)
    }
    if (nextProps.theme !== oldProps.theme) {
      this.editor.setTheme(`ace/theme/${nextProps.theme}`)
    }
    if (nextProps.keyboardHandler !== oldProps.keyboardHandler) {
      if (nextProps.keyboardHandler) {
        this.editor.setKeyboardHandler(
          `ace/keyboard/${nextProps.keyboardHandler}`
        )
      } else {
        this.editor.setKeyboardHandler(null)
      }
    }
    if (nextProps.fontSize !== oldProps.fontSize) {
      this.editor.setFontSize(nextProps.fontSize)
    }
    if (nextProps.wrapEnabled !== oldProps.wrapEnabled) {
      this.editor.getSession().setUseWrapMode(nextProps.wrapEnabled)
    }
    if (nextProps.showPrintMargin !== oldProps.showPrintMargin) {
      this.editor.setShowPrintMargin(nextProps.showPrintMargin)
    }
    if (nextProps.showGutter !== oldProps.showGutter) {
      this.editor.renderer.setShowGutter(nextProps.showGutter)
    }
    if (!isEqual(nextProps.setOptions, oldProps.setOptions)) {
      this.handleOptions(nextProps)
    }
    if (!isEqual(nextProps.annotations, oldProps.annotations)) {
      this.editor.getSession().setAnnotations(nextProps.annotations || [])
    }
    if (
      !isEqual(nextProps.markers, oldProps.markers) &&
      Array.isArray(nextProps.markers)
    ) {
      this.handleMarkers(nextProps.markers)
    }

    // this doesn't look like it works at all....
    if (!isEqual(nextProps.scrollMargin, oldProps.scrollMargin)) {
      this.handleScrollMargins(nextProps.scrollMargin)
    }

    if (
      prevProps.height !== this.props.height ||
      prevProps.width !== this.props.width
    ) {
      this.editor.resize()
    }
    if (this.props.focus && !prevProps.focus) {
      this.editor.focus()
    }

    if (!isEqual(this.props.lineNumbers, prevProps.lineNumbers)) {
      this.refreshLineNumbers()
    }

    if (!isEqual(this.props.gutterDecorations, prevProps.gutterDecorations)) {
      this.handleGutterDecorations(prevProps.gutterDecorations)
    }
  }

  public handleScrollMargins(margins = [0, 0, 0, 0]) {
    this.editor.renderer.setScrollMargins(
      margins[0],
      margins[1],
      margins[2],
      margins[3]
    )
  }

  public componentWillUnmount() {
    this.editor.destroy()
    this.editor = null
  }

  public onChange(event: any) {
    if (this.props.onChange && !this.silent) {
      // When a new line is inserted, if the previous line is all whitespace,
      // we want to delete that whitespace.
      if (event.action === 'insert' && event.lines.length >= 2) {
        const startRow = event.start.row
        const lineBefore = this.editor.getSession().getLine(startRow)
        if (lineBefore.match(/^\s*$/)) {
          // Need to allow the cursor to be updated first before removing the whitespace
          setTimeout(() => {
            this.editor?.getSession().getDocument().removeInLine(startRow, 0, lineBefore.length)
          }, 0)
        }
      }

      const match = this.editor.getValue().match(/^.*?(\r\n|\r|\n)/m)
      let newLine = match ? match[1] : '\n'
      if (this.editor.getSession().doc.getNewLineCharacter) {
        newLine = (this.editor.getSession().doc.getNewLineCharacter())
      }
      const value = this.editor.getValue().concat(newLine)
      this.props.onChange(value, event)
    }
  }

  public onSelectionChange(event: any) {
    if (this.props.onSelectionChange) {
      const value = this.editor.getSelection()
      this.props.onSelectionChange(value, event)
    }
  }

  public onCursorChange(event: any) {
    if (this.props.onCursorChange) {
      const value = this.editor.getSelection()
      this.props.onCursorChange(value, event)
    }
  }

  public onInput(event: any) {
    if (this.props.onInput) {
      this.props.onInput(event)
    }
    if (this.props.placeholder) {
      this.updatePlaceholder()
    }
  }

  public onFocus(event: any) {
    if (this.props.onFocus) {
      this.props.onFocus(event, this.editor)
    }
  }

  public onBlur(event: any) {
    if (this.props.onBlur) {
      this.props.onBlur(event, this.editor)
    }
  }

  public onCopy(text: string) {
    if (this.props.onCopy) {
      this.props.onCopy(text)
    }
  }

  public onPaste(text: string) {
    if (this.props.onPaste) {
      this.props.onPaste(text)
    }
  }

  public onScroll() {
    if (this.props.onScroll) {
      this.props.onScroll(this.editor)
    }
  }

  public handleOptions(props: IAceEditorProps) {
    const setOptions = Object.keys(props.setOptions)
    for (let y = 0; y < setOptions.length; y++) {
      this.editor.setOption(setOptions[y], props.setOptions[setOptions[y]])
    }
  }

  public handleMarkers(markers: IMarker[]) {
    // remove foreground markers
    let currentMarkers = this.editor.getSession().getMarkers(true)
    for (const i in currentMarkers) {
      if (currentMarkers.hasOwnProperty(i)) {
        this.editor.getSession().removeMarker(currentMarkers[i].id)
      }
    }
    // remove background markers except active line marker and selected word marker
    currentMarkers = this.editor.getSession().getMarkers(false)
    for (const i in currentMarkers) {
      if (
        currentMarkers.hasOwnProperty(i) &&
        currentMarkers[i].clazz !== 'ace_active-line' &&
        currentMarkers[i].clazz !== 'ace_selected-word'
      ) {
        this.editor.getSession().removeMarker(currentMarkers[i].id)
      }
    }
    // add new markers
    markers.forEach(
      ({
        startRow,
        startCol,
        endRow,
        endCol,
        className,
        type,
        inFront = false,
      }) => {
        const range = new Range(startRow, startCol, endRow, endCol)
        this.editor.getSession().addMarker(range, className, type, inFront)
      }
    )
  }

  // prevGutterDecorations come from prevProps
  public handleGutterDecorations(prevGutterDecorations: IGutterDecoration[]) {
    const session = this.editor.getSession()
    if (prevGutterDecorations) {
      prevGutterDecorations.forEach((decoration) => {
        session.removeGutterDecoration(decoration.row, decoration.className)
      })
    }
    if (this.props.gutterDecorations) {
      this.props.gutterDecorations.forEach((decoration) => {
        session.addGutterDecoration(decoration.row, decoration.className)
      })
    }
  }

  public updatePlaceholder() {
    // Adapted from https://stackoverflow.com/questions/26695708/how-can-i-add-placeholder-text-when-the-editor-is-empty

    const {editor} = this
    const {placeholder} = this.props

    const showPlaceholder = !editor.session.getValue().length
    let node = editor.renderer.placeholderNode
    if (!showPlaceholder && node) {
      editor.renderer.scroller.removeChild(editor.renderer.placeholderNode)
      editor.renderer.placeholderNode = null
    } else if (showPlaceholder && !node) {
      node = editor.renderer.placeholderNode = document.createElement('div')
      node.textContent = placeholder || ''
      node.className = 'ace_comment ace_placeholder'
      node.style.padding = '0 9px'
      node.style.position = 'absolute'
      node.style.zIndex = '3'
      editor.renderer.scroller.appendChild(node)
    } else if (showPlaceholder && node) {
      node.textContent = placeholder
    }
  }

  public updateRef(item: HTMLElement) {
    this.refEditor = item
  }

  public refreshLineNumbers = () => {
    // this.editor.renderer is the VirtualRenderer; this.refEditor is the DOM editor div element
    const visibleLines = this.editor.renderer.$textLayer.$lines.cells.map(({row}) => row)
    const gutterElements = [...this.refEditor.children]
      .find(c => [...c.classList].includes('ace_gutter')).children[0].children
    const aceContentElement = [...this.refEditor.children]
      .find(c => [...c.classList].includes('ace_scroller')).children[0]
    const markerElements = [...aceContentElement.children].reverse()
      .find(c => [...c.classList].includes('ace_marker-layer')).children
    const furledMarkerElements = [...markerElements]
      .filter(c => [...c.classList].includes('furled'))
    const firstVisibleRow = this.editor.renderer.getFirstVisibleRow()
    const {lineNumbers, unfurl} = this.props

    // Set gutter width based on the last line number (widest)
    if (lineNumbers?.length) {
      for (let i = lineNumbers.length - 1; i >= 0; i--) {
        // exclude empty lineNumber (modification and deletion) and furled rows
        if (lineNumbers[i] && !lineNumbers[i].toString().includes('-')) {
          const innfoString = lineNumbers[i].toString()
          const gutterWidth =
            innfoString.length * this.editor.renderer.characterWidth + 19 + 6  // paddings
          const gutter = [...this.refEditor.children]
            .find(c => [...c.classList].includes('ace_gutter'))
          gutter.style.width = `${gutterWidth}px`
          gutter.children[0].style.width = `${gutterWidth}px`
          const scroller = [...this.refEditor.children]
            .find(c => [...c.classList].includes('ace_scroller'))
          scroller.style.left = `${gutterWidth}px`
          break
        }
      }
    }

    const makeGutterClickHandler = (lineNumber: string, index: number) => (e) => {
      // Unfurl furled rows
      if (unfurl) {
        unfurl(index)
      }

      const shouldFormat = this.props.lintFile &&
        ['ace_warning', 'ace_error'].some(c => e.target.classList.contains(c))
      if (shouldFormat) {
        this.props.lintFile()
        return
      }
      window.location.hash = lineNumber ? `L${lineNumber}` : ''
    }

    const makeMarkerClickHandler = (index: number) => () => {
      // Unfurl furled rows
      if (unfurl) {
        unfurl(index)
      }
    }

    const makeMutualHighlight = (element1, element2) => {  // Highlight the whole furled row
      element1.addEventListener('mouseover', () => element2.classList.add('furled-highlight'))
      element1.addEventListener('mouseout', () => element2.classList.remove('furled-highlight'))
      element2.addEventListener('mouseover', () => element1.classList.add('furled-highlight'))
      element2.addEventListener('mouseout', () => element1.classList.remove('furled-highlight'))
    }

    let furledIndex = 0
    for (let i = 0; i < gutterElements.length; i += 1) {
      const visibleLineNumber = visibleLines[i]

      if (lineNumbers && lineNumbers.length > 0) {
        const lineNumber = `${lineNumbers[firstVisibleRow + i] || ''}`
        if ([...gutterElements[i].classList].includes('furled')) {
          let expandImgHTML = ''
          if (i === 0) {
            expandImgHTML = this.editor.expandUpImgHTML
          } else if (i === gutterElements.length - 1) {
            expandImgHTML = this.editor.expandDownImgHTML
          } else {
            expandImgHTML = this.editor.expandMiddleImgHTML
          }

          gutterElements[i].innerHTML = expandImgHTML
          gutterElements[i].onclick = makeGutterClickHandler(lineNumber, firstVisibleRow + i)
          if (furledMarkerElements && furledIndex < furledMarkerElements.length) {
            furledMarkerElements[furledIndex].textContent = lineNumber
            furledMarkerElements[furledIndex].onclick = makeMarkerClickHandler(firstVisibleRow + i)
            makeMutualHighlight(gutterElements[i], furledMarkerElements[furledIndex])
            furledIndex++
          }
        } else {
          gutterElements[i].textContent = lineNumber
        }
      } else {
        gutterElements[i].firstChild.textContent = `${visibleLineNumber + 1}`
        gutterElements[i].onclick = makeGutterClickHandler(visibleLineNumber + 1, null)
      }
    }
  }

  public render() {
    const {name, width, height, style} = this.props
    const divStyle = {width, height, ...style}
    return <div ref={this.updateRef} id={name} style={divStyle} />
  }
}
