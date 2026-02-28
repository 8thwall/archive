/* eslint-disable no-bitwise */
// This finds assets and transforms their contents
import type {DeepReadonly} from 'ts-essentials'

import {G8DiffLineOrigin, IDiffLine, IG8FileDiff, IG8FileInfoStatus, IMergeHunk} from './g8-dto'
import type {IGutterDecoration, IMarker} from '../../third_party/react-ace/types'
import {isDependencyPath, isLandablePath} from '../common/editor-files'

interface IDiffViewPane {
  diffViewData: DiffViewLineInfo[]
  markers: IMarker[]
  gutterDecorations: IGutterDecoration[]
}

type Decorations = [IMarker[], IGutterDecoration[]]

type MergeMarker = {start: number, theirs: number, yours: number, end: number}
const ORIGINAL_MARKER = '>>>> ORIGINAL'
const THEIRS_MARKER = '==== THEIRS'
const YOURS_MARKER = '==== YOURS'
const END_MARKER = '<<<<'

const removeIgnoredAssets =
(diffList: DeepReadonly<IG8FileDiff[]>) => diffList.filter(
  d => isLandablePath(d.info.path)
)

const removeDependencies = (diffList: DeepReadonly<IG8FileDiff[]>) => diffList.filter(
  d => !isDependencyPath(d.info.path)
)

const keepDependencies = (diffList: DeepReadonly<IG8FileDiff[]>) => diffList.filter(
  d => isDependencyPath(d.info.path)
)

const transformAssets = (diffList: DeepReadonly<IG8FileDiff[]>) => {
  const res: DeepReadonly<IG8FileDiff>[] = []
  diffList.forEach((diff) => {
    if (diff.info.path.split('/')[0] === 'assets') {
      // do shady stuff
      res.push({
        info: {
          ...diff.info,
          blobId: `${diff.info.status}`,
        },
        lines: [
          {
            origin: G8DiffLineOrigin.BINARY,
            content: '',
            baseLineNumber: -1,
            newLineNumber: 1,
          },
        ],
      })
    } else {
      res.push(diff)
    }
  })
  return res
}

const transformBlobContents = blobContents => ({
  ...blobContents,
  [IG8FileInfoStatus.ADDED]: 'Asset File Added',
  [IG8FileInfoStatus.MODIFIED]: 'Asset File Changed',
  [IG8FileInfoStatus.DELETED]: 'Asset File Deleted',
})

interface DiffViewLineInfo {
  // this structure's position in the array dictates its physical location in the buffer
  lineNumber: number | string
  content: string
  marker: 'none' | 'addition' | 'deletion' | 'modification' | 'furled'
}

const getMarkerForBinaryContent = (content) => {
  if (/Added/.test(content)) {
    return 'addition'
  } else if (/Deleted/.test(content)) {
    return 'deletion'
  }
  return 'modification'
}

