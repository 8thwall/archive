#ifndef BINDINGS_BASE_H
#define BINDINGS_BASE_H

#include "webgl-base.h"

#define JS_GL_METHOD_IMPL(context_impl, webgl_template, webgl_name, method_name)          \
  Nan::SetPrototypeTemplate(                                                              \
    webgl_template,                                                                       \
    webgl_name,                                                                           \
    Nan::New<v8::FunctionTemplate>([](const Nan::FunctionCallbackInfo<v8::Value> &info) { \
      context_impl *obj = node::ObjectWrap::Unwrap<context_impl>(info.Holder());          \
      obj->method_name(info);                                                             \
    }));

#define JS_CONSTANT(webgl_template, x, v) \
  Nan::SetPrototypeTemplate(webgl_template, #x, Nan::New<v8::Integer>(v))

#define JS_GL_CONSTANT(webgl_template, name) JS_CONSTANT(webgl_template, name, GL_##name)

#define BASE_JS_GL_METHODS(context_impl, webgl_template)                                           \
  /* WebGL methods */                                                                              \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "_drawArraysInstanced", DrawArraysInstanced);    \
  JS_GL_METHOD_IMPL(                                                                               \
    context_impl, webgl_template, "_drawElementsInstanced", DrawElementsInstanced);                \
                                                                                                   \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "getUniform", GetUniform);                       \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "uniform1f", Uniform1f);                         \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "uniform2f", Uniform2f);                         \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "uniform3f", Uniform3f);                         \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "uniform4f", Uniform4f);                         \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "uniform1i", Uniform1i);                         \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "uniform2i", Uniform2i);                         \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "uniform3i", Uniform3i);                         \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "uniform4i", Uniform4i);                         \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "pixelStorei", PixelStorei);                     \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "bindAttribLocation", BindAttribLocation);       \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "getError", GetError);                           \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "drawArrays", DrawArrays);                       \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "uniformMatrix2fv", UniformMatrix2fv);           \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "uniformMatrix3fv", UniformMatrix3fv);           \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "uniformMatrix4fv", UniformMatrix4fv);           \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "generateMipmap", GenerateMipmap);               \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "getAttribLocation", GetAttribLocation);         \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "depthFunc", DepthFunc);                         \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "viewport", Viewport);                           \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "createShader", CreateShader);                   \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "shaderSource", ShaderSource);                   \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "compileShader", CompileShader);                 \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "getShaderParameter", GetShaderParameter);       \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "getShaderInfoLog", GetShaderInfoLog);           \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "createProgram", CreateProgram);                 \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "attachShader", AttachShader);                   \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "linkProgram", LinkProgram);                     \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "getProgramParameter", GetProgramParameter);     \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "getUniformLocation", GetUniformLocation);       \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "clearColor", ClearColor);                       \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "clearDepth", ClearDepth);                       \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "disable", Disable);                             \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "createTexture", CreateTexture);                 \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "bindTexture", BindTexture);                     \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "texImage2D", TexImage2D);                       \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "texParameteri", TexParameteri);                 \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "texParameterf", TexParameterf);                 \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "clear", Clear);                                 \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "useProgram", UseProgram);                       \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "createFramebuffer", CreateFramebuffer);         \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "bindFramebuffer", BindFramebuffer);             \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "framebufferTexture2D", FramebufferTexture2D);   \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "createBuffer", CreateBuffer);                   \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "bindBuffer", BindBuffer);                       \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "bufferData", BufferData);                       \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "bufferSubData", BufferSubData);                 \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "enable", Enable);                               \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "blendEquation", BlendEquation);                 \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "blendFunc", BlendFunc);                         \
  JS_GL_METHOD_IMPL(                                                                               \
    context_impl, webgl_template, "enableVertexAttribArray", EnableVertexAttribArray);             \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "vertexAttribPointer", VertexAttribPointer);     \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "activeTexture", ActiveTexture);                 \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "drawElements", DrawElements);                   \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "flush", Flush);                                 \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "finish", Finish);                               \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "vertexAttrib1f", VertexAttrib1f);               \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "vertexAttrib2f", VertexAttrib2f);               \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "vertexAttrib3f", VertexAttrib3f);               \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "vertexAttrib4f", VertexAttrib4f);               \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "blendColor", BlendColor);                       \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "blendEquationSeparate", BlendEquationSeparate); \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "blendFuncSeparate", BlendFuncSeparate);         \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "clearStencil", ClearStencil);                   \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "colorMask", ColorMask);                         \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "copyTexImage2D", CopyTexImage2D);               \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "copyTexSubImage2D", CopyTexSubImage2D);         \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "cullFace", CullFace);                           \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "depthMask", DepthMask);                         \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "depthRange", DepthRange);                       \
  JS_GL_METHOD_IMPL(                                                                               \
    context_impl, webgl_template, "disableVertexAttribArray", DisableVertexAttribArray);           \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "hint", Hint);                                   \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "isEnabled", IsEnabled);                         \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "lineWidth", LineWidth);                         \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "polygonOffset", PolygonOffset);                 \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "scissor", Scissor);                             \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "stencilFunc", StencilFunc);                     \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "stencilFuncSeparate", StencilFuncSeparate);     \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "stencilMask", StencilMask);                     \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "stencilMaskSeparate", StencilMaskSeparate);     \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "stencilOp", StencilOp);                         \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "stencilOpSeparate", StencilOpSeparate);         \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "bindRenderbuffer", BindRenderbuffer);           \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "createRenderbuffer", CreateRenderbuffer);       \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "deleteBuffer", DeleteBuffer);                   \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "deleteFramebuffer", DeleteFramebuffer);         \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "deleteProgram", DeleteProgram);                 \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "deleteRenderbuffer", DeleteRenderbuffer);       \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "deleteShader", DeleteShader);                   \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "deleteTexture", DeleteTexture);                 \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "detachShader", DetachShader);                   \
  JS_GL_METHOD_IMPL(                                                                               \
    context_impl, webgl_template, "framebufferRenderbuffer", FramebufferRenderbuffer);             \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "getVertexAttribOffset", GetVertexAttribOffset); \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "isBuffer", IsBuffer);                           \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "isFramebuffer", IsFramebuffer);                 \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "isProgram", IsProgram);                         \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "isRenderbuffer", IsRenderbuffer);               \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "isShader", IsShader);                           \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "isTexture", IsTexture);                         \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "renderbufferStorage", RenderbufferStorage);     \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "getShaderSource", GetShaderSource);             \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "validateProgram", ValidateProgram);             \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "texSubImage2D", TexSubImage2D);                 \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "readPixels", ReadPixels);                       \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "getTexParameter", GetTexParameter);             \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "getActiveAttrib", GetActiveAttrib);             \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "getActiveUniform", GetActiveUniform);           \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "getAttachedShaders", GetAttachedShaders);       \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "getParameter", GetParameter);                   \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "getBufferParameter", GetBufferParameter);       \
  JS_GL_METHOD_IMPL(                                                                               \
    context_impl,                                                                                  \
    webgl_template,                                                                                \
    "getFramebufferAttachmentParameter",                                                           \
    GetFramebufferAttachmentParameter);                                                            \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "getProgramInfoLog", GetProgramInfoLog);         \
  JS_GL_METHOD_IMPL(                                                                               \
    context_impl, webgl_template, "getRenderbufferParameter", GetRenderbufferParameter);           \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "getVertexAttrib", GetVertexAttrib);             \
  JS_GL_METHOD_IMPL(                                                                               \
    context_impl, webgl_template, "getSupportedExtensions", GetSupportedExtensions);               \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "getExtension", GetExtension);                   \
  JS_GL_METHOD_IMPL(                                                                               \
    context_impl, webgl_template, "getShaderPrecisionFormat", GetShaderPrecisionFormat);           \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "frontFace", FrontFace);                         \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "sampleCoverage", SampleCoverage);               \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "destroy", Destroy);                             \
                                                                                                   \
  /* Non-standard methods. */                                                                      \
  JS_GL_METHOD_IMPL(context_impl, webgl_template, "eglSwapBuffers", EglSwapBuffers);               \
  JS_GL_METHOD_IMPL(                                                                               \
    context_impl, webgl_template, "_getCachedUnpackAlignment", GetCachedUnpackAlignment);          \
                                                                                                   \
  /* Windows defines a macro called NO_ERROR which messes this up */                               \
  Nan::SetPrototypeTemplate(webgl_template, "NO_ERROR", Nan::New<v8::Integer>(GL_NO_ERROR));       \
  JS_GL_CONSTANT(webgl_template, INVALID_ENUM);                                                    \
  JS_GL_CONSTANT(webgl_template, INVALID_VALUE);                                                   \
  JS_GL_CONSTANT(webgl_template, INVALID_OPERATION);                                               \
  JS_GL_CONSTANT(webgl_template, OUT_OF_MEMORY);                                                   \
                                                                                                   \
  JS_GL_CONSTANT(webgl_template, MAX_VERTEX_UNIFORM_VECTORS);                                      \
  JS_GL_CONSTANT(webgl_template, MAX_VARYING_VECTORS);                                             \
  JS_GL_CONSTANT(webgl_template, MAX_FRAGMENT_UNIFORM_VECTORS);                                    \
  JS_GL_CONSTANT(webgl_template, RGB565);                                                          \
  JS_GL_CONSTANT(webgl_template, STENCIL_INDEX8);                                                  \
  JS_GL_CONSTANT(webgl_template, FRAMEBUFFER_INCOMPLETE_DIMENSIONS);                               \
  JS_GL_CONSTANT(webgl_template, DEPTH_BUFFER_BIT);                                                \
  JS_GL_CONSTANT(webgl_template, STENCIL_BUFFER_BIT);                                              \
  JS_GL_CONSTANT(webgl_template, COLOR_BUFFER_BIT);                                                \
  JS_GL_CONSTANT(webgl_template, POINTS);                                                          \
  JS_GL_CONSTANT(webgl_template, LINES);                                                           \
  JS_GL_CONSTANT(webgl_template, LINE_LOOP);                                                       \
  JS_GL_CONSTANT(webgl_template, LINE_STRIP);                                                      \
  JS_GL_CONSTANT(webgl_template, TRIANGLES);                                                       \
  JS_GL_CONSTANT(webgl_template, TRIANGLE_STRIP);                                                  \
  JS_GL_CONSTANT(webgl_template, TRIANGLE_FAN);                                                    \
  JS_GL_CONSTANT(webgl_template, ZERO);                                                            \
  JS_GL_CONSTANT(webgl_template, ONE);                                                             \
  JS_GL_CONSTANT(webgl_template, SRC_COLOR);                                                       \
  JS_GL_CONSTANT(webgl_template, ONE_MINUS_SRC_COLOR);                                             \
  JS_GL_CONSTANT(webgl_template, SRC_ALPHA);                                                       \
  JS_GL_CONSTANT(webgl_template, ONE_MINUS_SRC_ALPHA);                                             \
  JS_GL_CONSTANT(webgl_template, DST_ALPHA);                                                       \
  JS_GL_CONSTANT(webgl_template, ONE_MINUS_DST_ALPHA);                                             \
  JS_GL_CONSTANT(webgl_template, DST_COLOR);                                                       \
  JS_GL_CONSTANT(webgl_template, ONE_MINUS_DST_COLOR);                                             \
  JS_GL_CONSTANT(webgl_template, SRC_ALPHA_SATURATE);                                              \
  JS_GL_CONSTANT(webgl_template, FUNC_ADD);                                                        \
  JS_GL_CONSTANT(webgl_template, BLEND_EQUATION);                                                  \
  JS_GL_CONSTANT(webgl_template, BLEND_EQUATION_RGB);                                              \
  JS_GL_CONSTANT(webgl_template, BLEND_EQUATION_ALPHA);                                            \
  JS_GL_CONSTANT(webgl_template, FUNC_SUBTRACT);                                                   \
  JS_GL_CONSTANT(webgl_template, FUNC_REVERSE_SUBTRACT);                                           \
  JS_GL_CONSTANT(webgl_template, BLEND_DST_RGB);                                                   \
  JS_GL_CONSTANT(webgl_template, BLEND_SRC_RGB);                                                   \
  JS_GL_CONSTANT(webgl_template, BLEND_DST_ALPHA);                                                 \
  JS_GL_CONSTANT(webgl_template, BLEND_SRC_ALPHA);                                                 \
  JS_GL_CONSTANT(webgl_template, CONSTANT_COLOR);                                                  \
  JS_GL_CONSTANT(webgl_template, ONE_MINUS_CONSTANT_COLOR);                                        \
  JS_GL_CONSTANT(webgl_template, CONSTANT_ALPHA);                                                  \
  JS_GL_CONSTANT(webgl_template, ONE_MINUS_CONSTANT_ALPHA);                                        \
  JS_GL_CONSTANT(webgl_template, BLEND_COLOR);                                                     \
  JS_GL_CONSTANT(webgl_template, ARRAY_BUFFER);                                                    \
  JS_GL_CONSTANT(webgl_template, ELEMENT_ARRAY_BUFFER);                                            \
  JS_GL_CONSTANT(webgl_template, ARRAY_BUFFER_BINDING);                                            \
  JS_GL_CONSTANT(webgl_template, ELEMENT_ARRAY_BUFFER_BINDING);                                    \
  JS_GL_CONSTANT(webgl_template, STREAM_DRAW);                                                     \
  JS_GL_CONSTANT(webgl_template, STATIC_DRAW);                                                     \
  JS_GL_CONSTANT(webgl_template, DYNAMIC_DRAW);                                                    \
  JS_GL_CONSTANT(webgl_template, BUFFER_SIZE);                                                     \
  JS_GL_CONSTANT(webgl_template, BUFFER_USAGE);                                                    \
  JS_GL_CONSTANT(webgl_template, CURRENT_VERTEX_ATTRIB);                                           \
  JS_GL_CONSTANT(webgl_template, FRONT);                                                           \
  JS_GL_CONSTANT(webgl_template, BACK);                                                            \
  JS_GL_CONSTANT(webgl_template, FRONT_AND_BACK);                                                  \
  JS_GL_CONSTANT(webgl_template, TEXTURE_2D);                                                      \
  JS_GL_CONSTANT(webgl_template, CULL_FACE);                                                       \
  JS_GL_CONSTANT(webgl_template, BLEND);                                                           \
  JS_GL_CONSTANT(webgl_template, DITHER);                                                          \
  JS_GL_CONSTANT(webgl_template, STENCIL_TEST);                                                    \
  JS_GL_CONSTANT(webgl_template, DEPTH_TEST);                                                      \
  JS_GL_CONSTANT(webgl_template, SCISSOR_TEST);                                                    \
  JS_GL_CONSTANT(webgl_template, POLYGON_OFFSET_FILL);                                             \
  JS_GL_CONSTANT(webgl_template, SAMPLE_ALPHA_TO_COVERAGE);                                        \
  JS_GL_CONSTANT(webgl_template, SAMPLE_COVERAGE);                                                 \
  JS_GL_CONSTANT(webgl_template, CW);                                                              \
  JS_GL_CONSTANT(webgl_template, CCW);                                                             \
  JS_GL_CONSTANT(webgl_template, LINE_WIDTH);                                                      \
  JS_GL_CONSTANT(webgl_template, ALIASED_POINT_SIZE_RANGE);                                        \
  JS_GL_CONSTANT(webgl_template, ALIASED_LINE_WIDTH_RANGE);                                        \
  JS_GL_CONSTANT(webgl_template, CULL_FACE_MODE);                                                  \
  JS_GL_CONSTANT(webgl_template, FRONT_FACE);                                                      \
  JS_GL_CONSTANT(webgl_template, DEPTH_RANGE);                                                     \
  JS_GL_CONSTANT(webgl_template, DEPTH_WRITEMASK);                                                 \
  JS_GL_CONSTANT(webgl_template, DEPTH_CLEAR_VALUE);                                               \
  JS_GL_CONSTANT(webgl_template, DEPTH_FUNC);                                                      \
  JS_GL_CONSTANT(webgl_template, STENCIL_CLEAR_VALUE);                                             \
  JS_GL_CONSTANT(webgl_template, STENCIL_FUNC);                                                    \
  JS_GL_CONSTANT(webgl_template, STENCIL_FAIL);                                                    \
  JS_GL_CONSTANT(webgl_template, STENCIL_PASS_DEPTH_FAIL);                                         \
  JS_GL_CONSTANT(webgl_template, STENCIL_PASS_DEPTH_PASS);                                         \
  JS_GL_CONSTANT(webgl_template, STENCIL_REF);                                                     \
  JS_GL_CONSTANT(webgl_template, STENCIL_VALUE_MASK);                                              \
  JS_GL_CONSTANT(webgl_template, STENCIL_WRITEMASK);                                               \
  JS_GL_CONSTANT(webgl_template, STENCIL_BACK_FUNC);                                               \
  JS_GL_CONSTANT(webgl_template, STENCIL_BACK_FAIL);                                               \
  JS_GL_CONSTANT(webgl_template, STENCIL_BACK_PASS_DEPTH_FAIL);                                    \
  JS_GL_CONSTANT(webgl_template, STENCIL_BACK_PASS_DEPTH_PASS);                                    \
  JS_GL_CONSTANT(webgl_template, STENCIL_BACK_REF);                                                \
  JS_GL_CONSTANT(webgl_template, STENCIL_BACK_VALUE_MASK);                                         \
  JS_GL_CONSTANT(webgl_template, STENCIL_BACK_WRITEMASK);                                          \
  JS_GL_CONSTANT(webgl_template, VIEWPORT);                                                        \
  JS_GL_CONSTANT(webgl_template, SCISSOR_BOX);                                                     \
  JS_GL_CONSTANT(webgl_template, COLOR_CLEAR_VALUE);                                               \
  JS_GL_CONSTANT(webgl_template, COLOR_WRITEMASK);                                                 \
  JS_GL_CONSTANT(webgl_template, UNPACK_ALIGNMENT);                                                \
  JS_GL_CONSTANT(webgl_template, PACK_ALIGNMENT);                                                  \
  JS_GL_CONSTANT(webgl_template, MAX_TEXTURE_SIZE);                                                \
  JS_GL_CONSTANT(webgl_template, MAX_VIEWPORT_DIMS);                                               \
  JS_GL_CONSTANT(webgl_template, SUBPIXEL_BITS);                                                   \
  JS_GL_CONSTANT(webgl_template, RED_BITS);                                                        \
  JS_GL_CONSTANT(webgl_template, GREEN_BITS);                                                      \
  JS_GL_CONSTANT(webgl_template, BLUE_BITS);                                                       \
  JS_GL_CONSTANT(webgl_template, ALPHA_BITS);                                                      \
  JS_GL_CONSTANT(webgl_template, DEPTH_BITS);                                                      \
  JS_GL_CONSTANT(webgl_template, STENCIL_BITS);                                                    \
  JS_GL_CONSTANT(webgl_template, POLYGON_OFFSET_UNITS);                                            \
  JS_GL_CONSTANT(webgl_template, POLYGON_OFFSET_FACTOR);                                           \
  JS_GL_CONSTANT(webgl_template, TEXTURE_BINDING_2D);                                              \
  JS_GL_CONSTANT(webgl_template, SAMPLE_BUFFERS);                                                  \
  JS_GL_CONSTANT(webgl_template, SAMPLES);                                                         \
  JS_GL_CONSTANT(webgl_template, SAMPLE_COVERAGE_VALUE);                                           \
  JS_GL_CONSTANT(webgl_template, SAMPLE_COVERAGE_INVERT);                                          \
  JS_GL_CONSTANT(webgl_template, COMPRESSED_TEXTURE_FORMATS);                                      \
  JS_GL_CONSTANT(webgl_template, DONT_CARE);                                                       \
  JS_GL_CONSTANT(webgl_template, FASTEST);                                                         \
  JS_GL_CONSTANT(webgl_template, NICEST);                                                          \
  JS_GL_CONSTANT(webgl_template, GENERATE_MIPMAP_HINT);                                            \
  JS_GL_CONSTANT(webgl_template, BYTE);                                                            \
  JS_GL_CONSTANT(webgl_template, UNSIGNED_BYTE);                                                   \
  JS_GL_CONSTANT(webgl_template, SHORT);                                                           \
  JS_GL_CONSTANT(webgl_template, UNSIGNED_SHORT);                                                  \
  JS_GL_CONSTANT(webgl_template, INT);                                                             \
  JS_GL_CONSTANT(webgl_template, UNSIGNED_INT);                                                    \
  JS_GL_CONSTANT(webgl_template, FLOAT);                                                           \
  JS_GL_CONSTANT(webgl_template, DEPTH_COMPONENT);                                                 \
  JS_GL_CONSTANT(webgl_template, ALPHA);                                                           \
  JS_GL_CONSTANT(webgl_template, RGB);                                                             \
  JS_GL_CONSTANT(webgl_template, RGBA);                                                            \
  JS_GL_CONSTANT(webgl_template, LUMINANCE);                                                       \
  JS_GL_CONSTANT(webgl_template, LUMINANCE_ALPHA);                                                 \
  JS_GL_CONSTANT(webgl_template, UNSIGNED_SHORT_4_4_4_4);                                          \
  JS_GL_CONSTANT(webgl_template, UNSIGNED_SHORT_5_5_5_1);                                          \
  JS_GL_CONSTANT(webgl_template, UNSIGNED_SHORT_5_6_5);                                            \
  JS_GL_CONSTANT(webgl_template, FRAGMENT_SHADER);                                                 \
  JS_GL_CONSTANT(webgl_template, VERTEX_SHADER);                                                   \
  JS_GL_CONSTANT(webgl_template, MAX_VERTEX_ATTRIBS);                                              \
  JS_GL_CONSTANT(webgl_template, MAX_COMBINED_TEXTURE_IMAGE_UNITS);                                \
  JS_GL_CONSTANT(webgl_template, MAX_VERTEX_TEXTURE_IMAGE_UNITS);                                  \
  JS_GL_CONSTANT(webgl_template, MAX_TEXTURE_IMAGE_UNITS);                                         \
  JS_GL_CONSTANT(webgl_template, SHADER_TYPE);                                                     \
  JS_GL_CONSTANT(webgl_template, DELETE_STATUS);                                                   \
  JS_GL_CONSTANT(webgl_template, LINK_STATUS);                                                     \
  JS_GL_CONSTANT(webgl_template, VALIDATE_STATUS);                                                 \
  JS_GL_CONSTANT(webgl_template, ATTACHED_SHADERS);                                                \
  JS_GL_CONSTANT(webgl_template, ACTIVE_UNIFORMS);                                                 \
  JS_GL_CONSTANT(webgl_template, ACTIVE_ATTRIBUTES);                                               \
  JS_GL_CONSTANT(webgl_template, SHADING_LANGUAGE_VERSION);                                        \
  JS_GL_CONSTANT(webgl_template, CURRENT_PROGRAM);                                                 \
  JS_GL_CONSTANT(webgl_template, NEVER);                                                           \
  JS_GL_CONSTANT(webgl_template, LESS);                                                            \
  JS_GL_CONSTANT(webgl_template, EQUAL);                                                           \
  JS_GL_CONSTANT(webgl_template, LEQUAL);                                                          \
  JS_GL_CONSTANT(webgl_template, GREATER);                                                         \
  JS_GL_CONSTANT(webgl_template, NOTEQUAL);                                                        \
  JS_GL_CONSTANT(webgl_template, GEQUAL);                                                          \
  JS_GL_CONSTANT(webgl_template, ALWAYS);                                                          \
  JS_GL_CONSTANT(webgl_template, KEEP);                                                            \
  JS_GL_CONSTANT(webgl_template, REPLACE);                                                         \
  JS_GL_CONSTANT(webgl_template, INCR);                                                            \
  JS_GL_CONSTANT(webgl_template, DECR);                                                            \
  JS_GL_CONSTANT(webgl_template, INVERT);                                                          \
  JS_GL_CONSTANT(webgl_template, INCR_WRAP);                                                       \
  JS_GL_CONSTANT(webgl_template, DECR_WRAP);                                                       \
  JS_GL_CONSTANT(webgl_template, VENDOR);                                                          \
  JS_GL_CONSTANT(webgl_template, RENDERER);                                                        \
  JS_GL_CONSTANT(webgl_template, NEAREST);                                                         \
  JS_GL_CONSTANT(webgl_template, LINEAR);                                                          \
  JS_GL_CONSTANT(webgl_template, NEAREST_MIPMAP_NEAREST);                                          \
  JS_GL_CONSTANT(webgl_template, LINEAR_MIPMAP_NEAREST);                                           \
  JS_GL_CONSTANT(webgl_template, NEAREST_MIPMAP_LINEAR);                                           \
  JS_GL_CONSTANT(webgl_template, LINEAR_MIPMAP_LINEAR);                                            \
  JS_GL_CONSTANT(webgl_template, TEXTURE_MAG_FILTER);                                              \
  JS_GL_CONSTANT(webgl_template, TEXTURE_MIN_FILTER);                                              \
  JS_GL_CONSTANT(webgl_template, TEXTURE_WRAP_S);                                                  \
  JS_GL_CONSTANT(webgl_template, TEXTURE_WRAP_T);                                                  \
  JS_GL_CONSTANT(webgl_template, TEXTURE);                                                         \
  JS_GL_CONSTANT(webgl_template, TEXTURE_CUBE_MAP);                                                \
  JS_GL_CONSTANT(webgl_template, TEXTURE_BINDING_CUBE_MAP);                                        \
  JS_GL_CONSTANT(webgl_template, TEXTURE_CUBE_MAP_POSITIVE_X);                                     \
  JS_GL_CONSTANT(webgl_template, TEXTURE_CUBE_MAP_NEGATIVE_X);                                     \
  JS_GL_CONSTANT(webgl_template, TEXTURE_CUBE_MAP_POSITIVE_Y);                                     \
  JS_GL_CONSTANT(webgl_template, TEXTURE_CUBE_MAP_NEGATIVE_Y);                                     \
  JS_GL_CONSTANT(webgl_template, TEXTURE_CUBE_MAP_POSITIVE_Z);                                     \
  JS_GL_CONSTANT(webgl_template, TEXTURE_CUBE_MAP_NEGATIVE_Z);                                     \
  JS_GL_CONSTANT(webgl_template, MAX_CUBE_MAP_TEXTURE_SIZE);                                       \
  JS_GL_CONSTANT(webgl_template, TEXTURE0);                                                        \
  JS_GL_CONSTANT(webgl_template, TEXTURE1);                                                        \
  JS_GL_CONSTANT(webgl_template, TEXTURE2);                                                        \
  JS_GL_CONSTANT(webgl_template, TEXTURE3);                                                        \
  JS_GL_CONSTANT(webgl_template, TEXTURE4);                                                        \
  JS_GL_CONSTANT(webgl_template, TEXTURE5);                                                        \
  JS_GL_CONSTANT(webgl_template, TEXTURE6);                                                        \
  JS_GL_CONSTANT(webgl_template, TEXTURE7);                                                        \
  JS_GL_CONSTANT(webgl_template, TEXTURE8);                                                        \
  JS_GL_CONSTANT(webgl_template, TEXTURE9);                                                        \
  JS_GL_CONSTANT(webgl_template, TEXTURE10);                                                       \
  JS_GL_CONSTANT(webgl_template, TEXTURE11);                                                       \
  JS_GL_CONSTANT(webgl_template, TEXTURE12);                                                       \
  JS_GL_CONSTANT(webgl_template, TEXTURE13);                                                       \
  JS_GL_CONSTANT(webgl_template, TEXTURE14);                                                       \
  JS_GL_CONSTANT(webgl_template, TEXTURE15);                                                       \
  JS_GL_CONSTANT(webgl_template, TEXTURE16);                                                       \
  JS_GL_CONSTANT(webgl_template, TEXTURE17);                                                       \
  JS_GL_CONSTANT(webgl_template, TEXTURE18);                                                       \
  JS_GL_CONSTANT(webgl_template, TEXTURE19);                                                       \
  JS_GL_CONSTANT(webgl_template, TEXTURE20);                                                       \
  JS_GL_CONSTANT(webgl_template, TEXTURE21);                                                       \
  JS_GL_CONSTANT(webgl_template, TEXTURE22);                                                       \
  JS_GL_CONSTANT(webgl_template, TEXTURE23);                                                       \
  JS_GL_CONSTANT(webgl_template, TEXTURE24);                                                       \
  JS_GL_CONSTANT(webgl_template, TEXTURE25);                                                       \
  JS_GL_CONSTANT(webgl_template, TEXTURE26);                                                       \
  JS_GL_CONSTANT(webgl_template, TEXTURE27);                                                       \
  JS_GL_CONSTANT(webgl_template, TEXTURE28);                                                       \
  JS_GL_CONSTANT(webgl_template, TEXTURE29);                                                       \
  JS_GL_CONSTANT(webgl_template, TEXTURE30);                                                       \
  JS_GL_CONSTANT(webgl_template, TEXTURE31);                                                       \
  JS_GL_CONSTANT(webgl_template, ACTIVE_TEXTURE);                                                  \
  JS_GL_CONSTANT(webgl_template, REPEAT);                                                          \
  JS_GL_CONSTANT(webgl_template, CLAMP_TO_EDGE);                                                   \
  JS_GL_CONSTANT(webgl_template, MIRRORED_REPEAT);                                                 \
  JS_GL_CONSTANT(webgl_template, FLOAT_VEC2);                                                      \
  JS_GL_CONSTANT(webgl_template, FLOAT_VEC3);                                                      \
  JS_GL_CONSTANT(webgl_template, FLOAT_VEC4);                                                      \
  JS_GL_CONSTANT(webgl_template, INT_VEC2);                                                        \
  JS_GL_CONSTANT(webgl_template, INT_VEC3);                                                        \
  JS_GL_CONSTANT(webgl_template, INT_VEC4);                                                        \
  JS_GL_CONSTANT(webgl_template, BOOL);                                                            \
  JS_GL_CONSTANT(webgl_template, BOOL_VEC2);                                                       \
  JS_GL_CONSTANT(webgl_template, BOOL_VEC3);                                                       \
  JS_GL_CONSTANT(webgl_template, BOOL_VEC4);                                                       \
  JS_GL_CONSTANT(webgl_template, FLOAT_MAT2);                                                      \
  JS_GL_CONSTANT(webgl_template, FLOAT_MAT3);                                                      \
  JS_GL_CONSTANT(webgl_template, FLOAT_MAT4);                                                      \
  JS_GL_CONSTANT(webgl_template, SAMPLER_2D);                                                      \
  JS_GL_CONSTANT(webgl_template, SAMPLER_CUBE);                                                    \
  JS_GL_CONSTANT(webgl_template, VERTEX_ATTRIB_ARRAY_ENABLED);                                     \
  JS_GL_CONSTANT(webgl_template, VERTEX_ATTRIB_ARRAY_SIZE);                                        \
  JS_GL_CONSTANT(webgl_template, VERTEX_ATTRIB_ARRAY_STRIDE);                                      \
  JS_GL_CONSTANT(webgl_template, VERTEX_ATTRIB_ARRAY_TYPE);                                        \
  JS_GL_CONSTANT(webgl_template, VERTEX_ATTRIB_ARRAY_NORMALIZED);                                  \
  JS_GL_CONSTANT(webgl_template, VERTEX_ATTRIB_ARRAY_POINTER);                                     \
  JS_GL_CONSTANT(webgl_template, VERTEX_ATTRIB_ARRAY_BUFFER_BINDING);                              \
  JS_GL_CONSTANT(webgl_template, COMPILE_STATUS);                                                  \
  JS_GL_CONSTANT(webgl_template, LOW_FLOAT);                                                       \
  JS_GL_CONSTANT(webgl_template, MEDIUM_FLOAT);                                                    \
  JS_GL_CONSTANT(webgl_template, HIGH_FLOAT);                                                      \
  JS_GL_CONSTANT(webgl_template, LOW_INT);                                                         \
  JS_GL_CONSTANT(webgl_template, MEDIUM_INT);                                                      \
  JS_GL_CONSTANT(webgl_template, HIGH_INT);                                                        \
  JS_GL_CONSTANT(webgl_template, FRAMEBUFFER);                                                     \
  JS_GL_CONSTANT(webgl_template, RENDERBUFFER);                                                    \
  JS_GL_CONSTANT(webgl_template, RGBA4);                                                           \
  JS_GL_CONSTANT(webgl_template, RGB5_A1);                                                         \
  JS_GL_CONSTANT(webgl_template, DEPTH_COMPONENT16);                                               \
  JS_GL_CONSTANT(webgl_template, RENDERBUFFER_WIDTH);                                              \
  JS_GL_CONSTANT(webgl_template, RENDERBUFFER_HEIGHT);                                             \
  JS_GL_CONSTANT(webgl_template, RENDERBUFFER_INTERNAL_FORMAT);                                    \
  JS_GL_CONSTANT(webgl_template, RENDERBUFFER_RED_SIZE);                                           \
  JS_GL_CONSTANT(webgl_template, RENDERBUFFER_GREEN_SIZE);                                         \
  JS_GL_CONSTANT(webgl_template, RENDERBUFFER_BLUE_SIZE);                                          \
  JS_GL_CONSTANT(webgl_template, RENDERBUFFER_ALPHA_SIZE);                                         \
  JS_GL_CONSTANT(webgl_template, RENDERBUFFER_DEPTH_SIZE);                                         \
  JS_GL_CONSTANT(webgl_template, RENDERBUFFER_STENCIL_SIZE);                                       \
  JS_GL_CONSTANT(webgl_template, FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE);                              \
  JS_GL_CONSTANT(webgl_template, FRAMEBUFFER_ATTACHMENT_OBJECT_NAME);                              \
  JS_GL_CONSTANT(webgl_template, FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL);                            \
  JS_GL_CONSTANT(webgl_template, FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE);                    \
  JS_GL_CONSTANT(webgl_template, COLOR_ATTACHMENT0);                                               \
  JS_GL_CONSTANT(webgl_template, DEPTH_ATTACHMENT);                                                \
  JS_GL_CONSTANT(webgl_template, STENCIL_ATTACHMENT);                                              \
  JS_GL_CONSTANT(webgl_template, NONE);                                                            \
  JS_GL_CONSTANT(webgl_template, FRAMEBUFFER_COMPLETE);                                            \
  JS_GL_CONSTANT(webgl_template, FRAMEBUFFER_INCOMPLETE_ATTACHMENT);                               \
  JS_GL_CONSTANT(webgl_template, FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT);                       \
  JS_GL_CONSTANT(webgl_template, FRAMEBUFFER_UNSUPPORTED);                                         \
  JS_GL_CONSTANT(webgl_template, FRAMEBUFFER_BINDING);                                             \
  JS_GL_CONSTANT(webgl_template, RENDERBUFFER_BINDING);                                            \
  JS_GL_CONSTANT(webgl_template, MAX_RENDERBUFFER_SIZE);                                           \
  JS_GL_CONSTANT(webgl_template, INVALID_FRAMEBUFFER_OPERATION);                                   \
                                                                                                   \
  /* WebGL-specific enums */                                                                       \
  JS_CONSTANT(webgl_template, STENCIL_INDEX, 0x1901);                                              \
  JS_CONSTANT(webgl_template, UNPACK_FLIP_Y_WEBGL, 0x9240);                                        \
  JS_CONSTANT(webgl_template, UNPACK_PREMULTIPLY_ALPHA_WEBGL, 0x9241);                             \
  JS_CONSTANT(webgl_template, CONTEXT_LOST_WEBGL, 0x9242);                                         \
  JS_CONSTANT(webgl_template, UNPACK_COLORSPACE_CONVERSION_WEBGL, 0x9243);                         \
  JS_CONSTANT(webgl_template, BROWSER_DEFAULT_WEBGL, 0x9244);                                      \
  JS_CONSTANT(webgl_template, VERSION, 0x1F02);                                                    \
  JS_CONSTANT(webgl_template, IMPLEMENTATION_COLOR_READ_TYPE, 0x8B9A);                             \
  JS_CONSTANT(webgl_template, IMPLEMENTATION_COLOR_READ_FORMAT, 0x8B9B);

#endif  // BINDINGS_BASE_H
