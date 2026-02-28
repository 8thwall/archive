// Copyright (c) 2021 8th Wall, Inc.
// Original Author: Nathan Waters (nathan@8thwall.com)
//
// Provides an entrypoint for accessing manually created synthetic scenes which can be used for
// benchmarking purposes.

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {
    "synthetic-scenes.h",
  };
  deps = {
    "//c8:hmatrix",
    "//c8:map",
    "//c8:random-numbers",
    "//c8:hpoint",
    "//c8:string",
    "//c8:c8-log",
    "//c8:vector",
    "//c8/geometry:intrinsics",
    "//c8/pixels:draw3-widgets",
    "//c8/pixels/render:renderer",
    "//c8/io:image-io",
  };
  visibility = {
    "//visibility:public",
  };
  data = {
    "//reality/quality/synthetic:assets",
  };
}
cc_end(0x66bc286e);

#include "c8/c8-log.h"
#include "c8/geometry/intrinsics.h"
#include "c8/io/image-io.h"
#include "c8/map.h"
#include "c8/pixels/draw3-widgets.h"
#include "c8/pixels/render/renderer.h"
#include "c8/random-numbers.h"
#include "c8/string.h"
#include "reality/quality/synthetic/synthetic-scenes.h"

namespace c8 {

namespace {

const TreeMap<String, int> SYNTHETIC_IDS = {
  // clang-format off
  {"Outside Ground", 0},
  {"Carpet Ground", 1},
  {"Crate Grid", 2},
  {"Platform", 3},
  {"Cluttered Top", 4},
  {"Lobby Tour", 5},
  {"Office Windows Translation", 6},
  // To add any additional scenes or variations, add the name and incremented ID here and then
  // update the syntheticSceneContent() switch statement below.
  // clang-format on
};

/**
 * Returns a scene that contains a single textured quad at y=-1.0
 */
std::unique_ptr<Group> basicGround(const String &groundTexturePath) {
  static TreeMap<String, RGBA8888PlanePixelBuffer> groundTexturePathToTexture;
  if (groundTexturePathToTexture.find(groundTexturePath) == groundTexturePathToTexture.end()) {
    groundTexturePathToTexture[groundTexturePath] = readImageToRGBA(groundTexturePath);
  }
  auto g = ObGen::named(ObGen::group(), "basic-ground");
  auto &ground = g->add(ObGen::quad());
  GeoGen::flipTextureY(&ground.geometry());
  ground.material()
    .setShader(Shaders::PHYSICAL)
    .setColorTexture(TexGen::rgbaPixels(groundTexturePathToTexture[groundTexturePath].pixels()));
  ground.setLocal(
    HMatrixGen::translation(0.0f, -1.0f, 0.0f) * HMatrixGen::rotationD(90, 0, 0)
    * HMatrixGen::scale(5));
  return g;
}

/**
 * Returns a scene that contains a quadrant of repeated textured quads at y=-1.0
 */
std::unique_ptr<Group> repeatedBasicGround(
  const String &groundTexturePath = "reality/quality/synthetic/assets/carpet.jpg") {
  auto g = ObGen::named(ObGen::group(), "repeated-basic-ground");
  g->add(ObGen::positioned(
    basicGround(groundTexturePath),
    HMatrixGen::translation(-2.5f, 0.f, -2.5f) * HMatrixGen::yDegrees(-90.f)
      * HMatrixGen::scale(.5f, 1.f, .5f)));
  g->add(ObGen::positioned(
    basicGround(groundTexturePath),
    HMatrixGen::translation(-2.5f, 0.f, 2.5f) * HMatrixGen::yDegrees(0.f)
      * HMatrixGen::scale(.5f, 1.f, .5f)));
  g->add(ObGen::positioned(
    basicGround(groundTexturePath),
    HMatrixGen::translation(2.5f, 0.f, -2.5f) * HMatrixGen::yDegrees(180.f)
      * HMatrixGen::scale(.5f, 1.f, .5f)));
  g->add(ObGen::positioned(
    basicGround(groundTexturePath),
    HMatrixGen::translation(2.5f, 0.f, 2.5f) * HMatrixGen::yDegrees(90.f)
      * HMatrixGen::scale(.5f, 1.f, .5f)));
  return g;
}

/**
 * Returns a scene that contains a quadrant of repeated textured quads at y=-1.0
 */
std::unique_ptr<Group> repeatedBasicGround(const String &groundTexturePath, int gridSize) {
  auto g = ObGen::named(ObGen::group(), "repeated-basic-ground");

  for (int i = -gridSize; i < gridSize; ++i) {
    for (int j = -gridSize; j < gridSize; ++j) {
      g->add(ObGen::positioned(
        basicGround(groundTexturePath), HMatrixGen::translation(i * 10, 0.f, j * 10)));
    }
  }
  return g;
}

std::unique_ptr<Renderable> crate() {
  static RGBA8888PlanePixelBuffer boxTexture =
    readImageToRGBA("reality/quality/synthetic/assets/crate.jpg");
  auto box = ObGen::cubeMesh();
  box->material()
    .setShader(Shaders::PHYSICAL)
    .setColorTexture(TexGen::rgbaPixels(boxTexture.pixels()))
    .setRenderSide(RenderSide::FRONT);
  return box;
}

// All boxes are at the same height and using the same crate texture.
std::unique_ptr<Group> crateGrid(int gridSize, float spacing) {
  // Single static texture that the multiple boxes are using simultaneously.
  static RGBA8888PlanePixelBuffer boxTexture =
    readImageToRGBA("reality/quality/synthetic/assets/crate.jpg");
  auto group = ObGen::named(ObGen::group(), "boxes");
  for (int i = -gridSize; i <= gridSize; ++i) {
    for (int j = -gridSize; j <= gridSize; ++j) {
      auto box = ObGen::cubeMesh();
      box->setLocal(
        HMatrixGen::translation(spacing * i, -0.75f, spacing * j) * HMatrixGen::scale(0.5));
      box->material()
        .setShader(Shaders::PHYSICAL)
        .setColorTexture(TexGen::rgbaPixels(boxTexture.pixels()))
        .setRenderSide(RenderSide::FRONT);
      group->add(std::move(box));
    }
  }
  return group;
}

// Adds a variety of clutter onto the ground with multiple objects taking up-to 50% of the surface
// area. This simulates our surface interaction with a cluttered desk or coffee table.
std::unique_ptr<Group> clutter(int gridSize, int clearSize, float spacing, RandomNumbers &rng) {
  // Single static texture that the multiple boxes are using simultaneously.
  static const auto cubeTex1 = readImageToRGBA("reality/quality/synthetic/assets/crate.jpg");
  static const auto cubeTex2 = readImageToRGBA("reality/quality/synthetic/assets/cubemap1.jpg");
  static const auto cubeTex3 = readImageToRGBA("reality/quality/synthetic/assets/cubemap2.png");
  static const auto cubeTex4 = readImageToRGBA("reality/quality/synthetic/assets/cubemap3.jpg");
  Vector<RGBA8888PlanePixels> boxTextures = {
    cubeTex1.pixels(),
    cubeTex2.pixels(),
    cubeTex3.pixels(),
    cubeTex4.pixels(),
  };
  auto group = ObGen::named(ObGen::group(), "clutter");
  for (int i = -gridSize; i <= gridSize; ++i) {
    for (int j = -gridSize; j <= gridSize; ++j) {
      // Have a clear center of size specified by the calling function
      if (i <= clearSize && i >= -clearSize && j <= clearSize && j >= -clearSize) {
        continue;
      }

      auto box = ObGen::cubeMesh();
      box->setLocal(
        HMatrixGen::translation(
          static_cast<float>(spacing * i) + (rng.nextRandomNormal32f() * 0.2f),
          -1.0f,
          static_cast<float>(spacing * j) + (rng.nextRandomNormal32f() * 0.2f))
        * Quaternion::fromEulerAngleDegrees(
            static_cast<float>(90 * (i * j)),
            static_cast<float>(90 * (i + j)),
            static_cast<float>(90 * (i + j * i)))
            .toRotationMat()
        * HMatrixGen::scale(0.25));
      box->material()
        .setShader(Shaders::PHYSICAL)
        .setColorTexture(TexGen::rgbaPixels(boxTextures[(i + j) % boxTextures.size()]))
        .setRenderSide(RenderSide::FRONT);
      group->add(std::move(box));
    }
  }
  return group;
}

// Adds a single table to the middle of the scene that is at a higher height than the ground.
// Useful for testing when a user starts on a table and then moves off a table.
std::unique_ptr<Renderable> platform() {
  // Single static texture that the multiple boxes are using simultaneously.
  static auto tableTexture = readImageToRGBA("reality/quality/synthetic/assets/table.jpg");
  auto table = ObGen::cubeMesh();
  table->setLocal(HMatrixGen::translation(0.0f, -2.0f, 0.0f) * HMatrixGen::scale(3.0));
  table->material()
    .setShader(Shaders::PHYSICAL)
    .setColorTexture(TexGen::rgbaPixels(tableTexture.pixels()));
  return table;
}

// Adds a table with four legs.
std::unique_ptr<Group> table() {
  static const auto tableTexture = readImageToRGBA("reality/quality/synthetic/assets/table.jpg");
  auto g = ObGen::named(ObGen::group(), "table");
  g->add(ObGen::named(
           ObGen::positioned(
             ObGen::cubeMesh(),
             HMatrixGen::translation(0.f, .5f, 0.f) * HMatrixGen::scale(1.5f, .05f, .5f)),
           "top"))
    .material()
    .setShader(Shaders::PHYSICAL)
    .setColorTexture(TexGen::rgbaPixels(tableTexture.pixels()));
  for (int i = -1; i <= 1; i += 2) {
    for (int j = -1; j <= 1; j += 2) {
      g
        ->add(ObGen::named(
          ObGen::positioned(
            ObGen::cubeMesh(),
            HMatrixGen::translation(i * .5f, .225f, j * .2f) * HMatrixGen::scale(.05f, 0.5f, .05f)),
          "leg"))
        .geometry()
        .setColor(Color::BLACK);
    }
  }
  return g;
}

std::unique_ptr<Group> clutteredTable() {
  auto g = ObGen::named(ObGen::group(), "cluttered-table");
  g->add(table());
  g->add(ObGen::positioned(
           ObGen::cubeMesh(),
           HMatrixGen::translation(-.3f, .55f, 0.f) * HMatrixGen::scale(.1f, .05f, .1f)))
    .geometry()
    .setColor(Color::GREEN);
  g->add(ObGen::positioned(
           ObGen::cubeMesh(),
           HMatrixGen::translation(.65f, .55f, .1f) * HMatrixGen::scale(.1f, .2f, .1f)))
    .geometry()
    .setColor(Color::DARK_YELLOW);
  g->add(ObGen::positioned(
           ObGen::curvyMesh({}),
           HMatrixGen::translation(.65f, .55f, -.1f) * HMatrixGen::scale(.1f, .2f, .1f)))
    .geometry()
    .setColor(Color::GRAY_05);
  return g;
}

std::unique_ptr<Group> monitorTable() {
  auto g = ObGen::named(ObGen::group(), "monitor-table");
  g->add(clutteredTable());
  g->add(ObGen::positioned(
           ObGen::cubeMesh(),
           HMatrixGen::translation(0.f, .55f, 0.f) * HMatrixGen::scale(.6f, .6f, .05f)))
    .geometry()
    .setColor(Color::BLACK);
  return g;
}

std::unique_ptr<Group> lobbyTour() {
  auto g = ObGen::positioned(
    ObGen::named(ObGen::group(), "lobby-tour"), HMatrixGen::translation(0.f, -1.f, 0.f));

  // Desks
  g->add(ObGen::positioned(clutteredTable(), HMatrixGen::translation(3.f, 0.f, -1.2f)));
  g->add(ObGen::positioned(table(), HMatrixGen::translation(0.2f, 0.f, -4.f)));
  g->add(ObGen::positioned(table(), HMatrixGen::translation(0.f, 0.f, -2.7f)));

  // Lobby objects
  g->add(ObGen::named(
           ObGen::positioned(
             ObGen::cubeMesh(),
             HMatrixGen::translation(0.f, .25f, 4.5f) * HMatrixGen::scale(1.f, .4f, 1.f)),
           "black-couch"))
    .geometry()
    .setColor(Color::BLACK);
  g->add(ObGen::named(
    ObGen::positioned(
      crate(), HMatrixGen::translation(2.25f, .25f, 2.3f) * HMatrixGen::scale(3.f, .5f, .1f)),
    "grass-divider"));
  g->add(ObGen::named(
           ObGen::positioned(
             ObGen::cubeMesh(),
             HMatrixGen::translation(3.5f, .25f, 3.5f) * HMatrixGen::scale(.5f, .5f, 2.f)),
           "cabinets"))
    .geometry()
    .setColor(Color::GRAY_04);

  // Wall in front.
  g->add(ObGen::named(
           ObGen::positioned(
             ObGen::cubeMesh(),
             HMatrixGen::translation(1.4f, 1.f, 5.f) * HMatrixGen::scale(4.9f, 2.f, .1f)),
           "+z-wall"))
    .geometry()
    .setColor(Color::GRAY_01);
  // Wall behind
  g->add(ObGen::named(
           ObGen::positioned(
             ObGen::cubeMesh(),
             HMatrixGen::translation(1.4f, 1.f, -5.f) * HMatrixGen::scale(4.9f, 2.f, .1f)),
           "-z-wall"))
    .geometry()
    .setColor(Color::GRAY_01);
  // Wall on left.
  g->add(ObGen::named(
           ObGen::positioned(
             ObGen::cubeMesh(),
             HMatrixGen::translation(-1.f, 1.f, 0.f) * HMatrixGen::scale(.1f, 2.f, 10.f)),
           "-x-wall"))
    .geometry()
    .setColor(Color::GRAY_01);
  // Wall on right.
  g->add(ObGen::named(
           ObGen::positioned(
             ObGen::cubeMesh(),
             HMatrixGen::translation(3.8f, 1.f, 0.f) * HMatrixGen::scale(.1f, 2.f, 10.f)),
           "+x-wall"))
    .geometry()
    .setColor(Color::GRAY_01);

  // Lighting
  g->add(ObGen::positioned(
    ObGen::directionalLight(Color::OFF_WHITE, .8f, false),
    HMatrixGen::translation(1.f, 2.f, -4.f)));

  return g;
}

std::unique_ptr<Group> officeWindowsTranslation() {
  auto g = ObGen::positioned(
    ObGen::named(ObGen::group(), "office-windows-translation"),
    HMatrixGen::translation(0.f, -1.f, 0.f));

  // Desks
  g->add(ObGen::positioned(
    clutteredTable(), HMatrixGen::translation(1.f, 0.f, 2.f) * HMatrixGen::yDegrees(90.f)));
  g->add(ObGen::positioned(
    clutteredTable(), HMatrixGen::translation(1.8f, 0.f, 2.f) * HMatrixGen::yDegrees(-90.f)));

  g->add(ObGen::positioned(
    clutteredTable(), HMatrixGen::translation(3.5f, 0.f, 2.5f) * HMatrixGen::yDegrees(-90.f)));
  g->add(ObGen::positioned(
    clutteredTable(), HMatrixGen::translation(4.3f, 0.f, 2.5f) * HMatrixGen::yDegrees(90.f)));
  g->add(ObGen::positioned(monitorTable(), HMatrixGen::translation(4.f, 0.f, 1.f)));

  g->add(ObGen::positioned(
    clutteredTable(), HMatrixGen::translation(6.f, 0.f, 2.f) * HMatrixGen::yDegrees(90.f)));
  g->add(ObGen::positioned(
    clutteredTable(), HMatrixGen::translation(6.8f, 0.f, 2.f) * HMatrixGen::yDegrees(-90.f)));

  g->add(ObGen::positioned(crate(), HMatrixGen::translation(9.f, 0.f, 2.f)));

  // Wall in front.
  g->add(ObGen::named(
           ObGen::positioned(
             ObGen::cubeMesh(),
             HMatrixGen::translation(5.f, 1.f, 5.f) * HMatrixGen::scale(12.1f, 2.f, .1f)),
           "+z-wall"))
    .geometry()
    .setColor(Color::GRAY_01);
  // Wall on left.
  g->add(ObGen::named(
           ObGen::positioned(
             ObGen::cubeMesh(),
             HMatrixGen::translation(-1.f, 1.f, 0.f) * HMatrixGen::scale(.1f, 2.f, 10.f)),
           "-x-wall"))
    .geometry()
    .setColor(Color::GRAY_01);
  // Wall on right.
  g->add(ObGen::named(
           ObGen::positioned(
             ObGen::cubeMesh(),
             HMatrixGen::translation(11.f, 1.f, 2.f) * HMatrixGen::scale(.1f, 2.f, 6.f)),
           "+x-wall"))
    .geometry()
    .setColor(Color::GRAY_01);

  // Lighting
  g->add(ObGen::positioned(
    ObGen::directionalLight(Color::DULL_YELLOW, .8f, false),
    HMatrixGen::translation(1.f, 2.f, -4.f)));
  g->add(ObGen::positioned(
    ObGen::directionalLight(Color::GRAY_03, .8f, false),
    HMatrixGen::translation(4.f, 2.f, 6.f) * HMatrixGen::yDegrees(180.f)));

  return g;
}
}  // namespace

// Returns the list of synthetic scene names.
const Vector<String> &syntheticSceneNames() {
  static Vector<String> names;
  // Slight optimization since this is called each frame in Omniscope when the window is opened.
  if (names.size() > 0) {
    return names;
  }

  names.reserve(SYNTHETIC_IDS.size());
  for (const auto &it : SYNTHETIC_IDS) {
    names.push_back(it.first);
  }
  return names;
}

// Add the content of a synthetic scene to a provided scene node
std::unique_ptr<Group> syntheticSceneContent(const String &sceneName) {
  auto group = ObGen::group();
  group->setName("synthetic-scene-content");
  RandomNumbers rng(42);
  auto it = SYNTHETIC_IDS.find(sceneName);
  if (it == SYNTHETIC_IDS.end()) {
    // unable to find a scene for the given name
    C8Log("[synthetic-scenes] ERROR: Unable to find synthetic scene named '%s'", sceneName.c_str());
    return group;
  }

  switch (it->second) {
    case 0:
      // Outside Ground
      group->add(repeatedBasicGround("reality/quality/synthetic/assets/ground.jpg", 3));
      group->setLocal(HMatrixGen::scale(2.0f));
      break;
    case 1:
      // Carpet Ground
      group->add(repeatedBasicGround("reality/quality/synthetic/assets/carpet.jpg", 3));
      group->setLocal(HMatrixGen::scale(1.4f));
      break;
    case 2:
      // Crate Grid
      group->add(repeatedBasicGround("reality/quality/synthetic/assets/carpet.jpg", 3));
      group->add(crateGrid(5, 4.0f));
      group->setLocal(HMatrixGen::scale(1.4f));
      break;
    case 3:
      // Platform
      group->add(repeatedBasicGround("reality/quality/synthetic/assets/carpet.jpg", 3));
      group->add(platform());
      group->setLocal(HMatrixGen::scale(1.4f));
      break;
    case 4:
      // Cluttered Top
      group->add(repeatedBasicGround("reality/quality/synthetic/assets/table.jpg", 3));
      group->add(clutter(5, 1, 2.0f, rng));
      group->setLocal(HMatrixGen::scale(1.4f));
      break;
    case 5:
      // Lobby Tour
      group->add(repeatedBasicGround("reality/quality/synthetic/assets/carpet.jpg"));
      group->add(lobbyTour());
      group->setLocal(HMatrixGen::scale(1.4f));
      break;
    case 6:
      // Office Windows Translation
      group->add(ObGen::positioned(repeatedBasicGround(), HMatrixGen::scale(2.2f, 1.f, 2.2f)));
      group->add(officeWindowsTranslation());
      group->setLocal(HMatrixGen::scale(1.4f));
      break;
    default:
      C8Log(
        "[synthetic-scenes] ERROR: The scene name '%s' was registered but there is not a "
        "corresponding scene to return",
        sceneName.c_str());
  }

  return group;
}

// Return the scene of a given synthetic scene name in the specified dimensions.
std::unique_ptr<Scene> syntheticScene(
  const String &sceneName, const c8_PixelPinholeCameraModel &intrinsics, int w, int h) {

  // This will be consistent across all synthetic scene
  auto scene = ObGen::scene(w, h);
  scene->add(ObGen::perspectiveCamera(intrinsics, w, h));
  scene->add(quadrantLights());
  scene->setName(sceneName);

  scene->add(syntheticSceneContent(sceneName));

  return scene;
};

}  // namespace c8
