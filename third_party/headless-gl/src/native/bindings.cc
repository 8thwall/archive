#include "bindings.h"

#include <cstdlib>

#include "bindings-base.h"
#include "webgl.h"
#include "webgl2.h"

using hgl::internal::AppSingleton;

#define JS_GL_METHOD(name, method) \
  JS_GL_METHOD_IMPL(WebGLRenderingContext, webgl_template, name, method)
#define JS_GL2_METHOD(name, method) \
  JS_GL_METHOD_IMPL(WebGL2RenderingContext, webgl2_template, name, method)
#define JS_GL2_CONSTANT(name) JS_GL_CONSTANT(webgl2_template, name)

struct PersistentThreadState {
  Nan::Persistent<v8::FunctionTemplate> webgl_template;
  Nan::Persistent<v8::FunctionTemplate> webgl2_template;
};

void Cleanup(void *arg) {
  PersistentThreadState *templates = static_cast<PersistentThreadState *>(arg);
  templates->webgl_template.Reset();
  templates->webgl2_template.Reset();
  delete templates;
}

NAN_MODULE_INIT(Init) {
  PersistentThreadState *persistent_templates = new PersistentThreadState();

  v8::Local<v8::Object> webgl_object = Nan::New<v8::Object>();
  {
    // WebGLRenderingContext setup
    v8::Local<v8::FunctionTemplate> webgl_template =
      Nan::New<v8::FunctionTemplate>(WebGLRenderingContext::New);

    webgl_template->InstanceTemplate()->SetInternalFieldCount(1);
    webgl_template->SetClassName(Nan::New<v8::String>("WebGLRenderingContext").ToLocalChecked());

    /* Common WebGL methods */
    BASE_JS_GL_METHODS(WebGLRenderingContext, webgl_template);

    /* WebGL methods */
    JS_GL_METHOD("createVertexArrayOES", CreateVertexArrayOES);
    JS_GL_METHOD("deleteVertexArrayOES", DeleteVertexArrayOES);
    JS_GL_METHOD("isVertexArrayOES", IsVertexArrayOES);
    JS_GL_METHOD("bindVertexArrayOES", BindVertexArrayOES);
    JS_GL_METHOD("drawBuffersWEBGL", DrawBuffersWEBGL);
    JS_GL_METHOD("extWEBGL_draw_buffers", EXTWEBGL_draw_buffers);

    JS_GL_METHOD("_vertexAttribDivisor", VertexAttribDivisor);

    // OpenGL ES 2.1 constants
    Nan::SetPrototypeTemplate(
      webgl_template, "DEPTH_STENCIL", Nan::New<v8::Integer>(GL_DEPTH_STENCIL_OES));

    Nan::SetPrototypeTemplate(
      webgl_template, "DEPTH_STENCIL_ATTACHMENT", Nan::New<v8::Integer>(0x821A));

    // Export template
    persistent_templates->webgl_template.Reset(webgl_template);
    Nan::Set(
      webgl_object,
      Nan::New<v8::String>("WebGLRenderingContext").ToLocalChecked(),
      Nan::GetFunction(webgl_template).ToLocalChecked());

    // Export helper methods for WebGLRenderingContext
    Nan::SetMethod(webgl_object, "setError", WebGLRenderingContext::SetError);
    Nan::SetMethod(webgl_object, "getNull", WebGLRenderingContext::GetNull);
  }

  v8::Local<v8::Object> webgl2_object = Nan::New<v8::Object>();
  {
    // WebGL2RenderingContext setup
    v8::Local<v8::FunctionTemplate> webgl2_template =
      Nan::New<v8::FunctionTemplate>(WebGL2RenderingContext::New);

    webgl2_template->InstanceTemplate()->SetInternalFieldCount(1);
    webgl2_template->SetClassName(Nan::New<v8::String>("WebGL2RenderingContext").ToLocalChecked());

    /* Common WebGL2 methods */
    BASE_JS_GL_METHODS(WebGL2RenderingContext, webgl2_template);

    /* WebGL2 methods of WebGL1 Extension methods */
    JS_GL2_METHOD("createVertexArray", CreateVertexArray);
    JS_GL2_METHOD("deleteVertexArray", DeleteVertexArray);
    JS_GL2_METHOD("isVertexArray", IsVertexArray);
    JS_GL2_METHOD("bindVertexArray", BindVertexArray);

    /* New Methods for WebGL2 */
    JS_GL2_METHOD("beginTransformFeedback", BeginTransformFeedback);
    JS_GL2_METHOD("beginQuery", BeginQuery);
    JS_GL2_METHOD("bindBufferBase", BindBufferBase);
    JS_GL2_METHOD("bindBufferRange", BindBufferRange);
    JS_GL2_METHOD("bindSampler", BindSampler);
    JS_GL2_METHOD("bindTransformFeedback", BindTransformFeedback);
    JS_GL2_METHOD("clearBufferfv", ClearBufferfv);
    JS_GL2_METHOD("clearBufferiv", ClearBufferiv);
    JS_GL2_METHOD("clearBufferuiv", ClearBufferuiv);
    JS_GL2_METHOD("clearBufferfi", ClearBufferfi);
    JS_GL2_METHOD("clientWaitSync", ClientWaitSync);
    JS_GL2_METHOD("compressedTexImage2D", CompressedTexImage2D);
    JS_GL2_METHOD("compressedTexSubImage2D", CompressedTexSubImage2D);
    JS_GL2_METHOD("copyBufferSubData", CopyBufferSubData);
    JS_GL2_METHOD("copyTexSubImage3D", CopyTexSubImage3D);
    JS_GL2_METHOD("createSampler", CreateSampler);
    JS_GL2_METHOD("createTransformFeedback", CreateTransformFeedback);
    JS_GL2_METHOD("createQuery", CreateQuery);
    JS_GL2_METHOD("deleteSampler", DeleteSampler);
    JS_GL2_METHOD("deleteSync", DeleteSync);
    JS_GL2_METHOD("deleteTransformFeedback", DeleteTransformFeedback);
    JS_GL2_METHOD("deleteQuery", DeleteQuery);
    JS_GL2_METHOD("drawArraysInstanced", DrawArraysInstanced);
    JS_GL2_METHOD("drawBuffers", DrawBuffers);
    JS_GL2_METHOD("drawElementsInstanced", DrawElementsInstanced);
    JS_GL2_METHOD("drawRangeElements", DrawRangeElements);
    JS_GL2_METHOD("endTransformFeedback", EndTransformFeedback);
    JS_GL2_METHOD("endQuery", EndQuery);
    JS_GL2_METHOD("fenceSync", FenceSync);
    JS_GL2_METHOD("getBufferSubData", GetBufferSubData);
    JS_GL2_METHOD("getParameter2", GetParameter2);
    JS_GL2_METHOD("getActiveUniforms", GetActiveUniforms);
    JS_GL2_METHOD("getActiveUniformBlockParameter", GetActiveUniformBlockParameter);
    JS_GL2_METHOD("getFragDataLocation", GetFragDataLocation);
    JS_GL2_METHOD("getIntegeriv", GetIntegeriv);
    JS_GL2_METHOD("getInternalformatParameter", GetInternalformatParameter);
    JS_GL2_METHOD("getSamplerParameter", GetSamplerParameter);
    JS_GL2_METHOD("getSyncParameter", GetSyncParameter);
    JS_GL2_METHOD("getTransformFeedbackVarying", GetTransformFeedbackVarying);
    JS_GL2_METHOD("getQuery", GetQuery);
    JS_GL2_METHOD("getQueryParameter", GetQueryParameter);
    JS_GL2_METHOD("getUniformBlockIndex", GetUniformBlockIndex);
    JS_GL2_METHOD("getUniformIndices", GetUniformIndices);
    JS_GL2_METHOD("isSampler", IsSampler);
    JS_GL2_METHOD("isSync", IsSync);
    JS_GL2_METHOD("isTransformFeedback", IsTransformFeedback);
    JS_GL2_METHOD("isQuery", IsQuery);
    JS_GL2_METHOD("pauseTransformFeedback", PauseTransformFeedback);
    JS_GL2_METHOD("blitFramebuffer", BlitFramebuffer);
    JS_GL2_METHOD("framebufferTextureLayer", FramebufferTextureLayer);
    JS_GL2_METHOD("invalidateSubFramebuffer", InvalidateSubFramebuffer);
    JS_GL2_METHOD("invalidateFramebuffer", InvalidateFramebuffer);
    JS_GL2_METHOD("readBuffer", ReadBuffer);
    JS_GL2_METHOD("resumeTransformFeedback", ResumeTransformFeedback);
    JS_GL2_METHOD("renderbufferStorageMultisample", RenderbufferStorageMultisample);
    JS_GL2_METHOD("samplerParameteri", SamplerParameteri);
    JS_GL2_METHOD("samplerParameterf", SamplerParameterf);
    JS_GL2_METHOD("texImage3D", TexImage3D);
    JS_GL2_METHOD("texSubImage3D", TexSubImage3D);
    JS_GL2_METHOD("texStorage2D", TexStorage2D);
    JS_GL2_METHOD("texStorage3D", TexStorage3D);
    JS_GL2_METHOD("transformFeedbackVaryings", TransformFeedbackVaryings);
    JS_GL2_METHOD("uniform1iv", Uniform1iv);
    JS_GL2_METHOD("uniform1fv", Uniform1fv);
    JS_GL2_METHOD("uniform1ui", Uniform1ui);
    JS_GL2_METHOD("uniform1uiv", Uniform1uiv);
    JS_GL2_METHOD("uniform2fv", Uniform2fv);
    JS_GL2_METHOD("uniform2iv", Uniform2iv);
    JS_GL2_METHOD("uniform2ui", Uniform2ui);
    JS_GL2_METHOD("uniform2uiv", Uniform2uiv);
    JS_GL2_METHOD("uniform3fv", Uniform3fv);
    JS_GL2_METHOD("uniform3iv", Uniform3iv);
    JS_GL2_METHOD("uniform3ui", Uniform3ui);
    JS_GL2_METHOD("uniform3uiv", Uniform3uiv);
    JS_GL2_METHOD("uniform4fv", Uniform4fv);
    JS_GL2_METHOD("uniform4iv", Uniform4iv);
    JS_GL2_METHOD("uniform4ui", Uniform4ui);
    JS_GL2_METHOD("uniform4uiv", Uniform4uiv);
    JS_GL2_METHOD("uniformBlockBinding", UniformBlockBinding);
    JS_GL2_METHOD("uniformMatrix2x3fv", UniformMatrix2x3fv);
    JS_GL2_METHOD("uniformMatrix2x4fv", UniformMatrix2x4fv);
    JS_GL2_METHOD("uniformMatrix3x2fv", UniformMatrix3x2fv);
    JS_GL2_METHOD("uniformMatrix3x4fv", UniformMatrix3x4fv);
    JS_GL2_METHOD("uniformMatrix4x2fv", UniformMatrix4x2fv);
    JS_GL2_METHOD("uniformMatrix4x3fv", UniformMatrix4x3fv);
    JS_GL2_METHOD("waitSync", WaitSync);
    JS_GL2_METHOD("vertexAttribI4i", VertexAttribI4i);
    JS_GL2_METHOD("vertexAttribI4ui", VertexAttribI4ui);
    JS_GL2_METHOD("vertexAttribIPointer", VertexAttribIPointer);
    JS_GL2_METHOD("vertexAttribDivisor", VertexAttribDivisor);

    /* EXT_multisampled_render_to_texture */
    JS_GL2_METHOD("renderbufferStorageMultisampleEXT", RenderbufferStorageMultisampleEXT);
    JS_GL2_METHOD("framebufferTexture2DMultisampleEXT", FramebufferTexture2DMultisampleEXT);

    // Non-standard methods.
    JS_GL2_METHOD("_getCachedUnpackRowLength", GetCachedUnpackRowLength);
    JS_GL2_METHOD("_getCachedUnpackSkipPixels", GetCachedUnpackSkipPixels);
    JS_GL2_METHOD("_getCachedUnpackSkipRows", GetCachedUnpackSkipRows);

    /* New Constants for WebGL2 */
    // Check bindings-base before adding new constants
    JS_CONSTANT(webgl2_template, MAX_CLIENT_WAIT_TIMEOUT_WEBGL, 0x9247);
    JS_CONSTANT(webgl2_template, TIMEOUT_IGNORED, -1);
    JS_GL2_CONSTANT(ACTIVE_UNIFORM_BLOCKS);
    JS_GL2_CONSTANT(ALREADY_SIGNALED);
    JS_GL2_CONSTANT(ANY_SAMPLES_PASSED);
    JS_GL2_CONSTANT(ANY_SAMPLES_PASSED_CONSERVATIVE);
    JS_GL2_CONSTANT(COLOR);
    JS_GL2_CONSTANT(COLOR_ATTACHMENT1);
    JS_GL2_CONSTANT(COLOR_ATTACHMENT2);
    JS_GL2_CONSTANT(COLOR_ATTACHMENT3);
    JS_GL2_CONSTANT(COLOR_ATTACHMENT4);
    JS_GL2_CONSTANT(COLOR_ATTACHMENT5);
    JS_GL2_CONSTANT(COLOR_ATTACHMENT6);
    JS_GL2_CONSTANT(COLOR_ATTACHMENT7);
    JS_GL2_CONSTANT(COLOR_ATTACHMENT8);
    JS_GL2_CONSTANT(COLOR_ATTACHMENT9);
    JS_GL2_CONSTANT(COLOR_ATTACHMENT10);
    JS_GL2_CONSTANT(COLOR_ATTACHMENT11);
    JS_GL2_CONSTANT(COLOR_ATTACHMENT12);
    JS_GL2_CONSTANT(COLOR_ATTACHMENT13);
    JS_GL2_CONSTANT(COLOR_ATTACHMENT14);
    JS_GL2_CONSTANT(COLOR_ATTACHMENT15);
    JS_GL2_CONSTANT(COMPARE_REF_TO_TEXTURE);
    JS_GL2_CONSTANT(CONDITION_SATISFIED);
    JS_GL2_CONSTANT(READ_BUFFER);
    JS_GL2_CONSTANT(READ_FRAMEBUFFER_BINDING);
    JS_GL2_CONSTANT(DRAW_FRAMEBUFFER_BINDING);
    JS_GL2_CONSTANT(COPY_READ_BUFFER);
    JS_GL2_CONSTANT(COPY_READ_BUFFER_BINDING);
    JS_GL2_CONSTANT(COPY_WRITE_BUFFER);
    JS_GL2_CONSTANT(COPY_WRITE_BUFFER_BINDING);
    JS_GL2_CONSTANT(CURRENT_QUERY);
    JS_GL2_CONSTANT(DEPTH);
    JS_GL2_CONSTANT(DEPTH_STENCIL);
    JS_GL2_CONSTANT(DEPTH_STENCIL_ATTACHMENT);
    JS_GL2_CONSTANT(DRAW_BUFFER0);
    JS_GL2_CONSTANT(DRAW_BUFFER1);
    JS_GL2_CONSTANT(DRAW_BUFFER2);
    JS_GL2_CONSTANT(DRAW_BUFFER3);
    JS_GL2_CONSTANT(DRAW_BUFFER4);
    JS_GL2_CONSTANT(DRAW_BUFFER5);
    JS_GL2_CONSTANT(DRAW_BUFFER6);
    JS_GL2_CONSTANT(DRAW_BUFFER7);
    JS_GL2_CONSTANT(DRAW_BUFFER8);
    JS_GL2_CONSTANT(DRAW_BUFFER9);
    JS_GL2_CONSTANT(DRAW_BUFFER10);
    JS_GL2_CONSTANT(DRAW_BUFFER11);
    JS_GL2_CONSTANT(DRAW_BUFFER12);
    JS_GL2_CONSTANT(DRAW_BUFFER13);
    JS_GL2_CONSTANT(DRAW_BUFFER14);
    JS_GL2_CONSTANT(DRAW_BUFFER15);
    JS_GL2_CONSTANT(DYNAMIC_READ);
    JS_GL2_CONSTANT(DYNAMIC_COPY);
    JS_GL2_CONSTANT(FLOAT_MAT2x3);
    JS_GL2_CONSTANT(FLOAT_MAT2x4);
    JS_GL2_CONSTANT(FLOAT_MAT3x2);
    JS_GL2_CONSTANT(FLOAT_MAT3x4);
    JS_GL2_CONSTANT(FLOAT_MAT4x2);
    JS_GL2_CONSTANT(FLOAT_MAT4x3);
    JS_GL2_CONSTANT(FRAGMENT_SHADER_DERIVATIVE_HINT);
    JS_GL2_CONSTANT(FRAMEBUFFER_ATTACHMENT_ALPHA_SIZE);
    JS_GL2_CONSTANT(FRAMEBUFFER_ATTACHMENT_BLUE_SIZE);
    JS_GL2_CONSTANT(FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING);
    JS_GL2_CONSTANT(FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE);
    JS_GL2_CONSTANT(FRAMEBUFFER_ATTACHMENT_DEPTH_SIZE);
    JS_GL2_CONSTANT(FRAMEBUFFER_ATTACHMENT_GREEN_SIZE);
    JS_GL2_CONSTANT(FRAMEBUFFER_ATTACHMENT_RED_SIZE);
    JS_GL2_CONSTANT(FRAMEBUFFER_ATTACHMENT_STENCIL_SIZE);
    JS_GL2_CONSTANT(FRAMEBUFFER_ATTACHMENT_TEXTURE_LAYER);
    JS_GL2_CONSTANT(FRAMEBUFFER_DEFAULT);
    JS_GL2_CONSTANT(FRAMEBUFFER_INCOMPLETE_MULTISAMPLE);
    JS_GL2_CONSTANT(INT_SAMPLER_2D);
    JS_GL2_CONSTANT(INT_SAMPLER_2D_ARRAY);
    JS_GL2_CONSTANT(INT_SAMPLER_3D);
    JS_GL2_CONSTANT(INT_SAMPLER_CUBE);
    JS_GL2_CONSTANT(INT_2_10_10_10_REV);
    JS_GL2_CONSTANT(INTERLEAVED_ATTRIBS);
    JS_GL2_CONSTANT(INVALID_INDEX);
    JS_GL2_CONSTANT(MAX);
    JS_GL2_CONSTANT(MAX_3D_TEXTURE_SIZE);
    JS_GL2_CONSTANT(MAX_ARRAY_TEXTURE_LAYERS);
    JS_GL2_CONSTANT(MAX_COLOR_ATTACHMENTS);
    JS_GL2_CONSTANT(MAX_COMBINED_FRAGMENT_UNIFORM_COMPONENTS);
    JS_GL2_CONSTANT(MAX_COMBINED_UNIFORM_BLOCKS);
    JS_GL2_CONSTANT(MAX_COMBINED_VERTEX_UNIFORM_COMPONENTS);
    JS_GL2_CONSTANT(MAX_DRAW_BUFFERS);
    JS_GL2_CONSTANT(MAX_ELEMENT_INDEX);
    JS_GL2_CONSTANT(MAX_ELEMENTS_INDICES);
    JS_GL2_CONSTANT(MAX_ELEMENTS_VERTICES);
    JS_GL2_CONSTANT(MAX_FRAGMENT_INPUT_COMPONENTS);
    JS_GL2_CONSTANT(MAX_FRAGMENT_UNIFORM_BLOCKS);
    JS_GL2_CONSTANT(MAX_FRAGMENT_UNIFORM_COMPONENTS);
    JS_GL2_CONSTANT(MAX_PROGRAM_TEXEL_OFFSET);
    JS_GL2_CONSTANT(MAX_SAMPLES);
    JS_GL2_CONSTANT(MAX_SERVER_WAIT_TIMEOUT);
    JS_GL2_CONSTANT(MAX_TEXTURE_LOD_BIAS);
    JS_GL2_CONSTANT(MAX_TRANSFORM_FEEDBACK_INTERLEAVED_COMPONENTS);
    JS_GL2_CONSTANT(MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS);
    JS_GL2_CONSTANT(MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS);
    JS_GL2_CONSTANT(MAX_UNIFORM_BLOCK_SIZE);
    JS_GL2_CONSTANT(MAX_UNIFORM_BUFFER_BINDINGS);
    JS_GL2_CONSTANT(MAX_VARYING_COMPONENTS);
    JS_GL2_CONSTANT(MAX_VERTEX_OUTPUT_COMPONENTS);
    JS_GL2_CONSTANT(MAX_VERTEX_UNIFORM_BLOCKS);
    JS_GL2_CONSTANT(MAX_VERTEX_UNIFORM_COMPONENTS);
    JS_GL2_CONSTANT(MIN);
    JS_GL2_CONSTANT(MIN_PROGRAM_TEXEL_OFFSET);
    JS_GL2_CONSTANT(OBJECT_TYPE);
    JS_GL2_CONSTANT(PIXEL_PACK_BUFFER);
    JS_GL2_CONSTANT(PIXEL_PACK_BUFFER_BINDING);
    JS_GL2_CONSTANT(PIXEL_UNPACK_BUFFER);
    JS_GL2_CONSTANT(PIXEL_UNPACK_BUFFER_BINDING);
    JS_GL2_CONSTANT(PACK_ROW_LENGTH);
    JS_GL2_CONSTANT(PACK_SKIP_ROWS);
    JS_GL2_CONSTANT(PACK_SKIP_PIXELS);
    JS_GL2_CONSTANT(QUERY_RESULT);
    JS_GL2_CONSTANT(QUERY_RESULT_AVAILABLE);
    JS_GL2_CONSTANT(RASTERIZER_DISCARD);
    JS_GL2_CONSTANT(RENDERBUFFER_SAMPLES);
    JS_GL2_CONSTANT(SAMPLER_2D_ARRAY);
    JS_GL2_CONSTANT(SAMPLER_2D_ARRAY_SHADOW);
    JS_GL2_CONSTANT(SAMPLER_2D_SHADOW);
    JS_GL2_CONSTANT(SAMPLER_3D);
    JS_GL2_CONSTANT(SAMPLER_BINDING);
    JS_GL2_CONSTANT(SAMPLER_CUBE_SHADOW);
    JS_GL2_CONSTANT(SEPARATE_ATTRIBS);
    JS_GL2_CONSTANT(SIGNALED);
    JS_GL2_CONSTANT(SIGNED_NORMALIZED);
    JS_GL2_CONSTANT(SRGB);
    JS_GL2_CONSTANT(STATIC_COPY);
    JS_GL2_CONSTANT(STATIC_READ);
    JS_GL2_CONSTANT(STENCIL);
    JS_GL2_CONSTANT(STREAM_COPY);
    JS_GL2_CONSTANT(STREAM_READ);
    JS_GL2_CONSTANT(SYNC_FLUSH_COMMANDS_BIT);
    JS_GL2_CONSTANT(SYNC_GPU_COMMANDS_COMPLETE);
    JS_GL2_CONSTANT(SYNC_STATUS);
    JS_GL2_CONSTANT(SYNC_CONDITION);
    JS_GL2_CONSTANT(SYNC_FENCE);
    JS_GL2_CONSTANT(SYNC_FLAGS);
    JS_GL2_CONSTANT(TEXTURE_2D_ARRAY);
    JS_GL2_CONSTANT(TEXTURE_BASE_LEVEL);
    JS_GL2_CONSTANT(TEXTURE_BINDING_2D_ARRAY);
    JS_GL2_CONSTANT(TEXTURE_BINDING_3D);
    JS_GL2_CONSTANT(TEXTURE_MAX_LEVEL);
    JS_GL2_CONSTANT(TEXTURE_COMPARE_MODE);
    JS_GL2_CONSTANT(TEXTURE_COMPARE_FUNC);
    JS_GL2_CONSTANT(TEXTURE_3D);
    JS_GL2_CONSTANT(TEXTURE_IMMUTABLE_FORMAT);
    JS_GL2_CONSTANT(TEXTURE_IMMUTABLE_LEVELS);
    JS_GL2_CONSTANT(TEXTURE_MAX_LOD);
    JS_GL2_CONSTANT(TEXTURE_MIN_LOD);
    JS_GL2_CONSTANT(TEXTURE_WRAP_R);
    JS_GL2_CONSTANT(TIMEOUT_EXPIRED);
    JS_GL2_CONSTANT(TRANSFORM_FEEDBACK);
    JS_GL2_CONSTANT(TRANSFORM_FEEDBACK_ACTIVE);
    JS_GL2_CONSTANT(TRANSFORM_FEEDBACK_BINDING);
    JS_GL2_CONSTANT(TRANSFORM_FEEDBACK_BUFFER);
    JS_GL2_CONSTANT(TRANSFORM_FEEDBACK_BUFFER_BINDING);
    JS_GL2_CONSTANT(TRANSFORM_FEEDBACK_BUFFER_MODE);
    JS_GL2_CONSTANT(TRANSFORM_FEEDBACK_BUFFER_START);
    JS_GL2_CONSTANT(TRANSFORM_FEEDBACK_BUFFER_SIZE);
    JS_GL2_CONSTANT(TRANSFORM_FEEDBACK_PAUSED);
    JS_GL2_CONSTANT(TRANSFORM_FEEDBACK_PRIMITIVES_WRITTEN);
    JS_GL2_CONSTANT(TRANSFORM_FEEDBACK_VARYINGS);
    JS_GL2_CONSTANT(UNIFORM_BLOCK_ACTIVE_UNIFORMS);
    JS_GL2_CONSTANT(UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES);
    JS_GL2_CONSTANT(UNIFORM_BLOCK_BINDING);
    JS_GL2_CONSTANT(UNIFORM_BLOCK_DATA_SIZE);
    JS_GL2_CONSTANT(UNIFORM_BLOCK_REFERENCED_BY_VERTEX_SHADER);
    JS_GL2_CONSTANT(UNIFORM_BLOCK_REFERENCED_BY_FRAGMENT_SHADER);
    JS_GL2_CONSTANT(UNIFORM_BUFFER);
    JS_GL2_CONSTANT(UNIFORM_BUFFER_OFFSET_ALIGNMENT);
    JS_GL2_CONSTANT(UNIFORM_BUFFER_BINDING);
    JS_GL2_CONSTANT(UNIFORM_BUFFER_START);
    JS_GL2_CONSTANT(UNIFORM_BUFFER_SIZE);
    JS_GL2_CONSTANT(UNIFORM_OFFSET);
    JS_GL2_CONSTANT(UNIFORM_SIZE);
    JS_GL2_CONSTANT(UNIFORM_TYPE);
    JS_GL2_CONSTANT(UNIFORM_ARRAY_STRIDE);
    JS_GL2_CONSTANT(UNIFORM_MATRIX_STRIDE);
    JS_GL2_CONSTANT(UNIFORM_IS_ROW_MAJOR);
    JS_GL2_CONSTANT(UNIFORM_BLOCK_INDEX);
    JS_GL2_CONSTANT(UNPACK_IMAGE_HEIGHT);
    JS_GL2_CONSTANT(UNPACK_ROW_LENGTH);
    JS_GL2_CONSTANT(UNPACK_SKIP_IMAGES);
    JS_GL2_CONSTANT(UNPACK_SKIP_ROWS);
    JS_GL2_CONSTANT(UNPACK_SKIP_PIXELS);
    JS_GL2_CONSTANT(UNSIGNALED);
    JS_GL2_CONSTANT(UNSIGNED_INT_SAMPLER_2D);
    JS_GL2_CONSTANT(UNSIGNED_INT_SAMPLER_2D_ARRAY);
    JS_GL2_CONSTANT(UNSIGNED_INT_SAMPLER_3D);
    JS_GL2_CONSTANT(UNSIGNED_INT_SAMPLER_CUBE);
    JS_GL2_CONSTANT(UNSIGNED_INT_VEC2);
    JS_GL2_CONSTANT(UNSIGNED_INT_VEC3);
    JS_GL2_CONSTANT(UNSIGNED_INT_VEC4);
    JS_GL2_CONSTANT(UNSIGNED_NORMALIZED);
    JS_GL2_CONSTANT(WAIT_FAILED);
    JS_GL2_CONSTANT(VERTEX_ATTRIB_ARRAY_DIVISOR);
    JS_GL2_CONSTANT(VERTEX_ATTRIB_ARRAY_INTEGER);
    JS_GL2_CONSTANT(VERTEX_ARRAY_BINDING);

    JS_GL2_CONSTANT(R8);
    JS_GL2_CONSTANT(RG8);
    JS_GL2_CONSTANT(RGB8);
    JS_GL2_CONSTANT(RGBA8);
    JS_GL2_CONSTANT(SRGB8_ALPHA8);
    JS_GL2_CONSTANT(RG8UI);
    JS_GL2_CONSTANT(SRGB8);
    JS_GL2_CONSTANT(RGBA8UI);
    JS_GL2_CONSTANT(RGB8UI);

    JS_GL2_CONSTANT(R8_SNORM);
    JS_GL2_CONSTANT(RG8_SNORM);
    JS_GL2_CONSTANT(RGB8_SNORM);
    JS_GL2_CONSTANT(RGBA8_SNORM);
    JS_GL2_CONSTANT(R8I);
    JS_GL2_CONSTANT(R8UI);
    JS_GL2_CONSTANT(RG8I);
    JS_GL2_CONSTANT(RGBA8I);
    JS_GL2_CONSTANT(RGB8I);

    JS_GL2_CONSTANT(R16UI);
    JS_GL2_CONSTANT(RG16UI);
    JS_GL2_CONSTANT(RGB16UI);
    JS_GL2_CONSTANT(RGBA16UI);

    JS_GL2_CONSTANT(R16I);
    JS_GL2_CONSTANT(RG16I);
    JS_GL2_CONSTANT(RGB16I);
    JS_GL2_CONSTANT(RGBA16I);

    JS_GL2_CONSTANT(R32UI);
    JS_GL2_CONSTANT(RG32UI);
    JS_GL2_CONSTANT(RGB32UI);
    JS_GL2_CONSTANT(RGBA32UI);

    JS_GL2_CONSTANT(R32I);
    JS_GL2_CONSTANT(RG32I);
    JS_GL2_CONSTANT(RGB32I);
    JS_GL2_CONSTANT(RGBA32I);

    // WebGL2 Extensions
    JS_GL2_CONSTANT(R16F);
    JS_GL2_CONSTANT(R32F);
    JS_GL2_CONSTANT(RG16F);
    JS_GL2_CONSTANT(RG32F);
    JS_GL2_CONSTANT(RGB16F);
    JS_GL2_CONSTANT(RGB32F);
    JS_GL2_CONSTANT(RGBA16F);
    JS_GL2_CONSTANT(RGBA32F);
    JS_GL2_CONSTANT(R11F_G11F_B10F);
    JS_GL2_CONSTANT(RGB9_E5);

    JS_GL2_CONSTANT(RGB10_A2);
    JS_GL2_CONSTANT(RGB10_A2UI);

    JS_GL2_CONSTANT(DEPTH_COMPONENT24);
    JS_GL2_CONSTANT(DEPTH_COMPONENT32F);
    JS_GL2_CONSTANT(DEPTH24_STENCIL8);
    JS_GL2_CONSTANT(DEPTH32F_STENCIL8);

    JS_GL2_CONSTANT(UNSIGNED_INT_2_10_10_10_REV);
    JS_GL2_CONSTANT(UNSIGNED_INT_10F_11F_11F_REV);
    JS_GL2_CONSTANT(UNSIGNED_INT_5_9_9_9_REV);
    JS_GL2_CONSTANT(UNSIGNED_INT_24_8);
    JS_GL2_CONSTANT(FLOAT_32_UNSIGNED_INT_24_8_REV);

    JS_GL2_CONSTANT(RGBA_INTEGER);
    JS_GL2_CONSTANT(RG_INTEGER);
    JS_GL2_CONSTANT(RGB_INTEGER);
    JS_GL2_CONSTANT(RED_INTEGER);
    JS_GL2_CONSTANT(RED);
    JS_GL2_CONSTANT(HALF_FLOAT);
    JS_GL2_CONSTANT(RG);

    JS_GL2_CONSTANT(DRAW_FRAMEBUFFER);
    JS_GL2_CONSTANT(READ_FRAMEBUFFER);

    Nan::SetPrototypeTemplate(
      webgl2_template,
      "__NIA_ANGLE_CONTEXT",
#if C8_USE_ANGLE
      Nan::New<v8::Boolean>(true)
#else
      Nan::New<v8::Boolean>(false)
#endif
    );

    // Export template
    persistent_templates->webgl2_template.Reset(webgl2_template);
    Nan::Set(
      webgl2_object,
      Nan::New<v8::String>("WebGL2RenderingContext").ToLocalChecked(),
      Nan::GetFunction(webgl2_template).ToLocalChecked());

    // Export helper methods for WebGL2RenderingContext
    Nan::SetMethod(webgl2_object, "setError", WebGLRenderingContext::SetError);
    Nan::SetMethod(webgl2_object, "getNull", WebGLRenderingContext::GetNull);
  }

  // Export both objects to the target
  Nan::Set(target, Nan::New<v8::String>("WebGL").ToLocalChecked(), webgl_object);
  Nan::Set(target, Nan::New<v8::String>("WebGL2").ToLocalChecked(), webgl2_object);

  v8::Isolate *isolate = target->GetIsolate();
  v8::Local<v8::Context> context = isolate->GetCurrentContext();
  node::Environment *env = node::GetCurrentEnvironment(context);

  node::AtExit(env, Cleanup, persistent_templates);
}

NAN_MODULE_WORKER_ENABLED(webgl, Init);

v8::Local<v8::Object> initHeadlessGlAddon(v8::Isolate *isolate, v8::Local<v8::Context> context) {
  v8::Local<v8::Object> target = Nan::New<v8::Object>();
  Init(target);
  return target;
}

#ifdef ANDROID
void setAndroidApp(struct android_app *app) { AppSingleton::getInstance().setAndroidApp(app); }
#endif

void setNewNativeWindow(void *nativeWindow) {
  AppSingleton::getInstance().setNativeWindow(nativeWindow);
}

void destroySurface() { AppSingleton::getInstance().destroySurface(); }
