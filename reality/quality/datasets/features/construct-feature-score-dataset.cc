// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_binary {
  deps = {
    "//c8:c8-log",
    "//c8:c8-log-proto",
    "//c8/pixels:pixel-buffer",
    "//c8/pixels:pixel-transforms",
    "//c8/pixels:pixels",
    "//c8/protolog:xr-requests",
    "//reality/quality/datasets/measuredpose:measured-pose-eval",
    "//reality/quality/visualization/render:imgproc",
    "//reality/quality/visualization/render:ui2",
    "//reality/quality/visualization/xrom/drawing:components",
    "//reality/quality/visualization/xrom/framework:reality-stream-factory",
    "//reality/quality/visualization/xrom/framework:reality-stream-interface",
    "//reality/engine/features:gl-reality-frame",
    "@opencv//:core",
    "@opencv//:highgui",
    "@opencv//:imgproc",
  };
  linkopts = {
    "-framework AVFoundation",
    "-framework Cocoa",
  };
}
cc_end(0x553591bf);

#include <iostream>
#include <memory>
#include <opencv2/core.hpp>
#include <opencv2/highgui.hpp>
#include <opencv2/imgproc.hpp>

#include "c8/c8-log-proto.h"
#include "c8/c8-log.h"
#include "c8/pixels/pixel-buffer.h"
#include "c8/pixels/pixel-transforms.h"
#include "c8/protolog/xr-requests.h"
#include "reality/engine/features/gl-reality-frame.h"
#include "reality/quality/datasets/measuredpose/measured-pose-eval.h"
#include "reality/quality/visualization/render/imgproc.h"
#include "reality/quality/visualization/render/ui2.h"
#include "reality/quality/visualization/xrom/drawing/components.h"
#include "reality/quality/visualization/xrom/framework/reality-stream-factory.h"
#include "reality/quality/visualization/xrom/framework/reality-stream-interface.h"

using namespace c8;

constexpr int MATCH_NEIGHBORS = 20;
constexpr int CROSS_NEIGHBORS = 10;
constexpr int PATCHSIZE_77 = 49;

// Patches from the source image are co-selected from this radius, and then all points in this
// radius are removed from future consideration from being examples. Note: 32 is the size we use
// for enforcing image area diversity when we retain the best feature points.
constexpr float SRC_BLACKLIST_RADIUS = 32.0f;

// This is the radius (in pixels) to search for descriptor matches in the target image. The
// frame-frame tracker uses a ray-space radius of 0.1, which is ~25->35 pixels in a 320x240 image on
// a newer->older phone. For the local matcher, we scale this search radius lower on finer scales
// of the pyramid, which we don't do here.  TODO(nb): should we?
constexpr float DEST_SEARCH_RADIUS = 25.0f;

// RESPONSE_GAIN should be in 0 to 1. This controls the quantum of softmax, i.e. how different the
// responses of two adjacent values in 0-255 are.
//
// The response difference is given by: 1 / (1 + exp(PixDelta * ResponseGain)).
//
// For example: Patch 1 has a score of 98 / 255 and Patch 2 has a score of 108 / 255.  They are 10
// pixel values apart.
//
//  RESPONSE_GAIN   PIXEL_DELTA  PATCH_1  PATCH_2
//       0.1            1/255     0.475    0.525
//       0.2            1/255     0.450    0.550
//       0.5            1/255     0.378    0.622
//       1.0            1/255     0.269    0.731
//       0.1           10/255     0.269    0.731
//       0.2           10/255     0.119    0.881
//       0.5           10/255     0.007    0.993
//       1.0           10/255   0.000045 0.999955
//       0.1           25/255     0.076    0.924
//       0.2           25/255     0.007    0.993
//       0.5           25/255     3e-6   1-3e-6
//       1.0           25/255     1e-11  1-1e-11
//       0.1          255/255     8e-12  1-8e-12
//
//
// TODO(nb): The FAST score makes poor use of its dynamic range, with values in a very narrow band.
// Once we move to a more sensitive score, we might want to lower this value.
constexpr double RESPONSE_GAIN = 0.5;

struct PatchData {
  double featureScore = 0.0f;
  double activation = 0.0f;
  std::array<uint8_t, PATCHSIZE_77> pix{};
};

struct Example {
  double exampleScore = 0.0f;
  double activation = 0.0f;
  PatchData target;
  std::array<PatchData, MATCH_NEIGHBORS> candidates;
};

struct CrossExample {
  double activation = 0.0f;
  std::array<Example, CROSS_NEIGHBORS> crossFeatures;
};

