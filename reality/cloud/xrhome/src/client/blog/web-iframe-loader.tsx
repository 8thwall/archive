import React from 'react'
import {Helmet} from 'react-helmet-async'

const WebIframeLoader = () => (
  <Helmet>
    <script src='https://cdn.8thwall.com/web/iframe/iframe.js' />
  </Helmet>
)

export default WebIframeLoader
