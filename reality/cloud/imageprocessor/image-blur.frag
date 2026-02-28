#version 320 es

precision mediump float;
in vec2 pos;
uniform sampler2D img;
out vec4 fragColor;
uniform float opacity;

vec3 texValue(vec2 p) {
  return texture(img, p).xyz;
}

void main() {
    float x = pos.x;
    float y = pos.y;
    float totalWeight = 0.;
    float stepx = 0.1;
    float stepy = 0.1;
    vec3 rgbPixel = 0.054659 * texValue(vec2(x + stepx, y + stepy)) +
      0.124474 * texValue(vec2(x + stepx, y)) +
      0.054659 * texValue(vec2(x + stepx, y - stepy)) +
      0.124474 * texValue(vec2(x,  y + stepy)) +
      0.283464 * texValue(vec2(x,  y)) +
      0.124474 * texValue(vec2(x,  y - stepy)) +
      0.054659 * texValue(vec2(x - stepx, y + stepy)) +
      0.124474 * texValue(vec2(x - stepx, y)) +
      0.054659 * texValue(vec2(x - stepx, y - stepy));
    fragColor = vec4(rgbPixel.x, rgbPixel.y, rgbPixel.z, opacity);
}
