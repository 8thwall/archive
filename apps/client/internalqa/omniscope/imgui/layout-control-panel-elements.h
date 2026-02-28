// Copyright (c) 2021 8th Wall, Inc.
// Original Author: Paris Morgan (paris@8thwall.com)

#pragma once

#include "apps/client/internalqa/omniscope/native/control-panel-element.h"

namespace c8 {

bool layoutCheckbox(ControlPanelElement *c, bool val);
bool layoutSlider(ControlPanelElement *c, float val);
bool layoutIntSlider(ControlPanelElement *c, int val);
bool layoutInputSlider(ControlPanelElement *c, float val);
bool layoutRadioButton(ControlPanelElement *c, int val);
bool layoutButton(ControlPanelElement *c, bool val);
bool layoutListBox(ControlPanelElement *c, int val);

}  // namespace c8
