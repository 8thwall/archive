#version 300 es

precision mediump float;

uniform sampler2D camTex;
in vec2 camTexCoordinate;
out vec4 fragmentColor;

void main () {
  fragmentColor = texture(camTex, camTexCoordinate);
}
