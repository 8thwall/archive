#version 320 es

in vec4 position;

in vec2 uv;
out vec2 texUv;

void main() {
  gl_Position = position;
  texUv = uv;
}
