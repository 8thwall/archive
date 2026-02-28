#version 320 es

precision mediump float;

in vec2 texUv;
uniform vec2 scale;
uniform sampler2D colorSampler;
out vec4 fragColor;
uniform float intensity;

float texValue(vec2 p) {
  vec3 sampled = texture(colorSampler, scale * p + texUv).rgb;
  return 0.22 * sampled.r + 0.71 * sampled.g + 0.07 * sampled.b;
}

void main() {
  float center = texValue(vec2(0.0, 0.0));
  float left = texValue(vec2(-1.0, 0.0));
  float right = texValue(vec2(1.0, 0.0));
  float top = texValue(vec2(0.0, -1.0));
  float bottom = texValue(vec2(0.0, 1.0));

  float tl = texValue(vec2(-1.0, -1.0));
  float tr = texValue(vec2(1.0, -1.0));
  float bl = texValue(vec2(-1.0, 1.0));
  float br = texValue(vec2(1.0, 1.0));

  float hEdge = (3.0 * tl + 10.0 * left + 3.0 * bl - 3.0 * tr - 10.0 * right - 3.0 * br) / intensity;
  float vEdge = (3.0 * tl + 10.0 * top + 3.0 * tr - 3.0 * bl - 10.0 * bottom - 3.0 * br) / intensity;
  float val = sqrt(hEdge * hEdge + vEdge * vEdge);

  fragColor.rgb = vec3(val, val, val);
  fragColor.a = 1.0;
}
