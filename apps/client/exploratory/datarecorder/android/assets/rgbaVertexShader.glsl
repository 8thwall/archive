#version 300 es

// Extra warping that is applied to correct aspect ratio, etc.
uniform mat4 _TextureWarp;

in vec4 position;
in vec4 texturePosition;

out vec2 camTexCoordinate;

void main() {
  gl_Position = position;

  camTexCoordinate = texturePosition.xy;
  camTexCoordinate.y = 1.0f - camTexCoordinate.y;
  camTexCoordinate = (_TextureWarp * vec4(camTexCoordinate,0,1)).xy;
}
