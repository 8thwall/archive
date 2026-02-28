// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Dat Chu (dat@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_binary {
  deps = {
    "//c8:c8-log",
    "//c8:c8-log-proto",
    "//c8/geometry:egomotion",
    "//c8/pixels:pixel-buffer",
    "//c8/pixels:pixel-transforms",
    "//c8/pixels:pixels",
    "//c8/protolog:xr-requests",
    "//reality/quality/visualization/xrom/framework:reality-stream-factory",
    "@cxxopts//:cxxopts",
    "@opencv//:core",
    "@opencv//:calib3d",
    "@opencv//:highgui",
    "@opencv//:imgproc",
  };
  linkopts = {
    "-framework AVFoundation",
    "-framework Cocoa",
  };
}
cc_end(0x1dbb5e3f);

#include <cxxopts.hpp>
#include <iostream>
#include <memory>
#include <opencv2/core.hpp>
#include <opencv2/calib3d.hpp>
#include <opencv2/highgui.hpp>
#include <opencv2/imgproc.hpp>
#include "c8/c8-log-proto.h"
#include "c8/c8-log.h"
#include "c8/geometry/egomotion.h"
#include "c8/pixels/pixel-buffer.h"
#include "c8/pixels/pixel-transforms.h"
#include "c8/protolog/xr-requests.h"
#include "c8/stats/scope-timer.h"
#include "reality/quality/visualization/xrom/framework/reality-stream-factory.h"

using namespace c8;

class FrameWithPosition {
public:
  FrameWithPosition(RealityRequest::Reader request, RealityResponse::Reader response) {
    auto camera = request.getSensors().getCamera();

    // Get the camera frame in RGB
    auto frame = camera.getCurrentFrame();
    auto ypix = constFrameYPixels(frame);
    auto uvpix = constFrameUVPixels(frame);

    auto p = displaybuf.pixels();
    if (p.rows() != ypix.rows() || p.cols() != ypix.cols()) {
      displaybuf = BGR888PlanePixelBuffer(ypix.rows(), ypix.cols());
      p = displaybuf.pixels();
    }

    BGR888PlanePixels lp(ypix.rows(), ypix.cols(), p.rowBytes(), p.pixels());
    ScopeTimer t("dense-depth-from-position");
    yuvToBgr(ypix, uvpix, &lp);

    // camera intrinsic, and extrinsic parameters
    float s = 360.0f / 1080.0f;  // TODO(dat): make this works on non-Pixel2 DataRecorder
    auto i = request.getSensors().getCamera().getPixelIntrinsics();

    intrinsics = c8_PixelPinholeCameraModel{static_cast<int>(i.getPixelsWidth() * s) + 120,
                                            static_cast<int>(i.getPixelsHeight() * s),
                                            i.getCenterPointX() * s + 60,
                                            i.getCenterPointY() * s,
                                            i.getFocalLengthHorizontal() * s,
                                            i.getFocalLengthVertical() * s};

    auto me = response.getXRResponse().getCamera().getExtrinsic();
    extrinsics = cameraMotion(toHVector(me.getPosition()), toQuaternion(me.getRotation()));
  }

  c8_PixelPinholeCameraModel intrinsics;
  HMatrix extrinsics = HMatrixGen::i();
  BGR888PlanePixelBuffer displaybuf;
};

class StereoDepthGeneration : public RealityStreamCallback {
public:
  StereoDepthGeneration() {}

  void processReality(
    RealityStreamInterface *stream,
    RealityRequest::Reader request,
    RealityResponse::Reader response) override {
    FrameWithPosition frame(request, response);
    if (images_.empty() || largeDistance(images_.back(), frame)) {
      images_.push_back(std::move(frame));
    }
  }

  bool largeDistance(const FrameWithPosition &prev, const FrameWithPosition &current) {
    auto m = egomotion(prev.extrinsics, current.extrinsics);
    return translation(m).l2Norm() > .125;
  }

  Vector<FrameWithPosition> images_;
};

void combineLeftRight(const cv::Mat &left, const cv::Mat &right, cv::Mat &output) {
  if (output.rows != left.rows || output.cols != left.cols * 2) {
    output = cv::Mat(left.rows, left.cols * 2, CV_8UC3);
  }
  left.copyTo(output.colRange(0, left.cols));
  right.copyTo(output.colRange(left.cols, left.cols * 2));
}

