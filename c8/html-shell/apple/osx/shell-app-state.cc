// Copyright (c) 2025 Niantic, Inc.
// Original Author: Yu-Hsiang Huang (yuhsianghuang@nianticlabs.com)

#include "c8/html-shell/apple/osx/shell-app-state.h"

namespace c8 {

ShellAppState *getShellAppState() {
  static ShellAppState *state = new ShellAppState();
  return state;
}

}  // namespace c8
