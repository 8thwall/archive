// Copyright (c) 2020 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {"omniscope-layout-thread.h"};
  deps = {
    "//apps/client/internalqa/omniscope/native:control-panel-element",
    "//apps/client/internalqa/omniscope/imgui/imgui-notify:layout-notification",
    ":load-datasets",
    ":omniscope-processing-thread",
    ":omniscope-thread-channel",
    ":layout-control-panel-elements",
    ":layout-formatting",
    ":layout-json",
    ":layout-logging-summary",
    ":layout-plot",
    ":layout-table",
    "//c8/pixels/render:object8",
    ":ui-config",
    "//c8:map",
    "//c8:set",
    "//c8:string",
    "//c8/string:join",
    "//c8:vector",
    "//c8/geometry:egomotion",
    "//c8/pixels:camera-controls",
    "//c8/pixels/opengl:gl-headers",
    "//c8/pixels/opengl:gl-texture",
    "//c8/pixels/render:hit-test",
    "//third_party/imgui/icons:imgui-fontawesome",
    "//reality/quality/synthetic:synthetic-scenes",
    "@imgui//:imgui",
    "@json//:json",
  };
}
cc_end(0xe0f0df1f);

#include <imgui.h>

#include <locale>
#include <memory>
#include <nlohmann/json.hpp>
#include <thread>

#include "apps/client/internalqa/omniscope/imgui/imgui-notify/layout-notification.h"
#include "apps/client/internalqa/omniscope/imgui/layout-control-panel-elements.h"
#include "apps/client/internalqa/omniscope/imgui/layout-formatting.h"
#include "apps/client/internalqa/omniscope/imgui/layout-json.h"
#include "apps/client/internalqa/omniscope/imgui/layout-logging-summary.h"
#include "apps/client/internalqa/omniscope/imgui/layout-plot.h"
#include "apps/client/internalqa/omniscope/imgui/layout-table.h"
#include "apps/client/internalqa/omniscope/imgui/load-datasets.h"
#include "apps/client/internalqa/omniscope/imgui/omniscope-layout-thread.h"
#include "apps/client/internalqa/omniscope/imgui/omniscope-processing-thread.h"
#include "apps/client/internalqa/omniscope/imgui/omniscope-thread-channel.h"
#include "apps/client/internalqa/omniscope/imgui/ui-config.h"
#include "apps/client/internalqa/omniscope/native/control-panel-element.h"
#include "c8/geometry/egomotion.h"
#include "c8/map.h"
#include "c8/pixels/camera-controls.h"
#include "c8/pixels/opengl/egl.h"
#include "c8/pixels/opengl/gl-texture.h"
#include "c8/pixels/render/hit-test.h"
#include "c8/pixels/render/object8.h"
#include "c8/set.h"
#include "c8/string.h"
#include "c8/string/join.h"
#include "c8/vector.h"
#include "reality/quality/synthetic/synthetic-scenes.h"
#include "third_party/imgui/icons/IconsFontAwesome4.h"

