// Copyright (c) 2017 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)
//
// C-wrapper functions for running 8thWall XR on iOS.

#pragma once

#ifdef __cplusplus
extern "C" {
#endif

#include <stdbool.h>
#include <stdint.h>

#include "c8/protolog/xr-extern.h"
#include "c8/symbol-visibility.h"

// Allocate and initialize a new reality engine.
C8_PUBLIC
void c8XRIos_create(int renderingSystem, void *session, void *sessionConfig, void *sessionDelegate);

// Destroy a reality engine.
C8_PUBLIC
void c8XRIos_destroy();

// Bytes of an XRConfiguration message.
C8_PUBLIC
void c8XRIos_configureXR(struct c8_NativeByteArray *bytes);

// Sets texture(s) managed by others to copy camera frames into. There are two exclusive options for
// the output color format:
//   - For RGBA, use c8XRIos_setManagedCameraRGBATexture(), which only supports OpenGL texture.
//   - For YUV, use c8XRIos_setManagedCameraYTexture() & c8XRIos_setManagedCameraUVTexture(), which
//     support both OpenGL and Metal textures.
//
// NOTE: Currently RGBA data is converted from raw YUV data on CPU so it may add some overhead.
C8_PUBLIC
void c8XRIos_setManagedCameraRGBATexture(
  void *texHandle, int width, int height, int renderingSystem);

C8_PUBLIC
void c8XRIos_setManagedCameraYTexture(void *texHandle, int width, int height, int renderingSystem);

C8_PUBLIC
void c8XRIos_setManagedCameraUVTexture(void *texHandle, int width, int height, int renderingSystem);

// Sets an iOS UIImageView to copy camera frames into.
C8_PUBLIC
void c8XRIos_setManagedImageView(void *imageView);

// Resume a reality engine.
C8_PUBLIC
void c8XRIos_resume();

// Resume a reality engine.
C8_PUBLIC
void c8XRIos_recenter();

// Get the most recent reality as a RealityResponse message.
C8_PUBLIC
int c8XRIos_getCurrentRealityXR(struct c8_NativeByteArray *reality);

// Get the xr environment as a XREnvironment message.
C8_PUBLIC
void c8XRIos_getXREnvironment(struct c8_NativeByteArray *bytes);

// Get the xr app environment as a XRAppEnvironment message.
C8_PUBLIC
void c8XRIos_getXRAppEnvironment(struct c8_NativeByteArray *bytes);

// Set the xr app environment from an existing XRAppEnvironment message.
C8_PUBLIC
void c8XRIos_setXRAppEnvironment(struct c8_NativeByteArray *bytes);

// Pause a reality engine.
C8_PUBLIC
void c8XRIos_pause();

C8_PUBLIC
void c8XRIos_renderFrameForDisplay();

C8_PUBLIC
void c8XRIos_renderDepthFrameForDisplay();

C8_PUBLIC
void c8XRIos_query(struct c8_NativeByteArray *request, struct c8_NativeByteArray *response);

// Legacy API, kept currently for swift compatibility.
C8_PUBLIC
void c8XRIos_configureXRLegacy(struct c8_XRConfigurationLegacy *config);

C8_PUBLIC
int c8XRIos_getCurrentRealityXRLegacy(struct c8_XRResponseLegacy *reality);

#ifdef __cplusplus
}  // extern "C"
#endif
