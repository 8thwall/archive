import * as ecs from '@8thwall/ecs'

ecs.registerComponent({
  name: 'Sun Shader',
  schema: {
    emissiveIntensity: ecs.f32,
  },
  schemaDefaults: {
    emissiveIntensity: 5.0,
  },
  data: {},
  stateMachine: ({world, eid, schemaAttribute}) => {
    const {THREE} = window as any
    let material = null

    // --- GLSL (port of your Sun shader) ---
    const vertexShader = `
      varying vec2 vUv;
      varying vec3 vPosition;
      void main() {
        vUv = uv;
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `

    // Lightweight tri-linear value noise (3D)
    const fragmentShader = `
      uniform float time;
      uniform float emissiveIntensity;
      varying vec2 vUv;
      varying vec3 vPosition;

      float hash(vec3 p) {
        return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453);
      }
      float noise3(vec3 p) {
        vec3 i = floor(p);
        vec3 f = fract(p);
        // Smoothstep for interpolation
        f = f * f * (3.0 - 2.0 * f);

        float n000 = hash(i + vec3(0.0, 0.0, 0.0));
        float n100 = hash(i + vec3(1.0, 0.0, 0.0));
        float n010 = hash(i + vec3(0.0, 1.0, 0.0));
        float n110 = hash(i + vec3(1.0, 1.0, 0.0));
        float n001 = hash(i + vec3(0.0, 0.0, 1.0));
        float n101 = hash(i + vec3(1.0, 0.0, 1.0));
        float n011 = hash(i + vec3(0.0, 1.0, 1.0));
        float n111 = hash(i + vec3(1.0, 1.0, 1.0));

        float nx00 = mix(n000, n100, f.x);
        float nx10 = mix(n010, n110, f.x);
        float nx01 = mix(n001, n101, f.x);
        float nx11 = mix(n011, n111, f.x);

        float nxy0 = mix(nx00, nx10, f.y);
        float nxy1 = mix(nx01, nx11, f.y);

        return mix(nxy0, nxy1, f.z);
      }

      void main() {
        // Animate noise over time; small scale to keep features readable
        float noiseValue = noise3(vPosition * 1.0 + vec3(time * 0.6));

        // Your original color mix: deep orange -> brighter orange
        vec3 baseA = vec3(1.0, 0.1, 0.0);
        vec3 baseB = vec3(1.0, 0.2, 0.0);
        vec3 color = mix(baseA, baseB, noiseValue);

        // Emissive-style intensity
        float intensity = (noiseValue * 0.5 + 0.5) * emissiveIntensity;

        gl_FragColor = vec4(color * intensity, 1.0);
      }
    `

    ecs.defineState('default')
      .initial()
      .onEnter(() => {
        // Clear any existing material component
        ecs.Material.remove(world, eid)

        const object = world.three.entityToObject.get(eid)

        material = new THREE.ShaderMaterial({
          uniforms: {
            time: {value: 0},
            emissiveIntensity: {value: schemaAttribute.get(eid).emissiveIntensity},
          },
          vertexShader,
          fragmentShader,
          transparent: false,
          depthWrite: true,
          depthTest: true,
        })

        // Apply to root object and all meshes below
        if (object.material !== undefined) object.material = material
        object.traverse((node) => {
          if (node.isMesh) node.material = material
        })
      })
      .onTick(() => {
        if (!material) return
        material.uniforms.time.value = world.time.elapsed * 0.001  // seconds
      })
  },
})
