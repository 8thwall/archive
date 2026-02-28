export default class HoloVideoObject {
  _createProgram(gl, vertexShaderSource, fragmentShaderSource, preLink) {
    function _createShader(gl, source, type) {
      const shader = gl.createShader(type)
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
      return shader
    }

    const program = gl.createProgram()
    const vshader = _createShader(gl, vertexShaderSource, gl.VERTEX_SHADER)
    gl.attachShader(program, vshader)
    gl.deleteShader(vshader)

    const fshader = _createShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER)
    gl.attachShader(program, fshader)
    gl.deleteShader(fshader)

    if (preLink) {
      preLink(program)
    }

    gl.linkProgram(program)

    let log = gl.getProgramInfoLog(program)
    if (log) {
      this._logError(log)
    }

    log = gl.getShaderInfoLog(vshader)
    if (log) {
      this._logError(log)
    }

    log = gl.getShaderInfoLog(fshader)
    if (log) {
      this._logError(log)
    }

    return program
  }

  _loadJSON(src, callback) {
    // native json loading technique from @KryptoniteDove:
    // http://codepen.io/KryptoniteDove/post/load-json-file-locally-using-pure-javascript

    const xobj = new XMLHttpRequest()
    xobj.overrideMimeType('application/json')
    xobj.open('GET', src, true)
    xobj.onreadystatechange = function () {
      if (xobj.readyState == 4 && // Request finished, response ready
              xobj.status == '200') { // Status OK
        callback(xobj.responseText, this)
      }
    }
    xobj.send(null)
    return xobj.responseText
  }

  _loadArrayBuffer(url, callback) {
    const xobj = new XMLHttpRequest()
    xobj.name = url.substring(url.lastIndexOf('/') + 1, url.length)
    xobj.responseType = 'arraybuffer'
    xobj.open('GET', url, true)
    xobj.onprogress = function (e) {
      if (e.lengthComputable) {
        const percentComplete = Math.floor((e.loaded / e.total) * 100)
        this._logInfo(`${xobj.name} progress: ${percentComplete}`)
      }
    }.bind(this)
    xobj.onreadystatechange = function () {
      if (xobj.readyState == 4) { // Request finished, response ready
        if (xobj.status == '200') { // Status OK
          const arrayBuffer = xobj.response
          if (arrayBuffer && callback) {
            callback(arrayBuffer)
          }
        } else {
          this._logInfo(`_loadArrayBuffer status = ${xobj.status}`)
        }
        if (this.httpRequest == xobj) {
          this.httpRequest = null
        }
      }
    }.bind(this)
    xobj.ontimeout = function () {
      this._logInfo('_loadArrayBuffer timeout')
    }
    xobj.send(null)
    this.httpRequest = xobj
  }

  _startPlaybackIfReady() {
    if (this.state == HoloVideoObject.States.Opening) {
      if (this.buffersLoaded >= this.minBuffers &&
              this.videosLoaded >= this.minVideos) {
        this._logInfo('state -> Opened')
        this.state = HoloVideoObject.States.Opened

        if (this.openOptions.autoplay) {
          this.play()
        }
      }
    }
    // not else if
    if (this.suspended) {
      var {timeline} = this.json.extensions[HoloVideoObject._extName]
      var image = this.json.images[timeline[this.currentVideoIndex].image]
      var currentVideo = image.video
      if ((currentVideo.paused || !currentVideo.playing) && currentVideo.preloaded) {
        this._logInfo(`video ${currentVideo.mp4Name} was suspended, resuming`)
        this.suspended = false
        currentVideo.play()
      }
    } else if (this.state == HoloVideoObject.States.Playing) {
      var {timeline} = this.json.extensions[HoloVideoObject._extName]
      var image = this.json.images[timeline[this.currentVideoIndex].image]
      var currentVideo = image.video
      if (!currentVideo.playing) {
        currentVideo.play()
      }
    }
  }

  _loadNextBuffer() {
    if (this.freeArrayBuffers.length == 0) {
      this._logInfo('_loadNextBuffer no free buffer slot available')
      return
    }

    const bufferIndex = this.nextBufferLoadIndex
    this.nextBufferLoadIndex = (this.nextBufferLoadIndex + 1) % (this.json.buffers.length)

    if (this.fallbackFrameBuffer && this.nextBufferLoadIndex == 0) {
      this.nextBufferLoadIndex = 1
    }

    const buffer = this.json.buffers[bufferIndex]
    const bufferName = buffer.uri
    const bufferURL = this.urlRoot + bufferName
    buffer.loaded = false

    let arrayBufferIndex = -1

    if (bufferIndex == 0) {
      this._logInfo('loading preview frame buffer')
    } else {
      arrayBufferIndex = this.freeArrayBuffers.shift()
      this._logInfo(`loading buffer: ${buffer.uri} into slot ${arrayBufferIndex}`)
    }

    this.pendingBufferDownload = true
    this._loadArrayBuffer(bufferURL, (arrayBuffer) => {
      this._logInfo(`buffer loaded: ${buffer.uri}`)

      if (!this.fallbackFrameBuffer && !this.filledFallbackFrame) {
        this._logInfo(`fallback frame buffer downloaded ${buffer.uri}`)
        this.fallbackFrameBuffer = arrayBuffer
        this._loadNextBuffer()
        this.pendingBufferDownload = false
        return
      }

      ++this.buffersLoaded

      this.buffers[arrayBufferIndex] = arrayBuffer
      arrayBuffer.bufferIndex = bufferIndex // which buffer in timeline is loaded into this arrayBuffer

      // so buffer knows which arrayBuffer contains its data... don't reference arrayBuffer directly because we only want to keep 3 arrayBuffers in memory at a time.
      buffer.arrayBufferIndex = arrayBufferIndex
      buffer.loaded = true
      this.pendingBufferDownload = false
      this.needMeshData = false // is this really true?

      this._startPlaybackIfReady()
      this._loadNextBuffer()
    })
  }

  _loadNextVideo() {
    if (this.freeVideoElements.length == 0) {
      return
    }

    const videoElementIndex = this.freeVideoElements.shift()
    const video = this.videoElements[videoElementIndex]
    video.videoElementIndex = videoElementIndex
    const videoIndex = this.nextVideoLoadIndex
    const numVideos = this.json.extensions[HoloVideoObject._extName].timeline.length
    this.nextVideoLoadIndex = (this.nextVideoLoadIndex + 1) % numVideos
    const image = this.json.images[this.json.extensions[HoloVideoObject._extName].timeline[videoIndex].image]

    image.video = video
    video.preloaded = false

    video.autoplay = false
    video.muted = this.openOptions.autoplay || !this.openOptions.audioEnabled

    // Safari won't preload unmuted videos
    if (this.isSafari) {
      video.muted = true
    }

    video.loop = numVideos == 1 && this.openOptions.autoloop
    video.preload = 'auto'
    video.crossOrigin = 'anonymous'
    video.playing = false
    // video.timeOffset =  image.timeOffset;
    video.preloaded = false

    const ext = image.uri.split('.').pop()

    const imageExt = image.extensions[HoloVideoObject._extName]

    if (this.isSafari && imageExt.hlsUri) {
      video.src = this.urlRoot + imageExt.hlsUri
      video.mp4Name = imageExt.hlsUri
    } else if (!this.isSafari && imageExt.dashUri && typeof dashjs !== 'undefined') {
      if (!this.dashPlayer) {
        this.dashPlayer = dashjs.MediaPlayer().create()
        this.dashPlayer.initialize()
      }

      var url = this.urlRoot + imageExt.dashUri
      this.dashPlayer.attachView(video)
      this.dashPlayer.attachSource(url)

      video.mp4Name = imageExt.dashUri
    } else {
      var url = this.urlRoot + image.uri
      video.src = url
      video.mp4Name = image.uri
    }

    this._logInfo(`loading video ${video.mp4Name}`)

    // video.getTime = function() {
    //  return Math.max((this.timeOffset + this.currentTime) * 1000 - 20, 0);
    // };

    const hvo = this

    video.canplay = function () {
      this._logInfo('video -> canplay')
    }.bind(this)

    video.canplaythrough = function () {
      this._logInfo('video -> canplaythrough')
    }.bind(this)

    video.waiting = function () {
      this._logInfo('video -> waiting')
    }.bind(this)

    video.suspend = function () {
      this._logInfo('video -> suspend')
    }.bind(this)

    video.stalled = function () {
      this._logInfo('video -> stalled')
    }.bind(this)

    video.onerror = function (e) {
      this._logInfo(`video error: ${e.target.error.code} - ${e.target.mp4Name}`)
    }.bind(this)

    video.onended = function () {
      video.playing = false
      this._onVideoEnded(video)
    }.bind(this)

    if (this.isSafari) {
      video.onplaying = function () {
        video.pause()
        video.muted = this.openOptions.autoplay || !this.openOptions.audioEnabled
        video.preloaded = true
        this._logInfo(`video loaded: ${video.mp4Name}`)

        video.onplaying = function () {
          this._logInfo(`video playing: ${video.mp4Name}`)
          video.playing = true
        }.bind(this)

        ++this.videosLoaded
        this._startPlaybackIfReady()
        this._loadNextVideo()
      }.bind(this)
    } else {
      video.onloadeddata = function () {
        const playPromise = video.play()

        if (playPromise !== undefined) {
          // Automatic playback started!
          playPromise.then((_) => {
          })
            .catch((error) => {
              // Auto-play was prevented
              video.onplaying()
            })
        }
      }

      video.onplaying = function () {
        video.pause()
        video.preloaded = true
        this._logInfo(`video loaded: ${video.mp4Name}`)

        video.onplaying = function () {
          this._logInfo(`video playing: ${video.mp4Name}`)
          video.playing = true
        }.bind(this)

        ++this.videosLoaded
        this._startPlaybackIfReady()
        this._loadNextVideo()
      }.bind(this)
    }

    // force preloading
    if (this.isSafari) {
      video.play()
    }
  }

  rewind() {
    if (this.json) {
      this._logInfo('rewind')

      const {timeline} = this.json.extensions[HoloVideoObject._extName]
      const image = this.json.images[timeline[this.currentVideoIndex].image]
      const currentVideo = image.video
      currentVideo.pause()
      currentVideo.playing = false
      currentVideo.currentTime = 0.0

      this.state = HoloVideoObject.States.Opening

      this.freeArrayBuffers = []
      for (var i = 0; i < Math.min(this.openOptions.maxBuffers, this.json.buffers.length - 1); ++i) {
        this.freeArrayBuffers.push(i)
      }

      this.currentBufferIndex = 0
      this.nextBufferLoadIndex = this.fallbackFrameBuffer ? 1 : 0
      this.frameIndex = -1
      this.lastKeyframe = -1
      this.nextPbo = 0
      this.lastVideoSampleIndex = -1
      this.filledFallbackFrame = false
      this.curMesh = null
      this.prevMesh = null
      this.prevPrevMesh = null

      if (this.readFences) {
        for (var i = 0; i < this.readFences.length; ++i) {
          if (this.readFences[i]) {
            this.gl.deleteSync(this.readFences[i])
            this.readFences[i] = null
          }
        }
      }

      this._loadNextBuffer()
      this._loadFallbackFrame()
    }
  }

  forceLoad() {
    if (this.json) {
      const {timeline} = this.json.extensions[HoloVideoObject._extName]
      const image = this.json.images[timeline[this.currentVideoIndex].image]
      const currentVideo = image.video

      if (currentVideo.playing) {
        this._logInfo('forceLoad: video already playing')
      } else if (!currentVideo.preloaded) {
        this._logInfo('forceLoad: manually starting video')
        this.suspended = true
        const playPromise = currentVideo.play()

        if (playPromise !== undefined) {
          playPromise.then((_) => {
            this.state = HoloVideoObject.States.Playing
          })
            .catch((error) => {
              // Auto-play was prevented
              this._logInfo(`play prevented: ${error}`)
            })
        }
      }
    } else {
      this._logInfo('forceLoad: don\'t have json yet')
    }
  }

  _onVideoEnded(video) {
    this._logInfo(`video ended = ${video.mp4Name}`)
    this.freeVideoElements.push(video.videoElementIndex)
    video.videoElementIndex = -1
    const {timeline} = this.json.extensions[HoloVideoObject._extName]

    if (this.currentVideoIndex == timeline.length - 1 && !this.openOptions.autoloop) {
      this.eos = true
      if (this.onEndOfStream) {
        this.onEndOfStream(this)
      }
    } else {
      this.currentVideoIndex = (this.currentVideoIndex + 1) % timeline.length
      this._loadNextVideo()
      this._startPlaybackIfReady()
    }
  }

  _setupTransformFeedback() {
    const {gl} = this

    this.outputBufferIndex = 0
    this.deltasBuf = gl.createBuffer()
    this.outputBuffers = [gl.createBuffer(), gl.createBuffer(), gl.createBuffer()]
    this.transformFeedbacks = [gl.createTransformFeedback(), gl.createTransformFeedback(), gl.createTransformFeedback()]
    this.vaos = [gl.createVertexArray(), gl.createVertexArray(), gl.createVertexArray()]

    gl.bindVertexArray(null)

    for (let i = 0; i < 3; ++i) {
      gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, this.transformFeedbacks[i])
      gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, this.outputBuffers[i])
    }

    this.normalsVao = gl.createVertexArray()
    // this.decodedNormals = gl.createBuffer();
    this.normalsTF = gl.createTransformFeedback()
    // gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, this.normalsTF);
    // gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, this.decodedNormals);

    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null)
    gl.bindBuffer(gl.TRANSFORM_FEEDBACK_BUFFER, null)

    const tfShaderSourcePS = `#version 300 es
          out lowp vec4 fragColor;
          void main()
          {
              fragColor = vec4(0,0,0,0);
          }
          `

    const tfShaderSourceVS = `#version 300 es
          in vec3 inQuantized;
          in vec3 prevPos;
          in vec3 prevPrevPos;

          uniform vec3 decodeMin;
          uniform vec3 decodeMax;
          uniform int havePrevPos;
          uniform int havePrevPrevPos;

          out vec3 outPos;

          void main()
          {
              if (havePrevPos == 1)
              {
                  vec3 dm = vec3(0.0, 0.0, 0.0);

                  if (havePrevPrevPos == 1)
                  {
                      dm = prevPos - prevPrevPos;
                  }

                  vec3 delta = (decodeMax - decodeMin) * inQuantized + decodeMin;
                  outPos = prevPos + dm + delta;
              }

              else
              {
                  outPos = (decodeMax - decodeMin) * inQuantized + decodeMin;
              }
          }`

    const tfShader = this._createProgram(gl, tfShaderSourceVS, tfShaderSourcePS, (program) => {
      gl.transformFeedbackVaryings(program, ['outPos'], gl.SEPARATE_ATTRIBS)
    })

    tfShader.havePrevPosLoc = gl.getUniformLocation(tfShader, 'havePrevPos')
    tfShader.havePrevPrevPosLoc = gl.getUniformLocation(tfShader, 'havePrevPrevPos')
    tfShader.decodeMinLoc = gl.getUniformLocation(tfShader, 'decodeMin')
    tfShader.decodeMaxLoc = gl.getUniformLocation(tfShader, 'decodeMax')
    tfShader.inQuantizedLoc = gl.getAttribLocation(tfShader, 'inQuantized')
    tfShader.prevPosLoc = gl.getAttribLocation(tfShader, 'prevPos')
    tfShader.prevPrevPosLoc = gl.getAttribLocation(tfShader, 'prevPrevPos')
    this.tfShader = tfShader

    const octNormalsShaderSourceVS = `#version 300 es
          in vec2 inOctNormal;
          out vec3 outNormal;

          vec3 OctDecode(vec2 f)
          {
              f = f * 2.0 - 1.0;

              // https://twitter.com/Stubbesaurus/status/937994790553227264
              vec3 n = vec3( f.x, f.y, 1.0 - abs(f.x) - abs(f.y));
              float t = clamp(-n.z, 0.0, 1.0);
              n.x += n.x >= 0.0 ? -t : t;
              n.y += n.y >= 0.0 ? -t : t;
              return normalize(n);
          }

          void main()
          {
              outNormal = OctDecode(inOctNormal);
          }`

    const octNormalsShader = this._createProgram(gl, octNormalsShaderSourceVS, tfShaderSourcePS, (program) => {
      gl.transformFeedbackVaryings(program, ['outNormal'], gl.SEPARATE_ATTRIBS)
    })

    octNormalsShader.inOctNormalLoc = gl.getAttribLocation(octNormalsShader, 'inOctNormal')
    this.octNormalsShader = octNormalsShader
  }

  _updateMeshTF(frame, posBuf, uvBuf, indexBuf, norBuf, sourceBuffers) {
    const {gl} = this

    // this is the buffer we're capturing to with transform feedback
    frame.outputBuffer = this.outputBuffers[this.outputBufferIndex]

    const saveVb = gl.getParameter(gl.ARRAY_BUFFER_BINDING)
    const saveIb = gl.getParameter(gl.ELEMENT_ARRAY_BUFFER_BINDING)
    const saveShader = gl.getParameter(gl.CURRENT_PROGRAM)

    gl.useProgram(this.tfShader)
    gl.bindBuffer(gl.ARRAY_BUFFER, null)

    let vertexCount = 0
    const {tfShader} = this

    if (frame.primitives[0].extensions[HoloVideoObject._extName].attributes.POSITION) {
      this.lastKeyframe = this.frameIndex

      // copy indices
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuf)
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, sourceBuffers.indices, gl.STATIC_DRAW)

      // copy uvs
      gl.bindBuffer(gl.ARRAY_BUFFER, uvBuf)
      gl.bufferData(gl.ARRAY_BUFFER, sourceBuffers.compressedUVs, gl.STATIC_DRAW)

      gl.bindVertexArray(this.vaos[0])

      this.prevMesh = null
      this.prevPrevMesh = null
      vertexCount = frame.compressedPos.count
      frame.indexCount = frame.indices.count

      // copy compressed (quantized) positions
      gl.bindBuffer(gl.ARRAY_BUFFER, this.deltasBuf)
      gl.bufferData(gl.ARRAY_BUFFER, sourceBuffers.compressedPos, gl.DYNAMIC_DRAW)
      gl.enableVertexAttribArray(tfShader.inQuantizedLoc)
      gl.vertexAttribPointer(tfShader.inQuantizedLoc, 3, frame.compressedPos.componentType, true, 0, 0)

      gl.disableVertexAttribArray(tfShader.prevPosLoc)
      gl.disableVertexAttribArray(tfShader.prevPrevPosLoc)

      const min = frame.compressedPos.extensions[HoloVideoObject._extName].decodeMin
      const max = frame.compressedPos.extensions[HoloVideoObject._extName].decodeMax

      gl.uniform3fv(tfShader.decodeMinLoc, min)
      gl.uniform3fv(tfShader.decodeMaxLoc, max)

      this.currentFrameInfo.bboxMin = min
      this.currentFrameInfo.bboxMax = max

      gl.uniform1i(tfShader.havePrevPosLoc, 0)
      gl.uniform1i(tfShader.havePrevPrevPosLoc, 0)
    } else {
      vertexCount = frame.deltas.count
      frame.indexCount = this.prevMesh.indexCount

      if (this.prevPrevMesh == null) {
        gl.bindVertexArray(this.vaos[1])
      } else {
        gl.bindVertexArray(this.vaos[2])
      }

      gl.bindBuffer(gl.ARRAY_BUFFER, this.deltasBuf)
      gl.bufferData(gl.ARRAY_BUFFER, sourceBuffers.deltas, gl.DYNAMIC_DRAW)
      gl.enableVertexAttribArray(tfShader.inQuantizedLoc)
      gl.vertexAttribPointer(tfShader.inQuantizedLoc, 3, frame.deltas.componentType, true, 0, 0)

      gl.uniform3fv(tfShader.decodeMinLoc, frame.deltas.extensions[HoloVideoObject._extName].decodeMin)
      gl.uniform3fv(tfShader.decodeMaxLoc, frame.deltas.extensions[HoloVideoObject._extName].decodeMax)

      gl.uniform1i(tfShader.havePrevPosLoc, 1)

      gl.bindBuffer(gl.ARRAY_BUFFER, this.prevMesh.outputBuffer)
      gl.enableVertexAttribArray(tfShader.prevPosLoc)
      gl.vertexAttribPointer(tfShader.prevPosLoc, 3, gl.FLOAT, false, 0, 0)

      if (this.prevPrevMesh == null) {
        gl.uniform1i(tfShader.havePrevPrevPosLoc, 0)
        gl.disableVertexAttribArray(tfShader.prevPrevPosLoc)
      } else {
        gl.uniform1i(tfShader.havePrevPrevPosLoc, 1)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.prevPrevMesh.outputBuffer)
        gl.enableVertexAttribArray(tfShader.prevPrevPosLoc)
        gl.vertexAttribPointer(tfShader.prevPrevPosLoc, 3, gl.FLOAT, false, 0, 0)
      }
    }

    // ensure output buffer has enough capacity
    var bufferSize = vertexCount * 12
    gl.bindBuffer(gl.ARRAY_BUFFER, frame.outputBuffer)
    // gl.bufferData(gl.ARRAY_BUFFER, bufferSize, gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null)

    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, this.transformFeedbacks[this.outputBufferIndex])
    gl.enable(gl.RASTERIZER_DISCARD)
    gl.beginTransformFeedback(gl.POINTS)
    gl.drawArrays(gl.POINTS, 0, vertexCount)
    gl.endTransformFeedback()
    gl.disable(gl.RASTERIZER_DISCARD)
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null)
    gl.bindBuffer(gl.TRANSFORM_FEEDBACK_BUFFER, null)

    // gl.getError();

    gl.bindVertexArray(null)

    // copy captured output into 'posBuf' passed to us by caller.
    gl.bindBuffer(gl.COPY_READ_BUFFER, frame.outputBuffer)
    gl.bindBuffer(gl.COPY_WRITE_BUFFER, posBuf)
    gl.bufferData(gl.COPY_WRITE_BUFFER, bufferSize, gl.DYNAMIC_COPY)
    gl.copyBufferSubData(gl.COPY_READ_BUFFER, gl.COPY_WRITE_BUFFER, 0, 0, bufferSize)
    gl.bindBuffer(gl.COPY_READ_BUFFER, null)
    gl.bindBuffer(gl.COPY_WRITE_BUFFER, null)

    this.outputBufferIndex = (this.outputBufferIndex + 1) % 3

    // copy normals, if any
    if (norBuf && sourceBuffers.compressedNormals) {
      // debugger;

      if (this.fileInfo.octEncodedNormals) {
        gl.useProgram(this.octNormalsShader)
        gl.bindBuffer(gl.ARRAY_BUFFER, null)

        gl.bindVertexArray(this.normalsVao)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.deltasBuf) // using deltasBuf as a scratch buffer
        gl.bufferData(gl.ARRAY_BUFFER, sourceBuffers.compressedNormals, gl.DYNAMIC_DRAW)
        gl.enableVertexAttribArray(this.octNormalsShader.inOctNormalLoc)
        gl.vertexAttribPointer(this.octNormalsShader.inOctNormalLoc, 2, gl.UNSIGNED_BYTE, true, 0, 0)

        var bufferSize = vertexCount * 12
        gl.bindBuffer(gl.ARRAY_BUFFER, norBuf)
        gl.bufferData(gl.ARRAY_BUFFER, bufferSize, gl.DYNAMIC_DRAW)
        gl.bindBuffer(gl.ARRAY_BUFFER, null)

        gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, this.normalsTF)
        gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, norBuf)
        gl.enable(gl.RASTERIZER_DISCARD)
        gl.beginTransformFeedback(gl.POINTS)
        gl.drawArrays(gl.POINTS, 0, vertexCount)
        gl.endTransformFeedback()
        gl.disable(gl.RASTERIZER_DISCARD)
        gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null)
        gl.bindBuffer(gl.TRANSFORM_FEEDBACK_BUFFER, null)

        gl.bindVertexArray(null)

        // gl.bindBuffer(gl.COPY_READ_BUFFER, norBuf);
        // gl.bindBuffer(gl.COPY_WRITE_BUFFER, norBuf);
        // gl.bufferData(gl.COPY_WRITE_BUFFER, bufferSize, gl.DYNAMIC_COPY);
        // gl.copyBufferSubData(gl.COPY_READ_BUFFER, gl.COPY_WRITE_BUFFER, 0, 0, bufferSize);
        // gl.bindBuffer(gl.COPY_READ_BUFFER, null);
        // gl.bindBuffer(gl.COPY_WRITE_BUFFER, null);
      } else {
        gl.bindBuffer(gl.ARRAY_BUFFER, norBuf)
        gl.bufferData(gl.ARRAY_BUFFER, sourceBuffers.compressedNormals, gl.DYNAMIC_DRAW)
      }
    }

    gl.useProgram(saveShader)
    gl.bindBuffer(gl.ARRAY_BUFFER, saveVb)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, saveIb)

    return true
  }

  _updateMesh(posBuf, uvBuf, indexBuf, norBuf) {
    this.frameIndex = (this.frameIndex + 1) % this.meshFrames.length

    const frame = this.meshFrames[this.frameIndex]

    if (!frame.ensureBuffers()) {
      return false
    }

    if (this.prevPrevMesh) {
      this.prevPrevMesh.uncompressedPos = null
    }

    this.prevPrevMesh = this.prevMesh
    this.prevMesh = this.curMesh
    this.curMesh = frame

    const sourceBuffers = {
      indices: null,
      compressedPos: null,
      compressedUVs: null,
      compressedNormals: null,
      deltas: null,
    }

    const {buffers} = this.json
    const {bufferViews} = this.json

    const {attributes} = frame.primitives[0].extensions[HoloVideoObject._extName]
    let arrayBufferIndex = -1

    if (attributes.POSITION) {
      arrayBufferIndex = buffers[bufferViews[frame.indices.bufferView].buffer].arrayBufferIndex
      const indexArrayBuf = this.buffers[arrayBufferIndex]
      const posArrayBuf = this.buffers[arrayBufferIndex]
      const uvArrayBuf = this.buffers[arrayBufferIndex]
      sourceBuffers.indices = new Uint16Array(indexArrayBuf, bufferViews[frame.indices.bufferView].byteOffset + frame.indices.byteOffset, frame.indices.count)
      sourceBuffers.compressedPos = new Uint16Array(posArrayBuf, bufferViews[frame.compressedPos.bufferView].byteOffset + frame.compressedPos.byteOffset, frame.compressedPos.count * 3)
      sourceBuffers.compressedUVs = new Uint16Array(uvArrayBuf, bufferViews[frame.compressedUVs.bufferView].byteOffset + frame.compressedUVs.byteOffset, frame.compressedUVs.count * 2)
    } else {
      arrayBufferIndex = buffers[bufferViews[frame.deltas.bufferView].buffer].arrayBufferIndex
      const deltasArrayBuf = this.buffers[arrayBufferIndex]
      sourceBuffers.deltas = new Uint8Array(deltasArrayBuf, bufferViews[frame.deltas.bufferView].byteOffset + frame.deltas.byteOffset, frame.deltas.count * 3)
    }

    if (arrayBufferIndex != this.currentBufferIndex) {
      this._logInfo(`currentBufferIndex -> ${arrayBufferIndex}`)
      this.freeArrayBuffers.push(this.currentBufferIndex)
      this.currentBufferIndex = arrayBufferIndex
      if (!this.pendingBufferDownload) {
        this._loadNextBuffer()
      }
    }

    if (frame.compressedNormals != null) {
      const norArrayBuf = this.buffers[buffers[bufferViews[frame.compressedNormals.bufferView].buffer].arrayBufferIndex]

      // oct encoding
      if (frame.compressedNormals.type == 'VEC2') {
        sourceBuffers.compressedNormals = new Uint8Array(norArrayBuf, bufferViews[frame.compressedNormals.bufferView].byteOffset + frame.compressedNormals.byteOffset, frame.compressedNormals.count * 2)
      }
      // quantized 16-bit xyz
      else if (frame.compressedNormals.type == 'VEC3') {
        sourceBuffers.compressedNormals = new Uint16Array(norArrayBuf, bufferViews[frame.compressedNormals.bufferView].byteOffset + frame.compressedNormals.byteOffset, frame.compressedNormals.count * 3)
      }
    }

    if (this.caps.webgl2 && !this.caps.badTF) {
      return this._updateMeshTF(frame, posBuf, uvBuf, indexBuf, norBuf, sourceBuffers)
    }

    const {gl} = this

    const saveVb = gl.getParameter(gl.ARRAY_BUFFER_BINDING)
    const saveIb = gl.getParameter(gl.ELEMENT_ARRAY_BUFFER_BINDING)

    // keyframe
    if (frame.primitives[0].extensions[HoloVideoObject._extName].attributes.POSITION) {
      this.lastKeyframe = this.frameIndex

      if (this.prevMesh) {
        this.prevMesh.uncompressedPos = null
        this.prevMesh = null
      }

      if (this.prevPrevMesh) {
        this.prevPrevMesh.uncompressedPos = null
        this.prevPrevMesh = null
      }

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuf)
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, sourceBuffers.indices, gl.DYNAMIC_DRAW)

      frame.indexCount = frame.indices.count

      {
        var {count} = frame.compressedPos

        frame.uncompressedPos = new Float32Array(count * 3) // need to keep these around to decode next frame.

        var min = frame.compressedPos.extensions[HoloVideoObject._extName].decodeMin
        var max = frame.compressedPos.extensions[HoloVideoObject._extName].decodeMax

        this.currentFrameInfo.bboxMin = min
        this.currentFrameInfo.bboxMax = max

        var bboxdx = (max[0] - min[0]) / 65535.0
        var bboxdy = (max[1] - min[1]) / 65535.0
        var bboxdz = (max[2] - min[2]) / 65535.0
        for (var i = 0; i < count; ++i) {
          var i0 = 3 * i
          var i1 = i0 + 1
          var i2 = i0 + 2
          frame.uncompressedPos[i0] = sourceBuffers.compressedPos[i0] * bboxdx + min[0]
          frame.uncompressedPos[i1] = sourceBuffers.compressedPos[i1] * bboxdy + min[1]
          frame.uncompressedPos[i2] = sourceBuffers.compressedPos[i2] * bboxdz + min[2]
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, posBuf)
        gl.bufferData(gl.ARRAY_BUFFER, frame.uncompressedPos, gl.DYNAMIC_DRAW)
      }

      // if (true) {
      // don't need to un-quantized values we'll tell glVertexAttribPointer to do it
      gl.bindBuffer(gl.ARRAY_BUFFER, uvBuf)
      gl.bufferData(gl.ARRAY_BUFFER, sourceBuffers.compressedUVs, gl.DYNAMIC_DRAW)
      // }
    } else {
      var {count} = frame.deltas

      frame.uncompressedPos = new Float32Array(count * 3)
      frame.indexCount = this.prevMesh.indexCount

      var min = frame.deltas.extensions[HoloVideoObject._extName].decodeMin
      var max = frame.deltas.extensions[HoloVideoObject._extName].decodeMax
      var bboxdx = (max[0] - min[0]) / 255.0
      var bboxdy = (max[1] - min[1]) / 255.0
      var bboxdz = (max[2] - min[2]) / 255.0

      const {deltas} = sourceBuffers

      if (this.prevPrevMesh == null) {
        for (var i = 0; i < count; ++i) {
          var i0 = 3 * i
          var i1 = i0 + 1
          var i2 = i0 + 2

          var x = this.prevMesh.uncompressedPos[i0]
          var y = this.prevMesh.uncompressedPos[i1]
          var z = this.prevMesh.uncompressedPos[i2]

          var deltaX = deltas[i0] * bboxdx + min[0]
          var deltaY = deltas[i1] * bboxdy + min[1]
          var deltaZ = deltas[i2] * bboxdz + min[2]

          // final
          x += deltaX
          y += deltaY
          z += deltaZ

          frame.uncompressedPos[i0] = x
          frame.uncompressedPos[i1] = y
          frame.uncompressedPos[i2] = z
        }
      } else {
        for (var i = 0; i < count; ++i) {
          var i0 = 3 * i
          var i1 = i0 + 1
          var i2 = i0 + 2

          var x = this.prevMesh.uncompressedPos[i0]
          var y = this.prevMesh.uncompressedPos[i1]
          var z = this.prevMesh.uncompressedPos[i2]

          const dx = x - this.prevPrevMesh.uncompressedPos[i0]
          const dy = y - this.prevPrevMesh.uncompressedPos[i1]
          const dz = z - this.prevPrevMesh.uncompressedPos[i2]

          // predicted
          x += dx
          y += dy
          z += dz

          var deltaX = deltas[i0] * bboxdx + min[0]
          var deltaY = deltas[i1] * bboxdy + min[1]
          var deltaZ = deltas[i2] * bboxdz + min[2]

          // final
          x += deltaX
          y += deltaY
          z += deltaZ

          frame.uncompressedPos[i0] = x
          frame.uncompressedPos[i1] = y
          frame.uncompressedPos[i2] = z
        }
      }

      gl.bindBuffer(gl.ARRAY_BUFFER, posBuf)
      gl.bufferData(gl.ARRAY_BUFFER, frame.uncompressedPos, gl.DYNAMIC_DRAW)
    }

    // copy normals, if any
    if (norBuf && sourceBuffers.compressedNormals) {
      // debugger;

      /*
          _OctDecode(vec2 f)
          {
              f = f * 2.0 - 1.0;

              // https://twitter.com/Stubbesaurus/status/937994790553227264
              vec3 n = vec3( f.x, f.y, 1.0 - abs(f.x) - abs(f.y));
              float t = clamp(-n.z, 0.0, 1.0);
              n.x += n.x >= 0.0 ? -t : t;
              n.y += n.y >= 0.0 ? -t : t;
              return normalize(n);
          }
          */

      if (this.fileInfo.octEncodedNormals) {
        var count = sourceBuffers.compressedNormals.length
        const uncompressedNormals = new Float32Array(3 * count)
        const {abs} = Math
        const clamp = this._clamp
        const {sqrt} = Math
        for (var i = 0; i < count; ++i) {
          var x = sourceBuffers.compressedNormals[2 * i]
          var y = sourceBuffers.compressedNormals[2 * i + 1]
          x = -1.0 + x * 0.0078125
          y = -1.0 + y * 0.0078125
          var z = 1.0 - abs(x) - abs(y)
          const t = clamp(-z, 0.0, 1.0)
          x += x >= 0.0 ? -t : t
          y += y >= 0.0 ? -t : t
          const invLen = 1.0 / Math.sqrt(x * x + y * y + z * z)
          uncompressedNormals[3 * i] = x * invLen
          uncompressedNormals[3 * i + 1] = y * invLen
          uncompressedNormals[3 * i + 2] = z * invLen
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, norBuf)
        gl.bufferData(gl.ARRAY_BUFFER, uncompressedNormals, gl.DYNAMIC_DRAW)
      } else {
        gl.bindBuffer(gl.ARRAY_BUFFER, norBuf)
        gl.bufferData(gl.ARRAY_BUFFER, sourceBuffers.compressedNormals, gl.DYNAMIC_DRAW)
      }
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, saveVb)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, saveIb)

    return true
  }

  _clamp(num, min, max) {
    return num < min ? min : num > max ? max : num
  }

  _onJsonLoaded(response) {
    this._logInfo('got json')

    const json = this.json = JSON.parse(response)

    this.minBuffers = Math.min(this.openOptions.minBuffers, this.json.buffers.length - 1)
    const {timeline} = this.json.extensions[HoloVideoObject._extName]
    this.minVideos = Math.min(2, timeline.length)

    this.buffers = [null, null, null]
    this.videoElements = [document.createElement('video')]// , document.createElement('video'), document.createElement('video')];

    this.videoElements[0].setAttribute('playsinline', 'playsinline')
    // this.videoElements[1].setAttribute('playsinline', 'playsinline');
    // this.videoElements[2].setAttribute('playsinline', 'playsinline');

    this.videoElements[0].volume = this.audioVolume

    // for (var i = 0 ; i < Math.min(3, timeline.length) ; ++i) {
    this.freeVideoElements.push(0)
    // }

    for (var i = 0; i < Math.min(this.openOptions.maxBuffers, this.json.buffers.length - 1); ++i) {
      this.freeArrayBuffers.push(i)
    }

    this._loadNextVideo()
    this._loadNextBuffer()
    this.currentBufferIndex = 0 // this is index into our ring of 3 buffers we keep in memory at a time, not full capture buffers list

    const {accessors} = this.json
    const numFrames = this.json.meshes.length

    const arrayBuffers = this.buffers

    const hvo = this

    const ensureBuffers = function () {
      const {bufferViews} = json
      const {buffers} = json

      if (this.primitives[0].extensions[HoloVideoObject._extName].attributes.POSITION) {
        const indexBufferView = bufferViews[this.indices.bufferView]
        if (buffers[indexBufferView.buffer].arrayBufferIndex == undefined ||
                  arrayBuffers[buffers[indexBufferView.buffer].arrayBufferIndex].bufferIndex != indexBufferView.buffer) {
          hvo._logInfo(`buffer for frame ${this.frameIndex} not downloaded yet: ${buffers[indexBufferView.buffer].uri}`)
          return false
        }

        const posBufferView = bufferViews[this.compressedPos.bufferView]
        if (buffers[posBufferView.buffer].arrayBufferIndex == undefined ||
                  arrayBuffers[buffers[posBufferView.buffer].arrayBufferIndex].bufferIndex != posBufferView.buffer) {
          hvo._logInfo(`buffer for frame ${this.frameIndex} not downloaded yet: ${buffers[posBufferView.buffer].uri}`)
          return false
        }

        const uvBufferView = bufferViews[this.compressedUVs.bufferView]
        if (buffers[uvBufferView.buffer].arrayBufferIndex == undefined ||
                  arrayBuffers[buffers[uvBufferView.buffer].arrayBufferIndex].bufferIndex != uvBufferView.buffer) {
          hvo._logInfo(`buffer for frame ${this.frameIndex} not downloaded yet: ${buffers[uvBufferView.buffer].uri}`)
          return false
        }
      } else {
        const deltaBufferView = bufferViews[this.deltas.bufferView]
        if (buffers[deltaBufferView.buffer].arrayBufferIndex == undefined ||
                  arrayBuffers[buffers[deltaBufferView.buffer].arrayBufferIndex].bufferIndex != deltaBufferView.buffer) {
          hvo._logInfo(`buffer for frame ${this.frameIndex} not downloaded yet: ${buffers[deltaBufferView.buffer].uri}`)
          return false
        }
      }

      if (this.compressedNormals) {
        const norBufferView = bufferViews[this.compressedNormals.bufferView]
        if (buffers[norBufferView.buffer].arrayBufferIndex == undefined ||
                  arrayBuffers[buffers[norBufferView.buffer].arrayBufferIndex].bufferIndex != norBufferView.buffer) {
          hvo._logInfo(`buffer for frame ${this.frameIndex} not downloaded yet: ${buffers[norBufferView.buffer].uri}`)
          return false
        }
      }

      return true
    }

    for (var i = 0; i < numFrames; ++i) {
      const meshFrame = this.json.meshes[i]
      meshFrame.frameIndex = i
      meshFrame.ensureBuffers = ensureBuffers

      const {attributes} = meshFrame.primitives[0].extensions[HoloVideoObject._extName]

      if (attributes.POSITION) {
        // accessor offset is relative to bufferView, not buffer
        meshFrame.indices = accessors[meshFrame.primitives[0].extensions[HoloVideoObject._extName].indices]
        meshFrame.compressedUVs = accessors[attributes.TEXCOORD_0]
        meshFrame.compressedPos = accessors[attributes.POSITION]
      } else {
        meshFrame.deltas = accessors[attributes._DELTA]
      }

      if (attributes.NORMAL != null) {
        this.fileInfo.haveNormals = true
        meshFrame.compressedNormals = accessors[attributes.NORMAL]

        if (meshFrame.compressedNormals.type == 'VEC2') {
          this.fileInfo.octEncodedNormals = true
        }
      }

      this.meshFrames.push(meshFrame)
    }

    const image = this.json.images[1].extensions[HoloVideoObject._extName]

    this.fileInfo.videoWidth = image.width
    this.fileInfo.videoHeight = image.height

    const ext = this.json.extensions[HoloVideoObject._extName]

    this.fileInfo.maxVertexCount = ext.maxVertexCount
    this.fileInfo.maxIndexCount = ext.maxIndexCount

    this.fileInfo.boundingBox = {
      'min': ext.boundingMin,
      'max': ext.boundingMax,
    }

    this.fileInfo.duration = Number((numFrames / ext.framerate).toFixed(2))

    if (this.onLoaded) {
      this.onLoaded(this.fileInfo)
    }

    if (this.outputBuffers) {
      const {gl} = this

      const saveVb = gl.getParameter(gl.ARRAY_BUFFER_BINDING)

      for (var i = 0; i < 3; ++i) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.outputBuffers[i])
        gl.bufferData(gl.ARRAY_BUFFER, 12 * ext.maxVertexCount, gl.STREAM_COPY)
      }

      gl.bindBuffer(gl.ARRAY_BUFFER, saveVb)
    }
  }

  _getChromeVersion() {
    const raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./)
    return raw ? parseInt(raw[2], 10) : false
  }

  // public APIs begin here:

  _logDebug(message, force) {
    if (this.logLevel >= 3) {
      const {id} = this
      console.log(`[${id}] ${message}`)
    }
  }

  _logInfo(message, force) {
    if (this.logLevel >= 2 || force) {
      const {id} = this
      console.log(`[${id}] ${message}`)
    }
  }

  _logWarning(message) {
    if (this.logLevel >= 1) {
      const {id} = this
      console.log(`[${id}] ${message}`)
    }
  }

  _logError(message) {
    if (this.logLevel >= 0) {
      const {id} = this
      console.log(`[${id}] ${message}`)
    }
  }

  _initializeWebGLResources(gl) {
    const caps = {}

    const version = gl.getParameter(gl.VERSION)
    caps.webgl2 = version.indexOf('WebGL 2.') != -1
    caps.badTF = false

    this.isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

    if (navigator.userAgent.includes('Mobile') &&
          navigator.platform != 'iPhone' &&
          navigator.platform != 'iPad') {
      this.isSafari = false
    }

    // Some iOS apps have Safari in their navigator.userAgent where as others do not.  For iOS
    // platforms, do the Safari workarounds.
    if (['iPhone', 'iPad', 'iPod'].includes(navigator.platform)) {
      this.isSafari = true
    }

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')

    if (debugInfo) {
      caps.vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)
      caps.renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)

      if (caps.renderer.indexOf('Mali') != -1) {
        // var chromeVersion = this._getChromeVersion();
        // if this gets fixed at some point we'd want to check for a minimum chrome/driver version here
        // https://bugs.chromium.org/p/chromium/issues/detail?id=961950#c8
        caps.badTF = true
      }
    }

    const capsStr = JSON.stringify(caps, null, 4)

    console.log(capsStr)

    // var ua = window.navigator.userAgent;
    // var iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
    // var webkit = !!ua.match(/WebKit/i);
    // var iOSSafari = iOS && webkit && !ua.match(/CriOS/i);
    // var isFirefox = typeof InstallTrigger !== 'undefined';

    this.caps = caps

    this.fbo1 = gl.createFramebuffer()

    if (this.caps.webgl2) {
      if (!this.caps.badTF) {
        this._setupTransformFeedback()
      }

      if (this.createOptions.disableAsyncDecode) {
        this.textures = [null]
      } else {
        this.fbo2 = gl.createFramebuffer()
        this.textures = new Array(this.createOptions.numAsyncFrames)
        this.pixelBuffers = new Array(this.createOptions.numAsyncFrames)
        this.readFences = new Array(this.createOptions.numAsyncFrames)
        this.nextPbo = 0
      }
    } else {
      this.textures = [null]
    }

    const saveTex = gl.getParameter(gl.TEXTURE_BINDING_2D)

    for (let i = 0; i < this.textures.length; ++i) {
      this.textures[i] = gl.createTexture()
      gl.bindTexture(gl.TEXTURE_2D, this.textures[i])
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    }

    gl.bindTexture(gl.TEXTURE_2D, saveTex)
  }

  _releaseWebGLResources(gl) {
    if (this.caps.webgl2 && !this.caps.badTF) {
      gl.deleteBuffer(this.deltasBuf)

      for (var i = 0; i < 3; ++i) {
        gl.deleteBuffer(this.outputBuffers[i])
        this.outputBuffers[i] = null
        gl.deleteTransformFeedback(this.transformFeedbacks[i])
        this.transformFeedbacks[i] = null
        gl.deleteVertexArray(this.vaos[i])
        this.vaos[i] = null
      }

      gl.deleteTransformFeedback(this.normalsTF)
      this.normalsTF = null
      gl.deleteVertexArray(this.normalsVao)
      this.normalsVao = null

      gl.deleteProgram(this.tfShader)
      this.tfShader = null

      gl.deleteProgram(this.octNormalsShader)
      this.octNormalsShader = null
    }

    if (this.pixelBuffers) {
      for (var i = 0; i < this.pixelBuffers.length; ++i) {
        gl.deleteBuffer(this.pixelBuffers[i])
        this.pixelBuffers[i] = null
      }
    }

    if (this.readFences) {
      for (var i = 0; i < this.readFences.length; ++i) {
        gl.deleteSync(this.readFences[i])
        this.readFences[i] = null
      }
    }

    this.nextPbo = 0

    for (var i = 0; i < this.textures.length; ++i) {
      gl.deleteTexture(this.textures[i])
    }

    if (this.fbo1) {
      gl.deleteFramebuffer(this.fbo1)
      this.fbo1 = null
    }

    if (this.fbo2) {
      gl.deleteFramebuffer(this.fbo2)
      this.fbo2 = null
    }
  }

  /**
   * {@link HoloVideoObject} is the internal web player implementation that interacts directly with WebGL (independent of three.js).
   * {@link HoloVideoObjectThreeJS} defines the public interface for three.js development.
   */
  constructor(gl, createOptions) {
    this.id = HoloVideoObject._instanceCounter++
    this.state = HoloVideoObject.States.Empty
    this.suspended = false
    this.gl = gl
    this.logLevel = 1
    this.audioVolume = 1.0

    if (createOptions) {
      this.createOptions = createOptions
      if (createOptions.numAsyncFrames < 2) {
        this._logWarning(`numAsyncFrames must be at least 2 (${createOptions.numAsyncFrames} specified)`)
        this.createOptions.numAsyncFrames = 2
      }
    } else {
      this.createOptions = {}
    }

    if (!this.createOptions.numAsyncFrames) {
      this.createOptions.numAsyncFrames = 3
    }

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.wasPlaying = this.state == HoloVideoObject.States.Playing
        this._logInfo('document hidden -> pausing playback')
        this.pause()
      } else if (this.wasPlaying) {
        this.wasPlaying = false
        this._logInfo('document visible -> resuming playback')
        this.play()
      }
    })

    const {canvas} = gl

    canvas.addEventListener('webglcontextlost', (event) => {
      this.contextLost = true
      this.wasPlaying = this.state == HoloVideoObject.States.Playing
      this.pause()
      this._logInfo('webglcontextlost -> pausing playback')
      this._releaseWebGLResources(gl)
    }, false)

    canvas.addEventListener('webglcontextrestored', (event) => {
      this._initializeWebGLResources(this.gl)

      if (this.json && this.outputBuffers) {
        const ext = this.json.extensions[HoloVideoObject._extName]

        const {gl} = this

        const saveVb = gl.getParameter(gl.ARRAY_BUFFER_BINDING)

        for (let i = 0; i < 3; ++i) {
          gl.bindBuffer(gl.ARRAY_BUFFER, this.outputBuffers[i])
          gl.bufferData(gl.ARRAY_BUFFER, 12 * ext.maxVertexCount, gl.STREAM_COPY)
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, saveVb)
      }

      this.contextLost = false

      if (this.wasPlaying) {
        this.wasPlaying = false
        this._logInfo('webglcontextrestored -> resuming playback')
        this.play()
      }
    }, false)

    console.log(`HoloVideoObject version ${HoloVideoObject.Version.String}`)
    this._initializeWebGLResources(gl)
  }

  getLoadProgress() {
    if (this.minBuffers == undefined) {
      return 0
    }

    if (this.state >= HoloVideoObject.States.Opened) {
      return 1.0
    }

    return (this.buffersLoaded + this.videosLoaded) / (this.minBuffers + this.minVideos)
  }

  setBuffers(posBuf, indexBuf, uvBuf, norBuf, tex) {
    const clientBuffers = {}
    clientBuffers.posBuf = posBuf
    clientBuffers.indexBuf = indexBuf
    clientBuffers.uvBuf = uvBuf
    clientBuffers.norBuf = norBuf
    clientBuffers.tex = tex
    this.clientBuffers = clientBuffers
  }

  updateToLastKeyframe() {
    if (this.lastKeyframe != -1) {
      this.frameIndex = this.lastKeyframe - 1
      this.curMesh = null
      this.prevMesh = null
      this.prevPrevMesh = null
      // this._updateMesh(this.clientBuffers.posBuf, this.clientBuffers.uvBuf, this.clientBuffers.indexBuf, this.clientBuffers.norBuf);
    }
  }

  _loadFallbackFrame() {
    if (this.json && this.fallbackFrameBuffer) {
      if (!this.fallbackTextureImage) {
        this.fallbackTextureImage = new Image()

        const encode = function (input) {
          const keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
          let output = ''
          let chr1; let chr2; let chr3; let enc1; let enc2; let enc3; let
            enc4
          let i = 0

          while (i < input.length) {
            chr1 = input[i++]
            chr2 = i < input.length ? input[i++] : Number.NaN // Not sure if the index
            chr3 = i < input.length ? input[i++] : Number.NaN // checks are needed here

            enc1 = chr1 >> 2
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4)
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6)
            enc4 = chr3 & 63

            if (isNaN(chr2)) {
              enc3 = enc4 = 64
            } else if (isNaN(chr3)) {
              enc4 = 64
            }
            output += keyStr.charAt(enc1) + keyStr.charAt(enc2) +
                                keyStr.charAt(enc3) + keyStr.charAt(enc4)
          }
          return output
        }

        // FIXME? can we always assume fallback image is image 0?
        const fallbackImage = this.json.images[0]
        const bufferView = this.json.bufferViews[fallbackImage.bufferView]

        this.fallbackTextureImage.src = `data:image/jpeg;base64,${encode(new Uint8Array(this.fallbackFrameBuffer, bufferView.byteOffset, bufferView.byteLength))}`

        this.fallbackTextureImage.onload = function () {
          this._logInfo('fallback image loaded')
          this.fallbackTextureImage.loaded = true
        }.bind(this)
      }

      if (this.fallbackTextureImage &&
              this.fallbackTextureImage.loaded &&
              !this.filledFallbackFrame &&
              this.clientBuffers &&
              this.clientBuffers.posBuf) {
        const {gl} = this

        const fallbackPrim = this.json.meshes[0].primitives[0]

        const saveVb = gl.getParameter(gl.ARRAY_BUFFER_BINDING)
        const saveIb = gl.getParameter(gl.ELEMENT_ARRAY_BUFFER_BINDING)

        let posAccesor = this.json.accessors[fallbackPrim.attributes.POSITION]
        const posBufferView = this.json.bufferViews[posAccesor.bufferView]
        gl.bindBuffer(gl.ARRAY_BUFFER, this.clientBuffers.posBuf)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.fallbackFrameBuffer, posBufferView.byteOffset + posAccesor.byteOffset, posAccesor.count * 3), gl.STATIC_DRAW)

        if (this.clientBuffers.norBuf && this.fileInfo.haveNormals) {
          const norAccesor = this.json.accessors[fallbackPrim.attributes.NORMAL]
          const norBufferView = this.json.bufferViews[norAccesor.bufferView]

          gl.bindBuffer(gl.ARRAY_BUFFER, this.clientBuffers.norBuf)
          gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.fallbackFrameBuffer, norBufferView.byteOffset + norAccesor.byteOffset, norAccesor.count * 3), gl.STATIC_DRAW)
        }

        const uvAccesor = this.json.accessors[fallbackPrim.attributes.TEXCOORD_0]
        const uvBufferView = this.json.bufferViews[uvAccesor.bufferView]
        gl.bindBuffer(gl.ARRAY_BUFFER, this.clientBuffers.uvBuf)
        gl.bufferData(gl.ARRAY_BUFFER, new Uint16Array(this.fallbackFrameBuffer, uvBufferView.byteOffset + uvAccesor.byteOffset, uvAccesor.count * 2), gl.STATIC_DRAW)

        const indexAccessor = this.json.accessors[fallbackPrim.indices]
        const indexBufferView = this.json.bufferViews[indexAccessor.bufferView]
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.clientBuffers.indexBuf)
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.fallbackFrameBuffer, indexBufferView.byteOffset + indexAccessor.byteOffset, indexAccessor.count), gl.STATIC_DRAW)

        gl.bindBuffer(gl.ARRAY_BUFFER, saveVb)
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, saveIb)

        gl.pixelStorei(gl.PACK_ALIGNMENT, 4)
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false)
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false)

        const saveTex = gl.getParameter(gl.TEXTURE_BINDING_2D)
        gl.bindTexture(gl.TEXTURE_2D, this.clientBuffers.tex)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.fallbackTextureImage)
        gl.bindTexture(gl.TEXTURE_2D, saveTex)

        this.currentFrameInfo.primCount = indexAccessor.count

        posAccesor = this.json.accessors[fallbackPrim.extensions[HoloVideoObject._extName].attributes.POSITION]
        const min = posAccesor.extensions[HoloVideoObject._extName].decodeMin
        const max = posAccesor.extensions[HoloVideoObject._extName].decodeMax
        this.currentFrameInfo.bboxMin = min
        this.currentFrameInfo.bboxMax = max

        this.filledFallbackFrame = true
        // keeping these around for rewind:
        // this.fallbackTextureImage = null;
        // this.fallbackFrameBuffer = null;
      }

      return this.filledFallbackFrame
    }
  }

  updateBuffers() {
    if (this.contextLost) {
      return false
    }

    if (!this.filledFallbackFrame) {
      return this._loadFallbackFrame()
    }

    const {timeline} = this.json.extensions[HoloVideoObject._extName]
    const image = this.json.images[timeline[this.currentVideoIndex].image]
    const currentVideo = image.video

    // if (!this.needMeshData &&
    //     currentVideo &&
    //     currentVideo.playing &&
    //     this.suspended && currentVideo.readyState == 4) {
    //    this._logInfo("updateBuffers resuming stalled video");
    //    currentVideo.play();
    //    this.suspended = false;
    // }

    if (currentVideo && currentVideo.playing && !this.suspended) {
      // When video is playing its last few frames it can reach readyState < 4 and not be "stalled".
      // if (currentVideo.readyState != 4) {
      //    this._logInfo("suspending currentVideo.readyState -> " + currentVideo.readyState)
      //    currentVideo.pause();
      //    this.suspended = true;
      // }

      const now = window.performance.now()
      const videoNow = currentVideo.currentTime * 1000

      if (now - this.lastUpdate < 20.0) {
        return false
      }

      // this._logInfo("updateBuffers time since last update = " + (now - this.lastUpdate));
      // this._logInfo("video time since last update = " + (videoNow - this.lastVideoTime));
      this.lastVideoTime = videoNow
      this.lastUpdate = now

      const {gl} = this

      if (!this.watermarkPixels) {
        this.watermarkPixels = new Uint8Array(image.extensions[HoloVideoObject._extName].width * 4)
      }

      let videoSampleIndex = -1

      const saveFbo = gl.getParameter(gl.FRAMEBUFFER_BINDING)
      const saveTex = gl.getParameter(gl.TEXTURE_BINDING_2D)

      const useAsyncDecode = this.caps.webgl2 && !this.createOptions.disableAsyncDecode

      if (useAsyncDecode) {
        var readPbo = (this.nextPbo + 1) % this.pixelBuffers.length

        if (this.readFences[readPbo] != null) {
          var status = gl.getSyncParameter(this.readFences[readPbo], gl.SYNC_STATUS)

          // Disable this for now as it adds an unpredictable amout of latency to video decoding (beyond 'numAsyncFrames' number of frames)
          // instead we'll just read PBO when we need to even if this results in a stall (and webgl warnings in the console)
          // if (status == gl.UNSIGNALED) {
          //    this._logInfo("fence not signaled for readPbo = " + readPbo);
          //    return false;
          // }

          gl.deleteSync(this.readFences[readPbo])
          this.readFences[readPbo] = null

          gl.bindBuffer(gl.PIXEL_PACK_BUFFER, this.pixelBuffers[readPbo])
          gl.getBufferSubData(gl.PIXEL_PACK_BUFFER, 0, this.watermarkPixels, 0, this.watermarkPixels.byteLength)

          var blockSize = image.extensions[HoloVideoObject._extName].blockSize * 4
          videoSampleIndex = 0
          for (var i = 0; i < 16; ++i) {
            if (this.watermarkPixels[blockSize * i + 0] > 128 || this.watermarkPixels[blockSize * i + 4] > 128) {
              videoSampleIndex += 1 << i
            }
          }

          // this._logInfo("read pbo " + readPbo + " -> frame index " + videoSampleIndex);

          // At this point we know that frame 'videoSampleIndex' is contained in textures[readPbo], but we don't want to copy it to client texture
          // until we know we have the matching mesh frame.
        }

        if (!this.pixelBuffers[this.nextPbo]) {
          this.pixelBuffers[this.nextPbo] = gl.createBuffer()
          gl.bindBuffer(gl.PIXEL_PACK_BUFFER, this.pixelBuffers[this.nextPbo])
          gl.bufferData(gl.PIXEL_PACK_BUFFER, this.watermarkPixels.byteLength, gl.DYNAMIC_READ)
        }

        // fill 'nextPbo' texture slice with current contents of video and start an async readback of the watermark pixels
        // this._logInfo("video -> texture slice " + this.nextPbo);

        gl.pixelStorei(gl.PACK_ALIGNMENT, 4)
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false)
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false)

        gl.bindTexture(gl.TEXTURE_2D, this.textures[this.nextPbo])
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, currentVideo)

        gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo1)
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.textures[this.nextPbo], 0)
        gl.bindBuffer(gl.PIXEL_PACK_BUFFER, this.pixelBuffers[this.nextPbo])
        gl.readPixels(0, 0, this.watermarkPixels.byteLength / 4, 1, gl.RGBA, gl.UNSIGNED_BYTE, 0)
        gl.bindFramebuffer(gl.FRAMEBUFFER, null)

        // this._logInfo("read texture slice " + this.nextPbo + " -> pbo " + this.nextPbo);

        this.readFences[this.nextPbo] = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0)
        this.nextPbo = (this.nextPbo + 1) % this.pixelBuffers.length
      } else {
        gl.pixelStorei(gl.PACK_ALIGNMENT, 4)
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false)
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false)

        gl.bindTexture(gl.TEXTURE_2D, this.textures[0])
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, currentVideo)

        const error = gl.getError()

        if (error == gl.NO_ERROR) {
          gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo1)
          gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.textures[0], 0)
          gl.readPixels(0, 0, this.watermarkPixels.byteLength / 4, 1, gl.RGBA, gl.UNSIGNED_BYTE, this.watermarkPixels)

          var blockSize = image.extensions[HoloVideoObject._extName].blockSize * 4
          videoSampleIndex = 0
          for (var i = 0; i < 16; ++i) {
            if (this.watermarkPixels[blockSize * i + 0] > 128 || this.watermarkPixels[blockSize * i + 4] > 128) {
              videoSampleIndex += 1 << i
            }
          }

          let allBlack = true
          // video frame jumped back to 0, this could be a loop, or a black/invalid frame.
          // scan the whole watermark row and if every pixel is black assume it's an invalid frame.
          if (videoSampleIndex == 0 && videoSampleIndex < this.lastVideoSampleIndex) {
            for (var i = 0; i < this.watermarkPixels.byteLength; ++i) {
              if (this.watermarkPixels[i] != 0) {
                allBlack = false
                break
              }
            }

            if (allBlack) {
              this._logWarning('dropping empty/black video frame')
              this.currentFrameInfo.primCount = 0
              return true
            }
          }
        } else {
          this._logWarning(`webgl error: ${error} skipping video texture read`)
        }
      }

      // if (videoSampleIndex < this.lastVideoSampleIndex) {
      //  console.log("video loop detected");
      // }

      if (videoSampleIndex > -1 && (this.curMesh == null || this.curMesh.frameIndex != videoSampleIndex)) {
        this._logDebug(`videoSampleIndex -> ${videoSampleIndex}`)

        if (this.meshFrames[videoSampleIndex].ensureBuffers()) {
          if (videoSampleIndex < this.lastVideoSampleIndex) {
            this.frameIndex = -1
            this._updateMesh(this.clientBuffers.posBuf, this.clientBuffers.uvBuf, this.clientBuffers.indexBuf, this.clientBuffers.norBuf)
            this._logInfo(`loop detected, videoSampleIndex = ${videoSampleIndex}, curMesh.frameIndex = ${this.curMesh.frameIndex}`)
          }

          while (this.curMesh == null || this.curMesh.frameIndex < videoSampleIndex) {
            if (!this._updateMesh(this.clientBuffers.posBuf, this.clientBuffers.uvBuf, this.clientBuffers.indexBuf, this.clientBuffers.norBuf)) {
              break
            }
          }

          this._logDebug(`updated to frame index = ${videoSampleIndex}`)

          // Don't update texture unless we were able to update mesh to target frame (the only reason this should ever be possible is if the mesh data isn't downloaded yet)
          // Note that we're not stopping the video -> texture -> pbo -> watermark loop from continuing, not sure if this matters?
          if (this.curMesh.frameIndex == videoSampleIndex) {
            const w = currentVideo.videoWidth
            const h = currentVideo.videoHeight
            if (useAsyncDecode) {
              // if (this.textures[readPbo]) {
              gl.bindFramebuffer(gl.READ_FRAMEBUFFER, this.fbo1)
              gl.framebufferTexture2D(gl.READ_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.textures[readPbo], 0)
              gl.readBuffer(gl.COLOR_ATTACHMENT0)

              gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.fbo2)
              gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.clientBuffers.tex, 0)
              gl.drawBuffers([gl.COLOR_ATTACHMENT0])

              // this._logInfo("texture slice " + readPbo + " -> client texture");

              var status = gl.checkFramebufferStatus(gl.READ_FRAMEBUFFER)
              const status2 = gl.checkFramebufferStatus(gl.DRAW_FRAMEBUFFER)

              gl.blitFramebuffer(0, 0, w, h, 0, 0, w, h, gl.COLOR_BUFFER_BIT, gl.NEAREST)
              //  }
            } else {
              gl.bindTexture(gl.TEXTURE_2D, this.clientBuffers.tex)
              gl.copyTexSubImage2D(gl.TEXTURE_2D, 0, 0, 0, 0, 0, w, h)
            }
          }

          if (this.curMesh && this.curMesh.frameIndex != videoSampleIndex) {
            this._logInfo(`texture (${videoSampleIndex}) <-> mesh (${this.curMesh.frameIndex}) mismatch`)
          }

          this.lastVideoSampleIndex = videoSampleIndex
        } else {
          this._logWarning(`ran out of mesh data, suspending video ${currentVideo.mp4Name}`)
          currentVideo.pause()
          this.suspended = true
          this.needMeshData = true
          if (!this.pendingBufferDownload) {
            this._loadNextBuffer()
          }
        }
      }

      gl.bindFramebuffer(gl.FRAMEBUFFER, saveFbo)
      gl.bindTexture(gl.TEXTURE_2D, saveTex)
    }

    if (this.curMesh) {
      this.currentFrameInfo.primCount = this.curMesh.indexCount
      this.currentFrameInfo.frameIndex = this.curMesh.frameIndex
      if (this.onUpdateCurrentFrame) {
        this.onUpdateCurrentFrame(this.curMesh.frameIndex)
      }
      return true
    }

    return false
  }

  close() {
    if (this.httpRequest) {
      this.httpRequest.abort()
      this.httpRequest = null
    }

    if (this.dashPlayer) {
      this.dashPlayer.reset()
    }

    for (let i = 0; i < this.videoElements.length; ++i) {
      this.videoElements[i].pause()
      this.videoElements[i].removeAttribute('src')
    }
    this.state = HoloVideoObject.States.Closed
  }

  pause() {
    if (this.videoElements.length > 0 && this.videoElements[this.currentVideoIndex]) {
      this.videoElements[this.currentVideoIndex].pause()
      this.state = HoloVideoObject.States.Paused
    }
  }

  setAudioVolume(volume) {
    this.audioVolume = volume
    this.videoElements[this.currentVideoIndex].volume = volume
  }

  setAutoLooping(loop) {
    this.openOptions.autoloop = loop
    this.videoElements[this.currentVideoIndex].loop = loop
  }

  setAudioEnabled(enabled) {
    this.videoElements[this.currentVideoIndex].muted = !enabled
  }

  audioEnabled() {
    return !this.videoElements[this.currentVideoIndex].muted
  }

  play() {
    const playPromise = this.videoElements[this.currentVideoIndex].play()

    if (playPromise !== undefined) {
      playPromise.then((_) => {
        this.state = HoloVideoObject.States.Playing
      })
        .catch((error) => {
          // Auto-play was prevented
          this._logInfo(`play prevented: ${error}`)
        })
    }
  }

  open(gltfURL, options) {
    if (this.state >= HoloVideoObject.States.Opening) {
      this.close()
    }

    this.state = HoloVideoObject.States.Opening

    // leave this pointing to parent directory of .gltf file so we can locate .bin, .mp4 files relative to it.
    this.urlRoot = gltfURL.substring(0, gltfURL.lastIndexOf('/') + 1)

    this.meshFrames = []
    this.buffersLoaded = 0
    this.videosLoaded = 0

    // indices into arrays below for next objects we can load data into
    this.freeArrayBuffers = []
    this.freeVideoElements = []

    // owning references on video and buffer objects (max size 3)
    this.buffers = []
    this.videoElements = []

    // next video/buffer to load (ahead of playback position)
    this.nextVideoLoadIndex = 0
    this.nextBufferLoadIndex = 0

    this.currentFrameInfo = {
      primCount: 0,
    }

    // these are current playback positions
    this.currentVideoIndex = 0
    this.currentBufferIndex = -1

    this.lastVideoTime = 0
    this.lastUpdate = 0

    this.json = null
    this.fileInfo = {
      haveNormals: false,
      octEncodedNormals: false,
    }

    if (options) {
      this.openOptions = options
    } else {
      this.openOptions = {}
    }

    if (!this.openOptions.minBuffers) {
      this.openOptions.minBuffers = 2
    }

    if (!this.openOptions.maxBuffers) {
      this.openOptions.maxBuffers = 3
    }

    if (this.readFences) {
      for (let i = 0; i < this.readFences.length; ++i) {
        if (this.readFences[i]) {
          this.gl.deleteSync(this.readFences[i])
          this.readFences[i] = null
        }
      }
    }

    this.nextPbo = 0

    this.curMesh = null
    this.prevMesh = null
    this.prevPrevMesh = null
    this.frameIndex = -1
    this.lastKeyframe = -1
    this.lastVideoSampleIndex = -1
    this.filledFallbackFrame = false
    this.fallbackFrameBuffer = null
    this.fallbackTextureImage = null
    this.eos = false

    this._loadJSON(gltfURL, this._onJsonLoaded.bind(this))
  }
}

HoloVideoObject._instanceCounter = 0

/**
* HoloVideoObject States
* @readonly
* @enum {number}
*/
HoloVideoObject.States = {
  /** A previously loaded capture has been unloaded. A new capture may be opened by calling {@link HoloVideoObjectThreeJS#open} */
  Closed: -1,
  /** Initial state of all HoloVideoObjectThreeJS instances */
  Empty: 0,
  /** A capture is in the process of opening and buffering data for playback. */
  Opening: 1,
  /** The capture loaded and ready for {@link HoloVideoObjectThreeJS#play} to be called */
  Opened: 2,
  /** Capture playback is in progress */
  Playing: 3,
  /** Playback is paused and may be resumed by calling {@link HoloVideoObjectThreeJS#play} */
  Paused: 4,
}

HoloVideoObject._extName = 'HCAP_holovideo'

HoloVideoObject.Version = {}
HoloVideoObject.Version.Major = 1
HoloVideoObject.Version.Minor = 2
HoloVideoObject.Version.Patch = 3
HoloVideoObject.Version.String = `${HoloVideoObject.Version.Major}.${HoloVideoObject.Version.Minor}.${HoloVideoObject.Version.Patch}`
