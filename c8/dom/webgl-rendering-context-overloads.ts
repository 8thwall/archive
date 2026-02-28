// @sublibrary(:dom-core-lib)
import type {
  GLenum,
  GLint,
  GLboolean,
  GLsizeiptr,
  GLsizei,
  GLintptr,
  Int32List,
  Float32List,
  TexImageSource,
  WebGLUniformLocation,
} from './webgl-rendering-context-base'

interface AllowSharedBufferSource {}

interface WebGLRenderingContextOverloads {
  bufferData(target: GLenum, size: GLsizeiptr, usage: GLenum): void
  bufferData(target: GLenum, data: AllowSharedBufferSource | null, usage: GLenum): void
  bufferSubData(target: GLenum, offset: GLintptr, data: AllowSharedBufferSource): void
  compressedTexImage2D(
    target: GLenum,
    level: GLint,
    internalformat: GLenum,
    width: GLsizei,
    height: GLsizei,
    border: GLint,
    data: ArrayBufferView | null,
  ): void
  compressedTexSubImage2D(
    target: GLenum,
    level: GLint,
    xoffset: GLint,
    yoffset: GLint,
    width: GLsizei,
    height: GLsizei,
    format: GLenum,
    data: ArrayBufferView | null,
  ): void
  readPixels(
    x: GLint,
    y: GLint,
    width: GLsizei,
    height: GLsizei,
    format: GLenum,
    type: GLenum,
    pixels: ArrayBufferView | null,
  ): void
  texImage2D(
    target: GLenum,
    level: GLint,
    internalformat: GLint,
    width: GLsizei,
    height: GLsizei,
    border: GLint,
    format: GLenum,
    type: GLenum,
    pixels: ArrayBufferView | null,
  ): void
  texImage2D(
    target: GLenum,
    level: GLint,
    internalformat: GLint,
    format: GLenum,
    type: GLenum,
    source: TexImageSource,
  ): void
  texSubImage2D(
    target: GLenum,
    level: GLint,
    xoffset: GLint,
    yoffset: GLint,
    width: GLsizei,
    height: GLsizei,
    format: GLenum,
    type: GLenum,
    pixels: ArrayBufferView | null,
  ): void
  texSubImage2D(
    target: GLenum,
    level: GLint,
    xoffset: GLint,
    yoffset: GLint,
    format: GLenum,
    type: GLenum,
    source: TexImageSource,
  ): void
  uniform1fv(location: WebGLUniformLocation | null, value: Float32List): void
  uniform2fv(location: WebGLUniformLocation | null, value: Float32List): void
  uniform3fv(location: WebGLUniformLocation | null, value: Float32List): void
  uniform4fv(location: WebGLUniformLocation | null, value: Float32List): void
  uniform1iv(location: WebGLUniformLocation | null, value: Int32List): void
  uniform2iv(location: WebGLUniformLocation | null, value: Int32List): void
  uniform3iv(location: WebGLUniformLocation | null, value: Int32List): void
  uniform4iv(location: WebGLUniformLocation | null, value: Int32List): void
  uniformMatrix2fv(
    location: WebGLUniformLocation | null,
    transpose: GLboolean,
    value: Float32List,
  ): void
  uniformMatrix3fv(
    location: WebGLUniformLocation | null,
    transpose: GLboolean,
    value: Float32List,
  ): void
  uniformMatrix4fv(
    location: WebGLUniformLocation | null,
    transpose: GLboolean,
    value: Float32List,
  ): void
}

export type {WebGLRenderingContextOverloads, AllowSharedBufferSource}
