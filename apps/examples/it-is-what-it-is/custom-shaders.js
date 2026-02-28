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

  const waveVortexShader = {
    schema: {
      timeMsec: {type: 'time', is: 'uniform'},
    },
  		vertexShader:
  		`varying vec2 vUv;
  
  			void main()
  			{
  				vUv = uv;
  				vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
  				gl_Position = projectionMatrix * mvPosition;
  			}
  		`,
  		fragmentShader:
  		` uniform float timeMsec;
  
  			varying vec2 vUv;
  
  			void main(void) {
  			  float time = timeMsec / 1000.0;
  
  				vec2 p = - 1.0 + 2.0 * vUv;
  				float a = time * 40.0;
  				float d, e, f, g = 1.0 / 40.0 ,h ,i ,r ,q;
  
  				e = 400.0 * ( p.x * 0.5 + 0.5 );
  				f = 400.0 * ( p.y * 0.5 + 0.5 );
  				i = 200.0 + sin( e * g + a / 150.0 ) * 20.0;
  				d = 200.0 + cos( f * g / 2.0 ) * 18.0 + cos( e * g ) * 7.0;
  				r = sqrt( pow( abs( i - e ), 2.0 ) + pow( abs( d - f ), 2.0 ) );
  				q = f / r;
  				e = ( r * cos( q ) ) - a / 2.0;
  				f = ( r * sin( q ) ) - a / 2.0;
  				d = sin( e * g ) * 176.0 + sin( e * g ) * 164.0 + r;
  				h = ( ( f + d ) + a / 2.0 ) * g;
  				i = cos( h + r * p.x / 1.3 ) * ( e + e + a ) + cos( q * g * 6.0 ) * ( r + h / 3.0 );
  				h = sin( f * g ) * 144.0 - sin( e * g ) * 212.0 * p.x;
  				h = ( h + ( f - e ) * q + sin( r - ( a + h ) / 7.0 ) * 10.0 + i / 4.0 ) * g;
  				i += cos( h * 2.3 * sin( a / 350.0 - q ) ) * 184.0 * sin( q - ( r * 4.3 + a / 12.0 ) * g)
  				+ tan( r * g + h ) * 184.0 * cos( r * g + h );
  				i = mod( i / 5.6, 256.0 ) / 64.0;
  				if ( i < 0.0 ) i += 4.0;
  				if ( i >= 2.0 ) i = 4.0 - i;
  				d = r / 350.0;
  				d += sin( d * d * 8.0 ) * 0.52;
  				f = ( sin( a * g ) + 1.0 ) / 2.0;
  				gl_FragColor = vec4( vec3( f * i / 1.6, i / 2.0 + d / 13.0, i ) * d * p.x + vec3( i / 1.3
  				+ d / 8.0, i / 2.0 + d / 18.0, i ) * d * ( 1.0 - p.x ), 1.0 );
  
  			}
  	  `,
  }

  const texVortexShader = {
    schema: {
      texture: {type: 'map', is: 'uniform'},
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
  		
  		uniform sampler2D texture;
  		
  		varying vec2 vUv;
  
  		void main( void ) {
  		  float time = timeMsec / 1000.0;
  
  			vec2 position = - 1.0 + 2.0 * vUv;
  
  			float t = atan( position.y, position.x );
  			float r = sqrt( dot( position, position ) );
  
  			vec2 uv;
  			uv.x = cos( t ) / r;
  			uv.y = sin( t ) / r;
  			uv /= 10.0;
  			uv += time * 0.05;
  
  		  vec4 color = texture2D( texture, uv );
  
  			gl_FragColor = vec4( color );
  			
  		}
  	  `,
  }

  const lavaShader = {
    schema: {
      texture1: {type: 'map', is: 'uniform'},
      texture2: {type: 'map', is: 'uniform'},
      timeMsec: {type: 'time', is: 'uniform'},
    },
  		vertexShader:
  		`
  		varying vec2 vUv;
  
  		void main()
  		{
  
  			vUv = vec2(3.0, 1.0) * uv;
  			vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
  			gl_Position = projectionMatrix * mvPosition;
  
  		}
  		`,
  		fragmentShader:
  		` 
  		uniform float timeMsec;
  
  		uniform vec3 fogColor;
  
  		uniform sampler2D texture1;
  		uniform sampler2D texture2;
  
  		varying vec2 vUv;
  
  		void main( void ) {
  		  float time = timeMsec / 1000.0;
  		  
  		  vec3 fogColor = vec3( 0, 0, 0 );
  
  			vec2 position = - 1.0 + 2.0 * vUv;
  
  			vec4 noise = texture2D( texture1, vUv );
  			vec2 T1 = vUv + vec2( 1.5, - 1.5 ) * time * 0.02;
  			vec2 T2 = vUv + vec2( - 0.5, 2.0 ) * time * 0.01;
  
  			T1.x += noise.x * 2.0;
  			T1.y += noise.y * 2.0;
  			T2.x -= noise.y * 0.2;
  			T2.y += noise.z * 0.2;
  
  			float p = texture2D( texture1, T1 * 2.0 ).a;
  
  			vec4 color = texture2D( texture2, T2 * 2.0 );
  			vec4 temp = color * ( vec4( p, p, p, p ) * 2.0 ) + ( color * color - 0.1 );
  
  			if( temp.r > 1.0 ) { temp.bg += clamp( temp.r - 2.0, 0.0, 100.0 ); }
  			if( temp.g > 1.0 ) { temp.rb += temp.g - 1.0; }
  			if( temp.b > 1.0 ) { temp.rg += temp.b - 1.0; }
  
  			gl_FragColor = temp;
  
  			float depth = gl_FragCoord.z / gl_FragCoord.w;
  			const float LOG2 = 1.442695;
  			float fogFactor = exp2( - 0.45 * 0.45 * depth * depth * LOG2 );
  			fogFactor = 1.0 - clamp( fogFactor, 0.0, 1.0 );
  
  			gl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor );
  		}
  	  `,
  }

  return {
    'flat-disco': flatDiscoShader,
    'wave-vortex': waveVortexShader,
    'tex-vortex': texVortexShader,
    'lava': lavaShader,
  }
}

export {customShaders}