const generateUnifiedDiff = (contentB: string, diffLines: DeepReadonly<IDiffLine[]>) => {
  const contentBLines = contentB ? contentB.split('\n') : []
  const diffViewData: DiffViewLineInfo[] = []

  let idxDiff = 0  // index of entry in the diffInfo
  let currentChangeLine = 1  // line number in contentB
  let lastContextLine = -1
  let done = false

  while (!done) {
    const diffLine = diffLines[idxDiff]

    if (diffLine) {
      const currentDiffLine = diffLine.newLineNumber

      // eslint-disable-next-line default-case
      switch (diffLine.origin) {
        case G8DiffLineOrigin.CONTEXT: {
          // context line matches current line in the file;
          // advance diff and contentB
          lastContextLine = currentDiffLine
          if (currentDiffLine === currentChangeLine) {
            diffViewData.push({
              lineNumber: currentChangeLine,
              content: contentBLines[currentChangeLine - 1],
              marker: 'none',
            })
            idxDiff++
            currentChangeLine++
            // eslint-disable-next-line no-continue
            continue  // outer loop
          }
          break  // from switch
        }
        case G8DiffLineOrigin.ADDITION: {
          if (currentDiffLine === currentChangeLine) {
            diffViewData.push({
              lineNumber: currentChangeLine,
              content: contentBLines[currentChangeLine - 1],
              marker: 'addition',
            })
            idxDiff++
            currentChangeLine++
            // eslint-disable-next-line no-continue
            continue
          }
          break
        }
        case G8DiffLineOrigin.DELETION: {
          if (lastContextLine === currentChangeLine - 1 || lastContextLine === -1) {
            diffViewData.push({
              lineNumber: ' ',
              content: diffLine.content.replace(/\n/, ''),
              marker: 'deletion',
            })
            idxDiff++
            // eslint-disable-next-line no-continue
            continue
          }
          break
        }
        // TODO(pawel) consider how to display this information to the user
        case G8DiffLineOrigin.ADD_EOFNL:
        case G8DiffLineOrigin.DEL_EOFNL: {
          idxDiff++
          // eslint-disable-next-line no-continue
          continue
        }
        case G8DiffLineOrigin.BINARY: {
          const content = contentBLines[0]
          diffViewData.push({
            lineNumber: ' ',
            content,
            marker: getMarkerForBinaryContent(content),
          })
          idxDiff++
          currentChangeLine++
          // eslint-disable-next-line no-continue
          continue
        }
      }
    }

    if (currentChangeLine > contentBLines.length) {
      done = true
      break
    }

    diffViewData.push({
      lineNumber: currentChangeLine,
      content: contentBLines[currentChangeLine - 1],
      marker: 'none',
    })
    currentChangeLine++
  }

  const markers = []
  const gutterDecorations: IGutterDecoration[] = []

  for (let i = 0; i < diffViewData.length; i++) {
    if (diffViewData[i].marker !== 'none') {
      markers.push({
        startRow: i,
        endRow: i + 1,
        type: 'screenLine',
        className: `codeMarker ${diffViewData[i].marker}`,
      })
      gutterDecorations.push({
        row: i,
        className: `codeMarker ${diffViewData[i].marker}`,
      })
    }
  }

  // counting changes: a single change is bounded by non -1 on both new/old lines;
  // counting boundaries should be enough
  let prevNewLine = 0
  let prevBaseLineNumber = 0
  let changeCount = 0
  for (let i = 0; i < diffLines.length; i++) {
    const {newLineNumber, baseLineNumber} = diffLines[i]
    const noChangePreviousLine = prevNewLine >= 0 && prevBaseLineNumber >= 0
    const noChangeCurrentLine = newLineNumber >= 0 && baseLineNumber >= 0
    const currentLineChanged = !noChangeCurrentLine
    if (noChangePreviousLine && currentLineChanged) {
      changeCount++
    }
    prevNewLine = newLineNumber
    prevBaseLineNumber = baseLineNumber
  }

  return {diffViewData, markers, gutterDecorations, changeCount}
}

