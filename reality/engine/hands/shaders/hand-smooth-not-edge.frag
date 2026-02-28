#version 320 es

precision mediump float;

in vec2 texUv;
uniform vec2 scale;
uniform sampler2D colorSampler;
out vec4 fragColor;
uniform float intensity;
uniform float edgeThreshold;
uniform float smoothIntensity;  // sigma

vec3 texValue(vec2 p) {
  return texture(colorSampler, scale * p + texUv).rgb;
}

float texGray(vec2 p) {
  vec3 sampled = texture(colorSampler, scale * p + texUv).rgb;
  return 0.22 * sampled.r + 0.71 * sampled.g + 0.07 * sampled.b;
}

float edge() {
  float center = texGray(vec2(0.0, 0.0));
  float left = texGray(vec2(-1.0, 0.0));
  float right = texGray(vec2(1.0, 0.0));
  float top = texGray(vec2(0.0, -1.0));
  float bottom = texGray(vec2(0.0, 1.0));

  float tl = texGray(vec2(-1.0, -1.0));
  float tr = texGray(vec2(1.0, -1.0));
  float bl = texGray(vec2(-1.0, 1.0));
  float br = texGray(vec2(1.0, 1.0));

  float hEdge = (3.0 * tl + 10.0 * left + 3.0 * bl - 3.0 * tr - 10.0 * right - 3.0 * br) / intensity;
  float vEdge = (3.0 * tl + 10.0 * top + 3.0 * tr - 3.0 * bl - 10.0 * bottom - 3.0 * br) / intensity;
  return sqrt(hEdge * hEdge + vEdge * vEdge);
}

const float PI = 3.1415926;

// See https://en.wikipedia.org/wiki/Gaussian_blur for 2d blur function
float getGaussian(float x, float y, float a, float b) {
  return a * exp(-(x * x + y * y) / b);
}

void main() {
  // COMPUTE SMOOTH
  float oneOver2PiSigmaSquared = 1.0 / (PI * 2.0 * smoothIntensity * smoothIntensity);
  float twoSigmaSquared = 2.0 * smoothIntensity * smoothIntensity;
  float p00 = getGaussian(0., 0., oneOver2PiSigmaSquared, twoSigmaSquared);
  float p01 = getGaussian(0., 1., oneOver2PiSigmaSquared, twoSigmaSquared);
  float p02 = getGaussian(0., 2., oneOver2PiSigmaSquared, twoSigmaSquared);
  float p11 = getGaussian(1., 1., oneOver2PiSigmaSquared, twoSigmaSquared);
  float p12 = getGaussian(1., 2., oneOver2PiSigmaSquared, twoSigmaSquared);
  float p22 = getGaussian(2., 2., oneOver2PiSigmaSquared, twoSigmaSquared);
  // This makes sure the image doesn't get darker or lighter
  float intensityScale = p00 + 4.0 * p01 + 4.0 * p11 + 4.0 * p02 + 8.0 * p12 + 4.0 * p22;
  vec3 smoothed = (
    p22 * texValue(vec2(-2.0, -2.0)) + p12 * texValue(vec2(-1.0, -2.0))
    + p02 * texValue(vec2(0.0, -2.0)) + p12 * texValue(vec2(1.0, -2.0))
    + p22 * texValue(vec2(2.0, -2.0)) + p12 * texValue(vec2(-2.0, -1.0))
    + p11 * texValue(vec2(-1.0, -1.0)) + p01 * texValue(vec2(0.0, -1.0))
    + p11 * texValue(vec2(1.0, -1.0)) + p12 * texValue(vec2(2.0, -1.0))
    + p02 * texValue(vec2(-2.0, 0.0)) + p01 * texValue(vec2(-1.0, 0.0))
    + p00 * texValue(vec2(0.0, 0.0)) + p01 * texValue(vec2(1.0, 0.0))
    + p02 * texValue(vec2(2.0, 0.0)) + p12 * texValue(vec2(-2.0, 1.0))
    + p11 * texValue(vec2(-1.0, 1.0)) + p01 * texValue(vec2(0.0, 1.0))
    + p11 * texValue(vec2(1.0, 1.0)) + p12 * texValue(vec2(2.0, 1.0))
    + p22 * texValue(vec2(-2.0, 2.0)) + p12 * texValue(vec2(-1.0, 2.0))
    + p02 * texValue(vec2(0.0, 2.0)) + p12 * texValue(vec2(1.0, 2.0))
    + p22 * texValue(vec2(2.0, 0.0))
  ) / intensityScale;

  // COMPUTE EDGE
  float edgeVal = edge();

  vec3 center = texValue(vec2(0.0, 0.0));
  if (edgeVal > edgeThreshold) {
    fragColor.rgb = center;
  } else {
    fragColor.rgb = smoothed;
  }
  fragColor.a = 1.0;
}
