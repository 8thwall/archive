// Copyright (c) 2025 Niantic, Inc.
// Original Author: Lucas Reyna (lucasreyna@nianticlabs.com)
//
// Platform-independent conversions for Native SensorEvent data to Web SensorEvent data.

#pragma once

#include "c8/quaternion.h"

namespace c8 {

/*
 * Converts a Quaternion to Euler angles in degrees for the Web Orientation API.
 * Input: Quaternion representing the rotation.
 *  - The quaternion must be normalized.
 *  - Uses the East-North-Up (ENU) coordinate system.
 *  - https://source.android.com/docs/core/interaction/sensors/sensor-types#rotation_vector
 *
 * Output: The Web Orientation API expects the following:
 * - Alpha: rotation around the z-axis in degrees [0, 360]
 * - Beta: rotation around the x-axis in degrees [-180, 180]
 * - Gamma: rotation around the y-axis in degrees [-90, 90]
 */
void getWebOrientation(Quaternion &quat, float &alpha, float &beta, float &gamma);

}  // namespace c8
