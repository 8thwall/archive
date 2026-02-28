// Copyright (c) 2024 Niantic, Inc.
// Original Author: Riyaan Bakhda (riyaanbakhda@nianticlabs.com)

import Foundation
import UIKit

class OmniscopeController: UIViewController {

  private var omniscopeView_: OmniscopeView!
  private var nextButton_: UIButton!

  private var isPaused_: Bool = true

  override func viewDidLoad() {
    super.viewDidLoad()

    //
    // Set up views.
    //

    self.view.isOpaque = false
    self.view.backgroundColor = UIColor.white

    let offset: CGFloat = 125
    let bounds = CGRect(
      x: self.view.bounds.minX,
      y: self.view.bounds.minY + offset,
      width: self.view.bounds.width,
      height: self.view.bounds.height - offset)
    omniscopeView_ = OmniscopeView(frame: bounds)
    omniscopeView_.isOpaque = true
    self.view.addSubview(omniscopeView_)

    nextButton_ = UIButton(frame: CGRect(x: 125, y: 50, width: 125, height: 50))
    nextButton_.backgroundColor = UIColor.gray
    nextButton_.setTitle("Next", for: .normal)
    nextButton_.addTarget(self, action: #selector(handleButtonAction), for: .touchUpInside)
    nextButton_.tag = 1
    self.view.addSubview(nextButton_)

    //
    // Configure XRIos & OmniscopeIos.
    //

    // NOTE: Even though we are drawing into a Metal layer in OmniscopeView, here the rendering
    //       system is set to OpenGL (1) instead of Metal (2) since we are copying camera frames to
    //       a OpenGL texture.
    c8XRIos_create(1 /* OpenGL */, nil, nil, nil)
    c8OmniscopeIos_create()

    // TODO(yuhsianghuang): Change the app id to "com.nianticlabs.Omniscope" and update its app key
    //                      accordingly. Also, apply the same changes to the Android version.
    var config = c8_XRConfigurationLegacy()
    config.maskLighting = true
    config.maskCamera = true
    config.maskSurfaces = true
    config.autofocus = true
    config.graphicsIntrinsicsTextureWidth = Int32(omniscopeView_.bounds.width)
    config.graphicsIntrinsicsTextureHeight = Int32(omniscopeView_.bounds.height)
    config.mobileAppKey =
      UnsafePointer<Int8>("<REMOVED_BEFORE_OPEN_SOURCING>")
    c8XRIos_configureXRLegacy(&config)
    c8OmniscopeIos_configureXRLegacy(&config)

    let eglDisplay = omniscopeView_.getEglDisplay()
    let eglSurface = omniscopeView_.getEglSurface()
    let eglContext = omniscopeView_.getEglContext()
    c8OmniscopeIos_createCaptureContext(eglContext)
    c8OmniscopeIos_createBackgroundThreads(eglDisplay, eglSurface, eglContext)
    c8OmniscopeIos_initializeCameraPipeline()

    // Attach OmniscopeIos to XRIos as a RealityPostprocessor callback to receive frame data. With
    // this setup, in order to resume/pause the pipeline execution, we should be calling the XRIos
    // API instead of the OmniscopeIos API (see resume() and pause() below).
    c8OmniscopeIos_setXRRealityPostprocessor()
  }

  override func viewDidAppear(_ animated: Bool) {
    super.viewDidAppear(animated)

    resume()
  }

  override func viewDidDisappear(_ animated: Bool) {
    super.viewDidDisappear(animated)

    pause()
  }

  deinit {
    c8OmniscopeIos_destroyCaptureContext()
    c8OmniscopeIos_destroy()
  }

  @objc func handleButtonAction(sender: UIButton!) {
    if (sender.tag == 1) { // from nextButton_
      c8OmniscopeIos_goNext()

      dismiss(animated: true, completion: nil)
    }
  }

  private func resume() {
    if (!isPaused_) {
      return
    }

    print("[OmniscopeController] Resuming...")

    c8XRIos_resume()

    isPaused_ = false
  }

  private func pause() {
    if (isPaused_) {
      return
    }

    print("[OmniscopeController] Pausing...")

    c8XRIos_pause()

    isPaused_ = true
  }
}
