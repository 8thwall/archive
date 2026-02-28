// @inliner-off
type DecodedBuffer = {
  // Number of frames
  length: number,
  numberOfChannels: number,
  sampleRate: number,
  left: Buffer,
  right: Buffer,
  error?: Error,
}

declare function playAudio(
  buffer: Float32Array[],
  totalGain?: number,
  panLeftGain?: number,
  panRightGain?: number,
  panAzimuth?: boolean,
  finishedCallback?: () => void
): number;

declare function updateGain(
  streamId: number,
  totalGain: number,
  panLeftGain?: number,
  panRightGain?: number,
  panAzimuth?: boolean
): void;

declare function decodeAudio(
  data: ArrayBuffer,
  sampleRate?: number,
  callback?: (audioBuffer: DecodedBuffer) => void,
): void;

declare function stopAudio(streamId: number): void;

declare function pauseAudio(streamId: number): void;

declare function resumeAudio(streamId: number): void;

export {
  playAudio,
  stopAudio,
  pauseAudio,
  resumeAudio,
  updateGain,
  decodeAudio,
  DecodedBuffer,
}
