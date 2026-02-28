export const discoWireframeMaterial = new THREE.ShaderMaterial({
  uniforms: {
    timeMsec: {value: 1.0},
  },
  vertexShader:
  `
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    gl_Position = projectionMatrix * mvPosition;
  }
  `,
  fragmentShader:
  ` 
  uniform float timeMsec;
  varying vec2 vUv;
  
  void main(void) {
    vec2 position = - 1.0 + 2.0 * vUv;
    
    float red = abs(sin(position.x * position.y + timeMsec / 5.0));
    float green = abs(sin(position.x * position.y + timeMsec / 4.0));
    float blue = abs(sin(position.x * position.y + timeMsec / 3.0));
    gl_FragColor = vec4(red, green, blue, 0.5);
  }
  `,
  transparent: true,
  wireframe: true,
})
