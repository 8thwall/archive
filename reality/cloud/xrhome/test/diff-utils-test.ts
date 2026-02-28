import {assert} from 'chai'

import {
  decodeMergeHunks,
  filterMergeHunks,
  keepLineNumbers,
  MergeLineType,
} from '../src/client/git/utils'
import type {IMergeHunk} from '../src/client/git/g8-dto'

const mergeCases: {
  path: string
  content: string
  hunks: IMergeHunk[]
  decoded: MergeLineType[]
}[] = [{
  path: 'app.js',
  content: `>>>> ORIGINAL app.js#57ca5f7
// app.js is the main entry point for your 8th Wall app.

==== THEIRS app.js#955a875
// comment
==== YOURS app.js
// app.js is the main entry point for your 8th Wall app.
asd
<<<<
const xrScene = \`
<a-scene xrweb xrextras-tap-recenter xrextras-almost-there xrextras-loading xrextras-runtime-error>
  <a-camera position="0 3 3"></a-camera>
  <a-box position="0 0.5 -1" material="color: #7611B6;" shacvdow></a-box>
  <a-box scale="100 2 100" position="0 -1 0" material="shader: shadow" shadow></a-box>
</a-scene>asdf
\`
>>>> ORIGINAL app.js#57ca5f7
/*
// Load AFrame and then add our scene to html.
XRExtras.AFrame.loadAFrameForXr()
==== THEIRS app.js#955a875



// add many empty space from line 9 to 16 inclusive

wut


/*
// Load AFrame and then add our scene to html.
XRExtras.AFrame.loadAFrameForXr()
==== YOURS app.js
/*xcv
// Load AFrame and theasdfn addzxdfasdfgcv our scene xcvto html.gf
XRExtras.AFrame.loadAFrameForXr(asdf)asdfasdfcvb
<<<<
  .then(() => document.body.insertAdjacentHTML('beforeend', xrScene))
>>>> ORIGINAL app.js#57ca5f7
*/    
==== THEIRS app.js#955a875
*/    
// comment
==== YOURS app.js
*/    fd
<<<<
`,
  hunks: [
    {
      original: {start: 1, size: 2},
      theirs: {start: 4, size: 1},
      yours: {start: 6, size: 2},
    },
    {
      original: {start: 17, size: 3},
      theirs: {start: 21, size: 11},
      yours: {start: 33, size: 3},
    },
    {
      original: {start: 39, size: 1},
      theirs: {start: 41, size: 2},
      yours: {start: 44, size: 1},
    },
  ],
  decoded: [
    MergeLineType.MARKER_ORIGINAL,
    MergeLineType.ORIGINAL,
    MergeLineType.ORIGINAL,
    MergeLineType.MARKER_THEIRS,
    MergeLineType.THEIRS,
    MergeLineType.MARKER_YOURS,
    MergeLineType.YOURS,
    MergeLineType.YOURS,
    MergeLineType.MARKER_FOOTER,
    MergeLineType.CONTEXT,
    MergeLineType.CONTEXT,
    MergeLineType.CONTEXT,
    MergeLineType.CONTEXT,
    MergeLineType.CONTEXT,
    MergeLineType.CONTEXT,
    MergeLineType.CONTEXT,
    MergeLineType.MARKER_ORIGINAL,
    MergeLineType.ORIGINAL,
    MergeLineType.ORIGINAL,
    MergeLineType.ORIGINAL,
    MergeLineType.MARKER_THEIRS,
    MergeLineType.THEIRS,
    MergeLineType.THEIRS,
    MergeLineType.THEIRS,
    MergeLineType.THEIRS,
    MergeLineType.THEIRS,
    MergeLineType.THEIRS,
    MergeLineType.THEIRS,
    MergeLineType.THEIRS,
    MergeLineType.THEIRS,
    MergeLineType.THEIRS,
    MergeLineType.THEIRS,
    MergeLineType.MARKER_YOURS,
    MergeLineType.YOURS,
    MergeLineType.YOURS,
    MergeLineType.YOURS,
    MergeLineType.MARKER_FOOTER,
    MergeLineType.CONTEXT,
    MergeLineType.MARKER_ORIGINAL,
    MergeLineType.ORIGINAL,
    MergeLineType.MARKER_THEIRS,
    MergeLineType.THEIRS,
    MergeLineType.THEIRS,
    MergeLineType.MARKER_YOURS,
    MergeLineType.YOURS,
    MergeLineType.MARKER_FOOTER,
    // MergeLineType.CONTEXT, NOTE(pawel) decodeMergeHunks() does not include trailing context lines
  ],
}]

describe('client diff-utils', () => {
  it('decode merge hunk info', () => {
    mergeCases.forEach(({path, content, hunks, decoded}) => {
      const lineTypes = decodeMergeHunks(hunks)
      assert.deepEqual(lineTypes, decoded)
      const linesToKeep = filterMergeHunks(lineTypes, {
        keepContext: true,
        keepMarkers: true,
        keepOriginal: true,
        keepTheirs: true,
        keepYours: true,
      })
      const reconstructed = keepLineNumbers(content, linesToKeep)
      assert.equal(reconstructed, content)
    })
  })

  it('stripe merge markers', () => {
    mergeCases.forEach(({content, hunks, decoded}) => {
      const lines = content.split('\n')
      const strippedContent = []
      for (let i = 0; i < lines.length; i++) {
        // eslint-disable-next-line no-bitwise
        if ((decoded[i] & MergeLineType.MARKER) !== MergeLineType.MARKER) {
          strippedContent.push(lines[i])
        }
      }
      const lineTypes = decodeMergeHunks(hunks)
      const linesToKeep = filterMergeHunks(lineTypes, {
        keepContext: true,
        keepMarkers: false,
        keepOriginal: true,
        keepTheirs: true,
        keepYours: true,
      })
      const reconstructed = keepLineNumbers(content, linesToKeep)
      assert.equal(reconstructed, strippedContent.join('\n'))
    })
  })
})
