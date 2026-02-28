# Make directories
mkdir -p resources/img/loading/v1
mkdir -p resources/img/loading/v2
mkdir -p resources/img/almostthere/v2
mkdir -p resources/img/mediarecorder
mkdir -p resources/img/runtimeerror/v1
mkdir -p resources/aframe
mkdir -p xrextras-shared-resources/fonts
mkdir -p xrextras-shared-resources/img/mediarecorder
mkdir -p xrextras-shared-resources/img/almostthere/v1
mkdir -p xrextras-shared-resources/img/almostthere/v2

# apps/client/public/web/xrextras/src/loadingmodule/loading-module.html
curl "https://cdn.8thwall.com/web/img/loading/v2/load-grad.png" > "resources/img/loading/v2/load-grad.png"
curl "https://cdn.8thwall.com/web/img/almostthere/v2/poweredby-horiz-white-4.svg" > "xrextras-shared-resources/img/almostthere/v2/poweredby-horiz-white-4.svg"
curl "https://cdn.8thwall.com/web/img/loading/v2/camera.svg" > "resources/img/loading/v2/camera.svg"
curl "https://cdn.8thwall.com/web/img/loading/v2/microphone.svg" > "resources/img/loading/v2/microphone.svg"
curl "https://cdn.8thwall.com/web/img/loading/v2/dots.svg" > "resources/img/loading/v2/dots.svg"
curl "https://cdn.8thwall.com/web/img/loading/v2/reload.svg" > "resources/img/loading/v2/reload.svg"
curl "https://cdn.8thwall.com/web/img/loading/v1/settings-icon-ios.png" > "resources/img/loading/v1/settings-icon-ios.png"
curl "https://cdn.8thwall.com/web/img/loading/v1/safari-icon.png" > "resources/img/loading/v1/safari-icon.png"
curl "https://cdn.8thwall.com/web/img/runtimeerror/v1/computer-voxel.png" > "resources/img/runtimeerror/v1/computer-voxel.png"

# apps/client/public/web/xrextras/src/almosttheremodule/almost-there-module.js
curl "https://cdn.8thwall.com/web/img/almostthere/v2/safari-fallback.png" > "xrextras-shared-resources/img/almostthere/v2/safari-fallback.png"

# apps/client/public/web/xrextras/src/almosttheremodule/almost-there-module.html
curl "https://cdn.8thwall.com/web/img/almostthere/v1/google-chrome.png" > "xrextras-shared-resources/img/almostthere/v1/google-chrome.png"
curl "https://cdn.8thwall.com/web/img/almostthere/v2/xtra-arrow.svg" > "xrextras-shared-resources/img/almostthere/v2/xtra-arrow.svg"

# apps/client/public/web/xrextras/src/loadingmodule/loading-module.js
curl "https://cdn.8thwall.com/web/img/almostthere/v2/android-fallback.png" > "resources/img/almostthere/v2/android-fallback.png"

# apps/client/public/web/xrextras/src/mediarecorder/media-preview.html
curl "https://cdn.8thwall.com/web/img/mediarecorder/close-v2.svg" > "resources/img/mediarecorder/close-v2.svg"
curl "https://cdn.8thwall.com/web/img/mediarecorder/download-v1.svg" > "resources/img/mediarecorder/download-v1.svg"

# apps/client/public/web/xrextras/src/mediarecorder/media-preview.js
curl "https://cdn.8thwall.com/web/img/mediarecorder/sound-off-v1.svg" > "xrextras-shared-resources/img/mediarecorder/sound-off-v1.svg"
curl "https://cdn.8thwall.com/web/img/mediarecorder/sound-on-v1.svg" > "xrextras-shared-resources/img/mediarecorder/sound-on-v1.svg"
curl "https://cdn.8thwall.com/web/img/mediarecorder/share-v1.svg" > "resources/img/mediarecorder/share-v1.svg"
curl "https://cdn.8thwall.com/web/img/mediarecorder/view-v1.svg" > "resources/img/mediarecorder/view-v1.svg"

# apps/client/public/web/xrextras/src/runtimeerrormodule/runtime-error-module.html
curl "https://cdn.8thwall.com/web/img/runtimeerror/v1/computer-voxel.png" > "resources/img/runtimeerror/v1/computer-voxel.png"

# apps/client/public/web/xrextras/src/statsmodule/stats.js
curl -L --compressed -o resources/aframe/stats.16.min.js https://cdn.8thwall.com/web/aframe/stats.16.min.js

# apps/client/public/web/xrextras/src/fonts/fonts.css
curl "https://cdn.8thwall.com/web/fonts/Nunito-Regular.ttf" > "xrextras-shared-resources/fonts/Nunito-Regular.ttf"
curl "https://cdn.8thwall.com/web/fonts/Nunito-Regular.woff" > "xrextras-shared-resources/fonts/Nunito-Regular.woff"
curl "https://cdn.8thwall.com/web/fonts/Nunito-SemiBold.ttf" > "xrextras-shared-resources/fonts/Nunito-SemiBold.ttf"
curl "https://cdn.8thwall.com/web/fonts/Nunito-SemiBold.woff" > "xrextras-shared-resources/fonts/Nunito-SemiBold.woff"
