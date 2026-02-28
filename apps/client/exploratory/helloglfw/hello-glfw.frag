#version 320 es

precision mediump float;

in vec3 pixColor;
out vec4 fragmentColor;
void main() {
  fragmentColor = vec4(pixColor, 1.0);
}
