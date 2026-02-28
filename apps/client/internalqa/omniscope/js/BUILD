load("//bzl/js:js.bzl", "js_library")
load("//bzl/npmpackage:typecheck.bzl", "npm_typecheck")

npm_typecheck(name = "npm-omni-js")

filegroup(
    name = "img",
    srcs = [
        "img/a-sunday-on-la-grande-jatte-seurat.jpg",
        "img/a-sunday-on-la-grande-jatte-seurat_rotated.jpg",
        "img/amity.jpg",
        "img/amity_crop_omni.jpg",
        "img/amity_rotated.jpg",
        "img/biz-card.png",
        "img/claude-monet-painting-in-his-garden-at-argenteuil-renoir.jpg",
        "img/cornhole.jpg",
        "img/crystal-dew.jpg",
        "img/diamond.jpg",
        "img/dragon.jpg",
        "img/flower-big.jpg",
        "img/icon-ar-camera.png",
        "img/inspectorstest.jpg",
        "img/mona-lisa-da-vinci.jpg",
        "img/osha.jpg",
        "img/pop-space.png",
        "img/postcard.png",
        "img/rocket-website.png",
        "img/starry-night-van-gough.jpg",
        "img/sunglasses-big.jpg",
        "img/tulip-fields-in-holland-monet.jpg",
        "img/tully.jpg",
        "img/tully_rotated.jpg",
        "img/tyrell.jpg",
        "img/wat-arun.jpg",
    ],
    visibility = [
        "//visibility:public",
    ],
)

filegroup(
    name = "models",
    srcs = [
        "models/mobilenetv3_100_deeplabv3_scale0_fp16.tflite",
    ],
    visibility = [
        "//visibility:public",
    ],
)

js_library(
    name = "omni-image-targets",
    srcs = [
        "omni-image-targets.ts",
        ":img",
    ],
    visibility = [
        "//visibility:public",
    ],
)
