#include "bzl/inliner/rules2.h"

cc_binary {
  deps = {
    "//c8:c8-log",
    "//c8/geometry:box3",
    "//c8/geometry:egomotion",
    "//c8/geometry:intrinsics",
    "//c8/geometry:load-splat",
    "//c8/geometry:splat",
    "//c8/io:image-io",
    "//c8/io:video-writer",
    "//c8/pixels/opengl:offscreen-gl-context",
    "//c8/pixels/render:assimp-assets",
    "//c8/pixels/render:renderer",
    "//c8/stats:scope-timer",
    "//c8/string:split",
    "@cli11//:cli11",
  };
}
cc_end(0x5bb337e9);

#include <CLI/CLI.hpp>
#include <cmath>

#include "c8/c8-log.h"
#include "c8/geometry/box3.h"
#include "c8/geometry/egomotion.h"
#include "c8/geometry/intrinsics.h"
#include "c8/geometry/load-splat.h"
#include "c8/geometry/splat.h"
#include "c8/io/image-io.h"
#include "c8/io/video-writer.h"
#include "c8/pixels/opengl/offscreen-gl-context.h"
#include "c8/pixels/pixel-transforms.h"
#include "c8/pixels/render/assimp-assets.h"
#include "c8/pixels/render/renderer.h"
#include "c8/stats/scope-timer.h"
#include "c8/string/split.h"

using namespace c8;

HPoint3 parseHPoint3(const String &s) {
  auto parts = split(s, ",");
  if (parts.size() != 3) {
    C8Log("Invalid HPoint3: %s", s.c_str());
    return HPoint3{0.0f, 0.0f, 0.0f};
  }
  return HPoint3{std::stof(parts[0]), std::stof(parts[1]), std::stof(parts[2])};
}

Vector<HMatrix> cameraPath(
  const HPoint3 &target,
  const HPoint3 &endTarget,
  float startAngle,
  float endAngle,
  float startPitch,
  float endPitch,
  float startRadius,
  float endRadius,
  int frames,
  bool rubToRuf) {
  Vector<HMatrix> path;
  path.reserve(frames);
  float s = frames > 1 ? 1.0f / (frames - 1) : 1.0f;
  for (int i = 0; i < frames; i++) {
    float beta = i * s;
    float alpha = 1.0f - beta;
    Quaternion r = Quaternion::fromPitchYawRollDegrees(
      startPitch * alpha + endPitch * beta, startAngle * alpha + endAngle * beta, 0.0f);
    float d = startRadius * alpha + endRadius * beta;
    HPoint3 p = {
      target.x() * alpha + endTarget.x() * beta,
      target.y() * alpha + endTarget.y() * beta,
      target.z() * alpha + endTarget.z() * beta,
    };

    if (rubToRuf) {
      p = {p.x(), p.y(), -p.z()};
      r = {-r.w(), r.x(), r.y(), -r.z()};
    }

    path.push_back(
      updateWorldPosition(cameraMotion(p, r), cameraMotion(HPoint3{0.0f, 0.0f, -d}, {})));
  }
  return path;
}

