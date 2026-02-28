// Copyright (c) 2017 8th Wall, Inc.
// Original Author: Scott Pollack (scott@8thwall.com)

import UIKit
import AVFoundation

class DataRecorderController: UIViewController, UIPickerViewDelegate, UIPickerViewDataSource {

  private var isLogging_ = false
  private var showDepth_ = false

  @IBOutlet weak var button_: UIButton!

  // Frame Count Picker
  @IBOutlet weak var picker_: UIPickerView!
  private var pickerData_: [Int32] = [Int32]()
  private var frameCount_: Int32 = 0

  // Communicate with the session and other session objects on this queue.
  private let sessionQueue_ = DispatchQueue(label: "session queue", attributes: [], target: nil)

  // View handles.
  @IBOutlet private weak var realityView_: RealityView!
  private var realityFeatureView_: RealityFeatureView!
  private var realityFrameView_: UIImageView!

  // Reality engine handles.

  private var lastRealityUpdateMicros_ : Int64 = 0

  override func viewDidLoad() {
    super.viewDidLoad()

    c8XRIos_create(2 /* Metal */, nil, nil, nil)
    c8XRIos_createDiskRecorder()

    // Set up the frame count picker
    self.picker_.delegate = self
    self.picker_.dataSource = self
    pickerData_ = [30, 90, 300, 600, 900, 1800];
    let index = 3
    self.picker_.selectRow(index, inComponent:0, animated:false)
    frameCount_ = pickerData_[index];

    // Set up the video preview view.
    let offset = CGFloat(70);
    let bounds = CGRect(x: realityView_.bounds.minX,
                        y: realityView_.bounds.minY + offset,
                        width: realityView_.bounds.width,
                        height: realityView_.bounds.height - offset)

    self.realityFrameView_ = UIImageView(frame: bounds)
    self.realityFrameView_.isOpaque = true
    self.realityFrameView_.isHidden = false
    // TODO(nb): scale-aspect-fill crops the image too much; but the other choices are worse.
    self.realityFrameView_.contentMode = UIViewContentMode.scaleAspectFill
    self.realityView_.addSubview(self.realityFrameView_)

    self.realityFeatureView_ = RealityFeatureView(frame: bounds)
    self.realityView_.addSubview(self.realityFeatureView_)

    // Configure the reality engine to request features.
    let imgViewCPtr = Unmanaged.passUnretained(self.realityFrameView_).toOpaque()
    c8XRIos_setManagedImageView(imgViewCPtr)

    var config = c8_XRConfigurationLegacy()
    config.maskLighting = true
    config.maskCamera = true
    config.maskSurfaces = true
    config.autofocus = true
    config.depthMapping = true
    // NOTE(akul): If you change the bundleId of the xcode app, you will need to update the appKey
    // here. You can get a new appKey from the unity cloud editor workspace.
    config.mobileAppKey = UnsafePointer<Int8>("d3a0LldMn962WEDAYzEVFcAFnCw1cxXWaF9sZi9ubpcDSK95F33bLSfMSBj6RDW9f7kRwq")
    c8XRIos_configureXRLegacy(&config)
  }

  // The number of columns of data
  func numberOfComponentsInPickerView(pickerView: UIPickerView) -> Int {
    return 1
  }

  func numberOfComponents(in pickerView: UIPickerView) -> Int {
    return 1
  }

  // The number of rows of data
  func pickerView(_ pickerView: UIPickerView, numberOfRowsInComponent component: Int) -> Int {
    return pickerData_.count
  }

  // The data to return for the row and component (column) that's being passed in
  func pickerView(_ pickerView: UIPickerView, titleForRow row: Int, forComponent component: Int) -> String? {
    return String(pickerData_[row])
  }

  // Catpure the picker view selection
  func pickerView(_ pickerView: UIPickerView, didSelectRow row: Int, inComponent component: Int) {
    frameCount_ = pickerData_[row]
  }

  @IBAction func clickButton() {
    print("[DataRecorderController] click c8XRIos_isLogging="
      + (c8XRIos_isLogging() ? "true" : "false")
      + " XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    if (c8XRIos_isLogging()) {
      self.pauseLogging();
    } else {
      self.startLogging();
    }
  }

  @IBAction func toggleDepthButton() {
    if (showDepth_) {
      self.showCamera();
    } else {
      self.showDepth();
    }
  }


  func pauseLogging() {
    print("[DataRecorderController] Pausing.")
    button_.setTitle("START", for: .normal)
    isLogging_ = false
    c8XRIos_pause()
  }

  func startLogging() {
    print("[DataRecorderController] Recording for", frameCount_, "frames")
    button_.setTitle("PAUSE", for: .normal)
    isLogging_ = true
    c8XRIos_resume()
    c8XRIos_logToDisk(frameCount_)
    self.scheduleNextUpdate()
  }

  func showDepth() {
    print("[DataRecorderController] Showing Depth View.")
    showDepth_ = true;
  }

  func showCamera() {
    print("[DataRecorderController] Showing Camera View.")
    showDepth_ = false;
  }

  func scheduleNextUpdate() {
    DispatchQueue.main.async { [unowned self] in
      self.runNextUpdate()
    }
  }

  func runNextUpdate() {
    if (!c8XRIos_isLogging()) {
      if (isLogging_) {
        print("[DataRecorderController] C8 is finished logging")
        self.pauseLogging()
      }
      return;
    }

    var currentReality = c8_XRResponseLegacy()
    c8XRIos_getCurrentRealityXRLegacy(&currentReality)
    if (currentReality.eventIdTimeMicros > self.lastRealityUpdateMicros_) {
      self.lastRealityUpdateMicros_ = currentReality.eventIdTimeMicros
      if (showDepth_) {
        c8XRIos_renderDepthFrameForDisplay()
      } else {
        c8XRIos_renderFrameForDisplay()
      }
    }
    scheduleNextUpdate()
  }

  override func viewWillAppear(_ animated: Bool) {
    super.viewWillAppear(animated)
    sessionQueue_.async {
      // self.pauseLogging();
    }
  }

  override func viewWillDisappear(_ animated: Bool) {
    sessionQueue_.async { [unowned self] in
      // self.pauseLogging()
    }
    super.viewWillDisappear(animated)
  }

  override var shouldAutorotate: Bool {
    return false
  }

  override var supportedInterfaceOrientations: UIInterfaceOrientationMask {
    return .portrait
  }

}
