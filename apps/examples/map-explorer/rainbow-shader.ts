import * as ecs from '@8thwall/ecs'

ecs.registerComponent({
  name: 'Rainbow Shader',
  schema: {
    wireframeColor: ecs.string,  // The base color to mix with our wave effect
    animationSpeed: ecs.f32,     // How fast the colors wave and change
    opacity: ecs.f32,            // How transparent the wireframe is
    waveScale: ecs.f32,          // How large the waves of color are
  },
  schemaDefaults: {
    wireframeColor: '#FFFFFF',   // Default to white
    animationSpeed: 0.002,       // Very slow peaceful movement
    opacity: 0.5,                // Semi-transparent
    waveScale: 0.1,              // Large, gentle waves
  },
  data: {
    time: ecs.f32,               // Keep track of time for our animation
  },
  stateMachine: ({world, eid, schemaAttribute, dataAttribute}) => {
    const {THREE} = window as any

    let mesh = null

    ecs.defineState('default')
      .initial()
      .onTick(() => {
        if (mesh && mesh.material.uniforms) {
          dataAttribute.mutate(eid, (c) => {
            c.time += world.time.delta
          })

          const {wireframeColor, animationSpeed, opacity, waveScale} = schemaAttribute.get(eid)

          mesh.material.uniforms.time.value = dataAttribute.get(eid).time
          mesh.material.uniforms.wireframeColor.value.setStyle(wireframeColor)
          mesh.material.uniforms.animationSpeed.value = animationSpeed
          mesh.material.uniforms.opacity.value = opacity
          mesh.material.uniforms.waveScale.value = waveScale
        }
      })
      .listen(world.events.globalId, 'reality.meshfound', (e) => {
        console.log(e.data)

        if (mesh) {
          world.three.scene.remove(mesh)
        }

        const {wireframeColor, animationSpeed, opacity, waveScale} = schemaAttribute.get(eid)
        const {bufferGeometry} = e.data as any
        const shaderMaterial = new THREE.ShaderMaterial({
          uniforms: {
            time: {value: 0},
            wireframeColor: {value: new THREE.Color(wireframeColor)},
            animationSpeed: {value: animationSpeed},
            opacity: {value: opacity},
            waveScale: {value: waveScale},
          },
          vertexShader: `
          varying vec3 vPosition;
          
          void main() {
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
          fragmentShader: `
          uniform float time;
          uniform vec3 wireframeColor;
          uniform float animationSpeed;
          uniform float opacity;
          uniform float waveScale;
          
          varying vec3 vPosition;
          
          void main() {
            vec3 pos = vPosition * waveScale;
            // Create three waves with slightly different speeds for a rainbow effect
            float wave1 = sin(pos.x + pos.y + pos.z + time * animationSpeed) * 0.5 + 0.5;
            float wave2 = sin(pos.x + pos.y + pos.z + time * animationSpeed * 0.7) * 0.5 + 0.5;
            float wave3 = sin(pos.x + pos.y + pos.z + time * animationSpeed * 1.3) * 0.5 + 0.5;
            
            vec3 color = vec3(wave1, wave2, wave3);
            color = mix(color, wireframeColor, 0.5);
            
            gl_FragColor = vec4(color, opacity);
          }
        `,
          transparent: true,  // Allow transparency
          wireframe: true,    // Show as wireframe
        })

        mesh = new THREE.Mesh(bufferGeometry, shaderMaterial)
        world.three.scene.add(mesh)
      })
      .listen(world.events.globalId, 'reality.meshlost', (e) => {
        if (!mesh) {
          return
        }

        world.three.scene.remove(mesh)
      })
  },
})
