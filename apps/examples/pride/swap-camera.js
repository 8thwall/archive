const swapCamComponent = {
  init() {
    const scene = this.el.sceneEl
    const camBtn = document.getElementById('swap-cam-btn')
    const flipBg = document.getElementById('flipBg')

    scene.addEventListener('realityready', () => {
      // fade from black
      flipBg.classList.add('fade-out')
      setTimeout(() => {
        flipBg.classList.remove('fade-out')
        flipBg.style.opacity = 0
      }, 500)
    })

    camBtn.addEventListener('click', () => {
      const faceAnchor = document.querySelector('xrextras-faceanchor')
      const worldContent = document.getElementById('worldContent')
      const prompt = document.getElementById('promptText')

      camBtn.classList.add('pulse-once')

      setTimeout(() => {
        camBtn.classList.remove('pulse-once')
        flipBg.style.opacity = 1
        if (!faceAnchor) {
          // switch to face tracking
          if (prompt) {
            prompt.style.display = 'none'
          }

          const hearts = document.querySelectorAll('.heart')
          hearts.forEach((heart) => {
            heart.remove()
          })
          worldContent.parentNode.removeChild(worldContent)
          scene.removeAttribute('tap-place')
          scene.removeAttribute('xrweb')
          scene.setAttribute('xrface', 'mirroredDisplay: true;  meshGeometry: eyes, face, mouth; cameraDirection: front; allowedDevices: any;')
          scene.removeAttribute('balloon-manager')
          scene.insertAdjacentHTML('beforeend',
            ` 
            <xrextras-faceanchor>
              <a-entity gltf-model="#head-occluder" position="0 0 0.3" scale="1.3 1.3 1.3" xrextras-hider-material></a-entity>
              
              <xrextras-face-attachment point="noseBridge">
                <!-- orbiting lights -->
                <a-entity layout="type: circle; radius: 3" rotation="90 0 0" xrextras-spin="speed: 5000;">
                  <a-entity
                    geometry="primitive: sphere; radius: 0;"
                    material="shader: flat; color: #FF0018;"
                    light="type: point;
                           intensity: 1.0;
                           color: #FF0018"
                    shadow
                    position="0 0 -1">
                  </a-entity>
              
                  <a-entity
                    geometry="primitive: sphere; radius: 0;"
                    material="shader: flat; color: #FFA52C;"
                    light="type: point;
                           intensity: 1.0;
                           color: #FFA52C"
                    shadow
                    position="-0.66 0 -0.66">
                  </a-entity>
                  
                  <a-entity
                    geometry="primitive: sphere; radius: 0;"
                    material="shader: flat; color: #FFFF41;"
                    light="type: point;
                           intensity: 1.0;
                           color: #FFFF41"
                    shadow
                    position="-0.66 0 0.66">
                  </a-entity>
              
                  <a-entity
                    geometry="primitive: sphere; radius: 0;"
                    material="shader: flat; color: #008018;"
                    light="type: point;
                           intensity: 1.0;
                           color: #008018"
                    shadow
                    position="0 0 1">
                  </a-entity>
          
                  <a-entity
                    geometry="primitive: sphere; radius: 0;"
                    material="shader: flat; color: #0000F9;"
                    light="type: point;
                           intensity: 1.0;
                           color: #0000F9"
                    shadow
                    position="0.66 0 0.66">
                  </a-entity>
          
                  <a-entity
                    geometry="primitive: sphere; radius: 0;"
                    material="shader: flat; color: #86007D;"
                    light="type: point;
                           intensity: 1.0;
                           color: #86007D"
                    shadow
                    position="0.66 0 -0.66">
                  </a-entity>
                </a-entity>
          
                <a-entity gltf-model="#words" position="0 0.05 0.75" scale="0.2 0.2 0.2" xrextras-spin="speed: 5000; direction: reverse;"></a-entity>
              </xrextras-face-attachment>
          
              <xrextras-face-mesh material-resource="#face-mesh"></xrextras-face-mesh>
              
            </xrextras-faceanchor>
        `)
          //       scene.insertAdjacentHTML('beforeend',
          //         `
          //       <xrextras-capture-button></xrextras-capture-button>
          //       <xrextras-capture-config request-mic="manual"></xrextras-capture-config>
          //       <xrextras-capture-preview></xrextras-capture-preview>
          //     `)
        } else {
          // switch to world tracking
          faceAnchor.parentNode.removeChild(faceAnchor)
          //  const captureBtn = document.querySelector('xrextras-capture-button')
          //  captureBtn.parentNode.removeChild(captureBtn)
          scene.removeAttribute('xrface')
          scene.setAttribute('xrweb', 'allowedDevices: any')
          scene.insertAdjacentHTML('beforeend',
            `<a-entity id="worldContent">
    <a-entity layout="type: circle; radius: 3" position="0 2 -2" rotation="90 0 0" xrextras-spin="speed: 5000;">
      <a-entity
        geometry="primitive: sphere; radius: 0;"
        material="shader: flat; color: #FF0018;"
        light="type: point;
               intensity: 1.0;
               color: #FF0018"
        shadow
        position="0 0 -1">
      </a-entity>
  
      <a-entity
        geometry="primitive: sphere; radius: 0;"
        material="shader: flat; color: #FFA52C;"
        light="type: point;
               intensity: 1.0;
               color: #FFA52C"
        shadow
        position="-0.66 0 -0.66">
      </a-entity>
      
      <a-entity
        geometry="primitive: sphere; radius: 0;"
        material="shader: flat; color: #FFFF41;"
        light="type: point;
               intensity: 1.0;
               color: #FFFF41"
        shadow
        position="-0.66 0 0.66">
      </a-entity>
  
      <a-entity
        geometry="primitive: sphere; radius: 0;"
        material="shader: flat; color: #008018;"
        light="type: point;
               intensity: 1.0;
               color: #008018"
        shadow
        position="0 0 1">
      </a-entity>
  
      <a-entity
        geometry="primitive: sphere; radius: 0;"
        material="shader: flat; color: #0000F9;"
        light="type: point;
               intensity: 1.0;
               color: #0000F9"
        shadow
        position="0.66 0 0.66">
      </a-entity>
  
      <a-entity
        geometry="primitive: sphere; radius: 0;"
        material="shader: flat; color: #86007D;"
        light="type: point;
               intensity: 1.0;
               color: #86007D"
        shadow
        position="0.66 0 -0.66">
      </a-entity>
    </a-entity>

    <a-entity
      light="type: directional;
         intensity: 0.2;
         castShadow: true;
         shadowMapHeight:2048;
         shadowMapWidth:2048;
         target: #i;
         shadowRadius: 9"
      position="1 14.3 12.5"
      xrextras-attach="target: i; offset: 1 15 1;"
      shadow>
  </a-entity>

    <a-plane
    id="ground" 
    class="cantap"
    rotation="-90 0 0" 
    width="1000" 
    height="1000" 
    material="shader: shadow; opacity: 0.35;"
    shadow>
  </a-plane>
  
    <a-entity id="p" shadow gltf-model="#pModel" position="-2 2 -5" scale="3 3 3" bob animation='property: rotation.y; from: 10; to: -10; loop: true; dir: alternate; dur: 1500; easing: easeInOutQuad' cubemap-static></a-entity>
    <a-entity id="r" shadow gltf-model="#rModel" position="-0.9 2 -5" scale="3 3 3" animation='property: rotation.y; from: -20; to: 20; loop: true; dir: alternate; dur: 2000; easing: easeInOutQuad' cubemap-static></a-entity>
    <a-entity id="i" shadow gltf-model="#iModel" position="0 2 -5" scale="3 3 3" animation='property: rotation.y; from: -25; to: 25; loop: true; dir: alternate; easing: easeInOutQuad' cubemap-static></a-entity>
    <a-entity id="d" shadow gltf-model="#dModel" position="1 2 -5" scale="3 3 3" animation='property: rotation.y; from: 15; to: -15; loop: true; dir: alternate; dur: 1800; easing: easeInOutQuad' cubemap-static></a-entity>
    <a-entity id="e" shadow gltf-model="#eModel" position="2.1 2 -5" scale="3 3 3" animation='property: rotation.y; from: -10; to: 10; loop: true; dir: alternate; dur: 1500; easing: easeInOutQuad' cubemap-static></a-entity>
  </a-entity>
          `)
          scene.setAttribute('balloon-manager', '')
          scene.setAttribute('tap-place', '')
          prompt.style.display = 'flex'
        }
      }, 500)
    })
  },
}

export {swapCamComponent}
