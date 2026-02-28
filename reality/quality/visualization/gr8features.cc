// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_binary {
  deps = {
    "//c8:c8-log",
    "//c8:c8-log-proto",
    "//c8/pixels:draw2",
    "//c8/pixels:pixel-buffer",
    "//c8/pixels:pixel-transforms",
    "//c8/pixels:pixels",
    "//c8/protolog:xr-requests",
    "//reality/quality/datasets/measuredpose:measured-pose-eval",
    "//reality/quality/visualization/render:ui2",
    "//reality/quality/visualization/xrom/framework:reality-stream-factory",
    "//reality/quality/visualization/xrom/framework:reality-stream-interface",
    "//reality/engine/features:gl-reality-frame",
    "//third_party/cvlite/features2d:fast",
    "@opencv//:core",
    "@opencv//:highgui",
    "@opencv//:imgproc",
  };
  linkopts = {
    "-framework AVFoundation",
    "-framework Cocoa",
  };
}
cc_end(0xb9f7243e);

#include <iostream>
#include <memory>
#include <opencv2/core.hpp>
#include <opencv2/highgui.hpp>
#include <opencv2/imgproc.hpp>
#include "c8/c8-log-proto.h"
#include "c8/c8-log.h"
#include "c8/pixels/draw2.h"
#include "c8/pixels/pixel-buffer.h"
#include "c8/pixels/pixel-transforms.h"
#include "c8/protolog/xr-requests.h"
#include "reality/engine/features/gl-reality-frame.h"
#include "reality/engine/features/gr8.h"
#include "reality/engine/features/gr8cpu.h"
#include "reality/quality/datasets/measuredpose/measured-pose-eval.h"
#include "reality/quality/visualization/render/ui2.h"
#include "reality/quality/visualization/xrom/framework/reality-stream-factory.h"
#include "reality/quality/visualization/xrom/framework/reality-stream-interface.h"
#include "third_party/cvlite/features2d/fast.h"
#include "third_party/cvlite/features2d/keypoint.h"

using namespace c8;

class FeatureCallback : public RealityStreamCallback {
public:
  static constexpr int FAST_THRESHOLD = 25;
  static constexpr int FEATURES_PER_FRAME = 500;

  FeatureCallback()
      : r_(0),
        gr8_(Gr8Gl::create()),
        gr8cpu_(Gr8::create(
          FEATURES_PER_FRAME,
          1.44f,
          4,
          gr8_.edgeThreshold(),
          0,
          2,
          Gr8CpuInterface::FAST_SCORE,
          FAST_THRESHOLD)) {}

