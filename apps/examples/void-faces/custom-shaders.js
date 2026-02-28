const customShaders = () => {
  const flatDiscoShader = {
    schema: {
      random: {type: 'number', is: 'uniform'},
      timeMsec: {type: 'time', is: 'uniform'},
    },
    vertexShader:
      `
      varying vec2 vUv;
      
      void main()
      {
        vUv = uv;
        vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
        gl_Position = projectionMatrix * mvPosition;
      }
      `,
    fragmentShader:
      ` 
        uniform float timeMsec;
        
        uniform float random;
        
        varying vec2 vUv;
        
      void main( void ) {
        float time = timeMsec / 1000.0;
        
        vec2 position = - 1.0 + 2.0 * vUv * random;
        
        float red = abs( sin( position.x * position.y + time / 5.0 ) );
        float green = abs( sin( position.x * position.y + time / 4.0 ) );
        float blue = abs( sin( position.x * position.y + time / 3.0 ) );
        gl_FragColor = vec4( red, green, blue, 1.0 );
      }
      `,
  }

  return {
    'flat-disco': flatDiscoShader,
  }
}

export {customShaders}