struct FrameCrossExamples {
  std::vector<CrossExample> examples;
};

class FeatureScoreDatasetCallback : public RealityStreamCallback {
public:
  FeatureScoreDatasetCallback() : r_(0), gr8_(Gr8Gl::create()) {}

  void processReality(
    RealityStreamInterface *stream,
    RealityRequest::Reader request,
    RealityResponse::Reader response) override {
    ScopeTimer rt("dataset-generator-run");
    std::swap(gl, lastGl);

    auto grayImage = request.getSensors()
                       .getCamera()
                       .getCurrentFrame()
                       .getImage()
                       .getOneOf()
                       .getGrayImagePointer();
    if (gl == nullptr) {
      glShader.reset(new Gr8FeatureShader());
      gl.reset(new GlRealityFrame());
      lastGl.reset(new GlRealityFrame());
      glShader->initialize();
      glShader->setFeatureParams(
        4.0f,     // robustGr8 threshold. 4 is default.
        10.0f,    // scoreThresh; 10 is default.
        0.0f,     // thresholdClamp, must be 0 or 1; 0 is default.
        255.0f);  // Disable NMS; Default is 1.0f;
      gl->initialize(glShader.get(), grayImage.getCols(), grayImage.getRows(), 0);
      lastGl->initialize(glShader.get(), grayImage.getCols(), grayImage.getRows(), 0);
      srcTex_.initialize();
    }

    {
      ScopeTimer t("copy-image-data-from-request");
      if (copyBuffer == nullptr) {
        copyBuffer.reset(new RGBA8888PlanePixelBuffer(grayImage.getRows(), grayImage.getCols()));
      }
      uint64_t dataPointer = grayImage.getUInt8PixelDataPointer();
      int range = grayImage.getRows() * grayImage.getCols();
      for (int i = 0; i < range; i++) {
        copyBuffer->pixels().pixels()[i * 4] = ((uint8_t *)dataPointer)[i];
        copyBuffer->pixels().pixels()[i * 4 + 1] = ((uint8_t *)dataPointer)[i];
        copyBuffer->pixels().pixels()[i * 4 + 2] = ((uint8_t *)dataPointer)[i];
        copyBuffer->pixels().pixels()[i * 4 + 3] = 255;
      }
    }

    {
      ScopeTimer t("upload-texture");

      glBindTexture(GL_TEXTURE_2D, srcTex_.texture);
      glTexImage2D(
        GL_TEXTURE_2D,
        0,
        GL_RGBA,
        grayImage.getCols(),
        grayImage.getRows(),
        0,
        GL_RGBA,
        GL_UNSIGNED_BYTE,
        copyBuffer->pixels().pixels());
    }

    {
      ScopeTimer t("gr8-pyramid");
      gl->draw(srcTex_.texture, GlRealityFrame::Options::READ_IMMEDIATELY);
    }

    if (!lastGl->hasPyramid()) {
      return;
    }

    Vector<Vector<ImagePointLocation>> currKeypoints;
    Vector<Vector<ImagePointLocation>> lastKeypoints;
    {
      ScopeTimer t("two-pyr-pts");
      currKeypoints = extractFastPoints(gl->pyramid());
      lastKeypoints = extractFastPoints(lastGl->pyramid());
    }

    /*******************************/
    Vector<CrossExample> exs;
    {
      ScopeTimer t("generate-examples");
      for (int level = 0; level < lastGl->pyramid().levels.size(); ++level) {
        auto curr = currKeypoints[level];
        auto last = lastKeypoints[level];
        int exsPerLevel = 0;

        while (last.size() > 0) {
          int lastIdx = r_.nextUniformInt(0, last.size());
          auto query = last[lastIdx];
          auto lastIdxs = findClosePoints(query, last, SRC_BLACKLIST_RADIUS);
          auto allNeighbors = keepPointsAtSortedIdxs(last, lastIdxs);
          auto crossNeighbors = selectCrossNeighbors(query, lastGl->pyramid(), allNeighbors);
          last = removePointsAtSortedIdxs(last, lastIdxs);

          if (crossNeighbors.size() < CROSS_NEIGHBORS) {
            continue;
          }

          int idx = 0;
          CrossExample cex;
          for (auto c : crossNeighbors) {
            if (idx >= CROSS_NEIGHBORS) {
              break;
            }
            auto currNeighbors =
              keepPointsAtSortedIdxs(curr, findClosePoints(c, curr, DEST_SEARCH_RADIUS));

            Vector<ImagePointLocation> closeCurr =
              selectExampleCandidates(c, lastGl->pyramid(), currNeighbors, gl->pyramid());

            if (closeCurr.size() < MATCH_NEIGHBORS) {
              continue;
            }

            cex.crossFeatures[idx++] =
              getExamplePatches(c, lastGl->pyramid(), closeCurr, gl->pyramid());
          }

          if (idx == CROSS_NEIGHBORS) {
            computeExampleScore(cex);
            scoreSum_ += cex.activation;
            ++scoreCount_;
            exs.push_back(cex);
            ++exsPerLevel;
          }
        }
      }
      C8Log(
        "[construct-feature-score-dataset] Got %d examples, current score: %f",
        exs.size(),
        score());
    }
    /*******************************/

    if (doDisplay_) {
      display(exs);
    }
  }

