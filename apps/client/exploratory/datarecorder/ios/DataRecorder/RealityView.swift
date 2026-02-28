//
//  RealityView.swift
//  DataRecorder
//
//  Created by Nicholas Butko on 2/28/17.
//  Copyright © 2017 8th Wall. All rights reserved.
//

import UIKit
import AVFoundation


class RealityView: UIView {
  // TODO(nbutko): Remove from Main.storyboard and then remove this class.
}

class RealityFeatureView : UIView {

  override init(frame :CGRect) {
    super.init(frame: frame)
    self.isOpaque = false
    self.backgroundColor = UIColor.clear
  }

  required init?(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }


  override func draw(_ rect: CGRect) {
    // Lock self from other threads while drawing.
    objc_sync_enter(self)
    defer {objc_sync_exit(self) }
  }
}
