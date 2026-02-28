load("//bzl/xcode:xcode.bzl", "xcode_app", "xcode_project")

xcode_project(
    name = "data-recorder-ios",
    project = "DataRecorder",
    deps = [
        "//reality/app/disk:xr-disk-ios",
        "//reality/app/xr/ios:xr-ios",
    ],
)

xcode_app(
    name = "data-recorder",
    project = ":data-recorder-ios",
)
