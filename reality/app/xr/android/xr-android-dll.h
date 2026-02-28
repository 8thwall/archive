// Copyright (c) 2017 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)
//
// C-wrapper functions for running the XR in Unity.

#pragma once

extern "C" {

// Unity needs a native method to call before it will load the shared object library that contains
// native code called through java JNI (which can't be called by unity directly).
//
// This is a no-op method that should be called in Unity before creating an XRAndroid.
void c8_loadXRDll();

}  // extern "C"
