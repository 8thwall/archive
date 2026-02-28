#include <v8.h>

v8::Local<v8::Object> initHeadlessGlAddon(v8::Isolate *isolate, v8::Local<v8::Context> context);

// Functions for updating the native window.
void setNewNativeWindow(void *nativeWindow);
void destroySurface();
void setAndroidApp(struct android_app *appPointer);
