import SwiftRs
import Tauri
import UIKit
import WebKit
import CoreLocation

class NativeAppExportPlugin: Plugin {
  @objc open override func load(webview: WKWebView) {
    guard let rootVC = UIApplication.shared.keyWindow?.rootViewController else { return }

    rootVC.edgesForExtendedLayout = .all
    rootVC.extendedLayoutIncludesOpaqueBars = true

    webview.backgroundColor = .clear
    webview.scrollView.backgroundColor = .clear
    webview.scrollView.contentInsetAdjustmentBehavior = .never

    webview.autoresizingMask = [.flexibleWidth, .flexibleHeight]
    webview.frame = rootVC.view.bounds

    // NOTE(lreyna): This is needed to extend WKUIDelegate
    webview.uiDelegate = self
  }

  @objc public func vibrate(_ invoke: Invoke) throws {
    let pattern = try invoke.parseArgs([UInt32].self)
    VibrationManager.vibrate(pattern: pattern, invoke: invoke)
  }
}

// This enables us to grant WebView permissions without a user prompt
// However, the screen does flash as if the pop-up was presented for a brief moment.
extension NativeAppExportPlugin: WKUIDelegate {
  @available(iOS 15, *)
  func webView(_ webView: WKWebView,
               requestDeviceOrientationAndMotionPermissionFor origin: WKSecurityOrigin,
               initiatedByFrame frame: WKFrameInfo,
               decisionHandler: @escaping (WKPermissionDecision) -> Void) {
    decisionHandler(.grant)
  }

  // NOTE(lreyna): The application permission prompt for Camera / Microphone will still appear.
  // This just prevents a follow up prompt from the WebView
  @available(iOS 15, *)
  func webView(_ webView: WKWebView,
               requestMediaCapturePermissionFor origin: WKSecurityOrigin,
               initiatedByFrame frame: WKFrameInfo,
               type: WKMediaCaptureType,
               decisionHandler: @escaping (WKPermissionDecision) -> Void) {
    decisionHandler(.grant)
  }

  @available(iOS 15, *)
  func webView(_ webView: WKWebView,
               requestGeolocationPermissionFor origin: WKSecurityOrigin,
               initiatedByFrame frame: WKFrameInfo,
               decisionHandler: @escaping (WKPermissionDecision) -> Void) {
    let locationStatus = CLLocationManager.authorizationStatus()

    switch locationStatus {
    case .authorizedWhenInUse, .authorizedAlways:
      decisionHandler(.grant)
    case .denied, .restricted:
      decisionHandler(.deny)
    @unknown default:
      decisionHandler(.deny)
    }
  }
}

@_cdecl("init_plugin_native_app_export")
func initPlugin() -> Plugin {
  return NativeAppExportPlugin()
}
