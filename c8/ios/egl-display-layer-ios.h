// Copyright (c) 2024 Niantic, Inc.
// Original Author: Yu-Hsiang Huang (yuhsianghuang@nianticlabs.com)

#pragma once

#ifdef __cplusplus
extern "C" {
#endif

#include "c8/symbol-visibility.h"

C8_PUBLIC
void c8EglDisplayLayerIos_create(void *layer, int renderingSystem);

C8_PUBLIC
void c8EglDisplayLayerIos_destroy();

C8_PUBLIC
void *c8EglDisplayLayerIos_getDisplay();

C8_PUBLIC
void *c8EglDisplayLayerIos_getSurface();

C8_PUBLIC
void *c8EglDisplayLayerIos_getContext();

C8_PUBLIC
void c8EglDisplayLayerIos_bind();

C8_PUBLIC
void c8EglDisplayLayerIos_unbind();

C8_PUBLIC
void c8EglDisplayLayerIos_present();

#ifdef __cplusplus
}  // extern "C"
#endif
