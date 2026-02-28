// Copyright (c) 2018 8th Wall, Inc.
//
// Application that calibrates devices using XR remote.

#include <time.h>
#include <cctype>
#include <iostream>
#include <opencv2/highgui.hpp>
#include <opencv2/imgproc.hpp>
#include "reality/quality/visualization/render/expanded-reality.h"
#include "reality/quality/visualization/protolog/log-record-capture.h"
#include "c8/calibrate/cvcamcalibrate.h"

using namespace cv;
using namespace std;
using namespace c8;

const char *usage =
  " \nexample command line for calibration from a live feed.\n"
  "   bazel run -c opt //reality/quality/visualization:cvcamcalibration -- -w=7 -h=7 -p=chessboard "
  "-n=10 -d=3000 -s=23 -o=$HOME/Desktop/cam.yaml -op -oe -zt -a=1.0 1\n";

const char *liveCaptureHelp =
  "When the live video from camera is used as "
  "input, the following hot-keys may be used:\n"
  "  <ESC>, 'q' - quit the program\n"
  "  'g' - start capturing images\n"
  "  'u' - switch undistortion on/off\n";

static void help() {
  printf(
    "This is a camera calibration sample.\n"
    "Usage: calibration\n"
    "     -w=<board_width>         # the number of inner corners per one of board dimension\n"
    "     -h=<board_height>        # the number of inner corners per another board dimension\n"
    "     [-pt=<pattern>]          # the type of pattern: chessboard or circles' grid\n"
    "     [-n=<number_of_frames>]  # the number of frames to use for calibration\n"
    "                              # (if not specified, it will be set to the number\n"
    "                              #  of board views actually available)\n"
    "     [-d=<delay>]             # a minimum delay in ms between subsequent attempts to capture\n"
    "                              # a next view (used only for video capturing)\n"
    "     [-s=<squareSize>]        # square size in some user-defined units (1 by default)\n"
    "     [-o=<out_camera_params>] # the output filename for intrinsic [and extrinsic] parameters\n"
    "     [-op]                    # write detected feature points\n"
    "     [-oe]                    # write extrinsic parameters\n"
    "     [-zt]                    # assume zero tangential distortion\n"
    "     [-a=<aspectRatio>]       # fix aspect ratio (fx/fy)\n"
    "     [-g]                     # start calibration with first frame and quit after calibration complete\n"
    "     [-p]                     # fix the principal point at the center\n"
    "     [-v]                     # flip the captured images around the horizontal axis\n"
    "     [-V]                     # use a video file, and not an image list, uses\n"
    "                              # [input_data] string for the video file name\n"
    "     [-su]                    # show undistorted images after calibration\n"
    "     [input_data]             # input data, one of the following:\n"
    "                              #  - text file with a list of the images of the board\n"
    "                              #    the text file can be generated with imagelist_creator\n"
    "                              #  - name of video file with a video of the board\n"
    "                              # if input_data unspecified, the camera is used\n"
    "\n");
  printf("\n%s", usage);
  printf("\n%s", liveCaptureHelp);
}

