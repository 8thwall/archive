#version 300 es
#extension GL_OES_EGL_image_external : require
#extension GL_OES_EGL_image_external_essl3 : require

precision mediump float;

uniform sampler2D camTex;
uniform sampler2D camTex2;
in vec2 camTexCoordinate;
out vec4 fragmentColor;

void main () {
  float y = texture(camTex, camTexCoordinate).r;
  vec2 uv = texture(camTex2, camTexCoordinate).rg - vec2(0.5f, 0.5f);
  fragmentColor.r = y + 1.13983f * uv.y;
  fragmentColor.g = y - 0.39465f * uv.x - 0.58060f * uv.y;
  fragmentColor.b = y + 2.03211f * uv.x;
  fragmentColor.a = 1.0f;
}
