#include <android_native_app_glue.h>

// Empty android_main, so webgl-base.h can include <android_native_app_glue.h> for the
// headless-gl-addon bazel target.
void android_main(struct android_app *app) {}
