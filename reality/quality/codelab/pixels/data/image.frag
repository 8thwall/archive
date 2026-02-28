#version 320 es

precision mediump float;

in vec2 texUv;

uniform sampler2D colorSampler;

out vec4 fragColor;

void main() {
  fragColor = texture(colorSampler, texUv);
}
