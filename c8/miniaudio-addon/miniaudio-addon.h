#include <v8.h>

v8::Local<v8::Object> initMiniaudioAddon(
  v8::Isolate *isolate, v8::Local<v8::Context> context, uv_loop_t *loop);

void cleanupAudio();
void pauseAllAudio();
void resumeAllAudio();