  void doDisplay(bool val) { doDisplay_ = val; }

  void display(Vector<CrossExample> &exs) {
    if (!doDisplay_) {
      return;
    }

    if (exs.size() > 0) {
      int gridSizeX = 4 * (MATCH_NEIGHBORS + 3) - 1;
      int gridSizeY = 5 * (CROSS_NEIGHBORS + 1) - 1;
      int pixPerSample = 18;
      RGB888PlanePixelBuffer eb(gridSizeY * pixPerSample, gridSizeX * pixPerSample);
      RGB888PlanePixels exim = eb.pixels();

      r_.shuffle(exs.begin(), exs.end());

      fill(230, 230, 230, &exim);
      for (int i = 0; i < exs.size(); ++i) {
        if (i >= 20) {
          break;
        }
        drawCrossExample(i / 4, i % 4, exs[i], &exim);
      }
      show("exs", exim);
    }
    show("im", copyBuffer->pixels());
    show("pyr", gl->pyramid().data);
    while (waitKey() != ' ') {
      break;
    }
  }

  double score() const { return scoreSum_ / scoreCount_; }

private:
  bool doDisplay_ = false;
  std::unique_ptr<GlRealityFrame> gl;
  std::unique_ptr<GlRealityFrame> lastGl;
  std::unique_ptr<Gr8FeatureShader> glShader;
  GlTexture srcTex_;
  RandomNumbers r_;
  Gr8Gl gr8_;

  double scoreSum_ = 0.0;
  int scoreCount_ = 0;

  std::unique_ptr<RGBA8888PlanePixelBuffer> copyBuffer = nullptr;

  void computeExampleScore(CrossExample &ex) {
    double targetSum = 0.0f;
    for (auto &e : ex.crossFeatures) {
      e.target.activation = std::exp(e.target.featureScore);
      targetSum += e.target.activation;
      double candidateSum = 0.0f;
      for (auto &p : e.candidates) {
        p.activation = std::exp(p.featureScore);
        candidateSum += p.activation;
      }
      e.exampleScore = 0.0f;
      for (auto &p : e.candidates) {
        p.activation = p.activation / candidateSum;
        e.exampleScore += p.activation * p.activation;
      }
    }
    ex.activation = 0.0f;
    for (auto &e : ex.crossFeatures) {
      e.target.activation = e.target.activation / targetSum;
      e.activation = e.exampleScore * e.target.activation;
      ex.activation += e.activation;
    }
  }

  void drawCrossExample(int r, int c, const CrossExample &ex, RGB888PlanePixels *dest) {
    constexpr int pixPerSample = 18;
    constexpr int exw = (MATCH_NEIGHBORS + 3) * pixPerSample;
    constexpr int exh = (CROSS_NEIGHBORS + 1) * pixPerSample;
    RGB888PlanePixels cropPix(
      CROSS_NEIGHBORS * pixPerSample,
      (MATCH_NEIGHBORS + 2) * pixPerSample,
      dest->rowBytes(),
      dest->pixels() + r * exh * dest->rowBytes() + c * exw * 3);
    for (int i = 0; i < CROSS_NEIGHBORS; ++i) {
      drawExample(i, ex.crossFeatures[i], &cropPix);
    }
  }

  int ar(double val) { return val > 0.33 ? 255 : static_cast<int>(val * 255 / 0.33); }

  int ag(double val) {
    return val < 0.33 ? 0 : (val > 0.67 ? 255 : static_cast<int>((val - .33) * 255 / .34));
  }

  int ab(double val) { return val < 0.67 ? 0 : static_cast<int>((val - .67) * 255 / .33); }

