#include <node_api.h>

#include <string>

#include "c8/io/image-io.h"
#include "c8/io/mime-sniff.h"
#include "c8/pixels/pixel-transforms.h"

struct NativeImageJs {
  int width;
  int height;
  int rowBytes;
  int components;
  bool hasAlpha;
  uint8_t *buffer;
  size_t bufferSize;
};

struct AsyncData {
  napi_deferred deferred;
  napi_async_work workHandle;

  // User Input
  napi_ref bufferRef;
  uint8_t *buffer;
  size_t bufferSize;

  // Output
  NativeImageJs nativeImage;
  bool success;
};

namespace {

template <class PixelsType, int bytesPerPixel>
void fillNativeImage(
  NativeImageJs &nativeImage, const c8::PixelBuffer<PixelsType, bytesPerPixel> &pixelBuffer) {
  nativeImage.width = pixelBuffer.pixels().cols();
  nativeImage.height = pixelBuffer.pixels().rows();
  nativeImage.rowBytes = nativeImage.width * bytesPerPixel;  // No padding
  nativeImage.hasAlpha = (bytesPerPixel == 4);
  nativeImage.components = 3;

  nativeImage.bufferSize = nativeImage.width * nativeImage.height * bytesPerPixel;

  // Should get freed in the finalizer for the ArrayBuffer
  nativeImage.buffer = new uint8_t[nativeImage.bufferSize];
  auto packedPixels =
    PixelsType(nativeImage.height, nativeImage.width, nativeImage.rowBytes, nativeImage.buffer);

  // Underlying pixelBuffer data is copied to nativeImage.buffer, later freed by its destructor
  // This copy removes row padding, if any
  c8::copyPixels(pixelBuffer.pixels(), &packedPixels);
}

}  // namespace

extern "C" {

void externalArrayBufferFinalizerCb(napi_env env, void *finalizeData, void *finalizeHint) {
  // Delete the data when the ArrayBuffer is no longer used
  free(finalizeData);
}

napi_value createNapiNativeImage(NativeImageJs &nativeImage, napi_env env) {
  napi_value imageObject;
  napi_create_object(env, &imageObject);

  napi_value width;
  napi_create_int32(env, nativeImage.width, &width);
  napi_set_named_property(env, imageObject, "width", width);

  napi_value height;
  napi_create_int32(env, nativeImage.height, &height);
  napi_set_named_property(env, imageObject, "height", height);

  napi_value rowBytes;
  napi_create_int32(env, nativeImage.rowBytes, &rowBytes);
  napi_set_named_property(env, imageObject, "rowBytes", rowBytes);

  napi_value components;
  napi_create_int32(env, nativeImage.components, &components);
  napi_set_named_property(env, imageObject, "components", components);

  napi_value hasAlpha;
  napi_get_boolean(env, nativeImage.hasAlpha, &hasAlpha);
  napi_set_named_property(env, imageObject, "hasAlpha", hasAlpha);

  napi_value arrayBuffer;
  napi_create_external_arraybuffer(
    env,
    nativeImage.buffer,
    nativeImage.bufferSize,
    externalArrayBufferFinalizerCb,
    nullptr,
    &arrayBuffer);

  napi_value typedArray;
  napi_create_typedarray(
    env, napi_uint8_array, nativeImage.bufferSize, arrayBuffer, 0, &typedArray);
  napi_set_named_property(env, imageObject, "data", typedArray);

  return imageObject;
}

void doLoadImage(napi_env env, void *data) {
  AsyncData *asyncData = static_cast<AsyncData *>(data);

  const auto mimeType = c8::matchImageMimeType({asyncData->buffer, asyncData->bufferSize});
  // TODO(lreyna,J8W-3973): Add new Image IO calls to preallocate data to prevent extra memcpy
  if (mimeType == c8::MimeType::IMAGE_JPEG) {
    const auto outRGBPixelBuffer = c8::readJpgToRGB(asyncData->buffer, asyncData->bufferSize);
    fillNativeImage(asyncData->nativeImage, outRGBPixelBuffer);
  } else if (mimeType == c8::MimeType::IMAGE_PNG) {
    const auto outRGBAPixelBuffer = c8::readPngToRGBA(asyncData->buffer, asyncData->bufferSize);
    fillNativeImage(asyncData->nativeImage, outRGBAPixelBuffer);
  } else if (mimeType == c8::MimeType::IMAGE_GIF) {
    const auto outRGBPixelBuffer = c8::readGifToRGBA(asyncData->buffer, asyncData->bufferSize);
    fillNativeImage(asyncData->nativeImage, outRGBPixelBuffer);
  } else {
    asyncData->success = false;
    return;
  }

  asyncData->success = true;
}

void afterLoadImage(napi_env env, napi_status status, void *data) {
  AsyncData *asyncData = static_cast<AsyncData *>(data);

  if (asyncData->success && status == napi_ok) {
    napi_value imageObject = createNapiNativeImage(asyncData->nativeImage, env);
    napi_resolve_deferred(env, asyncData->deferred, imageObject);
  } else {
    napi_value errorMessage;
    napi_create_string_utf8(env, "Failed to load image", NAPI_AUTO_LENGTH, &errorMessage);

    napi_value errorValue;
    napi_create_error(env, nullptr, errorMessage, &errorValue);
    napi_reject_deferred(env, asyncData->deferred, errorValue);
  }

  napi_delete_reference(env, asyncData->bufferRef);
  napi_delete_async_work(env, asyncData->workHandle);
  delete asyncData;
}

// This function initiates the asynchronous work and returns a Promise
napi_value loadImage(napi_env env, napi_callback_info info) {
  size_t argc = 1;
  napi_value args[1];
  napi_get_cb_info(env, info, &argc, args, nullptr, nullptr);

  napi_value promise;
  napi_deferred deferred;
  napi_create_promise(env, &deferred, &promise);

  AsyncData *asyncData = new AsyncData{
    .deferred = deferred,
    .buffer = nullptr,
    .success = false,
  };

  napi_value arrayBuffer;
  size_t byteOffset;
  napi_typedarray_type type;
  bool isTypedArray;

  napi_is_typedarray(env, args[0], &isTypedArray);
  if (!isTypedArray) {
    napi_throw_type_error(env, nullptr, "Expected a typed array as the first argument");
    return nullptr;
  }

  napi_create_reference(env, args[0], 1, &asyncData->bufferRef);

  napi_get_typedarray_info(
    env,
    args[0],
    &type,
    &asyncData->bufferSize,
    reinterpret_cast<void **>(&asyncData->buffer),
    &arrayBuffer,
    &byteOffset);

  napi_value resourceName;
  napi_create_string_utf8(env, "loadImage", NAPI_AUTO_LENGTH, &resourceName);

  napi_create_async_work(
    env, nullptr, resourceName, doLoadImage, afterLoadImage, asyncData, &asyncData->workHandle);

  napi_queue_async_work(env, asyncData->workHandle);

  return promise;
}

napi_value Init(napi_env env, napi_value exports) {
  napi_status status;

  napi_property_descriptor desc[] = {{"loadImage", 0, loadImage, 0, 0, 0, napi_default, 0}};
  status = napi_define_properties(env, exports, sizeof(desc) / sizeof(desc[0]), desc);
  if (status != napi_ok) {
    napi_throw_error(env, NULL, "Failed to define properties");
    return nullptr;
  }

  return exports;
}

NAPI_MODULE(IMAGE_DECODING_ADDON, Init)

}  // extern "C"