const generateSplitDiff = (
  contentA: string, contentB: string, diffLines: DeepReadonly<IDiffLine[]>
): IDiffViewPane[] => {
  const contentALines = contentA ? contentA.split('\n') : []
  const contentBLines = contentB ? contentB.split('\n') : []
  const diffViewDataA: DiffViewLineInfo[] = []
  const diffViewDataB: DiffViewLineInfo[] = []

  let idxDiff = 0
  let currentChangeLineA = 1  // line number in contentA
  let currentChangeLineB = 1  // line number in contentB
  let lastContextLineA = -1
  let lastContextLineB = -1
  let done = false

  while (!done) {
    const diffLine = diffLines[idxDiff]

    if (diffLine) {
      const currentDiffLineA = diffLine.baseLineNumber
      const currentDiffLineB = diffLine.newLineNumber
      // eslint-disable-next-line default-case
      switch (diffLine.origin) {
        case G8DiffLineOrigin.CONTEXT: {
          // context line numbers for new and old are non -1
          // make sure both sides are lined up; advance whoever isn't
          while (diffViewDataA.length < diffViewDataB.length) {
            diffViewDataA.push({
              lineNumber: '',
              content: '',
              marker: 'none',
            })
          }
          while (diffViewDataB.length < diffViewDataA.length) {
            diffViewDataB.push({
              lineNumber: '',
              content: '',
              marker: 'none',
            })
          }

          // advance the diff and output on both sides
          lastContextLineA = currentDiffLineA
          lastContextLineB = currentDiffLineB
          if (currentDiffLineA === currentChangeLineA && currentDiffLineB === currentChangeLineB) {
            diffViewDataA.push({
              lineNumber: currentChangeLineA,
              content: contentALines[currentChangeLineA - 1],
              marker: 'none',
            })
            diffViewDataB.push({
              lineNumber: currentChangeLineB,
              content: contentBLines[currentChangeLineB - 1],
              marker: 'none',
            })
            idxDiff++
            currentChangeLineA++
            currentChangeLineB++
            // eslint-disable-next-line no-continue
            continue  // head to outer loop
          }
          break
        }
        case G8DiffLineOrigin.ADDITION: {
          // the A side is the old side, we emit empty line here
          // side B is new side and so emit green lines here
          if (currentDiffLineB === currentChangeLineB) {
            diffViewDataB.push({
              lineNumber: currentChangeLineB,
              content: contentBLines[currentChangeLineB - 1],
              marker: 'addition',
            })
            idxDiff++
            currentChangeLineB++
            // eslint-disable-next-line no-continue
            continue
          }
          break
        }
        case G8DiffLineOrigin.DELETION: {
          // side A, older version, should mark these as deleted and new side shows these as blank
          // the context handler will do the catching up for side B
          if (currentDiffLineA === currentChangeLineA) {
            diffViewDataA.push({
              lineNumber: currentChangeLineA,
              content: contentALines[currentChangeLineA - 1],
              marker: 'deletion',
            })
            idxDiff++
            currentChangeLineA++
            // eslint-disable-next-line no-continue
            continue
          }
          break
        }
        // TODO(pawel) consider how to display this information to the user
        case G8DiffLineOrigin.ADD_EOFNL:
        case G8DiffLineOrigin.DEL_EOFNL: {
          idxDiff++
          // eslint-disable-next-line no-continue
          continue
        }
        case G8DiffLineOrigin.BINARY: {
          const contentA = contentALines[0] || 'Binary File'
          const contentB = contentBLines[0] || 'Binary File'
          diffViewDataA.push({
            lineNumber: ' ',
            content: contentA,
            marker: getMarkerForBinaryContent(contentA),
          })
          diffViewDataB.push({
            lineNumber: ' ',
            content: contentB,
            marker: getMarkerForBinaryContent(contentB),
          })
          idxDiff++
          currentChangeLineA++
          currentChangeLineB++
          // eslint-disable-next-line no-continue
          continue
        }
      }
    }

    if (currentChangeLineA > contentALines.length && currentChangeLineB > contentBLines.length) {
      done = true
      break
    }

    if (currentChangeLineA <= contentALines.length) {
      diffViewDataA.push({
        lineNumber: currentChangeLineA,
        content: contentALines[currentChangeLineA - 1],
        marker: 'none',
      })
      currentChangeLineA++
    }

    if (currentChangeLineB <= contentBLines.length) {
      diffViewDataB.push({
        lineNumber: currentChangeLineB,
        content: contentBLines[currentChangeLineB - 1],
        marker: 'none',
      })
      currentChangeLineB++
    }
  }  // end diffing loop

  // Now that both files are written, add empty lines to the shorter one so scrolling can be synchronized
  while (diffViewDataA.length < diffViewDataB.length) {
    diffViewDataA.push({
      lineNumber: ' ',
      content: '',
      marker: 'none',
    })
  }

  while (diffViewDataB.length < diffViewDataA.length) {
    diffViewDataB.push({
      lineNumber: '',
      content: '',
      marker: 'none',
    })
  }

  enum Side {
    A = 0,
    B = 1,
  }

  const splitMarkers = [[], []]
  const gutterDecorations: IGutterDecoration[][] = [[], []]
  const diffViewData: DiffViewLineInfo[][] = [diffViewDataA, diffViewDataB]

  for (let side = 0; side < 2; side++) {
    for (let j = 0; j < diffViewData[side].length; j++) {
      if (diffViewData[side][j].marker !== 'none') {
        splitMarkers[side].push({
          startRow: j,
          endRow: j + 1,
          type: 'screenLine',
          className: `codeMarker ${diffViewData[side][j].marker}`,
        })
        gutterDecorations[side].push({
          row: j,
          className: `codeMarker ${diffViewData[side][j].marker}`,
        })
      }
    }
  }

  return [
    {diffViewData: diffViewData[Side.A], markers: splitMarkers[Side.A], gutterDecorations: gutterDecorations[Side.A]},
    {diffViewData: diffViewData[Side.B], markers: splitMarkers[Side.B], gutterDecorations: gutterDecorations[Side.B]},
  ]
}