  void drawExample(int r, const Example &e, RGB888PlanePixels *dest) {
    constexpr int pixPerSample = 18;
    RGB888PlanePixels cropPix(
      pixPerSample,
      (MATCH_NEIGHBORS + 2) * pixPerSample,
      dest->rowBytes(),
      dest->pixels() + r * pixPerSample * dest->rowBytes());
    auto v = e.activation;
    fill(ar(v), ag(v), ab(v), &cropPix);
    drawPatch(0, e.target, &cropPix);
    for (int i = 0; i < MATCH_NEIGHBORS; ++i) {
      drawPatch(i + 2, e.candidates[i], &cropPix);
    }
  }

  void drawPatch(int col, const PatchData &patch, RGB888PlanePixels *dest) {
    constexpr int pixPerSample = 18;
    RGB888PlanePixels cropPix(
      pixPerSample, pixPerSample, dest->rowBytes(), dest->pixels() + col * pixPerSample * 3);

    auto v = patch.activation;
    fill(ar(v), ag(v), ab(v), &cropPix);

    int y = 1;
    int x = 1;
    for (int r = 0; r < 7; ++r) {
      for (int c = 0; c < 7; ++c) {
        for (int r1 = 0; r1 < 2; ++r1) {
          for (int c1 = 0; c1 < 2; ++c1) {
            int dr = (y + r) * 2 + r1;
            int dc = (x + c) * 2 + c1;
            uint8_t *px = &cropPix.pixels()[dr * cropPix.rowBytes() + dc * 3];
            px[0] = patch.pix[r * 7 + c];
            px[1] = patch.pix[r * 7 + c];
            px[2] = patch.pix[r * 7 + c];
          }
        }
      }
    }
  }