void saveCameraParams(
  const string &filename,
  Size imageSize,
  Size boardSize,
  float squareSize,
  float aspectRatio,
  int flags,
  const vector<vector<Point2f>> &imagePoints,
  const CalibrationOutput &calibrationOutput) {
  FileStorage fs(filename, FileStorage::WRITE);

  const auto &cameraMatrix = calibrationOutput.cameraMatrix;
  const auto &distCoeffs = calibrationOutput.distCoeffs;
  const auto &rvecs = calibrationOutput.rvecs;
  const auto &tvecs = calibrationOutput.tvecs;
  const auto &reprojErrs = calibrationOutput.reprojErrs;
  double totalAvgErr = calibrationOutput.totalAvgErr;

  time_t tt;
  time(&tt);
  struct tm *t2 = localtime(&tt);
  char buf[1024];
  strftime(buf, sizeof(buf) - 1, "%c", t2);

  fs << "calibration_time" << buf;

  if (!rvecs.empty() || !reprojErrs.empty())
    fs << "nframes" << (int)std::max(rvecs.size(), reprojErrs.size());
  fs << "image_width" << imageSize.width;
  fs << "image_height" << imageSize.height;
  fs << "board_width" << boardSize.width;
  fs << "board_height" << boardSize.height;
  fs << "square_size" << squareSize;

  if (flags & CALIB_FIX_ASPECT_RATIO)
    fs << "aspectRatio" << aspectRatio;

  if (flags != 0) {
    sprintf(
      buf,
      "flags: %s%s%s%s",
      flags & CALIB_USE_INTRINSIC_GUESS ? "+use_intrinsic_guess" : "",
      flags & CALIB_FIX_ASPECT_RATIO ? "+fix_aspectRatio" : "",
      flags & CALIB_FIX_PRINCIPAL_POINT ? "+fix_principal_point" : "",
      flags & CALIB_ZERO_TANGENT_DIST ? "+zero_tangent_dist" : "");
    // cvWriteComment( *fs, buf, 0 );
  }

  fs << "flags" << flags;

  fs << "camera_matrix" << cameraMatrix;
  fs << "distortion_coefficients" << distCoeffs;

  fs << "avg_reprojection_error" << totalAvgErr;
  if (!reprojErrs.empty())
    fs << "per_view_reprojection_errors" << Mat(reprojErrs);

  if (!rvecs.empty() && !tvecs.empty()) {
    CV_Assert(rvecs[0].type() == tvecs[0].type());
    Mat bigmat((int)rvecs.size(), 6, rvecs[0].type());
    for (int i = 0; i < (int)rvecs.size(); i++) {
      Mat r = bigmat(Range(i, i + 1), Range(0, 3));
      Mat t = bigmat(Range(i, i + 1), Range(3, 6));

      CV_Assert(rvecs[i].rows == 3 && rvecs[i].cols == 1);
      CV_Assert(tvecs[i].rows == 3 && tvecs[i].cols == 1);
      //*.t() is MatExpr (not Mat) so we can use assignment operator
      r = rvecs[i].t();
      t = tvecs[i].t();
    }
    // cvWriteComment( *fs, "a set of 6-tuples (rotation vector + translation
    // vector) for each view", 0 );
    fs << "extrinsic_parameters" << bigmat;
  }

  if (!imagePoints.empty()) {
    Mat imagePtMat((int)imagePoints.size(), (int)imagePoints[0].size(), CV_32FC2);
    for (int i = 0; i < (int)imagePoints.size(); i++) {
      Mat r = imagePtMat.row(i).reshape(2, imagePtMat.cols);
      Mat imgpti(imagePoints[i]);
      imgpti.copyTo(r);
    }
    fs << "image_points" << imagePtMat;
  }
}

bool runAndSave(
  const string &outputFilename,
  const vector<vector<Point2f>> &imagePoints,
  Size imageSize,
  Size boardSize,
  Pattern patternType,
  float squareSize,
  float aspectRatio,
  int flags,
  Mat &cameraMatrix,
  Mat &distCoeffs,
  bool writeExtrinsics,
  bool writePoints) {
  vector<Mat> rvecs, tvecs;
  vector<float> reprojErrs;
  CalibrationOutput out;

  runCalibration(
    imagePoints,
    imageSize,
    boardSize,
    patternType,
    squareSize,
    aspectRatio,
    flags,
    &out);
  printf(
    "%s. avg reprojection error = %.2f\n",
    out.ok ? "Calibration succeeded" : "Calibration failed",
    out.totalAvgErr);

  if (out.ok)
    saveCameraParams(
      outputFilename,
      imageSize,
      boardSize,
      squareSize,
      aspectRatio,
      flags,
      writePoints ? imagePoints : vector<vector<Point2f>>(),
      out);
  return out.ok;
}