static void icvGetRectangles(
  const CvMat *cameraMatrix,
  const CvMat *distCoeffs,
  const CvMat *R,
  const CvMat *newCameraMatrix,
  CvSize imgSize,
  cv::Rect_<float> &inner,
  cv::Rect_<float> &outer) {
  const int N = 9;
  int x, y, k;
  cv::Ptr<CvMat> _pts(cvCreateMat(1, N * N, CV_32FC2));
  CvPoint2D32f *pts = (CvPoint2D32f *)(_pts->data.ptr);

  for (y = k = 0; y < N; y++)
    for (x = 0; x < N; x++)
      pts[k++] =
        cvPoint2D32f((float)x * imgSize.width / (N - 1), (float)y * imgSize.height / (N - 1));

  cvUndistortPoints(_pts, _pts, cameraMatrix, distCoeffs, R, newCameraMatrix);

  float iX0 = -FLT_MAX, iX1 = FLT_MAX, iY0 = -FLT_MAX, iY1 = FLT_MAX;
  float oX0 = FLT_MAX, oX1 = -FLT_MAX, oY0 = FLT_MAX, oY1 = -FLT_MAX;
  // find the inscribed rectangle.
  // the code will likely not work with extreme rotation matrices (R) (>45%)
  for (y = k = 0; y < N; y++)
    for (x = 0; x < N; x++) {
      CvPoint2D32f p = pts[k++];
      oX0 = MIN(oX0, p.x);
      oX1 = MAX(oX1, p.x);
      oY0 = MIN(oY0, p.y);
      oY1 = MAX(oY1, p.y);

      if (x == 0)
        iX0 = MAX(iX0, p.x);
      if (x == N - 1)
        iX1 = MIN(iX1, p.x);
      if (y == 0)
        iY0 = MAX(iY0, p.y);
      if (y == N - 1)
        iY1 = MIN(iY1, p.y);
    }
  inner = cv::Rect_<float>(iX0, iY0, iX1 - iX0, iY1 - iY0);
  outer = cv::Rect_<float>(oX0, oY0, oX1 - oX0, oY1 - oY0);
}