  void processReality(
    RealityStreamInterface *stream,
    RealityRequest::Reader request,
    RealityResponse::Reader response) override {
    ScopeTimer rt("dataset-generator-run");

    // Copy image data into buffers owned by the sensor struct.
    auto frame = request.getSensors().getCamera().getCurrentFrame();
    auto ly = frame.getImage().getOneOf().getGrayImagePointer();
    auto luv = frame.getUvImage().getOneOf().getGrayImagePointer();

    int lyr = ly.getRows();
    int lyc = ly.getCols();
    int luvr = luv.getRows();
    int luvc = luv.getCols();
    bool swapDims = lyr < lyc;
    if (swapDims) {
      std::swap(lyr, lyc);
      std::swap(luvr, luvc);
    }

    ConstYPlanePixels ySrc(
      ly.getRows(),
      ly.getCols(),
      ly.getBytesPerRow(),
      reinterpret_cast<const uint8_t *>(ly.getUInt8PixelDataPointer()));
    ConstUVPlanePixels uvSrc(
      luv.getRows(),
      luv.getCols(),
      luv.getBytesPerRow(),
      reinterpret_cast<const uint8_t *>(luv.getUInt8PixelDataPointer()));

    if (gl == nullptr) {
      glShader.reset(new Gr8FeatureShader());
      gl.reset(new GlRealityFrame());
      glShader->initialize();
      gl->initialize(glShader.get(), lyc, lyr, 0);
      srcTex_ = makeLinearRGBA8888Texture2D(lyc, lyr);
    }

    {
      ScopeTimer t("copy-image-data-from-request");
      if (srcImg_.pixels().rows() != lyr || srcImg_.pixels().cols() != lyc) {
        srcImg_ = RGBA8888PlanePixelBuffer(lyr, lyc);
      }
      auto destPix = srcImg_.pixels();
      yuvToRgb(ySrc, uvSrc, &destPix);
    }

    {
      ScopeTimer t("upload-texture");
      srcTex_.bind();
      srcTex_.updateImage(srcImg_.pixels().pixels());
      srcTex_.unbind();
    }

    {
      ScopeTimer t("gr8-pyramid");
      glShader->setFeatureParams(
        5.0f,     // robustGr8 threshold. 4 is default.
        10.0f,    // scoreThresh; 10 is default.
        0.0f,     // thresholdClamp, must be 0 or 1; 0 is default.
        255.0f);  // Disable NMS; Default is 1.0f;
      gl->draw(
        srcTex_.id(), GlRealityFrame::Options::READ_IMMEDIATELY_RESTORE_STATE);
    }

    auto l0 = gl->pyramid().levels[0];
    auto p0r = l0.h;
    auto p0c = l0.w;

    RGBA8888PlanePixelBuffer rawFastIm(2 * p0r, p0c * 4);
    auto rfi = rawFastIm.pixels();
    fill(225, 225, 225, 255, &rfi);
    auto rfil = crop(rfi, p0r, p0c, 0, 0);
    auto rfim = crop(rfi, p0r, p0c, 0, p0c);
    auto rfir = crop(rfi, p0r, p0c, 0, 2 * p0c);
    auto rfi2 = crop(rfi, p0r, p0c, 0, 3 * p0c);

    fill(0, 0, 0, 0, &rfi2);

    YPlanePixelBuffer cornerScoreIm(p0r, p0c * 3);
    auto csi = cornerScoreIm.pixels();
    fill(0, &csi);
    auto csil = crop(csi, p0r, p0c, 0, 0);
    auto csim = crop(csi, p0r, p0c, 0, p0c);
    auto csir = crop(csi, p0r, p0c, 0, 2 * p0c);

    auto p = gl->pyramid();
    auto pd = p.data;
    YPlanePixelBuffer pyrY(pd.rows(), pd.cols());
    auto py = pyrY.pixels();

    for (int r = 0; r < pd.rows(); ++r) {
      const auto *sp = pd.pixels() + r * pd.rowBytes();
      auto *dp = py.pixels() + r * py.rowBytes();
      auto *ep = dp + py.cols();
      while (dp < ep) {
        *dp = *sp;
        ++dp;
        sp += 4;
      }
    }

    auto y0 = crop(py, l0.h, l0.w, l0.r, l0.c);
    yToRgb(y0, &rfil);
    yToRgb(y0, &rfim);
    yToRgb(y0, &rfir);

    {
      auto s = gl->pyramid().level(0);
      int edgeThreshold = 3;
      int r = s.rows() - 2 * edgeThreshold;
      int c = s.cols() - 2 * edgeThreshold;

      const uint8_t *rowStart = s.pixels() + edgeThreshold * s.rowBytes() + 4 * edgeThreshold;
      uint8_t *destStart = rfim.pixels() + edgeThreshold * rfim.rowBytes() + 4 * edgeThreshold;
      uint8_t *destStart2 = rfi2.pixels() + edgeThreshold * rfi2.rowBytes() + 4 * edgeThreshold;
      uint8_t *destStart3 = csil.pixels() + edgeThreshold * csil.rowBytes() + edgeThreshold;
      for (int i = 0; i < r; ++i) {
        const uint8_t *e = rowStart + 4 * c;
        uint8_t *dp = destStart;
        uint8_t *dp2 = destStart2;
        uint8_t *dp3 = destStart3;
        for (const uint8_t *p = rowStart; p < e; p += 4, dp += 4, dp2 += 4, dp3 += 1) {
          if (p[3]) {
            dp[0] = 255;
            dp[1] = 0;
            dp[2] = 255;
            dp2[1] = 255;
            // dp2[2] = 255;
            dp3[0] = p[2];
          }
        }
        rowStart += s.rowBytes();
        destStart += rfim.rowBytes();
        destStart2 += rfi2.rowBytes();
        destStart3 += csil.rowBytes();
      }
    }

    std::vector<c8cv::KeyPoint> cvkeypoints;
    cvkeypoints.reserve(py.rows() * py.cols());

    // Detect FAST features, 20 is a good threshold
    {
      c8cv::Mat img(
        l0.h,
        l0.w,
        CV_8UC1,
        const_cast<uint8_t *>(py.pixels() + l0.r * py.rowBytes() + l0.c),
        py.rowBytes());
      c8cv::Ptr<c8cv::FastFeatureDetector> fd =
        c8cv::FastFeatureDetector::create(FAST_THRESHOLD, false);
      fd->detect(img, cvkeypoints);
    }
    for (auto k : cvkeypoints) {
      int x = k.pt.x;
      int y = k.pt.y;
      auto *p = rfir.pixels() + y * rfir.rowBytes() + x * 4;
      auto *p2 = rfi2.pixels() + y * rfi2.rowBytes() + x * 4;
      auto *p3 = csim.pixels() + y * csim.rowBytes() + x;
      p[0] = 255;
      p[1] = 0;
      p[2] = 255;
      p2[0] = 255;
      p3[0] = k.response;
    }

    for (int i = 0; i < p0r; ++i) {
      auto *pl = csil.pixels() + i * csil.rowBytes();
      auto *pm = csim.pixels() + i * csim.rowBytes();
      auto *pr = csir.pixels() + i * csir.rowBytes();
      for (int j = 0; j < p0c; ++j) {
        int l = pl[j];
        int m = pm[j];
        int v = l - m;
        pr[j] = static_cast<uint8_t>(127 + v);
      }
    }

    auto cornerHeatMap = crop(rfi, p0r, 3 * p0c, p0r, p0c);
    for (int i = 0; i < csi.rows(); ++i) {
      auto *sp = csi.pixels() + i * csi.rowBytes();
      auto *dp = cornerHeatMap.pixels() + i * cornerHeatMap.rowBytes();
      for (int j = 0; j < csi.cols(); ++j, ++sp, dp += 4) {
        heatMap(sp[0], &dp[0], &dp[1], &dp[2]);
      }
    }

    {
      ScopeTimer t("gr8-pyramid");
      glShader->setFeatureParams(
        5.0f,   // robustGr8 threshold. 4 is default.
        10.0f,  // scoreThresh; 10 is default.
        0.0f,   // thresholdClamp, must be 0 or 1; 0 is default.
        1.0f);  // Disable NMS; Default is 1.0f;
      gl->draw(
        srcTex_.id(), GlRealityFrame::Options::READ_IMMEDIATELY_RESTORE_STATE);
    }

    Vector<Vector<ImagePointLocation>> currKeypoints;
    {
      ScopeTimer t("pyr-pts");
      currKeypoints = extractFastPoints(gl->pyramid());
    }

    p = gl->pyramid();
    pd = p.data;
    RGBA8888PlanePixelBuffer nms(pd.rows() * 2, pd.cols() * 3);
    RGBA8888PlanePixelBuffer retainBestPix(pd.rows(), pd.cols() * 2);
    {
      auto nmsp = nms.pixels();
      fill(225, 225, 225, 255, &nmsp);
      auto nms0 = crop(nmsp, pd.rows(), pd.cols(), 0, 0);
      yToRgb(pyrY.pixels(), &nms0);

      auto nmspl = crop(nmsp, pd.rows(), pd.cols(), 0, pd.cols());
      auto nmspr = crop(nmsp, pd.rows(), pd.cols(), 0, pd.cols() * 2);

      auto rbpl = crop(nmsp, pd.rows(), pd.cols(), pd.rows(), pd.cols());
      auto rbpr = crop(nmsp, pd.rows(), pd.cols(), pd.rows(), pd.cols() * 2);

      auto pl = p.levels;
      int nl = 0;

      int nlevels = pl.size();
      Vector<int> nfeaturesPerLevel(nlevels);

      // fill the extractors and descriptors for the corresponding scales
      // TODO(nb): scaleFactor is implicit in the pyramid; we shouldn't be computing it here.
      float factor = (float)(1.0 / 1.44f);
      int nfeatures = FEATURES_PER_FRAME;
      float ndesiredFeaturesPerScale =
        nfeatures * (1 - factor) / (1 - (float)std::pow((double)factor, (double)nlevels));

      int sumFeatures = 0;
      for (int level = 0; level < nlevels - 1; level++) {
        nfeaturesPerLevel[level] = std::round(ndesiredFeaturesPerScale);
        sumFeatures += nfeaturesPerLevel[level];
        ndesiredFeaturesPerScale *= factor;
      }
      nfeaturesPerLevel[nlevels - 1] = std::max(nfeatures - sumFeatures, 0);

      for (auto l : pl) {
        auto pl = crop(nmspl, l.h, l.w, l.r, l.c);
        fill(0, 0, 0, 255, &pl);
        auto pr = crop(nmspr, l.h, l.w, l.r, l.c);
        fill(0, 0, 0, 255, &pr);

        auto rl = crop(rbpl, l.h, l.w, l.r, l.c);
        fill(0, 0, 0, 255, &rl);
        auto rr = crop(rbpr, l.h, l.w, l.r, l.c);
        fill(0, 0, 0, 255, &rr);

        for (auto pt : currKeypoints[nl]) {
          auto pix =
            pl.pixels() + static_cast<int>(pt.pt.y) * pl.rowBytes() + 4 * static_cast<int>(pt.pt.x);
          pix[0] = 255;
          pix[1] = 255;
        }

        {
          auto ln = gl->pyramid().levels[nl];
          c8cv::Mat img(
            ln.h,
            ln.w,
            CV_8UC1,
            const_cast<uint8_t *>(py.pixels() + ln.r * py.rowBytes() + ln.c),
            py.rowBytes());
          c8cv::Ptr<c8cv::FastFeatureDetector> fd = c8cv::FastFeatureDetector::create(20, true);
          cvkeypoints.clear();
          fd->detect(img, cvkeypoints);
          c8cv::KeyPointsFilter::runByImageBorder(cvkeypoints, img.size(), gr8_.edgeThreshold());

          for (auto k : cvkeypoints) {
            auto pix =
              pr.pixels() + static_cast<int>(k.pt.y) * pr.rowBytes() + 4 * static_cast<int>(k.pt.x);
            pix[0] = 255;
            pix[1] = 255;
          }
        }

        int target = nfeaturesPerLevel[nl];
        Gr8Gl::retainBest(currKeypoints[nl], target, l.w, l.h, gr8_.edgeThreshold(), true);
        Gr8::retainBest(cvkeypoints, target, l.w, true);

        for (auto pt : currKeypoints[nl]) {
          auto pix =
            rl.pixels() + static_cast<int>(pt.pt.y) * rl.rowBytes() + 4 * static_cast<int>(pt.pt.x);
          pix[0] = 255;
          pix[1] = 255;
        }

        for (auto k : cvkeypoints) {
          auto pix =
            rr.pixels() + static_cast<int>(k.pt.y) * rr.rowBytes() + 4 * static_cast<int>(k.pt.x);
          pix[0] = 255;
          pix[1] = 255;
        }

        ++nl;
      }
    }

    RGBA8888PlanePixelBuffer endToEnd(lyr, lyc * 2);
    {
      RGBA8888PlanePixels eep = endToEnd.pixels();
      auto l0 = gl->pyramid().levels[0];
      float s = static_cast<float>(lyc) / l0.w;
      auto eepl = crop(eep, lyr, lyc, 0, 0);
      auto eepr = crop(eep, lyr, lyc, 0, lyc);
      copyPixels(srcImg_.pixels(), &eepl);
      copyPixels(srcImg_.pixels(), &eepr);

      auto glFeats = gr8_.detectAndCompute(gl->pyramid());
      Vector<c8cv::KeyPoint> keyPoints;
      c8cv::Mat descriptors;
      auto pl0 = crop(py, l0.h, l0.w, l0.r, l0.c);
      c8cv::Mat frameWrap(pl0.rows(), pl0.cols(), CV_8UC1, pl0.pixels(), pl0.rowBytes());
      gr8cpu_.detectAndCompute(frameWrap, keyPoints, descriptors);

      for (const auto &f : glFeats) {
        auto pt = f.location().pt;
        int r = std::round(pt.y * s);
        int c = std::round(pt.x * s);

        Color color;
        if (f.location().scale == 0) {
          color = Color::LIGHT_PURPLE;
        } else if (f.location().scale == 1) {
          color = Color::MANGO;
        } else if (f.location().scale == 2) {
          color = Color::MINT;
        } else if (f.location().scale == 3) {
          color = Color::CHERRY;
        }

        float xoff = std::cos(f.location().angle * M_PI / 180.0f) * 7;
        float yoff = std::sin(f.location().angle * M_PI / 180.0f) * 7;

        drawLine({pt.x * s, pt.y * s}, {pt.x * s + xoff, pt.y * s + yoff}, 1, color, eepl);

        for (int dr = r - 1; dr <= r + 1; ++dr) {
          int adr = dr < 0 ? 0 : (dr >= eepl.rows() ? eepl.rows() - 1 : dr);
          for (int dc = c - 1; dc <= c + 1; ++dc) {
            int adc = dc < 0 ? 0 : (dc >= eepl.cols() ? eepl.cols() - 1 : dc);
            uint8_t *p = eepl.pixels() + adr * eepl.rowBytes() + adc * 4;
            p[0] = color.r();
            p[1] = color.g();
            p[2] = color.b();
          }
        }
      }

      for (const auto &f : keyPoints) {
        auto pt = f.pt;
        int r = std::round(pt.y * s);
        int c = std::round(pt.x * s);

        Color color;
        if (f.octave == 0) {
          color = Color::LIGHT_PURPLE;
        } else if (f.octave == 1) {
          color = Color::CANARY;
        } else if (f.octave == 2) {
          color = Color::MINT;
        } else if (f.octave == 3) {
          color = Color::CHERRY;
        }

        float xoff = std::cos(f.angle * M_PI / 180.0f) * 7;
        float yoff = std::sin(f.angle * M_PI / 180.0f) * 7;
        drawLine({pt.x * s, pt.y * s}, {pt.x * s + xoff, pt.y * s + yoff}, 1, color, eepr);

        for (int dr = r - 1; dr <= r + 1; ++dr) {
          int adr = dr < 0 ? 0 : (dr >= eepl.rows() ? eepl.rows() - 1 : dr);
          for (int dc = c - 1; dc <= c + 1; ++dc) {
            int adc = dc < 0 ? 0 : (dc >= eepl.cols() ? eepl.cols() - 1 : dc);
            uint8_t *p = eepr.pixels() + adr * eepr.rowBytes() + adc * 4;
            p[0] = color.r();
            p[1] = color.g();
            p[2] = color.b();
          }
        }
      }
    }

    if (doDisplay_) {
      show("rawfast + cornerscore", rawFastIm.pixels());
      show("nms + retain best", nms.pixels());
      show("endtoend", endToEnd.pixels());
      while (waitKey() != ' ') {
        // break;
      }
    }

    int32_t a = 0;
    int32_t b = 0;
    int32_t ab = 0;
    for (auto *p = rfi2.pixels(); p < rfi2.pixels() + rfi2.rows() * rfi2.rowBytes(); p += 4) {
      if (p[0] && p[1]) {
        ++ab;
      } else if (p[0]) {
        ++a;
      } else if (p[1]) {
        ++b;
      }
    }
    C8Log("cpu: %d, gpu: %d, both: %d", a, b, ab);
  }

