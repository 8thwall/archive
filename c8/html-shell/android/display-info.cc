// Copyright (c) 2025 Niantic Spatial, Inc.
// Original Author: Lucas Reyna (lucas@nianticspatial.com)

#include "c8/html-shell/android/display-info.h"

#include "c8/android/jni/scoped-local-env.h"
#include "c8/c8-log.h"

#define FLAG_TRANSLUCENT_STATUS 0x04000000
#define FLAG_TRANSLUCENT_NAVIGATION 0x08000000

#define LAYOUT_IN_DISPLAY_CUTOUT_MODE_DEFAULT 0
#define LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES 1
#define LAYOUT_IN_DISPLAY_CUTOUT_MODE_NEVER 2
#define LAYOUT_IN_DISPLAY_CUTOUT_MODE_ALWAYS 3

namespace c8 {

float getDevicePixelRatio(JNIEnv *env, jobject activity) {
  auto scopedEnv = ScopedLocalEnv(env);

  auto contextClass = scopedEnv.GetObjectClass(activity);
  auto getResources =
    scopedEnv.GetMethodID(contextClass, "getResources", "()Landroid/content/res/Resources;");
  auto resources = scopedEnv.CallObjectMethod<jobject>(activity, getResources);

  auto resourcesClass = scopedEnv.GetObjectClass(resources);
  auto getDisplayMetrics =
    scopedEnv.GetMethodID(resourcesClass, "getDisplayMetrics", "()Landroid/util/DisplayMetrics;");
  auto displayMetrics = scopedEnv.CallObjectMethod<jobject>(resources, getDisplayMetrics);

  auto dmClass = scopedEnv.GetObjectClass(displayMetrics);
  auto densityField = scopedEnv.GetFieldID(dmClass, "density", "F");
  auto density = scopedEnv.GetFloatField(displayMetrics.get(), densityField);

  return density;
}

// See: https://developer.android.com/reference/android/view/WindowMetrics
DisplayInfo getDisplayInfo(JNIEnv *env, jobject activity) {
  auto scopedEnv = ScopedLocalEnv(env);

  auto activityClass = scopedEnv.GetObjectClass(activity);

  auto getWindowManager =
    scopedEnv.GetMethodID(activityClass, "getWindowManager", "()Landroid/view/WindowManager;");
  auto windowManager = scopedEnv.CallObjectMethod<jobject>(activity, getWindowManager);

  auto windowManagerClass = scopedEnv.GetObjectClass(windowManager);
  auto getCurrentWindowMetrics = scopedEnv.GetMethodID(
    windowManagerClass, "getCurrentWindowMetrics", "()Landroid/view/WindowMetrics;");
  auto windowMetrics = scopedEnv.CallObjectMethod<jobject>(windowManager, getCurrentWindowMetrics);

  auto windowMetricsClass = scopedEnv.GetObjectClass(windowMetrics);
  auto getWindowInsets =
    scopedEnv.GetMethodID(windowMetricsClass, "getWindowInsets", "()Landroid/view/WindowInsets;");
  auto windowInsets = scopedEnv.CallObjectMethod<jobject>(windowMetrics, getWindowInsets);

  auto windowInsetsTypeClass = scopedEnv.FindClass("android/view/WindowInsets$Type");
  auto systemBarsMethod = scopedEnv.GetStaticMethodID(windowInsetsTypeClass, "systemBars", "()I");
  auto systemBarsType = scopedEnv.CallStaticIntMethod(windowInsetsTypeClass, systemBarsMethod);

  auto windowInsetsClass = scopedEnv.GetObjectClass(windowInsets);
  auto getInsetsIgnoringVisibility = scopedEnv.GetMethodID(
    windowInsetsClass, "getInsetsIgnoringVisibility", "(I)Landroid/graphics/Insets;");
  auto insets =
    scopedEnv.CallObjectMethod<jobject>(windowInsets, getInsetsIgnoringVisibility, systemBarsType);

  auto insetsClass = scopedEnv.GetObjectClass(insets);
  auto leftField = scopedEnv.GetFieldID(insetsClass, "left", "I");
  auto rightField = scopedEnv.GetFieldID(insetsClass, "right", "I");
  auto left = scopedEnv.GetIntField(insets.get(), leftField);
  auto right = scopedEnv.GetIntField(insets.get(), rightField);

  auto topField = scopedEnv.GetFieldID(insetsClass, "top", "I");
  auto bottomField = scopedEnv.GetFieldID(insetsClass, "bottom", "I");
  auto top = scopedEnv.GetIntField(insets.get(), topField);
  auto bottom = scopedEnv.GetIntField(insets.get(), bottomField);

  auto getBounds =
    scopedEnv.GetMethodID(windowMetricsClass, "getBounds", "()Landroid/graphics/Rect;");
  auto bounds = scopedEnv.CallObjectMethod<jobject>(windowMetrics, getBounds);

  auto rectClass = scopedEnv.GetObjectClass(bounds);

  auto widthMethod = scopedEnv.GetMethodID(rectClass, "width", "()I");
  int screenWidth = scopedEnv.CallIntMethod(bounds, widthMethod);

  auto heightMethod = scopedEnv.GetMethodID(rectClass, "height", "()I");
  int screenHeight = scopedEnv.CallIntMethod(bounds, heightMethod);

  int insetScreenWidth = screenWidth - left - right;
  int insetScreenHeight = screenHeight - top - bottom;

  float devicePixelRatio = getDevicePixelRatio(env, activity);

  return DisplayInfo{
    .screenWidth = screenWidth,
    .insetScreenWidth = insetScreenWidth,
    .screenHeight = screenHeight,
    .insetScreenHeight = insetScreenHeight,
    .devicePixelRatio = devicePixelRatio,
  };
}

void setLayoutInDisplayCutoutMode(JNIEnv *env, jobject activity, int mode) {
  auto activityClass = env->GetObjectClass(activity);
  auto getWindow = env->GetMethodID(activityClass, "getWindow", "()Landroid/view/Window;");
  auto window = env->CallObjectMethod(activity, getWindow);

  auto windowClass = env->GetObjectClass(window);
  auto getAttributes =
    env->GetMethodID(windowClass, "getAttributes", "()Landroid/view/WindowManager$LayoutParams;");
  auto layoutParams = env->CallObjectMethod(window, getAttributes);

  auto layoutParamsClass = env->GetObjectClass(layoutParams);
  auto cutoutModeField = env->GetFieldID(layoutParamsClass, "layoutInDisplayCutoutMode", "I");
  env->SetIntField(layoutParams, cutoutModeField, mode);

  auto setAttributes =
    env->GetMethodID(windowClass, "setAttributes", "(Landroid/view/WindowManager$LayoutParams;)V");
  env->CallVoidMethod(window, setAttributes, layoutParams);
}

void hideStatusBars(JNIEnv *env, jobject activity) {
  auto versionClass = env->FindClass("android/os/Build$VERSION");
  auto sdkIntField = env->GetStaticFieldID(versionClass, "SDK_INT", "I");
  auto sdkInt = env->GetStaticIntField(versionClass, sdkIntField);

  if (sdkInt < 30) {
    return;
  }

  // activity.getWindow().getInsetsController().hide(WindowInsets.Type.systemBars())
  auto activityClass = env->GetObjectClass(activity);
  auto getWindow = env->GetMethodID(activityClass, "getWindow", "()Landroid/view/Window;");
  auto window = env->CallObjectMethod(activity, getWindow);

  auto windowClass = env->GetObjectClass(window);
  auto getInsetsController =
    env->GetMethodID(windowClass, "getInsetsController", "()Landroid/view/WindowInsetsController;");
  auto insetsController = env->CallObjectMethod(window, getInsetsController);

  if (insetsController) {
    auto insetsControllerClass = env->GetObjectClass(insetsController);
    auto insetsTypeClass = env->FindClass("android/view/WindowInsets$Type");
    auto systemBarsMethod = env->GetStaticMethodID(insetsTypeClass, "systemBars", "()I");
    auto systemBarsType = env->CallStaticIntMethod(insetsTypeClass, systemBarsMethod);

    auto hideMethod = env->GetMethodID(insetsControllerClass, "hide", "(I)V");
    env->CallVoidMethod(insetsController, hideMethod, systemBarsType);
  } else {
    C8Log("[display-info] Unable to get InsetsController. Status Bars may not be hidden.");
  }
}

// TODO(lreyna): Support toggling system insets on/off at runtime.
// At the moment, this is only called once at app startup.
void toggleSystemInsets(JNIEnv *env, jobject activity, bool show) {
  auto activityClass = env->GetObjectClass(activity);
  auto getWindow = env->GetMethodID(activityClass, "getWindow", "()Landroid/view/Window;");
  auto window = env->CallObjectMethod(activity, getWindow);

  auto windowClass = env->GetObjectClass(window);
  auto addFlags = env->GetMethodID(windowClass, "addFlags", "(I)V");

  if (!show) {
    hideStatusBars(env, activity);
  }

  // NOTE(lreyna): These calls are needed to signal to Android to use a fullscreen window when
  // the status bars are potentially hidden. Otherwise, we won't be able to render content in the
  // system inset areas.
  // See: https://developer.android.com/reference/android/view/WindowManager.LayoutParams
  setLayoutInDisplayCutoutMode(env, activity, LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES);
  env->CallVoidMethod(window, addFlags, FLAG_TRANSLUCENT_STATUS);
  env->CallVoidMethod(window, addFlags, FLAG_TRANSLUCENT_NAVIGATION);
}

}  // namespace c8