int main(int argc, char *argv[]) {
  cxxopts::Options options(argv[0]);
  options.add_options()(
    "r,realitySrc",
    "Source for reality, 'remote' for remote; 'stdin' for stdin, otherwise filename.",
    cxxopts::value<String>()->default_value("stdin"));
  options.add_options()(
    "m,method",
    "Disparity computation method. Choose from BM, SGBM, HH, SGBM_3WAY. Unknown and defaults are BM",
    cxxopts::value<String>()->default_value("BM"));

  String realitySrc;
  String method;
  try {
    auto result = options.parse(argc, argv);
    realitySrc = result["realitySrc"].as<String>();
    method = result["method"].as<String>();
  } catch (cxxopts::option_not_exists_exception e) {
    C8Log("[dense-depth-from-images] WARNING: unrecognized command-line flag: %s;", e.what());
    throw e;
  }

  auto rStream = RealityStreamFactory::create(realitySrc);
  StereoDepthGeneration depthGen;
  C8Log("[dense-depth-from-images] %s", "Processing frames.");
  rStream->setCallback(&depthGen);
  rStream->spin();

  C8Log("[dense-depth-from-images] Got %d frames", depthGen.images_.size());

  for (int i = 1; i < depthGen.images_.size(); ++i) {
    auto image = depthGen.images_[i].displaybuf.pixels();
    auto prev = depthGen.images_[i - 1].displaybuf.pixels();

    cv::Mat displayImage(image.rows(), image.cols() * 2, CV_8UC3);
    cv::Mat left(prev.rows(), prev.cols(), CV_8UC3, prev.pixels(), prev.rowBytes());
    cv::Mat right(image.rows(), image.cols(), CV_8UC3, image.pixels(), image.rowBytes());
    combineLeftRight(left, right, displayImage);

    // Undistort and rectify the images
    auto pe = depthGen.images_[i - 1].extrinsics;
    auto ce = depthGen.images_[i].extrinsics;
    auto pk = HMatrixGen::intrinsic(depthGen.images_[i - 1].intrinsics);
    auto ck = HMatrixGen::intrinsic(depthGen.images_[i].intrinsics);

    cv::Mat pkMat = cv::Mat(3, 3, CV_32F, (void*)(pk.data().data()), 16).t();
    cv::Mat ckMat = cv::Mat(3, 3, CV_32F, (void*)(ck.data().data()), 16).t();

    cv::Mat R1, R2, P1, P2, Q;
    cv::Rect_<int> roi1, roi2;
    auto m = egomotion(pe, ce).inv();
    cv::Mat mMat = cv::Mat(4, 4, CV_32F, (void*)(m.data().data()), 16).t();
    // TODO(dat): Create empty Mat instead. Tested and didn't change the result
    cv::Mat pDistortMat{0, 0, 0, 0, 0};
    cv::Mat cDistortMat{0, 0, 0, 0, 0};

    cv::Mat extrinsicsRotation, extrinsicsTranslation;
    cv::Mat(mMat, cv::Range(0, 3), cv::Range(0, 3)).convertTo(extrinsicsRotation, CV_64F);
    cv::Mat(mMat, cv::Range(0, 3), cv::Range(3, 4)).convertTo(extrinsicsTranslation, CV_64F);
    // stereoRectify uses CV_64F internally
    cv::stereoRectify(
      pkMat,
      pDistortMat,
      ckMat,
      cDistortMat,
      displayImage.size(),
      extrinsicsRotation,
      extrinsicsTranslation,
      R1,
      R2,
      P1,
      P2,
      Q,
      cv::CALIB_ZERO_DISPARITY,
      0.5, // alpha: free scaling parameter
      displayImage.size(),
      &roi1,
      &roi2);

    cv::Mat map11, map12, map21, map22;
    cv::initUndistortRectifyMap(pkMat, pDistortMat, R1, P1, displayImage.size(), CV_16SC2, map11, map12);
    cv::initUndistortRectifyMap(ckMat, cDistortMat, R2, P2, displayImage.size(), CV_16SC2, map21, map22);

    cv::Mat img1r, img2r;
    remap(left, img1r, map11, map12, cv::INTER_LINEAR);
    remap(right, img2r, map21, map22, cv::INTER_LINEAR);

    // Draw the ROIs onto the images
    C8Log("[dense-depth-from-images] ROI1 tl(%d, %d) br(%d, %d)", roi1.tl().x, roi1.tl().y, roi1.br().x, roi1.br().y);
    C8Log("[dense-depth-from-images] ROI2 tl(%d, %d) br(%d, %d)", roi2.tl().x, roi2.tl().y, roi2.br().x, roi2.br().y);
    cv::rectangle(img1r, roi1, cv::Scalar(255, 255, 0), 2);
    cv::rectangle(img2r, roi2, cv::Scalar(255, 255, 0), 2);

    cv::Mat undistortedRectifiedDisplayImage;
    combineLeftRight(img1r, img2r, undistortedRectifiedDisplayImage);

    // Displaying the images
    cv::imshow("Original Pair", displayImage);
    cv::imshow("Undistorted Rectified Pair", undistortedRectifiedDisplayImage);

    // Perform disparity calculation
    int numberOfDisparities = 256;
    int SADWindowSize = -1;

    numberOfDisparities =
      numberOfDisparities > 0 ? numberOfDisparities : ((displayImage.size().width / 8) + 15) & -16;

    cv::Ptr<cv::StereoBM> bm = cv::StereoBM::create(16, 9);
    bm->setROI1(roi1);
    bm->setROI2(roi2);
    bm->setPreFilterCap(31);
    bm->setBlockSize(SADWindowSize > 0 ? SADWindowSize : 9);
    bm->setMinDisparity(0);
    bm->setNumDisparities(numberOfDisparities);
    bm->setTextureThreshold(10);
    bm->setUniquenessRatio(15);
    bm->setSpeckleWindowSize(100);
    bm->setSpeckleRange(32);
    bm->setDisp12MaxDiff(1);

    cv::Ptr<cv::StereoSGBM> sgbm = cv::StereoSGBM::create(0, 16, 3);
    sgbm->setPreFilterCap(63);
    int sgbmWinSize = SADWindowSize > 0 ? SADWindowSize : 3;
    sgbm->setBlockSize(sgbmWinSize);

    int cn = img1r.channels();

    sgbm->setP1(8 * cn * sgbmWinSize * sgbmWinSize);
    sgbm->setP2(32 * cn * sgbmWinSize * sgbmWinSize);
    sgbm->setMinDisparity(0);
    sgbm->setNumDisparities(numberOfDisparities);
    sgbm->setUniquenessRatio(10);
    sgbm->setSpeckleWindowSize(100);
    sgbm->setSpeckleRange(32);
    sgbm->setDisp12MaxDiff(1);

    cv::Mat disp;
    if (method == "HH") {
      C8Log("[dense-depth-from-images] %s", "Compute disparity with HH method.");
      sgbm->setMode(cv::StereoSGBM::MODE_HH);
      sgbm->compute(img1r, img2r, disp);
    } else if (method == "SGBM") {
      C8Log("[dense-depth-from-images] %s", "Compute disparity with SGBM method.");
      sgbm->setMode(cv::StereoSGBM::MODE_SGBM);
      sgbm->compute(img1r, img2r, disp);
    } else if (method == "SGBM_3WAY") {
      C8Log("[dense-depth-from-images] %s", "Compute disparity with SGBM_3WAY method.");
      sgbm->setMode(cv::StereoSGBM::MODE_SGBM_3WAY);
      sgbm->compute(img1r, img2r, disp);
    } else {
      C8Log("[dense-depth-from-images] %s", "Compute disparity with BM method.");
      cv::Mat img1grey, img2grey;
      cv::cvtColor(img1r, img1grey, cv::COLOR_RGB2GRAY);
      cv::cvtColor(img2r, img2grey, cv::COLOR_RGB2GRAY);
      bm->compute(img1grey, img2grey, disp);
    }

    cv::Mat disp8;
    disp.convertTo(disp8, CV_8U, 255 / (numberOfDisparities * 16.));
    cv::imshow("Disparity", disp8);

    while (cv::waitKey(10) != ' ') {
    }

    // NOTE(dat): reprojectImageTo3D(disp, xyz, Q, true) to get a point cloud
  }

  C8Log("[dense-depth-from-images] %s", "Done.");
  C8Log("[dense-depth-from-images] %s", "");
  C8Log("[dense-depth-from-images] %s", "");
  C8Log("[dense-depth-from-images] %s", "===================================");
  C8Log("[dense-depth-from-images] %s", "");
  C8Log("[dense-depth-from-images] %s", "");
  C8Log("[dense-depth-from-images] %s", "");
  return 0;
}
