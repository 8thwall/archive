import * as THREE from 'three'

import HoloVideoObject from './holovideoobject'

export default class HoloVideoObjectThreeJS {
  _hvoOnEndOfStream(hvo) {
    if (this.onEndOfStream) {
      this.onEndOfStream(this)
    }
  }

  /**
   * Creates a new HoloVideoObjectThreeJS instance
   * @param {THREE.WebGLRenderer} renderer - WebGLRenderer that will be used to render the capture.
   * @param {HoloVideoObjectThreeJS~openCallback} - Callback invoked when initial loading is complete.
   * @param {Object} options - Optional collection of options that permanently affect behavior of this HoloVideoObjectThreeJS instance.
   * @param {boolean} options.disableAsyncDecode - Disables asynchronous video decoding path which may result in improved audio sync but incurs a performance penalty. This is the only decoding path available in WebGL1 environments.
   * @param {boolean} options.numAsyncFrames - Controls how many asynchronous frames are buffered in WebGL2 async. decode path resulting in 'numAsyncFrames' - 1 frames of latency. The default value is 3.
   */
  constructor(renderer, callback, createOptions, updateCurrentFrameCallback) {
    const hvo = new HoloVideoObject(renderer.getContext(), createOptions)
    this.hvo = hvo
    this.renderer = renderer
    hvo.onEndOfStream = this._hvoOnEndOfStream.bind(this)
    hvo.onUpdateCurrentFrame = updateCurrentFrameCallback
    hvo.onLoaded = function (fileInfo) {
      this.fileInfo = fileInfo

      const useNormals = fileInfo.haveNormals

      const unlitMaterial = new THREE.MeshBasicMaterial({map: null, transparent: false, side: THREE.DoubleSide})
      const litMaterial = new THREE.MeshLambertMaterial({map: null, transparent: false, side: THREE.DoubleSide})

      if (this.mesh) {
        var material = useNormals ? litMaterial : unlitMaterial
        material.map = this.mesh.material.map
        this.mesh.material = material
      } else {
        const gl = renderer.getContext()

        const bufferGeometry = new THREE.BufferGeometry()
        bufferGeometry.boundingSphere = new THREE.Sphere()
        bufferGeometry.boundingSphere.set(new THREE.Vector3(), Infinity)
        bufferGeometry.boundingBox = new THREE.Box3()
        bufferGeometry.boundingBox.set(
          new THREE.Vector3(-Infinity, -Infinity, -Infinity),
          new THREE.Vector3(+Infinity, +Infinity, +Infinity)
        )

        // NOTE(paris): This feature https://github.com/mrdoob/three.js/pull/13196 has now landed in
        // an official three.js release so we can use GLBufferAttribute directly.
        // https://github.com/mrdoob/three.js/pull/20114/commits/9cbc221db7e6deecbe5fa8811151de7156abde6b
        // https://github.com/mrdoob/three.js/releases/tag/r120

        const pos = gl.createBuffer()
        const posAttr = new THREE.GLBufferAttribute(pos, gl.FLOAT, 3, 0)
        bufferGeometry.setAttribute('position', posAttr)
        const posBuf = posAttr.buffer

        let norBuf = null
        if (useNormals) {
          const nor = gl.createBuffer()
          const norAttr = new THREE.GLBufferAttribute(nor, gl.FLOAT, 3, 0)
          bufferGeometry.setAttribute('normal', norAttr)
          norBuf = norAttr.buffer
        }

        const uvs = gl.createBuffer()
        const uvAttr = new THREE.GLBufferAttribute(uvs, gl.UNSIGNED_SHORT, 2, 0)
        uvAttr.normalized = true
        bufferGeometry.setAttribute('uv', uvAttr)
        const uvBuf = uvAttr.buffer

        const indices = []
        const ind = gl.createBuffer()
        const indAttr = new THREE.GLBufferAttribute(ind, gl.UNSIGNED_SHORT, 2, 0)
        bufferGeometry.setIndex(indAttr)
        const indexBuf = indAttr.buffer

        const texture = new THREE.Texture()
        texture.encoding = THREE.sRGBEncoding
        const texProps = renderer.properties.get(texture)
        texProps.__webglTexture = gl.createTexture()

        const saveTex = gl.getParameter(gl.TEXTURE_BINDING_2D)
        gl.bindTexture(gl.TEXTURE_2D, texProps.__webglTexture)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, fileInfo.videoWidth, fileInfo.videoHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
        gl.bindTexture(gl.TEXTURE_2D, saveTex)

        var material = useNormals ? litMaterial : unlitMaterial
        material.map = texture

        const mesh = new THREE.Mesh(bufferGeometry, material)
        mesh.scale.x = 0.001
        mesh.scale.y = 0.001
        mesh.scale.z = 0.001
        hvo.setBuffers(posBuf, indexBuf, uvBuf, norBuf, texProps.__webglTexture)

        this.mesh = mesh
        this.bufferGeometry = bufferGeometry
      }

      /**
       * The current state of this HoloVideoObjectThreeJS instance.
       * @type {HoloVideoObject.States}
       */
      this.state = this.hvo.state

      callback(this.mesh)
    }.bind(this)

    const gl = renderer.getContext()
    const {canvas} = gl

    canvas.addEventListener('webglcontextlost', (event) => {
      if (this.mesh) {
        const texid = this.mesh.material.map.__webglTexture
        gl.deleteTexture(texid)
      }
    }, false)

    canvas.addEventListener('webglcontextrestored', (event) => {
      if (this.mesh) {
        const bufferGeometry = this.mesh.geometry

        const {renderer} = this
        renderer.geometries.update(bufferGeometry)

        let posBuf = null
        let norBuf = null
        let uvBuf = null
        let indexBuf = null

        const posAt = bufferGeometry.attributes.position
        posBuf = renderer.attributes.get(posAt).buffer

        const norAt = bufferGeometry.attributes.normal
        if (norAt) {
          norBuf = renderer.attributes.get(norAt).buffer
        }

        uvBuf = renderer.attributes.get(bufferGeometry.attributes.uv).buffer
        indexBuf = renderer.attributes.get(bufferGeometry.index).buffer

        const texture = new THREE.Texture()
        texture.encoding = THREE.sRGBEncoding
        const texProps = renderer.properties.get(texture)
        texProps.__webglTexture = gl.createTexture()

        const saveTex = gl.getParameter(gl.TEXTURE_BINDING_2D)
        gl.bindTexture(gl.TEXTURE_2D, texProps.__webglTexture)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.fileInfo.videoWidth, this.fileInfo.videoHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
        gl.bindTexture(gl.TEXTURE_2D, saveTex)

        this.mesh.material.map = texture

        this.hvo.setBuffers(posBuf, indexBuf, uvBuf, norBuf, texProps.__webglTexture)
        this.hvo.updateToLastKeyframe()
        this.bufferGeometry.index.count = 0
      }
    }, false)
  }