int main(int argc, const char **argv) {
  CLI::App app{"load-splat"};
  String splatFile;
  int imageWidth = 1980;
  int imageHeight = 1020;
  bool renderTexture = true;
  bool orbit = true;
  int frames = 420;
  int fps = 60;
  String target = "0,0,0";
  String endTarget = "";
  float startAngle = 0;
  float endAngle = 360;
  float radius = 0;
  float endRadius = NAN;
  float pitch = 0;
  float endPitch = NAN;
  bool rubToRuf = false;

  app.add_option("--splat", splatFile, "Splat file");
  app.add_option("--width", imageWidth, "Image width");
  app.add_option("--height", imageHeight, "Image height");
  app.add_flag("--orbit", orbit, "Orbit the camera around the target");
  app.add_option("--frames", frames, "Number of frames to render");
  app.add_option("--fps", fps, "Frames per second");
  app.add_option("--target", target, "Target position");
  app.add_option("--endTarget", endTarget, "End target position");
  app.add_option("--startAngle", startAngle, "Start angle");
  app.add_option("--endAngle", endAngle, "End angle");
  app.add_option("--radius", radius, "Radius");
  app.add_option("--endRadius", endRadius, "End radius");
  app.add_option("--pitch", pitch, "Pitch");
  app.add_option("--endPitch", endPitch, "End pitch");
  app.add_flag("--rubToRuf", rubToRuf, "RUB to RUF for target and angle");

  CLI11_PARSE(app, argc, argv);

  if (endTarget.empty()) {
    endTarget = target;
  }
  if (std::isnan(endAngle)) {
    endAngle = startAngle;
  }
  if (std::isnan(endRadius)) {
    endRadius = radius;
  }
  if (std::isnan(endPitch)) {
    endPitch = pitch;
  }

  C8Log("[load-splat] Reading %s", splatFile.c_str());

  SplatRawData splatDataRaw;
  splatDataRaw = loadSplat(splatFile);

  // Print mesh data for the scene, to show an idea of the data structures and their contents.

  C8Log("Splat has %d points", splatDataRaw.header.numPoints);
  C8Log("Splat has %d SH degree", splatDataRaw.header.shDegree);
  C8Log("Splat has %d positions", splatDataRaw.positions.size());
  C8Log("Splat has %d scales", splatDataRaw.scales.size());
  C8Log("Splat has %d rotations", splatDataRaw.rotations.size());
  C8Log("Splat has %d alphas", splatDataRaw.alphas.size());
  C8Log("Splat has %d colors", splatDataRaw.colors.size());
  C8Log("Splat has %d SH coefficients", splatDataRaw.sh.size());

  auto splatData = splatAttributes(splatDataRaw);

  auto bb = Box3::from(splatData.positions);
  C8Log("Splat bounding box: %s", bb.toString().c_str());

  OffscreenGlContext ctx = OffscreenGlContext::createRGBA8888Context();

  auto scene = ObGen::scene(imageWidth, imageHeight);

  scene->renderSpec().clearColor = Color::TRUE_BLACK;

  scene->add(ObGen::positioned(
    ObGen::perspectiveCamera(
      Intrinsics::getCameraIntrinsics(DeviceInfos::APPLE_IPHONE_XS), imageWidth, imageHeight),
    cameraMotion(
      HPoint3{-2.0f, 0.0f, 0.0f}, Quaternion::fromPitchYawRollDegrees(0.0f, 0.0f, 0.0f))));

  auto &camera = scene->find<Camera>();
  auto cameraPos = camera.local();

  Vector<uint32_t> splatIds;
  if (renderTexture) {
    sortSplatIds(splatData, SplatOctreeNode{}, cameraPos, {.lowToHigh = false}, &splatIds);
    scene->add(ObGen::splatTexture(splatData.header, splatTexture(splatData), splatIds));
  } else {
    splatData = sortSplatAttributes(splatData, SplatOctreeNode{}, cameraPos, {.lowToHigh = false});
    scene->add(ObGen::splatAttributes(
      splatData.positions, splatData.rotations, splatData.scales, splatData.colors));
  }

  auto &splat = scene->find<Renderable>();

  Renderer renderer;
  renderer.render(*scene);

  auto img = renderer.result();

  writeImage(img.pixels(), "/tmp/load-splat.jpg");
  C8Log("[load-splat] Wrote /tmp/load-splat.jpg");

  VideoCollection videos;

  {
    ScopeTimer t("video-sequence");
    auto path = cameraPath(
      parseHPoint3(target),
      parseHPoint3(endTarget),
      startAngle,
      endAngle,
      pitch,
      endPitch,
      radius,
      endRadius,
      frames,
      rubToRuf);
    int i = 0;
    for (const auto &cameraPos : path) {
      ScopeTimer t1("video-sequence-frame");
      camera.setLocal(cameraPos);
      {
        ScopeTimer t2("sort-splat");
        if (renderTexture) {
          sortSplatIds(splatData, SplatOctreeNode{}, cameraPos, {.lowToHigh = false}, &splatIds);
        } else {
          splatData =
            sortSplatAttributes(splatData, SplatOctreeNode{}, cameraPos, {.lowToHigh = false});
        }
      }
      {
        ScopeTimer t2("update-instances");
        if (renderTexture) {
          ObGen::updateSplatTexture(&splat, splatIds);
        } else {
          ObGen::updateSplatAttributes(
            &splat, splatData.positions, splatData.rotations, splatData.scales, splatData.colors);
        }
      }
      {
        ScopeTimer t2("update-render");
        renderer.render(*scene);
      }
      {
        ScopeTimer t2("update-result");
        img = renderer.result();
      }
      {
        ScopeTimer t2("video-encode");
        videos.encode("/tmp/load-splat.mp4", img.pixels(), i / static_cast<float>(fps));
        ++i;
      }
    }
  }

  {
    ScopeTimer t("video-write");
    videos.finish();
  }
  C8Log("[load-splat] Wrote /tmp/load-splat.mp4");

  ScopeTimer::summarizer()->logBriefSummary();

  return 0;
}
