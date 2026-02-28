package(default_visibility = ["//visibility:public"])

android_library(
    name = "arcore-sensor",
    srcs = [
        "ARCoreSensorData.java",
        "ARCoreTextureReader.java",
        "CameraGLContextHelper.java",
        "GLARCoreSensor.java",
        "ImageDetectionConfigAsyncTask.java",
    ],
    deps = [
        "//c8/annotations",
        "//c8/opengl",
        "//c8/pixels:pixels-java",
        "//reality/app/xr/common:api-limits-java",
        "//reality/engine/api:reality.capnp-java",
        "//reality/engine/api/base:image-types.capnp-java",
        "//third_party/arcore-1-39",
        "@capnproto_java//:capnp-runtime-java",
    ],
)