  Vector<Vector<ImagePointLocation>> extractFastPoints(const Gr8Pyramid &pyramid) {
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
          if (p[1]) {
            float y = static_cast<float>(i + edgeThreshold);
            float x = static_cast<float>(((p - rowStart) >> 2) + edgeThreshold);
            // x and y are scaled later.
            keypoints.emplace_back(
              x,
              y,
              7.0,
              scale,
              -1 /* angle */,
              -1 /* gravityAngle */,
              *p /* response */,
              -1 /* roi */);
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

  Vector<int> findClosePoints(
    ImagePointLocation target, const Vector<ImagePointLocation> &candidates, float radius) {
    float cx = target.pt.x;
    float cy = target.pt.y;
    Vector<int> closeIdxs;
    closeIdxs.reserve(candidates.size());

    for (int idx = 0; idx < candidates.size(); ++idx) {
      auto o = candidates[idx];
      float ox = o.pt.x;
      float oy = o.pt.y;
      float xd = ox - cx;
      float yd = oy - cy;
      if (xd > radius || yd > radius || xd < -radius || yd < -radius) {
        continue;
      }
      float sqd = xd * xd + yd * yd;
      if (sqd > (50 * 50)) {
        continue;
      }
      closeIdxs.push_back(idx);
    }
    return closeIdxs;
  }

  Vector<ImagePointLocation> removePointsAtSortedIdxs(
    const Vector<ImagePointLocation> &pts, const Vector<int> &idxs) {
    Vector<ImagePointLocation> newPts;
    int idx = 0;
    for (int i = 0; i < pts.size(); ++i) {
      if (i != idxs[idx]) {
        newPts.push_back(pts[i]);
      } else {
        idx++;
      }
    }
    return newPts;
  }

  Vector<ImagePointLocation> keepPointsAtSortedIdxs(
    const Vector<ImagePointLocation> &pts, const Vector<int> &idxs) {
    Vector<ImagePointLocation> newPts;
    int idx = 0;
    for (int i = 0; i < pts.size(); ++i) {
      if (i == idxs[idx]) {
        newPts.push_back(pts[i]);
        idx++;
      }
    }
    return newPts;
  }

  PatchData pyramidPatch(Gr8Pyramid pyramid, ImagePointLocation l) {
    PatchData patch;
    auto s = pyramid.level(l.scale);
    int x = l.pt.x;
    int y = l.pt.y;
    const uint8_t *rowStart = s.pixels() + (y - 3) * s.rowBytes() + (x - 3) * 4;
    for (int i = 0; i < 7; ++i) {
      for (int j = 0; j < 7; ++j) {
        patch.pix[i * 7 + j] = rowStart[j * 4];
      }
      rowStart += s.rowBytes();
    }
    patch.featureScore = l.response * RESPONSE_GAIN;
    return patch;
  }

  Vector<ImagePointLocation> selectCrossNeighbors(
    const ImagePointLocation &last,
    const Gr8Pyramid &lastPyr,
    Vector<ImagePointLocation> &neighbors) {
    if (neighbors.size() < CROSS_NEIGHBORS) {
      return Vector<ImagePointLocation>();
    }
    auto crossDescs = getDescriptor(lastPyr, last);
    auto allDescs = getDescriptors(lastPyr, neighbors);

    while (crossDescs.size() < CROSS_NEIGHBORS) {
      float maxDist = 0.0f;
      int bestDesc = 0;
      for (int i = 0; i < allDescs.size(); ++i) {
        float minDist = 1000.0f;
        for (int j = 0; j < crossDescs.size(); ++j) {
          float d = allDescs[i].features().get<OrbFeature>().hammingDistance(
            crossDescs[j].features().get<OrbFeature>());
          if (d < minDist) {
            minDist = d;
          }
        }
        if (minDist > maxDist) {
          maxDist = minDist;
          bestDesc = i;
        }
      }
      crossDescs.push_back(allDescs[bestDesc].location());
      crossDescs.back().mutableFeatures() = allDescs[bestDesc].features().clone();
    }

    Vector<ImagePointLocation> diverseNeighbors;
    for (int i = 0; i < crossDescs.size(); ++i) {
      diverseNeighbors.push_back(crossDescs[i].location());
    }
    return diverseNeighbors;
  }

  Vector<ImagePointLocation> selectExampleCandidates(
    ImagePointLocation last,
    Gr8Pyramid lastPyr,
    Vector<ImagePointLocation> &curr,
    Gr8Pyramid currPyr) {
    if (curr.size() < MATCH_NEIGHBORS) {
      return Vector<ImagePointLocation>();
    }

    // Find the point in the current image with the lowest discriptor distance to the point in the
    // previous image.
    auto lastDescs = getDescriptor(lastPyr, last);
    auto currDescs = getDescriptors(currPyr, curr);
    float minDist = 1000;  // max is 256.
    ImagePointLocation bestLoc;
    for (const auto &desc : currDescs) {
      float dist = lastDescs[0].features().get<OrbFeature>().hammingDistance(
        desc.features().get<OrbFeature>());
      if (dist < minDist) {
        minDist = dist;
        bestLoc = desc.location();
      }
    }

    // Find the closest points to the best match.
    Vector<std::pair<double, int>> distToBest;
    float bx = bestLoc.pt.x;
    float by = bestLoc.pt.y;
    double is = 1.0f / curr.size();
    for (int i = 0; i < curr.size(); ++i) {
      double xd = curr[i].pt.x - bx;
      double yd = curr[i].pt.y - by;
      distToBest.push_back(std::make_pair(xd * xd + yd * yd + i * is, i));
    }
    std::sort(distToBest.begin(), distToBest.end());

    // Return points that are close to the best match.
    Vector<ImagePointLocation> closeToBest;
    for (int i = 0; i < MATCH_NEIGHBORS; ++i) {
      closeToBest.push_back(curr[distToBest[i].second]);
    }
    return closeToBest;
  }

  Example getExamplePatches(
    const ImagePointLocation &last,
    const Gr8Pyramid &lastPyr,
    const Vector<ImagePointLocation> &curr,
    Gr8Pyramid currPyr) {
    Example e;
    e.target = pyramidPatch(lastPyr, last);
    for (int l = 0; l < e.candidates.size(); ++l) {
      e.candidates[l] = pyramidPatch(currPyr, curr[l]);
    }
    return e;
  }

  ImagePoints getDescriptor(const Gr8Pyramid &p, const ImagePointLocation pt) {
    Vector<ImagePointLocation> v{1, pt};
    return getDescriptors(p, v);
  }

  ImagePoints getDescriptors(const Gr8Pyramid &p, Vector<ImagePointLocation> &pts) {
    auto orbIndices = gr8_.computeOrbKeypoints(p, DETECTION_CONFIG_ALL_ORB, &pts);
    auto pd = gr8_.toPointsWithEmptyDescriptors(pts);
    gr8_.computeGr8Descriptors(p, orbIndices, false, &pd);
    return pd;
  }
};

int main(int argc, char *argv[]) {
  bool doDisplay = true;
  auto rStream = RealityStreamFactory::createFromFlags(argc, argv);
  FeatureScoreDatasetCallback datasetGenerator;
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

  C8Log("[construct-feature-score-dataset] Final Score: %f", datasetGenerator.score());

  return 0;
}