enum MergeLineType {
  CONTEXT = 1 << 0,
  ORIGINAL = 1 << 1,
  THEIRS = 1 << 2,
  YOURS = 1 << 3,
  MARKER = 1 << 4,
  FOOTER = 1 << 5,
  MARKER_ORIGINAL = MARKER | ORIGINAL,
  MARKER_THEIRS = MARKER | THEIRS,
  MARKER_YOURS = MARKER | YOURS,
  MARKER_FOOTER = MARKER | FOOTER,
}

const isLineType = (testType: MergeLineType) => (lineType: MergeLineType): boolean => (
  (lineType & testType) === testType
)
const isExactLineType = (testType: MergeLineType) => (lineType: MergeLineType): boolean => (
  lineType === testType
)

const hasMarker = isLineType(MergeLineType.MARKER)
const stripMarkerStatus = (type: MergeLineType) => type & ~MergeLineType.MARKER

const lineCount = (content: string) => {
  let newLines = 1
  for (let i = 0; i < content.length; i++) {
    if (content[i] === '\n') {
      newLines++
    }
  }
  return newLines
}

// given a list of hunks and the number of lines in the file, return an array describing what
// each line is
// NOTE(pawel) not including trailing context lines as we don't have this info
// optionally provide the number of lines and these will be appended as CONTEXT lines
const decodeMergeHunks = (
  hunks: IMergeHunk[], totalNumberOfLines: number = -1
): MergeLineType[] => {
  let lineNumber = 1
  const res: MergeLineType[] = []
  hunks.forEach(({original, theirs, yours}) => {
    // context lines before the conflict
    while (lineNumber++ < original.start) {
      res.push(MergeLineType.CONTEXT)
    }
    // original header
    res.push(MergeLineType.MARKER_ORIGINAL)

    // original content
    while (lineNumber++ <= original.start + original.size) {
      res.push(MergeLineType.ORIGINAL)
    }
    // theirs header
    res.push(MergeLineType.MARKER_THEIRS)

    // theirs content
    while (lineNumber++ <= theirs.start + theirs.size) {
      res.push(MergeLineType.THEIRS)
    }
    // yours header
    res.push(MergeLineType.MARKER_YOURS)

    // yours content
    while (lineNumber++ <= yours.start + yours.size) {
      res.push(MergeLineType.YOURS)
    }
    // footer
    res.push(MergeLineType.MARKER_FOOTER)
  })

  while (lineNumber++ <= totalNumberOfLines) {
    res.push(MergeLineType.CONTEXT)
  }

  return res
}

// line types are extracted from hunks after a merge operation
const setLineTypeDecoration = (
  pane: IDiffViewPane, lineTypes: MergeLineType[], typeToDecorate: MergeLineType, decorClass: string
): IDiffViewPane => {
  const {diffViewData, markers, gutterDecorations} = pane
  const isTypeToDecorate = (typeToDecorate === MergeLineType.MARKER)
    ? isLineType(typeToDecorate)
    : isExactLineType(typeToDecorate)

  const existingMarkers = new Set(markers.map(({startRow}) => startRow))
  const existingGutterDecorations = new Set(gutterDecorations.map(({row}) => row))
  const linesNeedingMarkers: number[] = []
  const linesNeedingGutterDecorations: number[] = []
  for (let line = 0; line < lineTypes.length; line++) {
    if (isTypeToDecorate(lineTypes[line])) {
      if (!existingMarkers.has(line)) {
        linesNeedingMarkers.push(line)
      }
      if (!existingGutterDecorations.has(line)) {
        linesNeedingGutterDecorations.push(line)
      }
    }
  }

  return {
    diffViewData,
    markers: markers.map((marker) => {
      if (isTypeToDecorate(lineTypes[marker.startRow])) {
        return {
          ...marker,
          className: decorClass,
        }
      } else {
        return marker
      }
    }).concat(linesNeedingMarkers.map(line => ({
      startRow: line,
      endRow: line + 1,
      type: 'screenLine',
      className: decorClass,
    } as IMarker))),
    gutterDecorations: gutterDecorations.map((decoration) => {
      if (isTypeToDecorate(lineTypes[decoration.row])) {
        return {
          ...decoration,
          className: decorClass,
        }
      } else {
        return decoration
      }
    }).concat(linesNeedingGutterDecorations.map(line => ({
      row: line,
      className: decorClass,
    }))),
  }
}

