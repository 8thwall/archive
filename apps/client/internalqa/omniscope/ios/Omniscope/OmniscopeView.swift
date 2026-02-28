// Copyright (c) 2025 Niantic, Inc.
// Original Author: Yu-Hsiang Huang (yuhsianghuang@nianticlabs.com)

import Foundation
import UIKit

class OmniscopeView: UIView {

  private var sourceTextureRGBA_: GLuint = 0

  override class var layerClass: AnyClass {
    return CAMetalLayer.self
  }

  override init(frame: CGRect) {
    super.init(frame: frame)

    let layer = self.layer as! CAMetalLayer
    let layerPtr = unsafeBitCast(layer, to: UnsafeMutableRawPointer.self)
    c8EglDisplayLayerIos_create(layerPtr, 2 /* Metal */)

    // TODO(yuhsianghuang): Create EglDisplayLayerIos directly on the render thread so that we don't
    //                      have to unbind it here (on main thread) and re-bind it after the render
    //                      thread is ready.
    c8EglDisplayLayerIos_unbind()
  }

  required init?(coder: NSCoder) {
    fatalError("[OmniscopeView] init(coder:) has not been implemented")
  }

  deinit {
    c8EglDisplayLayerIos_destroy()
  }

  func getEglDisplay() -> UnsafeMutableRawPointer {
    return c8EglDisplayLayerIos_getDisplay()
  }

  func getEglSurface() -> UnsafeMutableRawPointer {
    return c8EglDisplayLayerIos_getSurface()
  }

  func getEglContext() -> UnsafeMutableRawPointer {
    return c8EglDisplayLayerIos_getContext()
  }

  // TODO(yuhsianghuang): Handle touch events.
}
