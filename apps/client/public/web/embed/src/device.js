export const deviceIsCompatible = () => navigator.userAgent.match(/Android/i) ||
  navigator.userAgent.match(/iPhone|iPad|iPod/i) ||
  navigator.userAgent.match(/Pacific/) || // Oculus Go
  navigator.userAgent.match(/Quest/) // Oculus Quest

export const browserIsCompatible = () => deviceIsCompatible() &&
  window.DeviceOrientationEvent &&
  window.WebAssembly &&
  window.navigator.mediaDevices &&
  window.navigator.mediaDevices.getUserMedia

export default {
  deviceIsCompatible,
  browserIsCompatible,
}