  /**
   * @callback HoloVideoObjectThreeJS~openCallback
   * @param {THREE.Mesh} mesh - THREE.Mesh object that will be populated with capture geometry during playback.
   */

  /**
   * Opens and capture and begins buffering data for playback
   *
   * @param {string} url - Capture URL, e.g. "http://127.0.0.1/mycapture.hcap"
   * @param {Object} options - Optional collection of options related to capture loading and playback.
   * @param {boolean} options.audioEnabled - Specifies whether audio playback is enabled initially
   * @param {boolean} options.autoplay - Specifies whether capture should automatically begin playback when loaded. If enabled will disable audio as many browsers do not allow automatic audio playback without user input.
   * @param {number} options.minBuffers - Minimum number of .bin segments that must be buffered before capture is considered preloaded. Default value is 2.
   * @param {number} options.maxBuffers - Maximum number of .bin segments that can be buffered and kept in memory at one time.
   */
  open(url, options) {
    if (this.state > HoloVideoObject.States.Empty) {
      this.close()
    }
    this.hvo.open(url, options)
    this.state = this.hvo.state
  }

  /**
   * Updates capture mesh and texture to latest playback frame. This should be called periodically from the application's animate/update loop.
   */
  update() {
    if (this.hvo && this.mesh) {
      this.state = this.hvo.state
    }

    if (this.hvo.updateBuffers()) {
      const min = this.hvo.currentFrameInfo.bboxMin
      const max = this.hvo.currentFrameInfo.bboxMax

      const {bufferGeometry} = this

      bufferGeometry.boundingBox.min.x = min[0]
      bufferGeometry.boundingBox.min.y = min[1]
      bufferGeometry.boundingBox.min.z = min[2]
      bufferGeometry.boundingBox.max.x = max[0]
      bufferGeometry.boundingBox.max.y = max[1]
      bufferGeometry.boundingBox.max.z = max[2]

      bufferGeometry.boundingBox.getCenter(bufferGeometry.boundingSphere.center)
      const maxSide = Math.max(max[0] - min[0], max[1] - min[1], max[2] - min[2])
      bufferGeometry.boundingSphere.radius = maxSide * 0.5

      bufferGeometry.index.count = this.hvo.currentFrameInfo.primCount
    }
  }

  /**
   * Rewinds capture back to the first frame and pauses.
   */
  rewind() {
    this.hvo.rewind()
  }

  /**
   * Starts capture playback if sufficient data has been buffered, or resumes paused playback.
   */
  play() {
    if (this.hvo.state == HoloVideoObject.States.Opening) {
      this.hvo.forceLoad()
    } else if (this.hvo.state >= HoloVideoObject.States.Opened &&
              this.hvo.state != HoloVideoObject.States.Playing) {
      this.hvo.play()
    }
  }

  /**
   * Stops playback and releases capture-specific resources. A new capture can then be loaded by calling {@link HoloVideoObjectThreeJS#open}
   */
  close() {
    if (this.bufferGeometry) {
      this.bufferGeometry.index.count = 0
    }
    this.hvo.close()
  }

  /**
   * Pauses playback.
   */
  pause() {
    this.hvo.pause()
  }

  /**
   * Sets verbosity level of log output
   * @param {number} level - 0 = errors, 1 = warnings, 2 = info, 3 = debug. Default setting is = 0.
   */
  setLogLevel(level) {
    this.hvo.logLevel = level
  }

  /**
   * Enables or disables audio playback. May be called at any time.
   * @param {boolean} enabled - Specifies whether audio should be enabled or disabled.
   */
  setAudioEnabled(enabled) {
    this.hvo.setAudioEnabled(enabled)
  }

  /**
   * Returns whether audio playback is currently enabled.
   */
  audioEnabled() {
    return this.hvo.audioEnabled()
  }

  /**
   * Sets audio volume.
   * @param {number} volume - Value between 0 and 1 specifying volume level.
   */
  setAudioVolume(volume) {
    this.hvo.setAudioVolume(volume)
  }

  /**
   * Specifies whether capture should loop automatically. May be called at any time.
   * @param {boolean} loop
   */
  setAutoLooping(loop) {
    this.hvo.setAutoLooping(loop)
  }
}
