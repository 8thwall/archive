import Foundation
import CoreHaptics
import AudioToolbox
import Tauri

class VibrationManager {

  // Shared haptic engine instance to avoid recreation overhead
  private static var hapticEngine: CHHapticEngine?
  private static var currentPlayer: CHHapticPatternPlayer?
  private static let hapticQueue = DispatchQueue(label: "haptic.vibration", qos: .userInteractive)

  private static let DEFAULT_INTENSITY: Float = 1.0
  private static let DEFAULT_SHARPNESS: Float = 0.5

  private static let MS_TO_SEC: Double = 0.001

  /// Executes a vibration pattern based on the Web Vibration API specification
  /// - Parameter pattern: Array of UInt32 values representing vibration and pause durations in milliseconds
  /// - Parameter invoke: Tauri invoke object to resolve the result
  static func vibrate(pattern: [UInt32], invoke: Invoke) {
    guard !pattern.isEmpty else {
      invoke.resolve(false)
      return
    }

    invoke.resolve(true)

    hapticQueue.async {
      performVibration(pattern: pattern)
    }
  }

  /// Performs the actual vibration work on a background queue
  /// - Parameter pattern: Array of UInt32 values representing vibration and pause durations in milliseconds
  private static func performVibration(pattern: [UInt32]) {
    let supportsHaptics = CHHapticEngine.capabilitiesForHardware().supportsHaptics
    guard supportsHaptics else {
      DispatchQueue.main.async {
        AudioServicesPlaySystemSound(SystemSoundID(kSystemSoundID_Vibrate))
      }
      return
    }

    do {
      let engine = try getOrCreateHapticEngine()

      // Stop any existing player first
      if let existingPlayer = currentPlayer {
        try existingPlayer.stop(atTime: 0)
        currentPlayer = nil
      }

      // Stop and restart the engine to ensure clean state
      if engine.currentTime > 0 {
        engine.stop { _ in
        }
      }

      try engine.start()

      let events = createHapticEvents(from: pattern)

      if !events.isEmpty {
        let hapticPattern = try CHHapticPattern(events: events, parameters: [])
        let player = try engine.makePlayer(with: hapticPattern)

        currentPlayer = player

        try player.start(atTime: 0)
      } else {
      }

    } catch {
      DispatchQueue.main.async {
        AudioServicesPlaySystemSound(SystemSoundID(kSystemSoundID_Vibrate))
      }
    }
  }

  /// Gets or creates the shared haptic engine instance
  /// - Returns: CHHapticEngine instance
  /// - Throws: CHHapticError if engine creation fails
  private static func getOrCreateHapticEngine() throws -> CHHapticEngine {
    if let existingEngine = hapticEngine {
      return existingEngine
    }

    let engine = try CHHapticEngine()

    engine.stoppedHandler = { reason in
      hapticEngine = nil
      currentPlayer = nil
    }

    engine.resetHandler = {
      hapticEngine = nil
      currentPlayer = nil
    }

    hapticEngine = engine
    return engine
  }

  /// Creates haptic events from a vibration pattern
  /// - Parameter pattern: Array of UInt32 values representing vibration and pause durations in milliseconds
  /// - Returns: Array of CHHapticEvent objects
  private static func createHapticEvents(from pattern: [UInt32]) -> [CHHapticEvent] {
    var events: [CHHapticEvent] = []
    events.reserveCapacity(pattern.count / 2)
    var currentTime: TimeInterval = 0


    for (index, duration) in pattern.enumerated() {
      let durationSeconds = TimeInterval(duration) * MS_TO_SEC

      if index % 2 == 0 && duration > 0 {
        let intensity = CHHapticEventParameter(parameterID: .hapticIntensity, value: DEFAULT_INTENSITY)
        let sharpness = CHHapticEventParameter(parameterID: .hapticSharpness, value: DEFAULT_SHARPNESS)

        let event = CHHapticEvent(
          eventType: .hapticContinuous,
          parameters: [intensity, sharpness],
          relativeTime: currentTime,
          duration: durationSeconds
        )

        events.append(event)
      }

      currentTime += durationSeconds
    }

    return events
  }
}