const applyMergeMarkers = (mergeView: IDiffViewPane, lineTypes: MergeLineType[]) => {
  let res = mergeView
  res = setLineTypeDecoration(res, lineTypes, MergeLineType.MARKER, 'codeMarker mergeMarker')
  res = setLineTypeDecoration(res, lineTypes, MergeLineType.ORIGINAL, 'codeMarker modification')
  res = setLineTypeDecoration(res, lineTypes, MergeLineType.THEIRS, 'codeMarker modification')
  res = setLineTypeDecoration(res, lineTypes, MergeLineType.YOURS, 'codeMarker modification')
  return res
}

interface FilterMergeHunkOptions {
  keepContext?: boolean
  keepMarkers?: boolean
  keepOriginal?: boolean
  keepTheirs?: boolean
  keepYours?: boolean
}

// Given an array of line types and filter options, return the line numbers that are kept
// NOTE(pawel) Looks like this is only used in testing decodeMergeHunks
const filterMergeHunks = (
  linesTypes: MergeLineType[], filterOptions: FilterMergeHunkOptions = {}
): number[] => {
  const {keepContext, keepMarkers, keepOriginal, keepTheirs, keepYours} = filterOptions
  const outputLines = []
  for (let lineNumber = 1; lineNumber <= linesTypes.length; lineNumber++) {
    const lineType = linesTypes[lineNumber - 1]
    const lineTypeStrippedMarkerStatus = stripMarkerStatus(lineType)
    const lineTypeIsMarker = hasMarker(lineType)

    // eslint-disable-next-line default-case
    switch (lineTypeStrippedMarkerStatus) {
      case MergeLineType.ORIGINAL: {
        if (!lineTypeIsMarker && keepOriginal) {
          outputLines.push(lineNumber)
        }
        if (lineTypeIsMarker && keepMarkers && keepOriginal) {
          outputLines.push(lineNumber)
        }
        break
      }
      case MergeLineType.THEIRS: {
        if (!lineTypeIsMarker && keepTheirs) {
          outputLines.push(lineNumber)
        }
        if (lineTypeIsMarker && keepMarkers && keepTheirs) {
          outputLines.push(lineNumber)
        }
        break
      }
      case MergeLineType.YOURS: {
        if (!lineTypeIsMarker && keepYours) {
          outputLines.push(lineNumber)
        }
        if (lineTypeIsMarker && keepMarkers && keepYours) {
          outputLines.push(lineNumber)
        }
        break
      }
      // context lines do not have marker status
      case MergeLineType.CONTEXT: {
        if (keepContext) {
          outputLines.push(lineNumber)
        }
        break
      }
      case MergeLineType.FOOTER: {
        if (keepMarkers) {
          outputLines.push(lineNumber)
        }
        break
      }
    }
  }
  return outputLines
}

// Given a string, keep only certain lines
// NOTE(pawel) Looks like this is only used in testing decodeMergeHunks
const keepLineNumbers = (content: string, linesToKeep: number[]): string => {
  const keep = new Set(linesToKeep)
  return `${content.split('\n').filter((_, idx) => keep.has(idx + 1)).join('\n')}\n`
}

const DIFF_LINE_GAP = 3

interface FurledLineInfo {
  furledLineInfo: DiffViewLineInfo[]
  furledHiddenLineInfo: Map<number, DiffViewLineInfo[]>
  furledMarkers: IMarker[]
  furledGutterDecorations: IGutterDecoration[]
}

