// Copyright (c) 2024 Niantic, Inc.
// Original Author: Riyaan Bakhda (riyaanbakhda@nianticlabs.com)
//
// C-wrapper functions for running Omniscope on iOS.

#pragma once

#ifdef __cplusplus
extern "C" {
#endif

#include "c8/protolog/xr-extern.h"
#include "c8/symbol-visibility.h"

C8_PUBLIC
void c8OmniscopeIos_create();

C8_PUBLIC
void c8OmniscopeIos_destroy();

C8_PUBLIC
void c8OmniscopeIos_configureXR(struct c8_NativeByteArray *configBytes);

C8_PUBLIC
void c8OmniscopeIos_configureXRLegacy(struct c8_XRConfigurationLegacy *config);

C8_PUBLIC
void c8OmniscopeIos_createCaptureContext(void *captureContext);

C8_PUBLIC
void c8OmniscopeIos_destroyCaptureContext();

C8_PUBLIC
void c8OmniscopeIos_initializeCameraPipeline();

C8_PUBLIC
void c8OmniscopeIos_setXRRealityPostprocessor();

C8_PUBLIC
void c8OmniscopeIos_createBackgroundThreads(void *eglDisplay, void *eglSurface, void *eglContext);

C8_PUBLIC
int c8OmniscopeIos_currentView();

C8_PUBLIC
void c8OmniscopeIos_setView(int index);

C8_PUBLIC
void c8OmniscopeIos_goNext();

C8_PUBLIC
void c8OmniscopeIos_goPrev();

C8_PUBLIC
void c8OmniscopeIos_gotTouches(int count);

C8_PUBLIC
void c8OmniscopeIos_getAndResetAnalyticsRecord(struct c8_NativeByteArray *logRecordHeaderBytes);

#ifdef __cplusplus
}  // extern "C"
#endif