int main(int argc, char **argv) {
  Size boardSize, imageSize;
  float squareSize, aspectRatio;
  Mat cameraMatrix, distCoeffs;
  string outputFilename;
  string inputFilename = "";

  int i, nframes;
  bool writeExtrinsics, writePoints, calibrateAndQuit;
  bool undistortImage = false;
  int flags = 0;
  std::unique_ptr<LogRecordCapture>capture(nullptr);
  bool flipVertical;
  bool showUndistorted;
  bool videofile;
  int delay;
  clock_t prevTimestamp = 0;
  int mode = DETECTION;
  int cameraId = 1;
  vector<vector<Point2f>> imagePoints;
  vector<string> imageList;
  Pattern pattern = CHESSBOARD;

  cv::CommandLineParser parser(
    argc,
    argv,
    "{help "
    "||}{w||}{h||}{g||}{pt|chessboard|}{n|10|}{d|1000|}{"
    "s|1|}{o|out_camera_data.yml|}"
    "{op||}{oe||}{zt||}{a|1|}{p||}{v||}{V||}{su||}"
    "{@input_data|0|}");
  if (parser.has("help")) {
    help();
    return 0;
  }
  boardSize.width = parser.get<int>("w");
  boardSize.height = parser.get<int>("h");
  if (parser.has("pt")) {
    string val = parser.get<string>("pt");
    if (val == "circles")
      pattern = CIRCLES_GRID;
    else if (val == "acircles")
      pattern = ASYMMETRIC_CIRCLES_GRID;
    else if (val == "chessboard")
      pattern = CHESSBOARD;
    else
      return fprintf(stderr, "Invalid pattern type: must be chessboard or circles\n"), -1;
  }
  squareSize = parser.get<float>("s");
  nframes = parser.get<int>("n");
  aspectRatio = parser.get<float>("a");
  delay = parser.get<int>("d");
  writePoints = parser.has("op");
  writeExtrinsics = parser.has("oe");
  if (parser.has("a"))
    flags |= CALIB_FIX_ASPECT_RATIO;
  if (parser.has("zt"))
    flags |= CALIB_ZERO_TANGENT_DIST;
  if (parser.has("p"))
    flags |= CALIB_FIX_PRINCIPAL_POINT;
  if (parser.has("g"))
    calibrateAndQuit = true;
  flipVertical = parser.has("v");
  videofile = parser.has("V");
  if (parser.has("o"))
    outputFilename = parser.get<string>("o");
  showUndistorted = parser.has("su");
  if (isdigit(parser.get<string>("@input_data")[0]))
    cameraId = parser.get<int>("@input_data");
  else
    inputFilename = parser.get<string>("@input_data");
  if (!parser.check()) {
    help();
    parser.printErrors();
    return -1;
  }
  if (squareSize <= 0)
    return fprintf(stderr, "Invalid board square width\n"), -1;
  if (nframes <= 3)
    return printf("Invalid number of images\n"), -1;
  if (aspectRatio <= 0)
    return printf("Invalid aspect ratio\n"), -1;
  if (delay <= 0)
    return printf("Invalid delay\n"), -1;
  if (boardSize.width <= 0)
    return fprintf(stderr, "Invalid board width\n"), -1;
  if (boardSize.height <= 0)
    return fprintf(stderr, "Invalid board height\n"), -1;

  if (!inputFilename.empty()) {
    capture.reset(LogRecordCapture::create(inputFilename.c_str()));
  } else {
    std::cout << "Capturing input from log records (stdin)" << std::endl;
    capture.reset(LogRecordCapture::create(""));
  }

  if (!capture->isOpened() && imageList.empty()) {
    return fprintf(stderr, "Could not initialize video capture\n"), -2;
  }

  if (!imageList.empty()) {
    nframes = (int)imageList.size();
  }

  if (capture->isOpened() && !calibrateAndQuit) {
    printf("%s", liveCaptureHelp);
  }

  namedWindow("Image View", 1);

  XRCapnpSensors sensors;
  // Main camera feed loop: loop forever (until break)
  for (i = 0;; i++) {
    Mat view, viewGray;
    bool blink = false;

    //////////////////////////////////////////////////////////////////////////////////
    // Frame acquisition: how do you get a frame to process?
    //////////////////////////////////////////////////////////////////////////////////

    // Grab a new image from the sensors.
    if (capture->isOpened()) {
      Mat view0;
      capture->read(&sensors);  // Reads from the network stream
      renderFrameForDisplay(sensors, &view0);  // extracts a frame from the read data.
      if (view0.rows == 0) {
        if (calibrateAndQuit) {
          break;
        }
        std::cout << "Grabbed empty frame!" << std::endl;
        waitKey(300);
        continue;
      }
      view0.copyTo(view);
    } else if (i < (int)imageList.size())
      view = imread(imageList[i], 1);

    // If there's no more data, quit early. Try to run with whatever you have.
    if (view.empty()) {
      if (imagePoints.size() > 0)
        runAndSave(
          outputFilename,
          imagePoints,
          imageSize,
          boardSize,
          pattern,
          squareSize,
          aspectRatio,
          flags,
          cameraMatrix,
          distCoeffs,
          writeExtrinsics,
          writePoints);
      break;
    }

    imageSize = view.size();

    if (flipVertical)
      flip(view, view, 0);

    vector<Point2f> pointbuf;
    Mat vg;

    viewGray = makeImageGray(view, &vg);

    bool found;

    try {
      found = processFrame(
        &viewGray,
        pattern,
        &boardSize,
        &imagePoints,
        &pointbuf);
    }

    catch(const std::exception&) {
      return EXIT_FAILURE;
    }

    renderBoardWithCorners(&view, viewGray, boardSize, &pointbuf, found);

    //////////////////////////////////////////////////////////////////////////////////
    // Judgement - Do we use this data for calibration or not?
    //////////////////////////////////////////////////////////////////////////////////

    // If we found an image and it's enough time from the last image, or if our if we're
    // just using a sequence of pre-collected images, add this to the list of images that
    // we found to use as input to calibration.
    if (
      mode == CAPTURING && found
      && (!capture->isOpened() || clock() - prevTimestamp > delay * 1e-3 * CLOCKS_PER_SEC)) {
      imagePoints.push_back(pointbuf);  // Add the 49 points to our list of 10 frames for calibration.
      prevTimestamp = clock();  // Remember the time to restart the min-time-delta clock.
      blink = capture->isOpened();  // For display only, set a note to later invert the colors of the
                                    // display image so we can tell that a frame happened.
    }

    // Print some useful progress stts on top of the displayed image.
    string msg =
      mode == CAPTURING ? "100/100" : mode == CALIBRATED ? "Calibrated" : "Press 'g' to start";
    int baseLine = 0;
    Size textSize = getTextSize(msg, 1, 1, 1, &baseLine);
    Point textOrigin(view.cols - 2 * textSize.width - 10, view.rows - 2 * baseLine - 10);

    if (mode == CAPTURING) {
      if (undistortImage)
        msg = c8::format("%d/%d Undist", (int)imagePoints.size(), nframes);
      else
        msg = c8::format("%d/%d", (int)imagePoints.size(), nframes);
    }

    putText(
      view, msg, textOrigin, 1, 1, mode != CALIBRATED ? Scalar(0, 0, 255) : Scalar(0, 255, 0));

    // Invert the image for display.
    if (blink)
      bitwise_not(view, view);

    // If we requested to calibrate undistortion parameters and pressed the right key to show undistortion,
    // warp the image with the undistortion parametrs.
    if (mode == CALIBRATED && undistortImage) {
      Mat temp = view.clone();
      undistort(temp, view, cameraMatrix, distCoeffs);
    }

    //////////////////////////////////////////////////////////////////////////////////
    // Display and user interface: paint the screen and collect keyboard input.
    //////////////////////////////////////////////////////////////////////////////////

    // Draw the image the screen
    imshow("Image View", view);
    char key = (char)waitKey(capture->isOpened() ? 50 : 500);

    // If the user hits the escape key, stop capture early.
    if (key == 27)
      break;

    // Let the user toggle undistorted view by pressing 'u'
    if (key == 'u' && mode == CALIBRATED)
      undistortImage = !undistortImage;

    // Start running calibration if the usre presses 'g'
    if (mode != CAPTURING && capture->isOpened() && (key == 'g' || calibrateAndQuit)) {
      mode = CAPTURING;
      imagePoints.clear();
    }

    //////////////////////////////////////////////////////////////////////////////////
    // Core calibration routine: turn 10x49 numbers into a field of view and save it.
    //////////////////////////////////////////////////////////////////////////////////

    // If we've collected 10x49 sets of points, then compute calibration params and write to disk.
    if (mode == CAPTURING && imagePoints.size() >= (unsigned)nframes) {
      if (runAndSave(
            outputFilename,
            imagePoints,
            imageSize,
            boardSize,
            pattern,
            squareSize,
            aspectRatio,
            flags,
            cameraMatrix,
            distCoeffs,
            writeExtrinsics,
            writePoints))
        mode = CALIBRATED;
      else
        mode = DETECTION;
      if (!capture->isOpened())
        break;
      }

    if (calibrateAndQuit && mode == CALIBRATED) {
      break;
    }
  }

  if (!capture->isOpened() && showUndistorted) {
    Mat view, rview, map1, map2;
    initUndistortRectifyMap(
      cameraMatrix,
      distCoeffs,
      Mat(),
      getOptimalNewCameraMatrix(cameraMatrix, distCoeffs, imageSize, 1, imageSize, 0),
      imageSize,
      CV_16SC2,
      map1,
      map2);

    for (i = 0; i < (int)imageList.size(); i++) {
      view = imread(imageList[i], 1);
      if (view.empty())
        continue;
      // undistort( view, rview, cameraMatrix, distCoeffs, cameraMatrix );
      remap(view, rview, map1, map2, INTER_LINEAR);
      imshow("Image View", rview);
      char c = (char)waitKey();
      if (c == 27 || c == 'q' || c == 'Q')
        break;
    }
  }

  return 0;
}
