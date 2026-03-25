import * as ecs from '@8thwall/ecs'

ecs.registerComponent({
  name: 'toon-ocean',
  schema: {
    colorFoam: ecs.string,
    colorShallow: ecs.string,
    colorDeep: ecs.string,
    bandSharpness: ecs.f32,
    causticScale: ecs.f32,
    causticStrength: ecs.f32,
    rippleHeight: ecs.f32,
    rippleFreq: ecs.f32,
    rippleSpeed: ecs.f32,
    rippleMod: ecs.f32,
    causticSpeed: ecs.f32,
    depthOpacity: ecs.f32,
    deepOpacity: ecs.f32,
    causticTint: ecs.string,
    useBands: ecs.boolean,
    meshScale: ecs.f32,  // <-- New property
  },
  schemaDefaults: {
    colorFoam: '#48cae4',
    colorShallow: '#00b4d8',
    colorDeep: '#0096c7',
    bandSharpness: 1,
    causticScale: 5,
    causticStrength: 1.5,
    rippleHeight: 0.75,
    rippleFreq: 0.15,
    rippleSpeed: 0.001,
    rippleMod: 1.5,
    causticSpeed: 0.001,
    depthOpacity: 0.2,
    deepOpacity: 0.7,
    causticTint: '#0077b6',
    useBands: true,
    meshScale: 1,  // <-- Default (no scale)
  },
  stateMachine: ({world, eid, schemaAttribute}) => {
    const {THREE} = window as any
    let material: any = null
    let causticTexture: any = null
    let meshReady = false

    function generateCausticCanvasTexture() {
      const width = 512
      const height = 512
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')!
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, width, height)

      // Draw caustic circles, wrapping at tile boundaries for seamlessness
      for (let i = 0; i < 90; i++) {
        const x = Math.random() * width
        const y = Math.random() * height
        const r = 20 + Math.random() * 30
        ctx.globalAlpha = 0.17
        ctx.filter = 'blur(4px)'
        // Draw at (x,y) and every wrapped edge position
        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            ctx.beginPath()
            ctx.arc(x + dx * width, y + dy * height, r, 0, Math.PI * 2)
            ctx.closePath()
            ctx.fillStyle = 'black'
            ctx.fill()
          }
        }
        ctx.filter = 'none'
        ctx.globalAlpha = 1.0
      }

      const tex = new THREE.CanvasTexture(canvas)
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping
      tex.anisotropy = 2
      tex.needsUpdate = true
      return tex
    }

    function assignOceanMaterialToAllMeshes(object: any) {
      if (!object) return
      // Set low renderOrder on parent to ensure ocean renders before render-first objects
      object.renderOrder = -100
      object.traverse((node: any) => {
        // Set renderOrder on all nodes to ensure proper ordering
        node.renderOrder = -100
        if (node.isMesh) {
          node.material = material
          // Ensure ocean meshes have low renderOrder
          node.renderOrder = -100
        }
      })
    }

    function createOceanMaterial(attribs: any) {
      return new THREE.ShaderMaterial({
        uniforms: {
          colorFoam: {value: new THREE.Color(attribs.colorFoam)},
          colorShallow: {value: new THREE.Color(attribs.colorShallow)},
          colorDeep: {value: new THREE.Color(attribs.colorDeep)},
          causticTint: {value: new THREE.Color(attribs.causticTint)},
          bandSharpness: {value: attribs.bandSharpness},
          causticMap: {value: causticTexture},
          causticScale: {value: attribs.causticScale},
          causticStrength: {value: attribs.causticStrength},
          causticSpeed: {value: attribs.causticSpeed},
          rippleHeight: {value: attribs.rippleHeight},
          rippleFreq: {value: attribs.rippleFreq},
          rippleSpeed: {value: attribs.rippleSpeed},
          rippleMod: {value: attribs.rippleMod},
          depthOpacity: {value: attribs.depthOpacity},
          deepOpacity: {value: attribs.deepOpacity},
          useBands: {value: attribs.useBands ? 1.0 : 0.0},
          uTime: {value: 0},
          meshScale: {value: attribs.meshScale},  // <-- New!
        },
        vertexShader: `
          varying vec2 vUv;
          varying float vRipple;
          varying float vWorldY;
          uniform float uTime;
          uniform float rippleHeight;
          uniform float rippleFreq;
          uniform float rippleSpeed;
          uniform float rippleMod;
          uniform float meshScale; // <-- New!


          float hash(vec2 p) {
            return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
          }


          void main() {
            vUv = uv;
            float t = uTime * rippleSpeed;

            // Calculate world position for seamless tiling
            vec4 worldPos = modelMatrix * vec4(position, 1.0);
            
            // Use WORLD coordinates (not local) for wave calculations
            // This ensures all ocean tiles calculate waves from the same coordinate system
            float sx = worldPos.x / meshScale;
            float sz = worldPos.z / meshScale;
            vec2 worldXZ = vec2(worldPos.x, worldPos.z);


            // Composite of multiple slow sine waves with modulation
            // Using world coordinates ensures seamless edges between tiles
            float ripple = 0.0;
            ripple += sin((sx + hash(worldXZ) * rippleMod) * rippleFreq + t);
            ripple += 0.6 * sin((sz * 0.7 + hash(worldXZ.yx) * rippleMod * 1.1) * rippleFreq * 1.4 + t * 1.15);
            ripple += 0.3 * sin((sx * 1.8 - sz * 1.3 + t * 0.33) * rippleFreq * 0.6);


            vRipple = ripple;
            vec3 pos = position.xyz;
            pos.y += ripple * rippleHeight;
            vWorldY = pos.y;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 colorFoam;
          uniform vec3 colorShallow;
          uniform vec3 colorDeep;
          uniform vec3 causticTint;
          uniform float bandSharpness;
          uniform sampler2D causticMap;
          uniform float causticScale;
          uniform float causticStrength;
          uniform float causticSpeed;
          uniform float uTime;
          uniform float depthOpacity;
          uniform float deepOpacity;
          uniform float useBands;


          varying vec2 vUv;
          varying float vRipple;
          varying float vWorldY;


          float bandEdge(float center, float width, float depth, float sharpness) {
            float halfWidth = width * 0.5;
            float edgeLow  = center - halfWidth;
            float edgeHigh = center + halfWidth;
            float t = smoothstep(edgeLow - sharpness, edgeLow + sharpness, depth) -
                      smoothstep(edgeHigh - sharpness, edgeHigh + sharpness, depth);
            return t;
          }


          void main() {
            float depth = vWorldY * 0.5 + 0.5; // [-1,1] -> [0,1]
            float s = clamp(bandSharpness, 0.001, 0.25); // Lower = softer, higher = sharper bands


            // Band weights with sharpness control
            float foamWeight    = smoothstep(0.60 - s, 0.70 + s, depth);
            float shallowWeight = smoothstep(0.22 - s, 0.58 + s, depth) * (1.0 - foamWeight);
            float deepWeight    = 1.0 - foamWeight - shallowWeight;


            vec3 color = colorDeep * deepWeight +
                        colorShallow * shallowWeight +
                        colorFoam * foamWeight;


            // If useBands is off, blend deep->foam
            if (useBands < 0.5) {
                color = mix(colorDeep, colorFoam, shallowWeight + foamWeight);
            }


            // Animated caustics
            vec2 causticUv = vUv * causticScale + vec2(
                uTime * causticSpeed * 0.33,
                uTime * causticSpeed * 0.20
            );
            float caustic = texture2D(causticMap, causticUv).r;
            float causticBand = pow(shallowWeight + foamWeight, 1.1);
            vec3 causticColor = mix(vec3(1.0), causticTint, 0.7);
            color = mix(color, color * (1.0 + causticStrength * caustic * causticBand) * causticColor, 0.75);


            // Fade out in deep with separate deep opacity control
            float fade = smoothstep(0.6, 1.0, depth) * depthOpacity;
            float deepAlpha = mix(1.0, deepOpacity, deepWeight);
            float finalAlpha = (1.0 - fade) * deepAlpha;
            gl_FragColor = vec4(color, finalAlpha);
          }
        `,
        transparent: true,
        depthTest: true,      // Ocean should test depth to render correctly with scene
        depthWrite: false,    // But shouldn't write to depth buffer (standard for transparent)
      })
    }

    ecs.defineState('default')
      .initial()
      .onEnter(() => {
        const attribs = schemaAttribute.get(eid)
        causticTexture = generateCausticCanvasTexture()
        material = createOceanMaterial(attribs)

        ecs.Material.remove(world, eid)

        // Handles both primitives and GLTF models!
        const applyMaterial = (object: any) => {
          assignOceanMaterialToAllMeshes(object)
          meshReady = true
        }

        world.events.addListener(eid, ecs.events.GLTF_MODEL_LOADED, () => {
          const gltfObject = world.three.entityToObject.get(eid)
          applyMaterial(gltfObject)
        })

        const object = world.three.entityToObject.get(eid)
        if (object) {
          // If there is an object already, just apply immediately
          applyMaterial(object)
        }
      })
      .onTick(() => {
        if (!material || !meshReady) return
        const attribs = schemaAttribute.get(eid)
        material.uniforms.uTime.value = world.time.elapsed * 0.8
        material.uniforms.bandSharpness.value = attribs.bandSharpness
        material.uniforms.causticScale.value = attribs.causticScale
        material.uniforms.causticStrength.value = attribs.causticStrength
        material.uniforms.causticSpeed.value = attribs.causticSpeed
        material.uniforms.rippleFreq.value = attribs.rippleFreq
        material.uniforms.rippleHeight.value = attribs.rippleHeight
        material.uniforms.rippleSpeed.value = attribs.rippleSpeed
        material.uniforms.rippleMod.value = attribs.rippleMod
        material.uniforms.colorFoam.value.set(attribs.colorFoam)
        material.uniforms.colorShallow.value.set(attribs.colorShallow)
        material.uniforms.colorDeep.value.set(attribs.colorDeep)
        material.uniforms.causticTint.value.set(attribs.causticTint)
        material.uniforms.depthOpacity.value = attribs.depthOpacity
        material.uniforms.deepOpacity.value = attribs.deepOpacity
        material.uniforms.useBands.value = attribs.useBands ? 1.0 : 0.0
        material.uniforms.meshScale.value = attribs.meshScale  // <-- Update meshScale every tick!
      })
  },
})