namespace c8 {

constexpr int RIGHT_ARROW_KEY = 259;
constexpr int ESCAPE_KEY = 27;

const Vector<String> FAQ = {
  "How to move the camera around the scene?",
  "- Left-click + drag or hold alt to rotate; Right-click + drag or hold cmd to pan; Mouse wheel "
  "or hold ctrl to zoom.",
  "- WASD for translation; EQ for height up/down; IJKL for rotation; OU for tilt left/right.",
  "\nHow to organize windows?",
  "- Click on the top of a window and drag it into another window. They can be tabbed or split.",
  "\nWhat is the number in the Hierarchy panel?",
  "- That is a sequential ID assigned to all Object8's.",
  "\nHow can I inspect elements?",
  "- Left click on an object in the scene view.",
  "- Hold tab and hover over the scene view.",
  "- Click on an object in the hierarchy.",
  "\nWhat do the icons mean?",
  format(
    "Scene: %s, Group: %s, Renderable: %s, Camera: %s, Light %s.",
    typeToIcon("Scene").c_str(),
    typeToIcon("Group").c_str(),
    typeToIcon("Renderable").c_str(),
    typeToIcon("Camera").c_str(),
    typeToIcon("Light").c_str()),
};

std::unique_ptr<std::thread> omniscopeThread;
std::shared_ptr<OmniscopeThreadChannel> channel;
std::unique_ptr<DatasetNode> datasets;
std::unique_ptr<DatasetNode> mapDatasets;

// State to layout the Inspector window.
String selectedNodeId = "";
// The node selected in the hierarchy or from the scene view.
Object8 *selectedNode = nullptr;
// The selected element in a hit-test.  For example, if the user clicked on a point in the point
// cloud, then this will be index of the point, which will be used for getting the point data
// from elementMetadata().
int selectedElementIndex = -1;
// Record if the user selected a node in the view using a hit-test this frame.  Set back to false
// at the end of the frame.
bool didSelectNodeInView = false;
// The node hovered over in the hierarchy.
Object8 *hoveredNodeInHierarchy = nullptr;
bool isNodeHovered = false;

// Camera movement.
Quaternion previousRotation;
float yaw = 0.f;
float pitch = 0.f;

// Called when the user hits "reset" or changes source
void shutdownProcessingThread(OmniscopeProcessingState *omniscopeState) {
  channel->pushEvents({{OmniscopeUiEvent::SHUTDOWN}});
  omniscopeThread->join();
  omniscopeThread.reset(nullptr);
  selectedNode = nullptr;
  hoveredNodeInHierarchy = nullptr;
  isNodeHovered = false;
  selectedNodeId = "";
  selectedElementIndex = -1;
  if (omniscopeState != nullptr) {
    omniscopeState->clear();
  }
}

// Displays a little (?) mark which shows a tooltip when hovered.
void HelpMarker(const char *desc) {
  if ((desc != NULL) && (desc[0] == '\0')) {
    return;
  }
  ImGui::SameLine();
  ImGui::TextDisabled("(?)");
  if (ImGui::IsItemHovered()) {
    ImGui::BeginTooltip();
    ImGui::PushTextWrapPos(ImGui::GetFontSize() * 35.0f);
    ImGui::TextUnformatted(desc);
    ImGui::PopTextWrapPos();
    ImGui::EndTooltip();
  }
}

// TODO(paris): Would be nice to also have orbital rotation, as opposed to just directional.
void updateCameraPosition(Lockable<Scene> *scene, const Vector<int> &keys) {
  auto lock = scene->lock();
  bool dirty = false;
  if (!scene->ref().has<Scene>("world-view")) {
    return;
  }
  auto &worldScene = scene->ref().find<Scene>("world-view");
  if (!worldScene.has<Camera>()) {
    return;
  }
  ImGuiIO &io = ImGui::GetIO();
  auto &sceneCam = worldScene.find<Camera>();
  HMatrix cam = sceneCam.local();

  // Keyboard.
  for (auto key : keys) {
    HMatrix newCam = cam;
    dirty |= updateViewCameraPosition(key, cam, &newCam);
    cam = newCam;
  }

  // Zoom.
  bool useMouse = std::abs(io.MouseWheel) > 1e-5;
  auto useCtrl =
    io.KeyCtrl && (std::abs(io.MouseDelta.x) > 1e-5 || std::abs(io.MouseDelta.y) > 1e-5);
  if (ImGui::IsWindowHovered() && (useMouse || useCtrl)) {
    dirty = true;
    auto delta = useMouse ? io.MouseWheel : (io.MouseDelta.x + io.MouseDelta.y) / 100.f;
    HVector3 zOffset = rotationMat(cam) * HVector3(0.f, 0.f, 1.f) * delta;
    cam = cam.translate(zOffset.x(), zOffset.y(), zOffset.z());
  }

  if (
    ImGui::IsWindowHovered()
    && (std::abs(io.MouseDelta.x) > 1e-5 || std::abs(io.MouseDelta.y) > 1e-5)) {
    if (ImGui::IsMouseDown(ImGuiMouseButton_Right) || io.KeySuper) {
      // Pan.
      dirty = true;
      float x = -io.MouseDelta.x / 100.f;
      float y = io.MouseDelta.y / 100.f;
      HVector3 right = rotationMat(cam) * HVector3(1.f, 0.f, 0.f);
      HVector3 up = rotationMat(cam) * HVector3(0.f, 1.f, 0.f);
      HVector3 offset = right.unit() * x + up.unit() * y;
      cam = cam.translate(offset.x(), offset.y(), offset.z());
    } else if (ImGui::IsMouseDown(ImGuiMouseButton_Left) || io.KeyAlt) {
      // Rotation.
      dirty = true;
      // Check if rotation is different from the last frame, if so update pitch & yaw.
      Quaternion incomingRotation = Quaternion::fromHMatrix(cam);
      if (previousRotation.dist(incomingRotation) > 1e-5) {
        // Project unit normal from the camera onto the ground and compute angle of projected
        // vector.
        yaw = groundPlaneRotationRads(incomingRotation);

        // Project unit normal from the camera onto the ground, get it's length, then get angle.
        HPoint3 cameraNorm{0.0f, 0.0f, 1.0f};
        HPoint3 cameraNormInWorldCoords = incomingRotation.toRotationMat() * cameraNorm;
        HVector2 arc(cameraNormInWorldCoords.x(), cameraNormInWorldCoords.z());
        pitch =
          cameraNormInWorldCoords.y() <= 0.f ? std::acos(arc.l2Norm()) : -std::acos(arc.l2Norm());
      }
      yaw += -io.MouseDelta.x / 200.f;
      pitch += -io.MouseDelta.y / 200.f;

      pitch = std::clamp(static_cast<double>(pitch), -M_PI / 2.f, M_PI / 2.f);
      while (yaw < 0.f) {
        yaw += 2.f * M_PI;
      }
      while (yaw >= 2.f * M_PI) {
        yaw -= 2.f * M_PI;
      }

      cam = translationMat(cam) * HMatrixGen::yRadians(yaw) * HMatrixGen::xRadians(pitch);
      previousRotation = Quaternion::fromHMatrix(cam);
    }
  }

  if (dirty) {
    sceneCam.setLocal(cam);
    (*scene)->setNeedsRerender(true);
  }
}

// Recursively lay out the sources menu.
const DatasetNode *layoutSourceMenu(const DatasetNode *node) {
  // Files / leaf node.
  String nodeDisplay = format("%s %s", node->icon.c_str(), node->name.c_str());
  if (node->children.empty()) {
    if (ImGui::MenuItem(nodeDisplay.c_str())) {
      return node;
    }
    return nullptr;
  }

  const DatasetNode *selected = nullptr;
  if (node->name.empty()) {
    // root node - no name. Just lay out the children.
    for (const auto &c : node->children) {
      const auto *selectedChild = layoutSourceMenu(c.get());
      if (selectedChild != nullptr) {
        selected = selectedChild;
      }
    }
  } else if (ImGui::BeginMenu(nodeDisplay.c_str())) {
    // Directories. Show the directory name in a menu and then lay out the children.
    for (const auto &c : node->children) {
      const auto *selectedChild = layoutSourceMenu(c.get());
      if (selectedChild != nullptr) {
        selected = selectedChild;
      }
    }
    ImGui::EndMenu();
  }
  return selected;
}

bool layoutInspectorWindow() {
  bool dirty = false;
  Object8 *node = isNodeHovered ? hoveredNodeInHierarchy : selectedNode;
  if (!ImGui::Begin("Omniscope | Inspector") || node == nullptr) {
    ImGui::End();
    return dirty;
  }
  auto enabled = node->enabled();
  if (ImGui::Checkbox(typeToIcon(node->type()).c_str(), &enabled)) {
    node->setEnabled(enabled);
    dirty = true;
  }
  ImGui::SameLine();
  ImGui::Text("%s", node->toString().c_str());
  ImGui::TextUnformatted("local:");
  ImGui::Text("  translation: %s", trsTranslation(node->local()).toString().c_str());
  ImGui::Text("  rotation:    %s", trsRotation(node->local()).toString().c_str());
  ImGui::Text("  scale:       %s", trsScale(node->local()).toString().c_str());
  ImGui::TextUnformatted("world:");
  ImGui::Text("  translation: %s", trsTranslation(node->world()).toString().c_str());
  ImGui::Text("  rotation:    %s", trsRotation(node->world()).toString().c_str());
  ImGui::Text("  scale:       %s", trsScale(node->world()).toString().c_str());

  // Specific to node type
  if (node->is<Camera>()) {
    const auto &c = node->as<Camera>();
    ImGui::Text("projection:\n%s", c.projection().toString().c_str());
  } else if (node->is<Light>()) {
    const auto &l = node->as<Light>();
    ImGui::Text("kind: %d, intensity: %f", l.kind(), l.intensity());
    ImGui::TextColored(
      toImColor(l.color()),
      "color: (%u, %u, %u, %u)",
      l.color().r(),
      l.color().g(),
      l.color().b(),
      l.color().a());
  } else if (node->is<Renderable>()) {
    const auto &r = node->as<Renderable>();
    ImGui::Text("kind: %d, ignoreProjection %d", r.kind(), r.ignoreProjection());
    ImGui::Text("geometry:\n  %s", r.geometry().toString("  ").c_str());
    ImGui::Text("material:\n  %s", r.material().toString("  ").c_str());
  }

  // Metadata
  ImGui::Text("%s", "metadata:");
  if (nlohmann::json::accept(node->metadata())) {
    auto metadata = nlohmann::json::parse(node->metadata());
    layoutJSON(
      *node,
      "{}: ",
      metadata,
      -1,     // -1 represents the root index.
      false,  // Lets layoutJSON know this is metadata() and not elementMetadata().
      didSelectNodeInView,
      selectedElementIndex);
  } else {
    ImGui::Text("%s", node->metadata().substr(0, 200).c_str());
  }

  if (node->is<Renderable>()) {
    const auto &r = node->as<Renderable>();
    ImGui::Text("%s", "element metadata:");
    nlohmann::json elementMetadataJSON;
    for (const auto &el : r.elementMetadata()) {
      if (nlohmann::json::accept(el)) {
        auto elJSON = nlohmann::json::parse(el);
        elementMetadataJSON.push_back(elJSON);
      } else {
        elementMetadataJSON.push_back(el.substr(0, 200));
      }
    }
    layoutJSON(
      *node,
      "[]: ",
      elementMetadataJSON,
      -1,    // -1 represents the root index.
      true,  // Lets layoutJSON know this is elementMetadata() and not metadata().
      didSelectNodeInView,
      selectedElementIndex);
  }
  ImGui::End();
  return dirty;
}

// Recursively lay out a tree-structure for objects in the scene graph.
bool layoutNode(Object8 *node, const Vector<String> &selectedNodeParents) {
  bool dirty = false;
  // Layout node
  ImGuiTreeNodeFlags nodeFlags = ImGuiTreeNodeFlags_OpenOnArrow
    | ImGuiTreeNodeFlags_OpenOnDoubleClick | ImGuiTreeNodeFlags_DefaultOpen;
  if (node->children().size() == 0) {
    nodeFlags |= ImGuiTreeNodeFlags_Bullet;
  }
  if (node->id() == selectedNodeId) {
    nodeFlags |= ImGuiTreeNodeFlags_Selected;
  }

  // Force open the nodes that are parents of the selected item.
  if (
    std::find(selectedNodeParents.begin(), selectedNodeParents.end(), node->id())
    != selectedNodeParents.end()) {
    ImGui::SetNextItemOpen(true);
  }

  ImGui::AlignTextToFramePadding();
  bool open = ImGui::TreeNodeEx(node->id().c_str(), nodeFlags, "%s", "");
  ImGui::SameLine();

  auto enabled = node->enabled();
  if (ImGui::Checkbox(typeToIcon(node->type()).c_str(), &enabled)) {
    node->setEnabled(enabled);
    dirty = true;
  }
  ImGui::SameLine();

  // Draw node info on one line
  String nodeName = node->name();
  auto nodeNameColor = toImColor(Color::WHITE);
  if (nodeName.empty()) {
    nodeName = "UNNAMED";
    nodeNameColor = toImColor(Color::DARK_GRAY);
  }
  ImGui::TextColored(nodeNameColor, "%s", nodeName.c_str());

  // State for Inspector window.
  if (ImGui::IsItemClicked()) {
    selectedNodeId = node->id();
    // Since we've selected an item in the hierarchy, we need to undo selectedElementIndex which
    // can only be set by clicking on an element in the view.
    selectedElementIndex = -1;
  }
  if (ImGui::IsItemHovered()) {
    isNodeHovered = true;
    hoveredNodeInHierarchy = node;
  } else if (selectedNodeId == node->id() && !isNodeHovered) {
    // Separate from IsItemClicked() b/c we could have been clicked on a previous frame.
    selectedNode = node;
  }

  ImGui::SameLine();
  ImGui::TextColored(toImColor(Color::GRAY_05), "%s", node->id().c_str());

  // Recursively layout children.
  if (open) {
    for (auto &child : node->children()) {
      dirty |= layoutNode(child.get(), selectedNodeParents);
    }
    ImGui::TreePop();
  }
  return dirty;
}

// Layouts the Hierarchy and Inspector windows for the scene.
void layoutScene(Lockable<Scene> *scene) {
  auto lock = scene->lock();
  if (selectedNodeId == "") {
    selectedNodeId = scene->ptr()->id();
  }
  ImGui::Begin("Omniscope | Hierarchy");
  isNodeHovered = false;

  // List of ids of the parents of the node selected in the view.  This forces open those nodes
  // so that it shows the selected object in the hierarchy.  Note that we should only do this on the
  // frame the node is selected.  The user should be able to re-collapse the node if desired.
  Vector<String> selectedNodeParents;
  if (selectedNode != nullptr && didSelectNodeInView) {
    Object8 *parent = selectedNode->parent();
    while (parent != nullptr) {
      selectedNodeParents.push_back(parent->id());
      parent = parent->parent();
    }
  }

  if (layoutNode(scene->ptr(), selectedNodeParents)) {
    scene->ptr()->setNeedsRerender(true);
  }
  ImGui::End();

  // Called outside of the recursion to ensure only 1 update to the Inspector window per-frame.
  if (layoutInspectorWindow()) {
    scene->ptr()->setNeedsRerender(true);
  }

  // Set back to false so we don't force the node and its metadata to be expanded each frame.
  didSelectNodeInView = false;
}

void layoutUiInRenderThread() {
  static std::shared_ptr<UiConfig> uiConfig(new UiConfig());
  static OmniscopeProcessingState omniscopeState;
  if (channel == nullptr) {
    channel.reset(new OmniscopeThreadChannel());
  }

  if (datasets == nullptr) {
    datasets.reset(new DatasetNode(loadDatasets(uiConfig.get())));
  }

  if (mapDatasets == nullptr) {
    mapDatasets.reset(new DatasetNode(loadDatasets(uiConfig.get(), true)));
  }

  channel->omniscopeState(&omniscopeState);
  Vector<OmniscopeUiEvent> events;
  Vector<int> keys;
  // Our state (make them static = more or less global) as a convenience to keep the example
  // terse.
  if (omniscopeThread == nullptr) {
    omniscopeThread = processOmniscopeStream(CGLGetCurrentContext(), uiConfig, channel);
  }

  // If you cmd + tab to another window then come back, io.KeySuper will be true. Reset it.
  // https://github.com/ocornut/imgui/issues/3832
  if (ImGui::IsWindowAppearing()) {
    ImGui::GetIO().KeySuper = false;
  }

  if (ImGui::BeginMainMenuBar()) {
    // Select the source to process, from datasets dir, remote app, or recents.
    if (ImGui::BeginMenu("Source")) {
      auto selectedSource = layoutSourceMenu(datasets.get());
      if (selectedSource != nullptr) {
        // Update the source and recents.
        auto cfg = uiConfig->get();
        cfg.setSource(selectedSource->path);
        uiConfig->set(cfg);
        // Rebuild the sources list to include the new recent selection.
        datasets.reset(new DatasetNode(loadDatasets(uiConfig.get())));
        // Shut down the current view, it will reopen with the selected one set on the uiConfig.
        shutdownProcessingThread(&omniscopeState);
      }
      ImGui::EndMenu();
    }
    // Select the omniscope view to run on the current source.
    if (ImGui::BeginMenu("View")) {
      for (const auto &e : omniscopeState.views) {
        if (ImGui::BeginMenu(e.first.c_str())) {
          for (int i = 0; i < e.second.size(); ++i) {
            if (ImGui::MenuItem(format("%d %s", i, e.second[i].c_str()).c_str())) {
              events.push_back({OmniscopeUiEvent::Kind::SELECT_VIEW, {e.first, i}});
            }
          }
          ImGui::EndMenu();
        }
      }
      ImGui::EndMenu();
    }
    // Select the synthetic scene
    if (ImGui::BeginMenu("Synthetic Scenes")) {
      auto synthNames = syntheticSceneNames();
      // Add keyword "None" as the first element in the drop down menu so users can remove the
      // synthetic scene and go back to the camera feed.
      synthNames.insert(synthNames.begin(), "None");
      for (const auto &name : synthNames) {
        auto cfg = uiConfig->get();
        if (ImGui::MenuItem(name.c_str(), "", cfg.syntheticSceneName == name)) {
          cfg.syntheticSceneName = name;
          uiConfig->set(cfg);
          // Shut down the current view, it will reopen with the selected synthetic scene set on the
          // uiConfig.
          shutdownProcessingThread(&omniscopeState);
        }
      }
      ImGui::EndMenu();
    }
    // Select the map file to load
    if (ImGui::BeginMenu("Map Source")) {
      auto selectedMapSource = layoutSourceMenu(mapDatasets.get());
      if (selectedMapSource != nullptr) {
        // Update the map source
        auto cfg = uiConfig->get();
        cfg.prebuiltMapSrc = selectedMapSource->path;
        uiConfig->set(cfg);
        // Shut down the current view, it will reopen with the selected one set on the uiConfig.
        shutdownProcessingThread(&omniscopeState);
      }
      ImGui::EndMenu();
    }
    ImGui::EndMainMenuBar();
  }

  bool nextPressed = false;
  bool prevPressed = false;
  bool stepPressed = false;
  bool pausePressed = false;
  bool stopPressed = false;

  // imgui only lets you check if a given key is pressed, and it allows you to define up to 512
  // keys that could be pressed.  So, just check them all.
  for (int i = 0; i < 512; ++i) {
    if (ImGui::IsKeyPressed(i, true)) {
      int lower = i;
      // osx imgui seems to give upper case key values for lower case keypresses. Since we usually
      // handle lowercase keys, convert both upper and lowercase to lower case instead of upper
      // case.
      if (i >= 'A' && i <= 'Z') {
        lower = i - 'A' + 'a';
      }
      if (lower == 'n') {
        nextPressed = true;
      } else if (lower == 'p') {
        prevPressed = true;
      } else if (lower == RIGHT_ARROW_KEY) {
        stepPressed = true;
      } else if (lower == ' ') {
        pausePressed = true;
      } else if (lower == ESCAPE_KEY) {
        stopPressed = true;
      } else {
        keys.push_back(lower);
        events.push_back({OmniscopeUiEvent::Kind::KEY_PRESSED, {}, {}, static_cast<double>(lower)});
      }
    }
  }

  {
    // Windows for text.
    for (const auto &e : omniscopeState.text) {
      if (ImGui::Begin(
            format("%s | %s", omniscopeState.currentViewName.c_str(), e.first.c_str()).c_str())) {
        // Use TextUnformatted to handle long strings: https://github.com/ocornut/imgui/issues/2429
        ImGui::TextUnformatted(&e.second[0], &e.second[e.second.size()]);
      }
      ImGui::End();
    }
  }

  {
    // Windows for line plots.
    for (const auto &[tagName, seriesPlot] : omniscopeState.seriesPlots) {
      auto windowName = format("%s | %s", omniscopeState.currentViewName.c_str(), tagName.c_str());
      // NOTE(paris): This is a bug that we pass in tagName, but correctly passing in window name
      // will destroy everyone's window location preferences.
      layoutPlot(tagName, seriesPlot);
    }
  }

  {
    // Windows for tables.
    for (const auto &[tagName, table] : omniscopeState.tables) {
      layoutTable(
        format("%s | %s", omniscopeState.currentViewName.c_str(), tagName.c_str()), table);
    }
  }

  {
    // Window for logging summary.
    if (ImGui::Begin("Omniscope | Logging Summary")) {
      layoutLoggingSummary(omniscopeState.summary.reader());
    }
    ImGui::End();
  }

  {
    // Windows for images.
    static TreeMap<String, GlTexture2D> imageTextures;
    static TreeSet<String> usedTextures;
    usedTextures.clear();
    for (const auto &e : omniscopeState.images) {
      String tag = format("%s | %s", omniscopeState.currentViewName.c_str(), e.first.c_str());
      auto pix = e.second.pixels();
      usedTextures.insert(tag);
      auto el = imageTextures.find(tag);
      if (el == imageTextures.end()) {
        el = imageTextures.emplace(std::make_pair(tag, GlTexture2D(nullptr))).first;
      }
      auto &tex = el->second;
      if (tex.width() != pix.cols() || tex.height() != pix.rows()) {
        tex = makeLinearRGBA8888Texture2D(pix.cols(), pix.rows());
      }
      tex.bind();
      tex.updateImage(pix.pixels());
      tex.unbind();

      if (ImGui::Begin(tag.c_str(), NULL, ImGuiWindowFlags_HorizontalScrollbar)) {
        ImGui::Image(reinterpret_cast<void *>(tex.id()), ImVec2(pix.cols(), pix.rows()));
      }
      ImGui::End();
    }

    // De-allocate unused textures.
    for (auto &e : imageTextures) {
      auto &tex = e.second;
      if (usedTextures.find(e.first) == usedTextures.end() && tex.id() != 0) {
        tex = GlTexture2D(nullptr);
      }
    }
  }

  {
    // Window for the scene.
    if (omniscopeState.scene != nullptr) {
      layoutScene(omniscopeState.scene.get());
    }
  }

  {
    // Window for playback, settings, and control panel elements.
    ImGui::Begin("Omniscope | 8th Wall");
    if (!omniscopeState.done) {

      if (ImGui::Button("Next") || nextPressed) {
        events.push_back({OmniscopeUiEvent::Kind::GO_NEXT});
      }

      ImGui::SameLine();

      if (ImGui::Button("Prev") || prevPressed) {
        events.push_back({OmniscopeUiEvent::Kind::GO_PREV});
      }

      ImGui::SameLine();

      if (ImGui::Button(omniscopeState.paused ? "Play" : "Pause") || pausePressed) {
        events.push_back({OmniscopeUiEvent::Kind::TOGGLE_PAUSE});
      }

      if (omniscopeState.paused) {
        ImGui::SameLine();
        if (ImGui::Button("Step") || stepPressed) {
          events.push_back({OmniscopeUiEvent::STEP});
        }
      }

      ImGui::SameLine();
      if (ImGui::Button("Stop") || stopPressed) {
        events.push_back({OmniscopeUiEvent::STOP});
        // Push state forward to trigger the new stop state.
        omniscopeState.paused ? events.push_back({OmniscopeUiEvent::TOGGLE_PAUSE})
                              : events.push_back({OmniscopeUiEvent::STEP});
      }
    } else {
      if (ImGui::Button("Reset") || stopPressed) {
        shutdownProcessingThread(&omniscopeState);
      }
    }
    ImGui::SameLine();
    HelpMarker(strJoin(FAQ.begin(), FAQ.end(), "\n").c_str());

    ImGui::Text("Frame %d", omniscopeState.frame);

    if (omniscopeState.controlPanelElements != nullptr) {
      bool dirty = false;
      int id = 0;
      for (auto &e : *omniscopeState.controlPanelElements) {
        bool showHelpMarker = true;
        ImGui::PushID(id++);
        switch (e.second.type()) {
          case ControlPanelElement::Type::CHECKBOX:
            dirty |= layoutCheckbox(&e.second, e.second.val<bool>());
            break;
          case ControlPanelElement::Type::SLIDER:
            dirty |= layoutSlider(&e.second, e.second.val<float>());
            break;
          case ControlPanelElement::Type::INT_SLIDER:
            dirty |= layoutIntSlider(&e.second, e.second.val<int>());
            break;
          case ControlPanelElement::Type::INPUT_SLIDER:
            dirty |= layoutInputSlider(&e.second, e.second.val<float>());
            break;
          case ControlPanelElement::Type::RADIO_BUTTON:
            dirty |= layoutRadioButton(&e.second, e.second.val<int>());
            break;
          case ControlPanelElement::Type::BUTTON:
            dirty |= layoutButton(&e.second, e.second.val<bool>());
            break;
          case ControlPanelElement::Type::LIST_BOX:
            dirty |= layoutListBox(&e.second, e.second.val<int>());
          case ControlPanelElement::Type::UNSPECIFIED:
            // fallthrough
          default:
            showHelpMarker = false;
            break;
        }
        ImGui::PopID();
        if (showHelpMarker) {
          HelpMarker(e.second.tooltip().c_str());
        }
        if (dirty && omniscopeState.scene != nullptr) {
          auto lock = omniscopeState.scene->lock();
          omniscopeState.scene->ptr()->setNeedsRerender(true);
        }
      }
    }

    // Allow saving of different camera locations
    {
      auto cfg = uiConfig->get();
      const auto &cameraPositions = cfg.realitySrcToCameraPositions[cfg.realitySrc];
      ImGui::Text("Saved camera positions (%lu)", cameraPositions.size());
      for (int i = 0; i < cameraPositions.size(); i++) {
        if (ImGui::Button(format("%d", i).c_str())) {
          events.push_back({OmniscopeUiEvent::JUMP_TO_CAMERA_LOCATION, {"", i}});
        }
        ImGui::SameLine();
      }
      if (ImGui::Button(ICON_FA_PLUS " Location")) {
        events.push_back({OmniscopeUiEvent::ADD_CURRENT_CAMERA_LOCATION});
      }
    }

    {
      // Frame rate and location of source
      auto hz = ImGui::GetIO().Framerate;
      ImGui::Text("%.1f ms/frame (%.1f FPS)", 1000.0f / hz, hz);
      const auto &realitySrc = uiConfig->get().realitySrc;
      const String delim = "datasets/";
      auto pos = realitySrc.find(delim);
      if (pos == std::string::npos) {
        selectableText(realitySrc);
      } else {
        selectableText(realitySrc.substr(pos + delim.size(), realitySrc.size()));
      }
    }

    {
      // Embedded device info
      ImGui::Text(
        "Manufacturer=%s Model=%s %s",
        omniscopeState.deviceInfo.manufacturer.c_str(),
        omniscopeState.deviceInfo.model.c_str(),
        omniscopeState.deviceInfo.isUnspecifiedModel ? "NEED CALIBRATION" : "");
      ImGui::Text(
        "OS=%s Ver=%s",
        omniscopeState.deviceInfo.os.c_str(),
        omniscopeState.deviceInfo.osVersion.c_str());
    }

    {
      // Scale
      ImGui::Text("responsiveToMetricScale=%.2f", omniscopeState.responsiveToMetricScale);
    }

    ImGui::End();
  }

  if (omniscopeState.displayTex.width() > 0) {
    float xpadding = 10.0f;  // magic padding value, is there an imgui style to get this from?
    float ypadding = 30.0f;  // magic padding value, is there an imgui style to get this from?
    // Window size set to magic padding value, plus small extra bound to hide scrollbar.
    auto size = ImVec2(
      omniscopeState.displayTex.width() + xpadding + 2,
      omniscopeState.displayTex.height() + ypadding + 5);
    ImGui::SetNextWindowSize(size, ImGuiCond_FirstUseEver);
    ImGui::Begin(omniscopeState.currentViewName.c_str());
    ImGui::Image(
      reinterpret_cast<void *>(omniscopeState.displayTex.id()),
      ImVec2(omniscopeState.displayTex.width(), omniscopeState.displayTex.height()));
    if (
      ImGui::IsWindowHovered()
      && (ImGui::IsMouseClicked(ImGuiMouseButton_Left) || ImGui::IsKeyDown(ImGui::GetKeyIndex(ImGuiKey_Tab)))) {
      auto mousePos = ImGui::GetMousePos();
      auto imPos = ImGui::GetWindowPos();
      auto clickX = mousePos.x - imPos.x + ImGui::GetScrollX() - xpadding;
      auto clickY = mousePos.y - imPos.y + ImGui::GetScrollY() - ypadding;

      if (
        clickX >= 0 && clickX < omniscopeState.displayTex.width() && clickY >= 0
        && clickY < omniscopeState.displayTex.height()) {
        if (omniscopeState.scene != nullptr) {
          auto lock = omniscopeState.scene->lock();
          // Update which node was selected for the inspector view.  Some views are using the old
          // renderer and do not have any children, so do not call hitTestPixel on them.
          if (!omniscopeState.scene->ref().children().empty()) {
            auto selectedNodes = hitTestPixel(omniscopeState.scene->ref(), {clickX, clickY});
            if (selectedNodes.size() > 0) {
              // The first node is the one closest to the camera.
              selectedNode = const_cast<Object8 *>(selectedNodes[0].target);

              if (selectedNode->is<Renderable>()) {
                const auto &r = selectedNode->as<Renderable>();
                if (selectedNodes[0].elementIndex < r.elementMetadata().size()) {
                  selectedElementIndex = selectedNodes[0].elementIndex;
                }
              }
              selectedNodeId = selectedNode->id();
              // Record that the user selected a node in the view so that it will expand the
              // hierarchy to show the selected node.
              didSelectNodeInView = true;
            }
          }
        }

        // you can hold down on tab to query in the scene efficiently.  We don't want this to serve
        // as a touch event, because it registers as as double touch event which can reset trackers
        // in multiple views.  Therefore, only register a touch if the left mouse button is clicked.
        if (ImGui::IsMouseClicked(ImGuiMouseButton_Left)) {
          events.push_back({OmniscopeUiEvent::TOUCH, {}, {clickX, clickY}});
        }
      }
    }

    // If the user is hovering over the scene, allow them to update the camera position using their
    // mouse/trackpad/keyboard controls.
    if (omniscopeState.scene != nullptr && ImGui::IsItemHovered()) {
      updateCameraPosition(omniscopeState.scene.get(), keys);
    }

    ImGui::End();
  }

  {
    // Render notifications
    ImGui::PushStyleVar(ImGuiStyleVar_WindowRounding, 5.f);  // Round borders
    ImGui::PushStyleColor(
      ImGuiCol_WindowBg,
      ImVec4(43.f / 255.f, 43.f / 255.f, 43.f / 255.f, 100.f / 255.f));  // Background color
    ImGui::RenderNotifications();  // <-- Here we render all notifications
    ImGui::PopStyleVar(1);         // Don't forget to Pop()
    ImGui::PopStyleColor(1);
  }

  channel->pushEvents(events);
}

void applicationWillTerminate() { shutdownProcessingThread(nullptr); }

}  // namespace c8