  void doDisplay(bool val) { doDisplay_ = val; }

private:
  bool doDisplay_ = false;
  std::unique_ptr<GlRealityFrame> gl;
  std::unique_ptr<Gr8FeatureShader> glShader;
  RandomNumbers r_;
  Gr8Gl gr8_;
  Gr8 gr8cpu_;

  GlTexture2D srcTex_;
  RGBA8888PlanePixelBuffer srcImg_;

  Vector<Vector<ImagePointLocation>> extractFastPoints(Gr8Pyramid pyramid) {
    ScopeTimer t("extract-raw-fast");
    Vector<int> counts(pyramid.levels.size());
    Vector<Vector<ImagePointLocation>> keypointLevels(pyramid.levels.size());

    int edgeThreshold = gr8_.edgeThreshold();
    for (int level = 0; level < pyramid.levels.size(); level++) {
      auto s = pyramid.level(level);
      int r = s.rows() - 2 * edgeThreshold;
      int c = s.cols() - 2 * edgeThreshold;

      auto &keypoints = keypointLevels.at(level);
      const uint8_t scale = static_cast<uint8_t>(level);

      // In multi-threaded, use extraction method optimized for CPU.
      const uint8_t *rowStart = s.pixels() + edgeThreshold * s.rowBytes() + 4 * edgeThreshold + 2;
      for (int i = 0; i < r; ++i) {
        const uint8_t *e = rowStart + 4 * c;
        for (const uint8_t *p = rowStart; p < e; p += 4) {
          if (p[0]) {
            float y = static_cast<float>(i + edgeThreshold);
            float x = static_cast<float>(((p - rowStart) >> 2) + edgeThreshold);
            // x and y are scaled later.
            keypoints.emplace_back(x, y, 7.0f, scale, -1.0f /* angle */, -1.0f /* gravityAngle */, *p /* response */, -1 /* roi */);
          }
        }
        rowStart += s.rowBytes();
      }

      counts[level] = keypoints.size();
    }
    for (int level = 0; level < pyramid.levels.size(); ++level) {
      auto s = pyramid.level(level);
      char tag[] = "level-000000-raw-keypoints";
      snprintf(tag, sizeof(tag), "level-%02d-raw-keypoints", level);
      int numpix = (s.rows() - 2 * edgeThreshold) * (s.cols() - 2 * edgeThreshold);
      t.addCounter(tag, counts[level], numpix);
    }
    return keypointLevels;
  }
};

int main(int argc, char *argv[]) {
  bool doDisplay = true;
  auto rStream = RealityStreamFactory::createFromFlags(argc, argv);
  FeatureCallback datasetGenerator;
  datasetGenerator.doDisplay(doDisplay);
  C8Log("[construct-feature-score-dataset] %s", "Processing frames.");
  rStream->setCallback(&datasetGenerator);
  rStream->spin();

  C8Log("[construct-feature-score-dataset] %s", "Done.");
  C8Log("[construct-feature-score-dataset] %s", "");
  C8Log("[construct-feature-score-dataset] %s", "");
  C8Log("[construct-feature-score-dataset] %s", "===================================");
  C8Log("[construct-feature-score-dataset] %s", "");
  C8Log("[construct-feature-score-dataset] %s", "");
  C8Log("[construct-feature-score-dataset] %s", "");
  ScopeTimer::logDetailedSummary();

  return 0;
}
