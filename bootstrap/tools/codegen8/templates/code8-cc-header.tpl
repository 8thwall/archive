// Copyright (c) $year 8th Wall, Inc.
// Original Author: $fullName (${unixName}@8thwall.com)
//
// TODO($unixName): Write file description.

#pragma once

namespace $ccNamespace {

class $ccClassName {
public:
  // Default constructor.
  $ccClassName() = default;

  // Default move constructors.
  $ccClassName($ccClassName&&) = default;
  $ccClassName& operator=($ccClassName&&) = default;

  // Disallow copying.
  $ccClassName(const $ccClassName&) = delete;
  $ccClassName& operator=(const $ccClassName&) = delete;

private:
};

}  // namespace $ccNamespace