const furlLineInfo = (
  lineInfo: DeepReadonly<DiffViewLineInfo[]>,
  markers: DeepReadonly<IMarker[]>,
  gutterDecorations: DeepReadonly<IGutterDecoration[]>
): FurledLineInfo => {
  const furledLineInfo: Array<DiffViewLineInfo> = []
  const furledHiddenLineInfo = new Map<number, DiffViewLineInfo[]>()
  const furledMarkers: Array<IMarker> = []
  const furledGutterDecorations: Array<IGutterDecoration> = []

  let last = -1
  for (let i = 0; i <= markers.length; i++) {
    // Create furled row
    const startRow = last + 1
    let endRow = markers[i] ? markers[i].startRow - DIFF_LINE_GAP - 1 : lineInfo.length - 1
    if (startRow === endRow) {  // Show it if only one row to be furled
      furledLineInfo.push(lineInfo[startRow])
    } else if (startRow < endRow) {
      // Otherwise furl them
      furledMarkers.push({
        startRow: furledLineInfo.length,
        endRow: furledLineInfo.length + 1,
        type: 'screenLine',
        className: 'codeMarker furled',
        inFront: true,  // Put furled rows to the front
      })
      furledGutterDecorations.push({
        row: furledLineInfo.length,
        className: 'codeMarker furled',
      })
      furledHiddenLineInfo.set(furledLineInfo.length, lineInfo.slice(startRow, endRow + 1))

      // Not to mark the trailing empty line in the last furled row as it's being removed later on
      if (endRow === lineInfo.length - 1 && !lineInfo[lineInfo.length - 1].content) {
        endRow--
      }
      furledLineInfo.push({
        lineNumber: `${lineInfo[startRow]?.lineNumber}-${lineInfo[endRow]?.lineNumber}`,
        content: ' ',  // Non-empty string to avoid being chopped at the end of a file
        marker: 'furled',
      })
    }

    // Overflow i to add the last furled row above. Breaking the loop
    if (!markers[i]) {
      break
    }

    // Add rows before change
    const beforeStart = Math.max(last + 1, markers[i].startRow - DIFF_LINE_GAP)
    const beforeEnd = markers[i].startRow - 1
    for (let j = beforeStart; j <= beforeEnd; j++) {
      furledLineInfo.push(lineInfo[j])
      last = j  // Relocate "last" cursor
    }

    // Add itself
    furledMarkers.push({
      startRow: furledLineInfo.length,
      endRow: furledLineInfo.length + 1,
      type: markers[i]?.type,
      className: markers[i]?.className,
    })
    furledGutterDecorations.push({
      row: furledLineInfo.length,
      className: gutterDecorations[i]?.className,
    })
    furledLineInfo.push(lineInfo[markers[i].startRow])
    last = markers[i].startRow  // Relocate "last" cursor

    // Add rows after change
    const afterStart = Math.min(last + 1, lineInfo.length - 1)
    const afterEnd = Math.min(last + DIFF_LINE_GAP, lineInfo.length - 1)
    for (let j = afterStart; j <= afterEnd; j++) {
      if (lineInfo[j].marker === 'none') {
        furledLineInfo.push(lineInfo[j])
        last = j  // Relocate "last" cursor
      } else {
        break
      }
    }
  }

  return {furledLineInfo, furledHiddenLineInfo, furledMarkers, furledGutterDecorations}
}

interface UnfurlLineInfoParams extends FurledLineInfo {
  index: number
}

const unfurlLineInfo = ({
  furledLineInfo,
  furledHiddenLineInfo,
  furledMarkers,
  furledGutterDecorations,
  index,
}: UnfurlLineInfoParams): FurledLineInfo => {
  if (index === null || !furledHiddenLineInfo?.size) {
    return null
  }

  const lineInfos = furledHiddenLineInfo.get(index)
  const newFurledLineInfo = [
    ...furledLineInfo.slice(0, index),
    ...lineInfos,
    ...furledLineInfo.slice(index + 1),
  ]

  const newFurledHiddenLineInfo = new Map<number, DiffViewLineInfo[]>()
  furledHiddenLineInfo.forEach((v, k) => {
    if (k < index) {
      newFurledHiddenLineInfo.set(k, v)
    } else if (k > index) {
      newFurledHiddenLineInfo.set(k + lineInfos.length - 1, v)
    }
  })

  const newFurledMarkers: Array<IMarker> = []
  furledMarkers.forEach((marker) => {
    if (marker.startRow < index) {
      newFurledMarkers.push(marker)
    } else if (marker.startRow > index) {
      newFurledMarkers.push({
        ...marker,
        startRow: marker.startRow + lineInfos.length - 1,
        endRow: marker.endRow + lineInfos.length - 1,
      })
    }
  })

  const newFurledGutterDecorations: Array<IGutterDecoration> = []
  furledGutterDecorations.forEach((gutterDecoration) => {
    if (gutterDecoration.row < index) {
      newFurledGutterDecorations.push(gutterDecoration)
    } else if (gutterDecoration.row > index) {
      newFurledGutterDecorations.push({
        ...gutterDecoration,
        row: gutterDecoration.row + lineInfos.length - 1,
      })
    }
  })

  return {
    furledLineInfo: newFurledLineInfo,
    furledHiddenLineInfo: newFurledHiddenLineInfo,
    furledMarkers: newFurledMarkers,
    furledGutterDecorations: newFurledGutterDecorations,
  }
}

