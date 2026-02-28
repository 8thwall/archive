// @sublibrary(:audio-lib)
import {AudioDestinationNode, AudioNode} from './audio-node'
import type {AudioContext} from './audio-context'
import type {HTMLMediaElement} from '../html-media-element'
import type {PannerGain} from './panner-node'
import {PannerNode} from './panner-node'
import {GainNode} from './gain-node'
import type {AudioBuffer} from './audio-buffer'
import {playAudio, updateGain} from './miniaudio'

class MediaElementAudioSourceNode extends AudioNode {
  _mediaElement: HTMLMediaElement

  private _pathToDestination: AudioNode[] = []

  private _streamIDs: number[] = []

  // intermediate variables for computing gains
  _totalGain: number = 1

  _pannerGain: PannerGain = {left: 0.0, right: 1.0, azimuthLeft: true}

  _distanceGain: number = 1.0

  _coneGain: number = 1.0

  constructor(context: AudioContext, mediaElement: HTMLMediaElement) {
    super(context)
    this._mediaElement = mediaElement
  }

  pathToDestination() {
    const path = []
    let node: AudioNode | null = this
    while (node) {
      if (node instanceof AudioDestinationNode) {
        this._pathToDestination = path
        return
      }
      path.push(node)
      if (node instanceof PannerNode) {
        node.sourceNode = this
      }
      const nextNode: AudioNode = [...node._destination][0] || null
      node = nextNode
    }
  }

  // eslint-disable-next-line class-methods-use-this
  play(buffer: AudioBuffer, finishedCallback = () => {}): number {
    if (this._pathToDestination.length === 0) {
      this.pathToDestination()
    }

    this.computeGains()
    const streamID = playAudio(
      buffer._channelData,
      this._totalGain,
      this._pannerGain.left,
      this._pannerGain.right,
      this._pannerGain.azimuthLeft,
      finishedCallback
    )
    this._streamIDs.push(streamID)
    return streamID
  }

  /**
 * Computes the gain values for the audio nodes by traversing the audio graph.
 *
 * @param {boolean} [coneGainOnly=false] - If true, only the cone gain is computed.
 *  If false, cone, distance and stereo panning gain are all computed.
 *  the reason for this flag is that panner orientation is only used to compute the cone gain,
 *  so we can skip recomputing panner's panning+distance gain if panner orientation is the only
 *  value that changed.
 */
  computeGains(coneGainOnly = false) {
    let totalGain = 1.0  // Start with unity gain
    for (const node of this._pathToDestination) {
      if (node instanceof GainNode) {
        totalGain *= node.gain.value
      } else if (node instanceof PannerNode) {
        const panner = node as PannerNode
        if (coneGainOnly) {
          totalGain *= (this._distanceGain * panner.computeConeGain())
        } else {  // compute all gains
        // Assume only one panner node in the graph
          this._pannerGain = panner.computeStereoPanningGain()
          this._distanceGain = panner.computeDistanceGain()
          totalGain *= (this._distanceGain * panner.computeConeGain())
        }
      }
    }
    this._totalGain = totalGain
  }

  updateGains(coneGainOnly = false) {
    this.computeGains(coneGainOnly)
    for (const streamID of this._streamIDs) {
      updateGain(streamID,
        this._totalGain,
        this._pannerGain.left,
        this._pannerGain.right,
        this._pannerGain.azimuthLeft)
    }
  }
}

export {MediaElementAudioSourceNode}
