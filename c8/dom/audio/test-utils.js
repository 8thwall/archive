const generateSampleAudioData = (sampleRate, durationInSeconds, frequency, amplitude) => {
  const numSamples = sampleRate * durationInSeconds
  const leftChannel = new Float32Array(numSamples)
  const rightChannel = new Float32Array(numSamples)

  for (let i = 0; i < numSamples; i++) {
    // Generate a sine wave for each channel
    const time = i / sampleRate
    const sineWave = Math.sin(2 * Math.PI * frequency * time)

    // Fill the left and right channels with the sine wave
    leftChannel[i] = amplitude * sineWave
    rightChannel[i] = amplitude * sineWave
  }

  return [leftChannel, rightChannel]  // Return as an array of channels
}

const generateSamplePCM = (sampleRate, durationInSeconds, frequency, amplitudeFactor = 1.0) => {
  const numSamples = sampleRate * durationInSeconds
  const audioData = new Int16Array(numSamples * 2)  // Double the size for stereo
  const MAX_INT16 = 32767
  for (let i = 0; i < numSamples; i++) {
    // Scale to 16-bit PCM
    const sampleValue =
       Math.sin((2 * Math.PI * frequency * i) / sampleRate) * MAX_INT16 * amplitudeFactor
    // Left channel
    audioData[i * 2] = sampleValue
    // Right channel (same for stereo)
    audioData[i * 2 + 1] = sampleValue
  }
  return audioData
}

// Helper function to write strings to DataView
const writeString = (view, offset, str) => {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i))
  }
}

const createWavBlob = (audioData, sampleRate = 44100) => {
  const byteRate = sampleRate * 4  // 2 bytes per channel, 2 channels
  const audioLength = audioData.length * 2  // each sample is 2 bytes
  const totalSize = 44 + audioLength  // WAV header is 44 bytes
  const buffer = new ArrayBuffer(totalSize)
  const view = new DataView(buffer)

  // Write WAV header
  writeString(view, 0, 'RIFF')
  view.setUint32(4, 36 + audioLength, true)  // File size - 8
  writeString(view, 8, 'WAVE')
  writeString(view, 12, 'fmt ')
  view.setUint32(16, 16, true)  // Subchunk1Size for PCM
  view.setUint16(20, 1, true)  // AudioFormat (PCM)
  view.setUint16(22, 2, true)  // NumChannels (Stereo)
  view.setUint32(24, sampleRate, true)  // SampleRate
  view.setUint32(28, byteRate, true)  // ByteRate
  view.setUint16(32, 4, true)  // BlockAlign (2 bytes/channel * 2 channels)
  view.setUint16(34, 16, true)  // BitsPerSample
  writeString(view, 36, 'data')
  view.setUint32(40, audioLength, true)  // Subchunk2Size

  // Write PCM data for stereo (interleaved)
  for (let i = 0; i < audioData.length / 2; i++) {
    const leftSample = audioData[i * 2]       // Left channel
    const rightSample = audioData[i * 2 + 1]  // Right channel

    view.setInt16(44 + i * 4, leftSample, true)       // Left channel
    view.setInt16(44 + i * 4 + 2, rightSample, true)  // Right channel
  }

  return new Blob([buffer], {type: 'audio/wav'})
}

const createEmptyMP3Blob = (numframes) => {
  // MP3 header for a silent frame (MPEG version 1, layer III, 128kbps, 44.1kHz, stereo)
  // This is a standard silent MP3 frame header, just repeat this for a minimal silent MP3
  const silentFrameHex = 'fffb9044000000000000000000000000'

  // Convert hex string to byte array
  const silentFrame =
    new Uint8Array(silentFrameHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)))

  // Repeat the silent frame multiple times to simulate an empty MP3
  const numFrames = numframes  // Adjust this number to change the MP3 length
  const mp3Data = new Uint8Array(silentFrame.length * numFrames)

  for (let i = 0; i < numFrames; i++) {
    mp3Data.set(silentFrame, i * silentFrame.length)
  }

  return new Blob([mp3Data], {type: 'audio/mpeg'})
}

export {generateSampleAudioData, generateSamplePCM, createWavBlob, createEmptyMP3Blob}
