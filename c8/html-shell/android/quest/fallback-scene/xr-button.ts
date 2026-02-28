/* eslint-disable @typescript-eslint/no-use-before-define, no-console, func-names */
/*

The MIT License

Copyright © 2010-2024 three.js authors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

/// <reference types="webxr" />
/* global XRSession */

import type {WebGLRenderer} from 'three'

import type {XrSessionMode, XrSessionInit} from '@nia/c8/xrapi/xrapi-types'

const {xr} = window.navigator

declare global {
  interface XRSystem {
    offerSession(mode: XrSessionMode, options: XrSessionInit): Promise<XRSession>
  }
}

// https://github.com/mrdoob/three.js/blob/dev/examples/jsm/webxr/XRButton.js

class XRButton {
  static createButton(renderer: WebGLRenderer, sessionInit: XrSessionInit = {}) {
    const button = document.createElement('button')
    function showStartXR(mode: XrSessionMode) {
      let currentSession: XRSession | null = null

      async function onSessionStarted(session: XRSession) {
        session.addEventListener('end', onSessionEnded)
        await renderer.xr.setSession(session)
        button.textContent = 'STOP XR'

        currentSession = session
      }

      function onSessionEnded(/* event */) {
        currentSession?.removeEventListener('end', onSessionEnded)
        button.textContent = 'START XR'

        currentSession = null
      }

      //

      button.style.display = ''

      button.style.cursor = 'pointer'
      button.style.left = 'calc(50% - 50px)'
      button.style.width = '100px'

      button.textContent = 'START XR'

      const sessionOptions = {
        ...sessionInit,
        optionalFeatures: [
          'local-floor',
          'bounded-floor',
          'layers',
          ...(sessionInit.optionalFeatures || []),
        ],
      }
      button.onmouseenter = function () {
        button.style.opacity = '1.0'
      }

      button.onmouseleave = function () {
        button.style.opacity = '0.5'
      }

      button.onclick = function () {
        if (currentSession === null) {
          xr.requestSession(mode, sessionOptions)
            .then(onSessionStarted)
        } else {
          currentSession.end()

          if (xr.offerSession !== undefined) {
            xr.offerSession(mode, sessionOptions)
              .then(onSessionStarted)
              .catch((err) => {
                console.warn(err)
              })
          }
        }
      }

      if (xr.offerSession !== undefined) {
        xr.offerSession(mode, sessionOptions)
          .then(onSessionStarted)
          .catch((err) => {
            console.warn(err)
          })
      }
    }

    function disableButton() {
      button.style.display = ''

      button.style.cursor = 'auto'
      button.style.left = 'calc(50% - 75px)'
      button.style.width = '150px'

      button.onmouseenter = null
      button.onmouseleave = null

      button.onclick = null
    }

    function showXRNotSupported() {
      disableButton()

      button.textContent = 'XR NOT SUPPORTED'
    }

    function showXRNotAllowed(exception: Error) {
      disableButton()

      // eslint-disable-next-line no-console
      console.warn('Exception when trying to call xr.isSessionSupported', exception)
      button.textContent = 'XR NOT ALLOWED'
    }

    function stylizeElement(element: HTMLElement) {
      element.style.position = 'absolute'
      element.style.bottom = '20px'
      element.style.padding = '12px 6px'
      element.style.border = '1px solid #fff'
      element.style.borderRadius = '4px'
      element.style.background = 'rgba(0,0,0,0.1)'
      element.style.color = '#fff'
      element.style.font = 'normal 13px sans-serif'
      element.style.textAlign = 'center'
      element.style.opacity = '0.5'
      element.style.outline = 'none'
      element.style.zIndex = '999'
    }

    if (xr) {
      button.id = 'XRButton'
      button.style.display = 'none'

      stylizeElement(button)
      xr.isSessionSupported('immersive-ar')
        .then((arSupported) => {
          if (arSupported) {
            showStartXR('immersive-ar')
          } else {
            xr.isSessionSupported('immersive-vr')
              .then((vrSupported) => {
                if (vrSupported) {
                  showStartXR('immersive-vr')
                } else {
                  showXRNotSupported()
                }
              }).catch(showXRNotAllowed)
          }
        }).catch(showXRNotAllowed)
      return button
    } else {
      const message = document.createElement('a')
      if (window.isSecureContext === false) {
        message.href = document.location.href.replace(/^http:/, 'https:')
        message.innerHTML = 'WEBXR NEEDS HTTPS'  // TODO Improve message
      } else {
        message.href = 'https://immersiveweb.dev/'
        message.innerHTML = 'WEBXR NOT AVAILABLE'
      }

      message.style.left = 'calc(50% - 90px)'
      message.style.width = '180px'
      message.style.textDecoration = 'none'

      stylizeElement(message)
      return message
    }
  }
}

export {XRButton}
