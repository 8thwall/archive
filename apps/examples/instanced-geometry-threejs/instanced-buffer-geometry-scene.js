
import {vertexShader, fragmentShader} from './shaders.js'

export const instancedBufferGeometrySceneModule = (myThree) => {

  // Populates some object into an XR scene and sets the initial camera position. The scene and
  // camera come from xr3js, and are only available in the camera loop lifecycle onStart() or later.
  const initXrScene = ({ scene, camera, renderer }) => {
    
    scene.add(new THREE.AmbientLight( 0x404040, 5 ))  // Add soft white light to the scene.

    // From https://github.com/mrdoob/three.js/blob/master/examples/webgl_buffergeometry_instancing.html
		// geometry
    var vector = new THREE.Vector4()
    var instances = 5000
		var positions = []
		var offsets = []
		var colors = []
		var orientationsStart = []
		var orientationsEnd = []

		positions.push( 0.025, - 0.025, 0 )
		positions.push( - 0.025, 0.025, 0 )
		positions.push( 0, 0, 0.025 )

		// instanced attributes
		for ( var i = 0; i < instances; i ++ ) {
      // offsets
      offsets.push( Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5 )
      // colors
			colors.push( Math.random(), Math.random(), Math.random(), Math.random() )
			// orientation start
			vector.set( Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1 )
			vector.normalize()
			orientationsStart.push( vector.x, vector.y, vector.z, vector.w )
			// orientation end
			vector.set( Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1 )
			vector.normalize()
			orientationsEnd.push( vector.x, vector.y, vector.z, vector.w )
		}

		var geometry = new THREE.InstancedBufferGeometry()
		geometry.maxInstancedCount = instances; // set so its initalized for dat.GUI, will be set in first draw otherwise
		geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) )
		geometry.setAttribute( 'offset', new THREE.InstancedBufferAttribute( new Float32Array( offsets ), 3 ) )
		geometry.setAttribute( 'color', new THREE.InstancedBufferAttribute( new Float32Array( colors ), 4 ) )
		geometry.setAttribute( 'orientationStart', new THREE.InstancedBufferAttribute( new Float32Array( orientationsStart ), 4 ) )
		geometry.setAttribute( 'orientationEnd', new THREE.InstancedBufferAttribute( new Float32Array( orientationsEnd ), 4 ) )

		// material
		var material = new THREE.RawShaderMaterial({
			uniforms: {
				"time": { value: 1.0 },
				"sineTime": { value: 1.0 }
			},
			vertexShader: vertexShader(),
			fragmentShader: fragmentShader(),
			side: THREE.DoubleSide,
			transparent: true
		})

		var mesh = new THREE.Mesh( geometry, material );
		scene.add( mesh );
		
    const gui = new dat.GUI({width: 250})
    gui.add(geometry, 'maxInstancedCount', 0, instances)

    // Set the initial camera position relative to the scene we just laid out. This must be at a
    // height greater than y=0.
    camera.position.set(0, 3, 2)
  }


  return {
    // Pipeline modules need a name. It can be whatever you want but must be unique within your app.
    name: 'instancedbuffergeometry',

    // onStart is called once when the camera feed begins. In this case, we need to wait for the
    // XR8.Threejs scene to be ready before we can access it to add content. It was created in
    // XR8.Threejs.pipelineModule()'s onStart method.
    onStart: ({canvas, canvasWidth, canvasHeight}) => {
      // const {scene, camera, renderer} = XR8.Threejs.xrScene()  // Get the 3js sceen from xr3js.
      const {scene, camera, renderer} = myThree.xrScene()  // Get the 3js sceen from xr3js.

      initXrScene({ scene, camera, renderer }) // Add objects to the scene and set starting camera position.

      // Sync the xr controller's 6DoF position and camera paremeters with our scene.
      XR8.XrController.updateCameraProjectionMatrix({
        origin: camera.position,
        facing: camera.quaternion,
      })

    },
    onRender: () => {
      // const {scene, camera, renderer} = XR8.Threejs.xrScene()
      const {scene, camera, renderer} = myThree.xrScene()
      const time = performance.now()
      const object = scene.children[2]
      object.rotation.y = time * 0.001
			object.material.uniforms[ "time" ].value = time * 0.005
			object.material.uniforms[ "sineTime" ].value = Math.sin( object.material.uniforms[ "time" ].value * 0.05 )
    },
  }
}