const lineInfoToContent = (lineInfo: DeepReadonly<DiffViewLineInfo[]>): string => (
  lineInfo.map(({content}) => content).join('\n')
)

const lineInfoToLines = (lineInfo: DeepReadonly<DiffViewLineInfo[]>): (number | string)[] => (
  lineInfo.map(({lineNumber}) => lineNumber)
)

const findMergeMarkers = (content: string): MergeMarker[] => {
  const markers: MergeMarker[] = []
  const lines = content.split('\n')
  let [startIdx, theirsIdx, yoursIdx, endIdx] = Array(4).fill(-1)

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith(ORIGINAL_MARKER)) {
      startIdx = i
    }
    if (lines[i].startsWith(THEIRS_MARKER)) {
      theirsIdx = i
    }
    if (lines[i].startsWith(YOURS_MARKER)) {
      yoursIdx = i
    }
    if (lines[i].startsWith(END_MARKER)) {
      endIdx = i
      if (startIdx !== -1 && startIdx < theirsIdx && theirsIdx < yoursIdx && yoursIdx < endIdx) {
        markers.push({
          start: startIdx,
          theirs: theirsIdx,
          yours: yoursIdx,
          end: endIdx,
        })
      }
      startIdx = -1
      theirsIdx = -1
      yoursIdx = -1
    }
  }
  return markers
}

const decorateConflictLines = (content: string): [IMarker[], IGutterDecoration[]] => {
  const markers: IMarker[] = []
  const gutterDecorations: IGutterDecoration[] = []

  const mergeMarkers = findMergeMarkers(content)
  mergeMarkers.forEach(({start, theirs, yours, end}) => {
    for (let i = start; i <= end; i++) {
      const className = [start, theirs, yours, end].includes(i)
        // eslint-disable-next-line local-rules/hardcoded-copy
        ? 'codeMarker mergeMarker'
        // eslint-disable-next-line local-rules/hardcoded-copy
        : 'codeMarker mergeBody'
      markers.push({
        startRow: i,
        endRow: i + 1,
        type: 'screenLine',
        className,
      } as IMarker)
      gutterDecorations.push({
        row: i,
        className,
      })
    }
  })
  return [markers, gutterDecorations]
}

const replaceDecorations = (current: Decorations, replacements: Decorations): Decorations => {
  const [currentMarkers, currentGutterDecorations] = current
  const [newMarkers, newGutterDecorations] = replacements

  const markerLines = new Set(newMarkers.map(({startRow}) => startRow))
  const gutterLines = new Set(newGutterDecorations.map(({row}) => row))

  const resultMarkers = currentMarkers.filter(({startRow}) => !markerLines.has(startRow)).concat(newMarkers)
  const resultGutters = currentGutterDecorations.filter(({row}) => !gutterLines.has(row)).concat(newGutterDecorations)

  return [
    resultMarkers,
    resultGutters,
  ]
}

export {
  IDiffViewPane,
  MergeMarker,
  Decorations,
  transformAssets,
  removeIgnoredAssets,
  transformBlobContents,
  DiffViewLineInfo,
  generateUnifiedDiff,
  generateSplitDiff,
  MergeLineType,
  lineCount,
  decodeMergeHunks,
  setLineTypeDecoration,
  applyMergeMarkers,
  FilterMergeHunkOptions,
  filterMergeHunks,
  keepLineNumbers,
  FurledLineInfo,
  furlLineInfo,
  unfurlLineInfo,
  lineInfoToContent,
  lineInfoToLines,
  decorateConflictLines,
  replaceDecorations,
  removeDependencies,
  keepDependencies,
  findMergeMarkers,
}
