/* eslint-disable import/no-unresolved */
const NativeMiniaudio =
    globalThis.NativeMiniaudio || require('external/miniaudio-addon/miniaudio-addon')
const {miniaudioPlayAudio, miniaudioStopAudio, miniaudioPauseAudio, miniaudioResumeAudio, 
    miniaudioUpdateGain, miniaudioDecodeAudio} = NativeMiniaudio

function playAudio(channels, totalGain = 1, panLeftGain = 0, panRightGain = 1, panAzimuth = true,
                   finishedCallback = () => {}) {
    return miniaudioPlayAudio(channels, totalGain, panLeftGain, panRightGain,
                              panAzimuth, finishedCallback)
}

function stopAudio(streamID) {
    if (!Number.isInteger(streamID)) {
        throw new Error(`Stream ID must be an integer. Received: ${streamId}`);
    }
    miniaudioStopAudio(streamID)
}

function pauseAudio(streamID) {
    if (!Number.isInteger(streamID)) {
        throw new Error(`Stream ID must be an integer. Received: ${streamId}`);
    }
    miniaudioPauseAudio(streamID)
}

function resumeAudio(streamID) {
    if (!Number.isInteger(streamID)) {
        throw new Error(`Stream ID must be an integer. Received: ${streamId}`);
    }
    miniaudioResumeAudio(streamID)
}

function updateGain(streamID, totalGain, panLeftGain = 0, panRightGain = 1, panAzimuth = true) {
    miniaudioUpdateGain(streamID, totalGain, panLeftGain, panRightGain, panAzimuth)
}

function decodeAudio(audioData, sampleRate = 44100, callback) {
    return miniaudioDecodeAudio(audioData, sampleRate, callback)
}

export {playAudio, stopAudio, pauseAudio, resumeAudio, updateGain, decodeAudio}
