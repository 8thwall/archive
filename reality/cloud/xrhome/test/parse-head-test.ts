/* eslint-disable max-len */
import {assert} from 'chai'

import {parseHead} from '../src/client/editor/modals/nae/parse-head'

describe('parseHead', () => {
  it('Returns empty for head with no dependencies', async () => {
    const headText = ''

    const result = await parseHead(headText)
    assert.deepEqual(result, [])
  })

  it('Parses dependencies from head text', async () => {
    const headText = `
    <!-- Copyright (c) 2023 8th Wall, Inc. -->
<!-- head.html is optional; elements will be added to your html head before app.js is loaded. -->

<!-- Use "8thwall:" meta tags to hook into 8th Wall's build process and developer tools. -->
<meta name="8thwall:renderer" content="aframe:1.3.0">
<meta name="8thwall:package" content="@8thwall.xrextras">
<meta name="8thwall:package" content="@8thwall.landing-page">

<!-- Microsoft HCAP Player -->
<meta name="8thwall:package" content="@mrcs.holovideoobject:1.3.7">
<script crossorigin="anonymous" src="https://cdn.dashjs.org/v4.0.1/dash.mediaplayer.min.js"></script> 
`

    const result = await parseHead(headText)
    assert.deepEqual(result, [
      {name: 'aframe', version: '1.3.0'},
      {name: '@8thwall.xrextras', version: ''},
      {name: '@8thwall.landing-page', version: ''},
      {name: '@mrcs.holovideoobject', version: '1.3.7'},
    ])
  })

  it('Ignores other types of meta tags', async () => {
    const headText = `
<meta name="other" content="aframe:1.3.0">
`
    const result = await parseHead(headText)
    assert.deepEqual(result, [])
  })
})
