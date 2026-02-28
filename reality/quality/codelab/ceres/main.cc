// Copyright (c) 2021 8th Wall, Inc.
// Original Author: Paris Morgan (paris@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_binary {
  deps = {
    "//c8/gui:imgui-app",
    "@imgui//:imgui",
    "@ceres//:ceres",
    "//c8:set",
    "//c8:vector",
    "@implot//:implot",
    "//c8:string",
  };
}
cc_end(0x90fa0c99);

#include <imgui.h>

#include "c8/gui/imgui-app.h"
#include "c8/set.h"
#include "c8/string.h"
#include "c8/vector.h"
#include "ceres/ceres.h"
#include "implot.h"

using namespace c8;

float phi_ = 1.f;
Vector<float> xs_;
Vector<float> huberVals0_;
Vector<float> huberVals1_;
Vector<float> huberVals2_;
Vector<float> cauchyVals0_;
Vector<float> cauchyVals1_;
Vector<float> cauchyVals2_;

void updateLossFunctions() {
  xs_.clear();
  huberVals0_.clear();
  huberVals1_.clear();
  huberVals2_.clear();
  cauchyVals0_.clear();
  cauchyVals1_.clear();
  cauchyVals2_.clear();

  auto huber = new ceres::HuberLoss(phi_);
  auto cauchy = new ceres::CauchyLoss(phi_);
  for (float i = 0.f; i < 10.f; i += 0.01f) {
    xs_.push_back(i);
    {
      double rho[3];
      huber->Evaluate(i, rho);
      huberVals0_.push_back(rho[0]);
      huberVals1_.push_back(rho[1]);
      huberVals2_.push_back(rho[2]);
    }
    {
      double rho[3];
      cauchy->Evaluate(i, rho);
      cauchyVals0_.push_back(rho[0]);
      cauchyVals1_.push_back(rho[1]);
      cauchyVals2_.push_back(rho[2]);
    }
  }
}

void createPlot(
  const String &plotName,
  const String &seriesName,
  const Vector<float> &xs,
  const Vector<float> &ys,
  double xMin,
  double xMax,
  double yMin,
  double yMax) {
  if (ImGui::Begin(plotName.c_str())) {
    ImPlot::SetNextAxesLimits(xMin, xMax, yMin, yMax, ImGuiCond_Once);
    if (ImPlot::BeginPlot(plotName.c_str(), ImVec2(-1, -1))) {
      ImPlot::PlotLine(seriesName.c_str(), xs.data(), ys.data(), xs.size());
      ImPlot::EndPlot();
    }
  }
  ImGui::End();
}

// Render thread callback to layout an imgui UI, maintain state, and process user input. It should
// be used as a callback from c8::startImGuiWindow.
void layoutUiInRenderThread() {
  if (ImGui::Begin("Main")) {
    if (ImGui::SliderFloat("Phi", &phi_, -2.0f, 3.0f)) {
      updateLossFunctions();
    }
  }
  ImGui::End();

  // NOTE - 0.2 added to all limits as padding.
  createPlot("Cauchy - rho", "rho", xs_, cauchyVals0_, -.2, 10.2, -0.2, 6.2);
  createPlot("Cauchy - rho'", "rho'", xs_, cauchyVals1_, -.2, 10.2, -0.2, 1.2);
  createPlot("Cauchy - rho''", "rho''", xs_, cauchyVals2_, -.2, 10.2, -1.2, 0.2);
  createPlot("Huber - rho", "rho", xs_, huberVals0_, -.2, 10.2, -0.2, 6.2);
  createPlot("Huber - rho'", "rho'", xs_, huberVals1_, -.2, 10.2, -0.2, 1.2);
  createPlot("Huber - rho''", "rho''", xs_, huberVals2_, -.2, 10.2, -1.2, 0.2);
}

// Shut down all threads and release resources when the user closes the window.
void applicationWillTerminate() {}

int main(int argc, char *argv[]) {
  updateLossFunctions();
  c8::startImGuiWindow("Ceres Loss Functions", &layoutUiInRenderThread, &applicationWillTerminate);
  return 0;
}
